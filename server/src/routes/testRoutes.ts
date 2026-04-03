import { Router } from "express";
import { createTest, getTests, submitTest, getResults, getAllResults } from "../controllers/testControllers";
import { authenticate } from "../middleware.ts/auth";
import { allowRoles } from "../middleware.ts/role";

const router = Router();

router.use(authenticate);

// Tests
router.post("/", allowRoles("teacher"), createTest);
router.get("/", getTests);

// Submissions
router.post("/submit", allowRoles("student"), submitTest);
router.get("/results", getAllResults);
router.get("/results/:testId", getResults);

export default router;
