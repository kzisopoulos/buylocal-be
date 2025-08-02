import express, { Express, Request, Response } from "express";
import { Listing, PrismaClient } from "@prisma/client";
import cors from "cors";
import corsOptions from "./config/cors";
import authRoutes from "./routes/auth.routes";

const prisma = new PrismaClient();
const app: Express = express();

app.use(cors(corsOptions));
const port = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
