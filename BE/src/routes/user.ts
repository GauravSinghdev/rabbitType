import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import bcrypt from 'bcryptjs'; // Import bcryptjs

// Define schema for signup
const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Define schema for signin
const signinSchema = z.object({
    email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

userRouter.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { success, data, error } = signupSchema.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({
        message: "Inputs not correct",
        errors: error,
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash the password

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const ifUser = await prisma.user.findFirst({
        where: {
          username: data.username,
        }
    });

    const ifEmail = await prisma.user.findFirst({
        where: {
          email: data.email,
        }
    });

    if(ifUser || ifEmail){
        if(ifUser && ifEmail){
            c.status(404);
            return c.json({
                message: "Inputs not correct.",
                errors: "User and Email already present.",
            })
        }
        else if(ifUser){
            c.status(404);
            return c.json({
                message: "Inputs not correct.",
                errors: "User already present.",
            })
        }
    
        else{
            c.status(404);
            return c.json({
                message: "Inputs not correct.",
                errors: "Email already present.",
            })
        }
    }
    
    const user = await prisma.user.create({
      data: {
        email: data.email.trim(),
        username: data.username.trim(),
        password: hashedPassword, // Store hashed password
      }
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      message: 'Signup successfully.',
      jwt,
      user,
    });
  } catch (e) {
    console.error(e); // Log error for debugging
    c.status(500);
    return c.json({
      message: 'Internal server error',
    });
  }
});

userRouter.post('/signin', async (c) => {
  try {
    const body = await c.req.json();
    const { success, data, error } = signinSchema.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({
        message: "Inputs not correct",
        errors: error,
      });
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      }
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) { // Compare hashed password
      c.status(403);
      return c.json({
        message: "Incorrect credentials!",
      });
    }

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      message: 'Signin successfully.',
      jwt,
      user,
    });
  } catch (e) {
    console.error(e); // Log error for debugging
    c.status(500);
    return c.json({
      message: 'Internal server error',
    });
  }
});


