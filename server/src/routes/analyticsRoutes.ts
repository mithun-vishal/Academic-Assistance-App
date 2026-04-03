import express from "express";
import { getDashboardStats } from "../controllers/analyticsControllers";

const router = express.Router();

router.get("/", getDashboardStats);

export default router;
