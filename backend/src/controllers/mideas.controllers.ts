import { DatabaseUser } from "../database";
import { DatabaseMidea, MideaType, Visibility } from "../database/mideas";
import AppError from "../errors/appError";
import { CreateMideaDTO } from "./dtos";

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

  async findById(id: string) {
    return await this.databaseMidea.findById(id);
  }
}

export { MideaController };
