import express, { Express } from "express";
import cors from "cors";
import corsOptions from "./config/cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import listingRoutes from "./routes/listing.routes";
import { protect } from "./middleware/auth.middleware";
const app: Express = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
const port = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/listing", protect, listingRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
