import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { ZodError } from "zod";

const prisma = new PrismaClient();
const saltRounds = 10;

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    signed: true,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, getCookieOptions());

    res.status(201).json({ email: user.email, role: user.role });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.issues });
      return;
    }
    res.status(500).json({ message: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, getCookieOptions());

    res.status(200).json({ email: user.email, role: user.role });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: error.issues });
      return;
    }
    res.status(500).json({ message: error });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("token", getCookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
};

export const profile = async (req: Request, res: Response) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token@@@d" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { email: true, role: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
