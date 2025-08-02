import express, { Express, Request, Response } from "express";
import { Listing, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
  const listings: Listing[] = await prisma.listing.findMany();
  res.send(listings.map((l) => `<div>${l.name}</div>`).join(""));
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
