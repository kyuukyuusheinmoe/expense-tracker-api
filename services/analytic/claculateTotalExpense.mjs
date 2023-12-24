import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"

//TODO: add date params
const prisma = new PrismaClient()

const claculateTotalBalance = async () => {
    const result = await prisma.transaction.aggregate({
      where: {
        spentType: "out"
      },
      _sum: {
        amount: true,
      },
    });
    const response = responseConstructor(200, {total: result?._sum.amount});
    return response
}

const handler = claculateTotalBalance
        
export {handler};
