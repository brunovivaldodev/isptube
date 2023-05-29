import { Router } from "express";

import { progress_middleware } from "./middlewares";
import uploadConfig from "../config/upload";
import multer from "multer";

import { MideaController } from "../controllers/mideas.controllers";
import AppError from "../errors/appError";

const mideaController = new MideaController();

const uploadAvatar = multer(uploadConfig("./uploads"));

const router = Router();
router.post(
  "/",
  progress_middleware,
  uploadAvatar.single("file"),
  async (request, response) => {
    const {
      name,
      authors,
      album,
      music_group,
      description,
      genre,
      release_date,
      type,
      visibility,
      user_id,
    } = request.body;

    const url = request.file?.filename;

    if (!url) {
      throw new AppError("Error on Upload File,Please, Try Again", 400);
    }

    await mideaController.create({
      name,
      authors,
      album,
      music_group,
      url,
      cover_url: undefined,
      description,
      genre,
      release_date,
      type,
      visibility,
      user_id,
    });

    return response.status(200).send("File uploaded");
  }
);

export default router;
