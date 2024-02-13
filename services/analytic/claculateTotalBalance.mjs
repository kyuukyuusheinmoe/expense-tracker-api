import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"
import middy from "middy"
import { authHandler } from "../../middleware/authMiddleware.mjs"
import httpJsonBodyParser from '@middy/http-json-body-parser'

const prisma = new PrismaClient()

const claculateTotalBalance = async () => {
    const result = await prisma.account.aggregate({
      _sum: {
        balance: true,
      },
    });
    const response = responseConstructor(200, {total: result?._sum.balance});
    return response
}

const handler = middy(claculateTotalBalance).use(httpJsonBodyParser()).use(authHandler())
        
export {handler};
