import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthedRequest } from "../types";

const prisma = new PrismaClient();

export const protect = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;
    console.log(decoded);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    req.user = {
      userId: decoded.id,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
