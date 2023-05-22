import { Router } from "express";
import { UserControllers } from "../controllers";

const router = Router();

const usersController = new UserControllers();

router.post("/", async (request, response) => {
  const { name, email, password, confirmationPassword } = request.body;
  const user = await usersController.create({
    name,
    email,
    password,
    confirmationPassword,
  });

  return response.json(user);
});

export default router;
