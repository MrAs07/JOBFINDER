import mongoose from "mongoose";
import Jobs from "../models/jobModel.js";
import Companies from "../models/companiesModel.js";


//Create Job
export const createJob = async(req , res, next) =>{
    try{
        const {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            desc,
            requirements,
          } = req.body;
         
          if (
            !jobTitle ||
            !jobType ||
            !location ||
            !salary ||
            !requirements ||
            !desc
          ) {
            next("Please Provide All Required Fields");
            return;
          }

          const id = req.body.user.userId;
         
        // checking id present or not
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send(`No Company with id :${id}`)
        }

        const jobPost = {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            detail: { desc, requirements },
            company: id,
          };

          const job = new Jobs(jobPost);
          await job.save();

          //update the company information with job id
          const company = await Companies.findById(id);
          
          company.jobPosts.push(job._id);
          
          const updateCompany = await Companies.findByIdAndUpdate(id,company,{
            new: true,
          });

          res.status(200).json({
            success: true,
            message: "Job Posted SUccessfully",
            job,
          });

    }
    catch(error){
        console.log(error);
        res.status(404).json(
            {
                message : error.message,
            }
        )
    }
}


// UPDATE JOB
export const updateJob = async(req , res, next) =>{
    try{
        const {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            desc,
            requirements,
          } = req.body;
          const { jobId } = req.params;
        
          //validation 
          if (
            !jobTitle ||
            !jobType ||
            !location ||
            !salary ||
            !desc ||
            !requirements
          ) {
            next("Please Provide All Required Fields");
            return;
          }

          const id =req.body.user.userId;

          if (!mongoose.Types.ObjectId.isValid(id)){
          return res.status(404).send(`No Company with id: ${id}`);
        }

        const jobPost = {
            jobTitle,
            jobType,
            location,
            salary,
            vacancies,
            experience,
            detail: { desc, requirements },
            _id: jobId,
          };
        
        await Jobs.findByIdAndUpdate(
            jobId,
            jobPost,
            {new:true}
        );

        res.status(200).json({
            success: true,
            message: "Job Post Updated Successfully",
            jobPost
        });
    }
    catch(error){
        console.log(error);
        res.status(404).json(
            {
                message : error.message,
            }
        )
    }
}

// GET JOB POSTS
export const getJobPosts = async(req , res, next) =>{
    try{
        const {search ,sort ,location, jtype, exp} = req.query;
        const types = jtype?.split(","); // full-time,part-time
        const experience = exp?.split(","); // 2-6

        let queryObject ={};

        if(location){
            queryObject.location ={$regex: location , $options: "i"};
        }

        if(jtype){
            queryObject.jobType ={ $in: types}
        }

        // [2 ,6]
        if(exp) {
            //  $gte stands for "greater than or equal to".This is MongoDB operator
            //  $lte stands for "less than or equal to".This is MongoDB operator
            queryObject.experience = { $gte: experience[0],
            $lte: experience[1] }
        };

        if(search){
            const searchQuery ={
                $or: [
                    {jobTitle:{$regex: search , $options: "i"} },
                    {jobType:{$regex: search , $options: "i"} },
                ],
            }
            queryObject = {...queryObject , ...searchQuery};
        }

        let queryResult = Jobs.find(queryObject).populate({
            path: 'company',
            select : "-password"
        });

        // Sorting
        if (sort === "Newest") {
            queryResult = queryResult.sort("-createdAt");
          }
          if (sort === "Oldest") {
            queryResult = queryResult.sort("createdAt");
          }
          if (sort === "A-Z") {
            queryResult = queryResult.sort("jobTitle");
          }
          if (sort === "Z-A") {
            queryResult = queryResult.sort("-jobTitle");
          }

           // pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // records count
        const totalJobs = await Jobs.countDocuments(queryResult);
        const numOfPage = Math.ceil(totalJobs/limit);

        queryResult = queryResult.limit(limit * page);

        const jobs = await queryResult;

        res.status(200).json({
            success: true,
      totalJobs,
      data: jobs,
      page,
      numOfPage,

        })

    }

    catch(error){
        console.log(error);
        res.status(404).json(
            {
                message : error.message,
            }
        )
    }
}


// GET JOB BY ID
export const getJobById = async(req , res, next) =>{
    try{
        const {id} = req.params;
        const job = await Jobs.findById({_id:id}).populate({
            path: "company",
            select: "-password"
        });

        if(!job){
            return res.status(200).send({
                success: false,
                message : "Job not found",
        })
    }

    // GET SIMILAR JOB POST 

    const searchQuery = {
        $or: [
            {jobTitle: {$regex: job?.jobTitle, $options: 'i'}},
            {jobType: {$regex : job?.jobType, $options:"i"}},
        ],
    };

    let queryResult = Jobs.find(searchQuery)
                          .populate({
                            path: "company",
                            select: "-password"
                            })
                           .sort({id:-1});
    
        queryResult = queryResult.limit(6);
        const similarJobs = await queryResult

        res.status(200).json({
            success: true,
            data: job,
            similarJobs,
          });
}
    catch(error){
        console.log(error);
        res.status(404).json(
            {
                message : error.message,
            }
        )
    }
}


// delete job post
export const deleteJobPost = async(req , res, next) =>{
    try{
        const {id} = req.params;

        await Jobs.findByIdAndDelete(id);

        return res.status(200).send({
            success: true,
            message : "Job post deleted successfully",
        })

    }
    catch(error){
        console.log(error);
        res.status(404).json(
            {
                message : error.message,
            }
        )
    }
}