import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"
import middy from "middy"
import { authHandler } from "../../middleware/authMiddleware.mjs"
import httpJsonBodyParser from '@middy/http-json-body-parser'

//TODO: add date params
const prisma = new PrismaClient()

const claculateTotalExpense = async (event) => {
  const { from } = event.queryStringParameters;

    const result = await prisma.transaction.aggregate({
      where: {
        userId: event.auth.id,
        spentType: "out",
        createdAt: {
          lte: new Date(),
          gte: new Date(from),
        },
      },
      _sum: {
        amount: true,
      },
    });
    const response = responseConstructor(200, {total: result?._sum.amount});
    return response
}

const handler = middy(claculateTotalExpense).use(httpJsonBodyParser()).use(authHandler())
        
export {handler};
