import { Router } from "express";
import { PlaylistControllers } from "../controllers";

const router = Router();

const playlistController = new PlaylistControllers();

router.post("/:user_id", async (request, response) => {
  const { name, visibility, description } = request.body;

  const { user_id } = request.params;

  const playlist = await playlistController.create({
    name,
    description,
    visibility,
    user_id: user_id,
  });

  return response.json(playlist);
});

router.post("/:id/add", async (request, response) => {
  const { midea_id } = request.body;

  const { id } = request.params;

  const playlist = await playlistController.addmidea(id, midea_id);

  return response.json(playlist);
});

export default router;
