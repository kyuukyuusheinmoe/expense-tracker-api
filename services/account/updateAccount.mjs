import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { responseConstructor } from "../../utils/common.mjs"

//TODO: make it work
const prisma = new PrismaClient

const updateAccount = async (event) => {
    const body = event.body
    const result = await prisma.account.update({data: {...body, updatedAt: new Date()}})
    const response = responseConstructor(200, result)

    return response
}

const handler = middy(updateAccount).use(httpJsonBodyParser())

export {handler}