import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"

//TODO: add date params
const prisma = new PrismaClient()

const claculateTotalExpense = async (event) => {
  const { from } = event.queryStringParameters;

    const result = await prisma.transaction.aggregate({
      where: {
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

const handler = claculateTotalExpense
        
export {handler};
