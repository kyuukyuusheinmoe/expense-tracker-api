import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient

const createTransaction = async (event) => {
    const result = await prisma.transaction.create({data: {...event.body, updatedAt: new Date()}})

    const response = responseConstructor(200, result)

    return response;
    
}

const handler = middy(createTransaction).use(httpJsonBodyParser())

export {handler}