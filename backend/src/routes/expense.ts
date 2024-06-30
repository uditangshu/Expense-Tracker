import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {verify} from 'hono/jwt';


export const expenseRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      Secret: string
    },Variables:{
        userId: any
    }
  }>();

  

expenseRouter.use("/*",async (c,next)=>{
    const authToken = c.req.header('Authorization') || "";
    const user = await verify(authToken,c.env.Secret);
  
    if(!user)
    {
        c.status(403)
        return c.json({
            error: 'Unauthorized'
        })
    }
    
        c.set("userId",user.id)
        await next();
})

  expenseRouter.post('/', async (c) => {
    const body = await c.req.json();
    const userId = c.get("userId");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    if(body.categoryId === undefined){
      return c.json({
        message: "please create a category frist"
      })
    }
    const expense = await prisma.expense.create({
      data: { balance: body.balance, 
        description: body.description,
        userId: userId, 
        categoryId: body.categoryId }
    });
  
    const user = await prisma.user.findUnique(
      { 
      where: 
      { id: userId } 
      });
    if (!user) {
      return c.json({ error: 'User not found' });
    }
    const newBalance = user.balance - body.balance;
    await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
    return c.json(expense);
  });
   
  expenseRouter.get('/all-expenses', async (c) => {
    const prisma = new PrismaClient({
         datasourceUrl: c.env.DATABASE_URL,
       }).$extends(withAccelerate())
  
    const expense = await prisma.expense.findMany();
    return c.json(expense);
    
  });
  

  expenseRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get("userId");
    const expense = await prisma.expense.findUnique({
       where: 
      { 
        userId: userId,
        id: Number(id)
      } 
    });

    if(!expense){
      return c.json({
        message: "category does not exist"
      })
    }
    return c.json(expense);
  });
  
  expenseRouter.put('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const oldExpense = await prisma.expense.findUnique({
       where: {
         id: Number(id) 
        } 
      });
    const userId = c.get("userId");
  
    if (oldExpense) {
      const expense = await prisma.expense.update({
        where: { id: Number(id) },
        data: { balance: body.balance,
          description: body.description, 
          userId: userId,
          categoryId: body.categoryId }
      });

      const amountDifference = body.balance - oldExpense.balance;

      const user = await prisma.user.findUnique(
        { 
        where: 
        { id: userId } 
        });
      if (!user) {
        return c.json({ error: 'User not found' });
      }
      const newBalance = user.balance - amountDifference;
      await prisma.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });
     
      return c.json(expense);
    } else {
      return c.notFound();
    }
  });
  
  expenseRouter.delete('/:id', async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const expense = await prisma.expense.findUnique({ where: { id: Number(id) } });
  
    if (expense) {
      const userId = c.get("userId");
      const user = await prisma.user.findUnique(
        { 
        where: 
        { id: userId } 
        });
      if (!user) {
        return c.json({ error: 'User not found' });
      }
      const newBalance = user.balance - body.balance;
      await prisma.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });
       // Add the expense amount.... back to the user's balance....(testing with whole body and function inside this time)
      return c.json({ message: 'Expense deleted' } && user.balance);
    } 
    else {
      return c.notFound();
    }
  });
  
 