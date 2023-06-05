import { PrismaClient } from "@prisma/client";
import { v4 as uuidV4 } from "uuid";

export interface CreateMidea {
  name: string;
  authors?: string;
  album?: string;
  music_group?: string;
  description?: string;
  genre?: string;
  release_date?: Date;
  type: string;
  visibility: string;
  cover_url?: string;
  url: string;
  user_id: string;
}

export enum Visibility {
  public = "public",
  private = "private",
}

export enum MideaType {
  video = "video",
  music = "music",
  document = "document",
}

export class DatabaseMidea {
  readonly prisma = new PrismaClient();

  async create(data: CreateMidea) {
    return await this.prisma.midea.create({
      data: {
        ...data,
        id: uuidV4(),
        created_at: new Date(),
        updated_at: new Date(),
        release_date: data.release_date
          ? new Date(data.release_date)
          : undefined,
      },
    });
  }

  async list() {
    return await this.prisma.midea.findMany({
      where: { visibility: Visibility.public },
      include: { user: true },
    });
  }

  async findById(id: string) {
    const midea = await this.prisma.midea.findFirst({
      where: { id },
      include: { user: true },
    });

    const count = await this.prisma.midea.count({
      where: { user_id: midea?.user.id },
    });


    return {midea, count};
  }
}
