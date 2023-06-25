import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "express-async-errors";

import routes from "./routes";
import AppError from "./errors/appError";
import path from "path";
const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "uploads")));

app.use(routes);

io.on("connection", (socket) => {
  console.log("a user connected");
});

app.use(
  (err: Error, resquest: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: "error",
      message: `Internal Error Server -${err.stack}`,
    });
  }
);
