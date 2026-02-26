import { Router } from "express";
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

// Student → view approved
router.get(
  "/",
  authenticate,
  allowRoles("student"),
  getApprovedResources
);

// Teacher → upload
router.post(
  "/",
  authenticate,
  allowRoles("teacher"),
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
