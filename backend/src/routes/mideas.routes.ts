import { Router } from "express";
import fs from "fs";
import { resolve } from "path";
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
  }),

  router.get("/stream/:id", async function (request, response) {
    const { id } = request.params;

    const { midea } = await mideaController.findById(id);
    const path = resolve("uploads/", `${midea?.url}`);

    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = request.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(path, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      response.writeHead(206, head);
      file.pipe(response);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      response.writeHead(200, head);
      fs.createReadStream(path).pipe(response);
    }
  })
);

export default router;
