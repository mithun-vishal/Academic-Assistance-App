import { Router } from "express";
import multer from "multer";
import fs from "fs";
import {
  uploadResource,
  getApprovedResources,
  getPendingResources,
  approveResource,
  rejectResource
} from "../controllers/resourceControllers";

import { authenticate } from "../middleware.ts/auth";
import { allowRoles } from "../middleware.ts/role";

const router = Router();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, "uploads/");
  },
  filename: (req: any, file: any, cb: any) => {
    // Keep it safe
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});
const upload = multer({ storage });

// Student and Teacher → view approved
router.get(
  "/",
  authenticate,
  allowRoles("student", "teacher"),
  getApprovedResources
);

// Teacher → upload
router.post(
  "/",
  authenticate,
  allowRoles("teacher"),
  upload.single("file"),
  uploadResource
);

// Admin → view pending
router.get(
  "/pending",
  authenticate,
  allowRoles("admin"),
  getPendingResources
);

// Admin → approve
router.put(
  "/approve/:id",
  authenticate,
  allowRoles("admin"),
  approveResource
);

// Admin → reject
router.put(
  "/reject/:id",
  authenticate,
  allowRoles("admin"),
  rejectResource
);

export default router;
