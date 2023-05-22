import { Router } from "express";
import mideaRoutes from "./mideas.routes";
import userRoutes from "./users.routes";

const routes = Router();

routes.use("/mideas", mideaRoutes);
routes.use("/users", userRoutes);

export default routes;
