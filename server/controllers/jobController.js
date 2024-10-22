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
// export const getJobPosts = async (req, res, next) => {
//     try {
//         const { search, sort, jtype, exp, location } = req.query;
        
//         // Check if parameters are coming in correctly
//         console.log("jtype:", jtype);  
//         console.log("exp:", exp);     
//         console.log("search:", search); 
//         console.log("location:", location);

//         // Initialize the query object
//         let queryObject = {};

//         // Job Type Filter (case-insensitive match)
//         if (jtype && jtype.trim() !== "") {
//             const types = jtype.split(",").map(type => type.trim()); // Split and trim job types
//             queryObject.jobType = { $in: types.map(type => new RegExp(`^${type}$`, "i")) }; // Exact case-insensitive match
//         }

//         // Experience Filter (only if exp is not empty)
//         if (exp && exp.trim() !== "") {
//             const experienceRange = exp.split("-");
//             queryObject.experience = {
//                 $gte: Number(experienceRange[0]), // Minimum experience
//                 $lte: Number(experienceRange[1]), // Maximum experience
//             };
//         }

//         // Location Filter (if needed)
//         if (location) {
//             queryObject.location = { $regex: location, $options: "i" }; // Case-insensitive location filter
//         }

//         // Search Filter
//         if (search) {
//             const searchQuery = {
//                 $or: [
//                     { jobTitle: { $regex: search, $options: "i" } },
//                     { jobType: { $regex: search, $options: "i" } },
//                 ],
//             };
//             queryObject = { ...queryObject, ...searchQuery };
//         }

//         // Log the final queryObject for debugging
//         console.log("Final Query Object:", queryObject);

//         // Initialize the query
//         let queryResult = Jobs.find(queryObject).populate({
//             path: 'company',
//             select: "-password", // Exclude the password field from the company object
//         });

//         // Sorting
//         if (sort === "Newest") {
//             queryResult = queryResult.sort("-createdAt");
//         } else if (sort === "Oldest") {
//             queryResult = queryResult.sort("createdAt");
//         }

//         // Pagination (optional)
//         const page = Number(req.query.page) || 1;
//         const limit = Number(req.query.limit) || 20;
//         const skip = (page - 1) * limit;

//         queryResult = queryResult.skip(skip).limit(limit);

//         // Execute the query
//         const jobs = await queryResult;

//         // Get total number of jobs that match the query
//         const totalJobs = await Jobs.countDocuments(queryObject);

//         // Calculate the number of pages
//         const numOfPages = Math.ceil(totalJobs / limit);

//         // Send the response
//         res.status(200).json({
//             success: true,
//             totalJobs,
//             data: jobs,
//             page,
//             numOfPages,
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(404).json({
//             message: error.message,
//         });
//     }
// };
export const getJobPosts = async (req, res, next) => {
    try {
      const { query, sort, location, jType, exp } = req.query;

      const search = query;
      console.log()
      const types = jType?.split(","); //full-time,part-time
      const experience = exp?.split("-"); //2-6
  
      let queryObject = {};
  
      if (location) {
        queryObject.location = { $regex: location, $options: "i" };
      }
  
      if (jType) {
        queryObject.jobType = { $in: types };

      }
  
      //    [2. 6]
  
      if (exp) {
        queryObject.experience = {
          $gte: Number(experience[0]) ,
          $lte: Number(experience[1]) ,
        };
      }
  
      if (search) {
        const searchQuery = {
          $or: [
            { jobTitle: { $regex: search, $options: "i" } },
            { jobType: { $regex: search, $options: "i" } },
          ],
        };
        queryObject = { ...queryObject, ...searchQuery };
      }
  
      // console.log(queryObject);

      let queryResult = Jobs.find(queryObject).populate({
        path: "company",
        select: "-password",
      });
  
      // SORTING
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
  
      //records count
      const totalJobs = await Jobs.countDocuments(queryResult);
      const numOfPage = Math.ceil(totalJobs / limit);
  
      queryResult = queryResult.limit(limit * page);
  
      const jobs = await queryResult;
  
      res.status(200).json({
        success: true,
        totalJobs,
        data: jobs,
        page,
        numOfPage,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };









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