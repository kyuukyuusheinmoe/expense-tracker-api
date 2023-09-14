import { PrismaClient } from "@prisma/client"
import middy from "middy"
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient

const createTransaction = async (event) => {
    const body = event.body

    const result = await prisma.transaction.create({...body})

    const response = responseConstructor(200, result)

    return response;
    
}

const handler = middy(createTransaction).use(httpJsonBodyParser)

export {handler}