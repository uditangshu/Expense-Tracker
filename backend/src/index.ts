import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { expenseRouter } from './routes/expense';
import { categoriesRouter } from './routes/categories';
import { cors } from 'hono/cors';
import {cron} from "./triggers/cronWorker"
import { homeRouter } from './routes/home';



const app = new Hono();

app.use('/api/v1/*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAge: 3600,
    credentials: true,
  }));


app.route('/api/v1/user',userRouter);
app.route('/api/v1/expenses',expenseRouter);
app.route('/api/v1/categories',categoriesRouter);
app.route('/api/v1/home',homeRouter);

app.use("/*",async(c: any)=>{
    await cron({
        cron: "0 0 1 * *",
        env: {
            
            DATABASE_URL: c.env.DATABASE_URL
        }
    })
})
export default app;
