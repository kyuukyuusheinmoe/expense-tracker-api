import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"

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

const handler = claculateTotalBalance
        
export {handler};
