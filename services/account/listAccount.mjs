import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"
import middy from "middy"
import { authHandler } from "../../middleware/authMiddleware.mjs"
import httpJsonBodyParser from '@middy/http-json-body-parser'

const prisma = new PrismaClient()
const listAccounts = async (event) => {
    const {auth} = event;
    const result = await prisma.account.findMany({where: {
        userId: auth.id
    }})

    const response = responseConstructor(200, result)

    return response
}

const handler  = middy(listAccounts).use(httpJsonBodyParser()).use(authHandler())

export {handler}