import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { responseConstructor } from "../../utils/common.mjs"
import { authHandler } from "../../middleware/authMiddleware.mjs"

const prisma = new PrismaClient

const fetchAccountDetails = async (event) => {
    const {auth} = event;
    const result = await prisma.account.findUnique({
        where: {
          id: parseInt(event.pathParameters.id),
          userId: auth.id
        },
      });
    const response = responseConstructor(200, result)

    return response
}

const handler = middy(fetchAccountDetails).use(httpJsonBodyParser()).use(authHandler())

export {handler}