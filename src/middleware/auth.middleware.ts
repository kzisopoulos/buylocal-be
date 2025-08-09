import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthedRequest } from "../types";

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
    req.user = {
      userId: decoded.id,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
