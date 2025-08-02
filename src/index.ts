import express, { Express } from "express";
import cors from "cors";
import corsOptions from "./config/cors";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
const port = process.env.PORT || 3000;

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
