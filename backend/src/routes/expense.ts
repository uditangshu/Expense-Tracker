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

expenseRouter.post('/:id', async (c) => {
  const categoryId = c.req.param("id");
  const body = await c.req.json();
  const userId = c.get("userId");

  if (!categoryId) {
    return c.json({
      message: "please create a category first"
    }, 400);
  }
  if (!body.balance ||!body.description) {
    return c.json({
      message: "balance and description are required"
    }, 400);
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const category = await prisma.category.findUnique({
    where: {
      name: (categoryId)
    }
  });

  if (!category) {
    return c.json({
      message: "category not found"
    }, 404);
  }

  const expense = await prisma.expense.create({
    data: {
      balance: body.balance,
      description: body.description,
      userId: userId,
      category: (categoryId)
    }
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const newBalance = user.balance - body.balance;
  await prisma.user.update({
    where: { id: userId },
    data: { 
      balance: newBalance 
     },
  });

  return c.json(expense);
});

expenseRouter.post('/', async (c) => {

  const body = await c.req.json();
  const userId = c.get("userId");

  if (!body.category)
    {
    return c.json({
      message: "please create a category first"
    }, 400);
  }

  if (!body.balance ||!body.description) {
    return c.json({
      message: "balance and description are required"
    }, 400);
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const category = await prisma.category.findUnique({
    where: {
      name: body.category
    }
  });

  if (!category) {
    return c.json({
      message: "category not found"
    }, 404);
  }

  const expense = await prisma.expense.create({
    data: {
      balance: body.balance,
      description: body.description,
      userId: userId,
      category: body.category
    }
  });

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const newBalance = user.balance - body.balance;
  await prisma.user.update({
    where: { id: userId },
    data: { 
      balance: newBalance 
     },
  });

  return c.json(expense);
});
   
  expenseRouter.get('/all-expenses', async (c) => {
    const prisma = new PrismaClient({
         datasourceUrl: c.env.DATABASE_URL,
       }).$extends(withAccelerate())
    const userId = c.get("userId");

    const expense = await prisma.expense.findMany({
      where: 
      { 
        userId: userId
      }
    });
    return c.json(expense);
    
  });
  

  expenseRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const userId = c.get("userId");


    const expense = await prisma.expense.findMany({
      where: 
      { 
        userId: userId,
        category: String(id)
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
          category: body.category
        }
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
          category: body.category
        }
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
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const expense = await prisma.expense.findUnique({ 
      where:
      { 
        id: Number(id) 
      } 
    });
  
    if (expense) {
      const userId = c.get("userId");
      const user = await prisma.user.findUnique(
        { 
        where:
        { 
          id: userId
        } 
      });
      if (!user) {
        return c.json({ error: 'User not found' });
      }
      const newBalance = user.balance + expense.balance;
      await prisma.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      await prisma.expense.delete({
        where: {
          id: Number(id)
        }
      });
       // Add the expense amount.... back to the user's balance....(testing with whole body and function inside this time)
      return c.json(c.req.json);
    } 
    else {
      return c.notFound();
    }
  });
