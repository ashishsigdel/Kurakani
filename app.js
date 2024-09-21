import express from "express";
import { createServer } from "http";
import cors from "cors";
import ApiError from "./app/utils/apiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const httpServer = createServer(app);

app.get("/", (req, res) => {
  res.json({ message: "Api Working..." });
});

// if route is api route, send 404 in json else render 404 page
app.use((req, res, next) => {
  throw new ApiError({
    status: 404,
    message: "URL Not Found",
    errors: [
      {
        message: `Cannot ${req.method} ${req.originalUrl}`,
      },
    ],
  });
});

export { app };

export default httpServer;
