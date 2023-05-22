import { PrismaClient } from "@prisma/client";
import {v4 as uuidV4} from "uuid"
export interface ICreateUser {
    name: string;
    email: string;
    password: string;
}


export class DatabaseUser {
    readonly prisma = new PrismaClient()

    async create({email,name,password} : ICreateUser ) {
       return await this.prisma.user.create({data : {email, name,password, id : uuidV4()}})
    }

    async findByEmail(email : string) {
        const user = this.prisma.user.findFirst({where : {email : email}})
        return user
    }



}