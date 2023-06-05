import { Router } from "express";
import { UserControllers } from "../controllers";
import uploadConfig from "../config/upload";

import multer from "multer";
import AppError from "../errors/appError";

const router = Router();

const usersController = new UserControllers();

const uploadAvatar = multer(uploadConfig("./uploads"));


router.post("/",uploadAvatar.single("avatar"), async (request, response) => {
  const { name, email, password, confirmationPassword } = request.body;

  const avatarUrl = request.file?.filename;

  if (!avatarUrl) {
    throw new AppError("Error on Upload File,Please, Try Again", 400);
  }

  const user = await usersController.create({
    name,
    email,
    password,
    confirmationPassword,
    avatarUrl
  });

  return response.json(user);
});


router.get("/:id", async (request, response) => {
  const { id } = request.params;

  const users = await usersController.findById(id);
  return response.json({ users });
})

export default router;
