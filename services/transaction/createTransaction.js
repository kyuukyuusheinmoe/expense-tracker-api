const { PrismaClient } = require("@prisma/client")
const middy = require('middy')
const httpJsonBodyParser = require("@middy/http-json-body-parser")
const { responseConstructor } = require("../../utils/common")

const prisma = new PrismaClient

const createTransaction = async (event) => {
    const body = event.body

    const result = await prisma.transaction.create({...body})

    const response = responseConstructor(200, result)

    return response;
    
}

const handler = middy(createTransaction).use(httpJsonBodyParser)

module.exports = {handler}