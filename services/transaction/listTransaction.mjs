import { PrismaClient } from "@prisma/client"
import middy from "middy"
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient()

const listTransaction = async (event) => {
  const {pageSize, page} = event.queryStringParameters;
    const list = await prisma.transaction.findMany({
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

const handler = listTransaction
        
export {handler};
