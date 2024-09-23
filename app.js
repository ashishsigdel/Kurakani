import express from "express";
import { createServer } from "http";
import cors from "cors";

import ApiError from "./app/utils/apiError.js";
import APIRoute from "./app/routes/index.js";
import cookieParser from "cookie-parser";
import errorHandlerMiddleware from "./app/middlewares/error.middleware.js";
import setUpSocket from "./app/socket/socket.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const httpServer = createServer(app);

const { io } = setUpSocket(httpServer);

app.use("/api/v1", APIRoute);

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

app.use(errorHandlerMiddleware);

export { app, io };

export default httpServer;
