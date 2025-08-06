import { CorsOptions } from "cors";

export const allowedOrigins = [
  "https://buylocal-fe.vercel.app/", // the actuall site when deployed.
  "http://localhost:4200",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {

    if(!origin) {
      callback(new Error('No origin found'));
      return;
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

export default corsOptions;
