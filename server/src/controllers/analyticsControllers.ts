import { Request, Response } from "express";
import User from "../models/user";
import Resource from "../models/resource";
import Test from "../models/test";
import Result from "../models/result";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalResources = await Resource.countDocuments();
    const totalTests = await Test.countDocuments();
    
    // Estimate active users
    const activeUsers = Math.floor((totalStudents + totalTeachers) * 0.4); 

    const results = await Result.find();
    let averageScore = 0;
    let testCompletionRate = 0;

    if (results.length > 0) {
      const totalScorePercent = results.reduce((acc, curr) => acc + curr.percentage, 0);
      averageScore = Math.round(totalScorePercent / results.length);
      
      if (totalStudents > 0 && totalTests > 0) {
        testCompletionRate = Math.min(100, Math.round((results.length / (totalStudents * totalTests)) * 100));
      }
    }

    const stats = {
      totalStudents,
      totalTeachers,
      totalResources,
      totalTests,
      activeUsers,
      testCompletionRate,
      averageScore,
      resourceUsage: 0
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
};
