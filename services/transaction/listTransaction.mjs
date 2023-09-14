import { PrismaClient } from "@prisma/client"
import middy from "middy"
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient()

const listTransaction = async () => {
    const list = await prisma.transaction.findMany()

    const response = responseConstructor(200, list);
    return response
}

const handler = listTransaction
        
export {handler};
