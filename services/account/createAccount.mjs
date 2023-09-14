import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient

const createAccount = async (event) => {
    const body = event.body
    const result = await prisma.account.create({...body})
    const response = responseConstructor(200, result)

    return response
}

const handler = middy(createAccount).use(httpJsonBodyParser())

module.exports = {handler}