import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient()
const listAccounts = async () => {
    const result = await prisma.account.findMany()

    const response = responseConstructor(200, result)

    return response
}

const handler  = listAccounts

export {handler}