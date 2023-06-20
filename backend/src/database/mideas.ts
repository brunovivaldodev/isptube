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

export interface UpdateMidea {
  id: string;
  name?: string;
  authors?: string;
  album?: string;
  music_group?: string;
  description?: string;
  genre?: string;
  release_date?: Date;
  type?: string;
  visibility?: string;
  cover_url?: string;
  url?: string;
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

  async updade(data: UpdateMidea) {
    const midea = await this.findById(data.id);
    return await this.prisma.midea.update({
      where: { id: data.id },
      data: {
        name: data.name ? data.name : midea?.name,
        authors: data.authors ? data.authors : midea?.authors,
        cover_url: data.cover_url ? data.cover_url : midea?.cover_url,
        description: data.description ? data.description : midea?.description,
        genre: data.genre ? data.genre : midea?.genre,
        url: data.url ? data.url : midea?.url,
        type: data.type ? data.type : midea?.type,
        visibility: data.visibility ? data.visibility : midea?.visibility,
        music_group: data.music_group ? data.music_group : midea?.music_group,
        album: data.album ? data.album : midea?.album,
        updated_at: new Date(),
        release_date: data.release_date
          ? new Date(data.release_date)
          : midea?.release_date,
      },
    });
  }

  async delete(id: string) {
    await this.prisma.midea.delete({
      where: { id },
    });
  }

  async list() {
    return await this.prisma.midea.findMany({
      where: { visibility: Visibility.public },
      include: { user: true },
    });
  }

  async listByUser(id: string) {
    return await this.prisma.midea.findMany({
      where: {
        user_id: id,
        visibility: Visibility.public,
      },
      include: { user: true },
    });
  }

  async search(query: string) {
    const mideas = await this.prisma.midea.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        visibility: Visibility.public,
      },
      include: {
        user: true,
      },
    });

    const users = await this.prisma.user.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      include: { Midea: { where: { visibility: Visibility.public } } },
    });

    return { mideas, users };
  }

  async findById(id: string) {
    return await this.prisma.midea.findFirst({
      where: { id },
    });
  }

  async findByIdAndCount(id: string) {
    const midea = await this.prisma.midea.findFirst({
      where: { id },
      include: { user: true },
    });

    const count = await this.prisma.midea.count({
      where: { user_id: midea?.user.id },
    });

    return { midea, count };
  }
}
