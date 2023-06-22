import { CreatePlaylistDTO } from "./dtos";
import AppError from "../errors/appError";
import { DatabasePlaylist, DatabaseUser } from "../database";

class PlaylistControllers {
  readonly databasePlaylist = new DatabasePlaylist();
  readonly databaseUser = new DatabaseUser();

  async create({ name, description, visibility, user_id }: CreatePlaylistDTO) {
    const userExists = await this.databaseUser.findByID(user_id);

    if (!userExists) {
      return new AppError("User Not Exists", 400);
    }
    const playlist = await this.databasePlaylist.create({
      name,
      description,
      visibility,
      user_id,
    });

    return playlist;
  }
}

export { PlaylistControllers };
