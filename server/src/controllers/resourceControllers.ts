import { Request, Response } from 'express';
import Resource from '../models/resource';

//  Get all
export const getResources = async (_req: Request, res: Response) => {
  const resources = await Resource.find();
  res.json(resources);
};

//  Create
export const createResource = async (req: Request, res: Response) => {
  const resource = new Resource(req.body);
  await resource.save();
  res.status(201).json(resource);
};

//  Update
export const updateResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await Resource.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// ➤ Delete
export const deleteResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Resource.findByIdAndDelete(id);
  res.json({ message: 'Resource deleted' });
};
