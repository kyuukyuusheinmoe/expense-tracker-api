import { PrismaClient } from "@prisma/client";
import { responseConstructor } from "../../utils/common.mjs";
import middy from "middy";
import httpJsonBodyParser from "@middy/http-json-body-parser";

const prisma = new PrismaClient()

const createCategory = async (event) => {
    const result = await prisma.category.create({data: {...event.body, updatedAt: new Date()}})

    return responseConstructor(200, result)
}

const handler = middy(createCategory).use(httpJsonBodyParser())

export {handler}


