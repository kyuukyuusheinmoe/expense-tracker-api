import { PrismaClient } from "@prisma/client";
import { responseConstructor } from "../../utils/common.mjs";
import middy from "middy";
import httpJsonBodyParser from "@middy/http-json-body-parser";

const prisma = new PrismaClient()

const listCatgory = async (event) => {
    const result = await prisma.category.findMany()

    return responseConstructor(200, result)
}

const handler = middy(listCatgory).use(httpJsonBodyParser())

export {handler}


