import mongoose from "mongoose";
import Application from "../models/applicationModel.js";
import Jobs from "../models/jobModel.js";
import Users from "../models/userModel.js";

// Create Application
export const createApplication = async (req, res, next) => {
    try {
        const { jobId, resumeUrl, coverLetter } = req.body;

        if (!jobId || !resumeUrl || !coverLetter) {
            return res.status(400).json(
                { message: "Please provide all required fields." }
            );
        }
        // console.log("we are entering here");
        const userId = req.body.user.userId;

        // Checking if user and job are valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).send(`No User with id: ${userId}`);
        }

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(404).send(`No Job with id: ${jobId}`);
        }

        // checking the user is already applied for this job 
        // if yes user cannot applied 
        // else user can continue
        const isUserApplied = await Application.findOne({
            user: userId,
            job: jobId
            });
        if (isUserApplied) {
                return res.status(400).json({
                    status: "failed", 
                    message: "You have already applied for this job."
        });
         }
         else{

             
             // Create a new Application
             const application = new Application({
                 job: jobId,
            user: userId,
            resumeUrl,
            coverLetter,
            
        });
        
        await application.save();
        // now we push the user id into application field which is define in jobs
        const job = await Jobs.findByIdAndUpdate(jobId, {
            $push: { application: userId },
        }, { new: true });
        
        // console.log(job);
        
        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application,
        });
    }
    } catch (error) {
        console.log(error);
        res.status(500).json(
            { message: error.message }
            );
    }
};

// Get Applications by User
export const getApplicationsByUser = async (req, res, next) => {
    try {
        const userId = req.body.user.userId;

        const applications = await Application.find({ user: userId }).populate({
            path: 'job',
            populate:{path:'company'}
        })

        res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Get Application by ID
export const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id).populate("job user");

        // const application = await Application.findById(id).populate("job").populate("user");
        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Get All Applications
export const getAllApplications = async (req, res, next) => {
    try {
      const applications = await Application.find().populate("job").populate("user");
  
      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

// Update Application Status
export const updateApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Applied', 'Under Review', 'Interview', 'Rejected', 'Hired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully.",
            application,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete Application
export const deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const application = await Application.findByIdAndDelete(id);

// and then we also want to remove userId from application field that we define in jobs schema

 // Get jobId from the application document
 const jobId = application.job;
 const userId = application.user;

 // Remove userId from application field in Jobs schema
 const job = await Jobs.findByIdAndUpdate(jobId, {
     $pull: { application: userId },
 }, { new: true });

//  console.log(job)
        res.status(200).json({
            success: true,
            message: "Application deleted successfully.",
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
