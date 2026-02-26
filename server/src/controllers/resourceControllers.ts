import { Response } from "express";
import Resource from "../models/resource";
import { AuthRequest } from "../middleware.ts/auth";

// Upload Resource (Teacher only)
export const uploadResource = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, subject, fileUrl } = req.body;

    const resource = await Resource.create({
      title,
      description,
      subject,
      fileUrl,
      uploadedBy: req.user.id
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};

// Get Approved Resources (Student)
export const getApprovedResources = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const resources = await Resource.find({ status: "approved" })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Get Pending Resources (Admin)
export const getPendingResources = async (
  req: AuthRequest,
  res: Response
) => {
  const resources = await Resource.find({ status: "pending" });
  res.json(resources);
};

// Approve Resource (Admin)
export const approveResource = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;

  await Resource.findByIdAndUpdate(id, { status: "approved" });

  res.json({ message: "Resource approved" });
};

// Reject Resource (Admin)
export const rejectResource = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;

  await Resource.findByIdAndUpdate(id, { status: "rejected" });

  res.json({ message: "Resource rejected" });
};
