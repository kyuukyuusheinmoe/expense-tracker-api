const { PrismaClient } = require("@prisma/client")
const middy = require('middy')
const httpJsonBodyParser = require("@middy/http-json-body-parser")
const { responseConstructor } = require("../../utils/common")

const prisma = new PrismaClient()

const listTransaction = async () => {
    console.log ('xxx listTransaction ')
    const list = await prisma.transaction.findMany()

    const response = responseConstructor(200, list);
    return response
}

const handler = listTransaction
        
module.exports = { handler }