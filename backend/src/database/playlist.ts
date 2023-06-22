import { PrismaClient } from "@prisma/client";
import { v4 as uuidV4 } from "uuid";
import { Visibility } from "./mideas";
export interface ICreatePlaylist {
  name: string;
  visibility: string;
  user_id: string;
  description?: string;
}

export class DatabasePlaylist {
  readonly prisma = new PrismaClient();

  async create({ name, description, visibility, user_id }: ICreatePlaylist) {
    return await this.prisma.playlist.create({
      data: {
        name,
        description,
        visibility,
        user_id: user_id,
        id: uuidV4(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
}
