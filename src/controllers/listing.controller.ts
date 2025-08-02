import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { AuthedRequest } from "../types";

const prisma = new PrismaClient();

export const getListings = async (req: AuthedRequest, res: Response) => {
  if (!req.user?.userId) {
    res.status(401).json({ message: "Not authorized" });
  }

  try {
    const listings = await prisma.listing.findMany();

    res.status(200).json({ data: listings });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
