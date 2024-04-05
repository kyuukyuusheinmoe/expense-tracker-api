import { PrismaClient } from "@prisma/client"
import { responseConstructor } from "../../utils/common.mjs"
import { authHandler } from "../../middleware/authMiddleware.mjs"
import middy from "middy"
import httpJsonBodyParser from '@middy/http-json-body-parser'
import moment from "moment"

const prisma = new PrismaClient()

const listTopCategories = async (event) => {
    const currentDate = new Date()
    const thisMonthStart = moment(currentDate).startOf('month').format('YYYY-MM-DD');
    const thisMonthEnd = moment(currentDate).endOf('month').format('YYYY-MM-DD');

    const { limit=3, from=thisMonthStart, to=thisMonthEnd } = event.queryStringParameters;
    const categories = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        spentType: "out",
        userId: event.auth.id,
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: +limit,
    });

    const categoryIds = categories.map((item) => item.categoryId);

    const categoriesWithAmount = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        label: true,
      },
    });

    const result = categories.map((item) => ({
      categoryName: categoriesWithAmount.find((c) => c.id === item.categoryId).label,
      amount: item._sum.amount,
    }));

    
    const response = responseConstructor(200, result);
    return response
}

const handler = middy(listTopCategories).use(httpJsonBodyParser()).use(authHandler())
        
export {handler};
