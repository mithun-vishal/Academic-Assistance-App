import { Response } from "express";
import Test from "../models/test";
import Result from "../models/result";
import { AuthRequest } from "../middleware.ts/auth";

export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const test = await Test.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test" });
  }
};

export const getTests = async (req: AuthRequest, res: Response) => {
  try {
    const tests = await Test.find().populate("createdBy", "name").sort({ createdAt: -1 });
    res.json(tests);
  } catch {
    res.status(500).json({ message: "Failed to fetch tests" });
  }
};

export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    const { testId, answers, timeTaken } = req.body;
    const test = await Test.findById(testId);
    if (!test) {
      res.status(404).json({ message: "Test not found" });
      return;
    }

    let score = 0;
    test.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += (test.totalMarks / test.questions.length);
      }
    });

    const percentage = (score / test.totalMarks) * 100;

    const result = await Result.create({
      testId,
      studentId: req.user.id,
      answers,
      score,
      percentage,
      timeTaken
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit test" });
  }
};

export const getResults = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.params;
    let query: any = {};
    if (testId) query.testId = testId;
    if (req.user.role === 'student') query.studentId = req.user.id;
    
    const results = await Result.find(query).populate('studentId', 'name email').populate('testId', 'title totalMarks');
    res.json(results);
  } catch {
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

export const getAllResults = async (req: AuthRequest, res: Response) => {
  try {
    let query: any = {};
    if (req.user.role === 'student') query.studentId = req.user.id;
    const results = await Result.find(query)
      .populate('testId', 'title totalMarks')
      .populate('studentId', 'name email');
    res.json(results);
  } catch {
    res.status(500).json({ message: "Failed to fetch all results" });
  }
};
