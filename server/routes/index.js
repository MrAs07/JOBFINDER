import express from 'express'

import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js"
import jobRoute from "./jobRoutes.js"
import applicationRoutes from "./applicationRoutes.js"

const router = express.Router();

const path ="/api-v1/";

router.use(`${path}auth`,authRoute);
//this means -> api-v1/auth/
router.use(`${path}users`,userRoute);
router.use(`${path}companies`,companyRoute)
router.use(`${path}jobs`,jobRoute)
router.use(`${path}applications`,applicationRoutes)

export default router;