
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
export async function updateUserBalance(userId: string , amount: any, c: any) {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    
    const user = await prisma.user.findUnique(
      { 
      where: 
      { id: userId } 
      });
    if (!user) {
      return c.json({ error: 'User not found' });
    }
    const newBalance = user.balance + amount;
    await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
  }