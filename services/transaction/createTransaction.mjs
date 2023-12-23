import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { responseConstructor } from "../../utils/common.mjs"

const prisma = new PrismaClient

async function addTransactionAndUpdateBalance(transactionData) {
    const { amount, accountId, spentType, ...rest } = transactionData;

    // Start a Prisma transaction
    const transaction = await prisma.$transaction(async (prisma) => {
      // Add the new transaction
      const newTransaction = await prisma.transaction.create({
        data: {
          amount,
          accountId,
          spentType,
          ...rest
        },
      });
  
      // Get the current balance of the account
      const account = await prisma.account.findFirst({
        where: { id: accountId },
      });
  
      // Update the balance in the account
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: spentType === "in" ? account.balance + amount : account.balance - amount ,
        },
      });
  
      return { newTransaction, updatedAccount };
    });
  
    return transaction;
  }

const createTransaction = async (event) => {
    let response = addTransactionAndUpdateBalance({...event.body, updatedAt: new Date()})
        .then((result) => {
            console.log('Transaction added and account balance updated:', result);
            return responseConstructor(200, {message: 'success'})

        })
        .catch((error) => {
            console.error('Error adding transaction:', error);
            return responseConstructor(500, {message: 'fail'})

        })
        .finally(async () => {
            await prisma.$disconnect();
        });
    return response;
}

const handler = middy(createTransaction).use(httpJsonBodyParser())

export {handler}