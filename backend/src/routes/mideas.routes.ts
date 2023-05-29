import { Router } from "express";

import { progress_middleware } from "./middlewares";
import uploadConfig from "../config/upload";
import multer from "multer";

import { MideaController } from "../controllers/mideas.controllers";

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
      music_groups,
      description,
      genre,
      release_date,
      type,
      visibility,
      user_id,
    } = request.body;

    await mideaController.create({
      name,
      authors,
      album,
      music_groups,
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
