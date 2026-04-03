import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { authenticate } from "../middleware.ts/auth";
import { allowRoles } from "../middleware.ts/role";

const router = express.Router();

//register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, regNo, deptNumber } = req.body;

    // Check missing fields
    if (!name || !email || !password || !role) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      regNo,
      deptNumber
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
});


//Login 
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
});

// Admin Users Fetch
router.get("/users", authenticate, allowRoles("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Role Promotion
router.patch("/users/:id/role", authenticate, allowRoles("admin"), async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    if (!["student", "teacher", "admin"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "Role updated successfully", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;