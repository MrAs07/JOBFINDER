import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";


export const register = async(req,res,next)=>{

    const {name, email, password}= req.body;

// validate fields
    if(!name){
        next("Company Name is required");
        return;
    }
    if(!email){
        next("Email is required");
        return;
    }
    if(!password){
        next("Password is required and must be grater than 8 character");
        return;
    }
    
    try{
        const accountExist = await Companies.findOne({email})

        if(accountExist){
           next("Email Already register, Please login");
           return;
        }

        //create a new account
        const company = await Companies.create({
            name,
            email,
            password,
        });

        // user token

        // always remember to use await
        const token = await company.createJWT();

        res.status(201).json({
            success: true,
            message: "Company Account Created Successfully",
            user:{
                _id: company.id,
                name: company.name,
                email: company.email,
            },
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: error.message,
        });
    }
};

// sign in controller for company

export const signIn = async(req,res,next) =>{
    const {email,password} = req.body;

    try{
        //validation
        if(!email || !password){
            next("Please Provide Credentials");
            return;
        }

    const company = await Companies.findOne({email}).select("+password");

    if(!company){
        next("Invalid Email or Password");
        return;
    }

    

    // compare password
    const isMatch = await company.comparePassword(password);

    if(!isMatch){
        next("Invalid Email or Password");
        return;
    }

        company.password = undefined;

        const token = await company.createJWT();

        res.status(200).json({
            success: true,
            message: "Login In Successfully",
            user : company,
            token,
        })

    } catch(err){
        console.log(err)
        res.status(404).json({message: err.message});
    }
}


//update company profile
export const updateCompanyProfile = async(req,res,next) =>{
    const {name, contact, location, profileUrl, about} =req.body;

    try{
        // validation
        if(!name || !contact || !location || !profileUrl || !about){
            next("Please Provide All Fields");
            return;
            }
        
            const id  = req.body.user.userId;

            if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(404).send(`No Company with id: ${id}`);
            }
            const updateCompany = {
                name,
                contact,
                location,
                profileUrl,
                about,
                _id : id
            };

            const company = await Companies.findByIdAndUpdate(id, updateCompany,{
                new: true,
            });

            const token = company.createJWT();

            company.password = undefined;

            res.status(200).json({
                success: true,
                message: "Company Profile Updated Successfully",
                company,
                token,
            }); 
            
    }
    catch(err){
        console.log(err)
        res.status(404).json({message: err.message});
    }
}


// get company profile
export const getCompanyProfile = async(req,res,next) =>{
    try{
        const id = req.body.user.userId;

        const company = await Companies.findById({_id:id});

        
        if(!company){
            return res.status(404).send({
                message: "Company Not Found",
                success: false,
            });
        }
        
        company.password = undefined;
        res.status(200).json({
            success: true,
            data: company,
        });
    }
    catch(err){
        console.log(err)
        res.status(404).json({message: err.message});
    }
}


//Get ALL COMPANIES
export const getCompanies = async(req,res,next) =>{
    try{
        const {search, sort,location} = req.query;

        // conditions for searching filters
        const queryObject  ={};

        if(search){
            queryObject.name = {$regex:search , $options:"i"}

        }
        if(location){
            queryObject.location = {$regex:location, $options:"i"}
        }

        let queryResult = Companies.find(queryObject).select("-password");

        // sorting
        if(sort === "Newest"){
            queryResult = queryResult.sort("-createdAt")
        }
        if(sort === "Oldest"){
            queryResult = queryResult.sort("createdAt")
        }
        if(sort === "A-Z"){
            queryResult = queryResult.sort("name")
        }
        if(sort === "Z-A"){
            queryResult = queryResult.sort("-name")
        }
        
        // pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 20
        const skip =  (page-1) * limit

        //records count
        const total = await Companies.countDocuments(queryResult);
        const numOfPage = Math.ceil(total / limit);

        // if you want show in next page VIEW (JUST LIKE AN OLD GOOGLE SEARCH TYPE)
        //queryResult = queryResult.skip(skip).limit(limit);

        // show more instead of moving to next page
        queryResult = queryResult.limit(limit * page);

        const companies = await queryResult;

        res.status(200).json({
            success: true,
            total,
            data: companies,
            page,
            numOfPage,
          });
    }
    catch(err){
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};

//Get COMPANY JOBS
export const getCompanyJobListing = async(req,res,next) =>{
    const {search ,sort}  = req.query;
    const id = req.body.user.userId;

     try {
        //conditions for searching filters
        const queryObject = {};

        if(search){
            queryObject.location = {$regex : search , $options : "i"};
        }

        let sorting;
        // sorting || another way
        if(sort === 'Newest'){
            sorting = "-createdAt";
        } 
        if(sort === 'Oldest'){
            sorting = "createdAt";
        }
        if(sort === 'A-Z'){
            sorting = "name";
        }
        if(sort === 'Z-A'){
            sorting = "-name";
        }

        let queryResult = await Companies.findById({_id:id}).populate({
            path: 'jobPosts',
            options: {sort : sorting}
        })

     }
     catch(err){
        console.log(error);
        res.status(404).json({ message: error.message });
     }
};

//GET SINGLE COMPANY 
export const getCompanyById = async(req,res,next) =>{
    try{
        const {id} = req.params;

        const company = await Companies.findById({ _id: id }).populate({
            path : "jobPosts",
            options: {
                sort :"-id",
            },
        })
        company.password = undefined;

        if(!company){
            return res.status(404).json(
                { 
                    message: "Company not found",
                    success: false, 
                }
                );
        }
        res.status(200).json({
            success: true,
            data: company,
          });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
};