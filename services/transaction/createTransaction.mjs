import { PrismaClient } from "@prisma/client"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import { responseConstructor } from "../../utils/common.mjs"
import { authHandler } from "../../middleware/authMiddleware.mjs"

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

      if (account.balance < amount) {
        throw('error', {message: "Insuffience Balance"})
      }
  
      // Update the balance in the account
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: {
          balance: spentType === "in" ? account.balance + amount : account.balance - amount,
          debitBalance: account.debitBalance + (spentType === "out" ? amount : 0),
          creditBalance: account.creditBalance + (spentType === "in" ? amount : 0),
        },
      });
  
      return { newTransaction, updatedAccount };
    });
  
    return transaction;
  }

const createTransaction = async (event) => {
    let response = addTransactionAndUpdateBalance({...event.body, userId: event.auth.id, updatedAt: new Date()})
        .then((result) => {
            console.log('Transaction added and account balance updated:', result);
            return responseConstructor(200, {message: 'success'})

        })
        .catch((error) => {
            return responseConstructor(500, error || {message: 'fail'})
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
    return response;
}

const handler = middy(createTransaction).use(httpJsonBodyParser()).use(authHandler())

export {handler}