import { Router } from "express";

import { progress_middleware } from "./middlewares";
import uploadConfig from "../config/upload";
import multer from "multer";

import { MideaController } from "../controllers/mideas.controllers";
import AppError from "../errors/appError";
import { destructureObject } from "../helpers";

const mideaController = new MideaController();

const uploadAvatar = multer(uploadConfig("./uploads"));

const router = Router();
router.post(
  "/",
  progress_middleware,
  uploadAvatar.fields([
    { name: "url", maxCount: 1 },
    { name: "cover_url", maxCount: 1 },
  ]),
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

    const fields = request.files;

    const images = destructureObject(fields);

    if (!fields?.length == !2) {
      throw new AppError("Error on Upload File,Please, Try Again", 400);
    }

    await mideaController.create({
      name,
      authors,
      album,
      music_group,
      url: images.url.filename,
      cover_url: images.cover_url.filename,
      description,
      genre,
      release_date,
      type,
      visibility,
      user_id,
    });

    return response.status(200).send("File uploaded");
  },

  router.get("/", async (request, response) => {
    return response.json(await mideaController.list());
  }),

  router.get("/:id", async (request, response) => {
    const { id } = request.params;

    const { count, midea } = await mideaController.findById(id);
    return response.json({ ...midea, count });
  })
);

export default router;
