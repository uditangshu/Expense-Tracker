import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
import { signupSchema,signinSchema} from "@uditangshu/social-common";

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string
      Secret: string
    },
    Variables: {
      userId: any
    }
  }>();

userRouter.post('/signup',async (c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const {success} = signupSchema.safeParse(body);
    if(!success)
    {
         return c.json({
        error: 'Invalid body'
      })
    }
    const check = await prisma.user.findUnique({
      where :{
        email : body.email,
      }
    })
    if(check)
    {
     return c.json({
      error: 'User already exists'
     });
    }
    try
    {
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password,
          username: body.username,
          balance : body.balance,
          income: body.income

        },
      });
      
      const jwtToken = await sign({id: user.id},c.env.Secret)
      return c.json({
        jwt: jwtToken
      })
    }
    catch(e: any)
    {
      c.status(403)
      return c.json({error: e.message})
    }
    
})

userRouter.post('/signin',async (c)=>{
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

  const body = await c.req.json();
  const {success} = signinSchema.safeParse(body);
  if(!success)
  {
    return c.json({
      error: 'Invalid body'
    })
  }
  const user = await prisma.user.findUnique({
    where :{
      email : body.email,
      password: body.password
    }
  }) 
    if(!user)
    {
      return c.json({
        error: 'user not found'
      })
    }
    const jwtToken = await sign({id: user.id},c.env.Secret)
    return c.json({
      jwt: jwtToken
    })
  })

  userRouter.put('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const user = await prisma.user.update({
      where: { id: id },
      data: { 
        username: body.username, 
        password: body.password,
        email: body.email
      }
    });
    return c.json({
      message: "user updated successfully" 
    });
  });
  
  userRouter.get('/all-users', async (c) => {
    const prisma = new PrismaClient({
         datasourceUrl: c.env.DATABASE_URL,
       }).$extends(withAccelerate())
  
    const user = await prisma.user.findMany();
  
    return c.json({
      user
      })
  });

  //need to this to check if the db is working ....

  userRouter.get('/:id', async (c) => {

    const id = c.req.param("id");
    const prisma = new PrismaClient({
         datasourceUrl: c.env.DATABASE_URL,
       }).$extends(withAccelerate())
  
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });
    return c.json(user);
    
  });

  