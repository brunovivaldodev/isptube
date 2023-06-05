import { DatabaseUser } from "../database";
import AppError from "../errors/appError";
import { CreateUserDTO } from "./dtos";

class UserControllers {
  readonly databaseUser = new DatabaseUser();

  async create({ email, confirmationPassword, name, password ,avatarUrl}: CreateUserDTO) {
    if (password != confirmationPassword) {
      return new AppError("Password Does Not Match",400);
    }

    const userExists = await this.databaseUser.findByEmail(email);

    if (userExists) {
      return new AppError("User Already Exists",400);
    }

    return await this.databaseUser.create({ email, name, password ,avatarUrl});
  }


  async findById(id: string) {
    return await this.databaseUser.findByID(id);
  }
}

export { UserControllers };
