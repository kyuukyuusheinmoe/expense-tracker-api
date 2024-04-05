import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { responseConstructor } from "../../utils/common.mjs"
import { authHandler } from "../../middleware/authMiddleware.mjs"


const prisma = new PrismaClient

const updateAccount = async (event) => {
    const {auth, pathParameters} = event;
    const body = event.body
    const result = await prisma.account.update(
        {   
            where: {id: parseInt(pathParameters.id), userId: auth.id},
            data: {...body, updatedAt: new Date()}
    })
    const response = responseConstructor(200, result)

    return response
}

const handler = middy(updateAccount).use(httpJsonBodyParser()).use(authHandler())

export {handler}