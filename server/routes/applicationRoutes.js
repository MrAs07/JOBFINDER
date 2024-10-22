import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createApplication,
  getApplicationsByUser ,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
  getApplicationById
} from "../controllers/applicationController.js";

const router = express.Router();

// POST /jobs/apply/:jobId - Route to create an application for a job
router.post("/apply/:jobId", userAuth, createApplication);

// GET /applications - Get all applications for the logged-in user
router.get("/user-logged", userAuth, getApplicationsByUser);

// GET /applications - Get all applications 
router.get("/all", userAuth, getAllApplications);

// GET /applications/:id - Get a specific application by ID
router.get("/:id", userAuth, getApplicationById);

// PUT /applications/:id/status - Update application status
router.put("/:id/status", userAuth, updateApplicationStatus);

// DELETE /applications/:id - Delete an application
router.delete("/:id", userAuth, deleteApplication);



export default router;