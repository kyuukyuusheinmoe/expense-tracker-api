import { PrismaClient } from "@prisma/client"
import middy from "middy"
import { responseConstructor } from "../../utils/common.mjs"
import { authHandler } from "../../middleware/authMiddleware.mjs"
import httpJsonBodyParser from '@middy/http-json-body-parser'

const prisma = new PrismaClient()

const listTransaction = async (event) => {
  const {auth} = event;
  const {pageSize, page} = event.queryStringParameters;
    const list = await prisma.transaction.findMany({
      where: { userId: auth.id},
      skip: page * pageSize,
      take: +pageSize,
      include: {
        account: {select: {name:true, accountType :true }},
        category: {select: {label:true }},
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    })

    const response = responseConstructor(200, list);
    return response
}

const handler = middy(listTransaction).use(httpJsonBodyParser()).use(authHandler())
        
export {handler};
