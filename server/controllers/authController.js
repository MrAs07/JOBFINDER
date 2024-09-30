import Users from "../models/userModel.js"

export const register = async (req, res, next) =>{

    // console.log("ERROR"+ err);

    const {firstName, lastName, email, password } = req.body;
    

    // validate field

    if(!firstName){
        next("First Name is required")
    }
    if(!lastName){
        next("Last Name is required");
    }
    if(!email){
        next("Email is required");
    }
    if(!password){
        next("Password is required");
    }   


    try{
        const userExist = await Users.findOne({email});

        if(userExist){
            next("Email already exists");
            return;
        }

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password
        });

        //user token 
        const token = await user.createJWT();
        res.status(201).send({
            success: true,
            message: "Account created successfully",
            user:{
                _id: user._id,
                firstName: user.firstName,
                lastName : user.lastName,
                email: user.email,
                accountType: user.accountType,
            },
            token,
        });
    }
    catch(error){
        console.log(error);
        res.status(404).json({
            message:error.message
        });
    }
};

export const signIn = async(req,res,next) =>{
    const { email, password} = req.body;
    try{
        // validation
        if(!email || !password){
            next("Please provide user credentials");
            return;
        }

        //find user by email

        // The + symbol is used to explicitly include the password field in the result.
        const user = await Users.findOne({email}).select("+password")

        if(!user){
            next("Invalid email or password");
            return;
        }

        // compare password
        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            next("Invalid email or password")
            return;
        }
        
        user.password = undefined;

        const token = user.createJWT();

        res.status(201).json({
            success:true,
            message: "Login successfully",
            user,
            token
        });
    }
    catch(err){
        console.log(err);
        res.status(404).json({
            message: err.message,
        });
    }
};