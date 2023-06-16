import { DatabaseUser } from "../database";
import { DatabaseMidea, MideaType, Visibility } from "../database/mideas";
import AppError from "../errors/appError";
import { CreateMideaDTO, UpdateMideaDTO } from "./dtos";

// Data Transfer Object
class MideaController {
  readonly databaseMidea = new DatabaseMidea();
  readonly databaseUser = new DatabaseUser();

  async create(data: CreateMideaDTO) {
    if (!(data.type in MideaType)) {
      return new AppError("MediaType Not Allowed", 400);
    }

    if (!(data.visibility in Visibility)) {
      return new AppError("Invalid Visibility Type", 400);
    }

    const userExists = await this.databaseUser.findByID(data.user_id);

    if (!userExists) {
      return new AppError("User Not Exists", 400);
    }

    return await this.databaseMidea.create({
      ...data,
      type: data.type as MideaType,
      visibility: data.visibility as Visibility,
    });
  }
  async list() {
    return await this.databaseMidea.list();
  }

  async findByIdAndCount(id: string) {
    return await this.databaseMidea.findByIdAndCount(id);
  }

  async delete(id: string) {
    return await this.databaseMidea.delete(id);
  }
  
  async update(data: UpdateMideaDTO) {

    const mideaExists = await this.databaseMidea.findById(data.id);

    if (!mideaExists) {
      return new AppError("Midea Not Exists", 400);
    }
    if (data.type && !(data?.type in MideaType)) {
      return new AppError("MediaType Not Allowed", 400);
    }

    if (data.visibility && !(data.visibility in Visibility)) {
      return new AppError("Invalid Visibility Type", 400);
    }

    return await this.databaseMidea.updade({
      ...data,
      type: data.type as MideaType,
      visibility: data.visibility as Visibility,
    });
  }
}

export { MideaController };
