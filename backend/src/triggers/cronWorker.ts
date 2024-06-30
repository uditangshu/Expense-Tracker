import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';


export async function cron( c: any) {
    if (c.cron === '0 0 1 * *') {
      const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate());
  
      async function updateIncome() {
        const users = await prisma.user.findMany();
        for (const user of users) {
          const newBalance = user.balance + user.income;
          await prisma.user.update({
            where: { id: user.id },
            data: { balance: newBalance },
          });
        }
      }
      await updateIncome();
    }
  }