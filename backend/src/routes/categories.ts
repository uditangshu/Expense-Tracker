import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {verify} from 'hono/jwt'


export const categoriesRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      Secret: string
    },
    Variables:
    {
      userId: any
    }
  }>();

  categoriesRouter.use("/*",async (c,next)=>{
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

  categoriesRouter.post('/', async (c) => {
    const body= await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  try{
    const category = await prisma.category.create({ 
      data:
       { 
        name :body.name 
      } 
      });
    return c.json({
      message : category.name
    });
  }
  catch(e: any){
    return c.json({
      message: e.error
    })
  }
    
  });
  categoriesRouter.get('/', async (c) => {

    const prisma = new PrismaClient({
         datasourceUrl: c.env.DATABASE_URL,
       }).$extends(withAccelerate())
       const userId= c.get("userId")
  
    const categories = await prisma.category.findMany();
    return c.json(categories);
  });
  
categoriesRouter.get('/:id', async (c) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const category = await prisma.category.findUnique({ 
    where: {
       id: Number(id)
       } 
    });
    if(!category){
      return c.json({
        message: "category does not exist"
      })
    }
    return c.json(category);
});

categoriesRouter.put('/:id', async (c) => {
  const id = c.req.param("id");
  const { name } = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const category = await prisma.category.update({
    where: { 
      id: Number(id) 
    },
    data: { name }
  });
  return c.json(category);
});

categoriesRouter.delete('/:id', async (c) => {
  const id= c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  await prisma.category.delete({ 
    where: { 
      id: Number(id)
    } });
  return c.json({ message: 'Category deleted' });
});