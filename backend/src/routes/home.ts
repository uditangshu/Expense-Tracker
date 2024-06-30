import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export const homeRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      Secret: string
    },Variables:{
        userId: any
    }
  }>();

homeRouter.use("/*",async (c,next)=>{
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

homeRouter.get("/",async(c)=>{
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    const userId = c.get("userId");
    const user = await prisma.user.findUnique({
        where: {
            id: userId
            }
        })
        if(!user)
            {
                return c.json({
                    error: 'Unauthorized'
                })
            }

        return c.json(user)
})


homeRouter.put('/', async (c) => {
    const id = c.get("userId");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const user = await prisma.user.update({
      where: { id: id },
      data: { 
        username: body.username,
      }
    });
    return c.json(user);
  });
  