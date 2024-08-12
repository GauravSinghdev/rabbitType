import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

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
        message: "Input validation failed.",
        errors: error.flatten().fieldErrors,
      });
    }

    const prisma = new PrismaClient({
      datasources: {
        db: { url: c.env.DATABASE_URL }
      }
    }).$extends(withAccelerate());

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: data.username.trim() },
            { email: data.email.trim() }
          ]
        }
      });

      if (existingUser) {
        c.status(409);
        return c.json({
          message: "Username or email already exists.",
          errors: existingUser.username === data.username ? "Username already in use." : "Email already in use."
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await prisma.user.create({
        data: {
          email: data.email.trim(),
          username: data.username.trim(),
          password: hashedPassword,
        }
      });

      const payload = { id: user.id, exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60) }; // Expire in 5 hours
      const jwt = sign(payload, c.env.JWT_SECRET);

      return c.json({
        message: 'Signup successful.',
        jwt,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (e) {
    console.error('Error during signup:', e);
    c.status(500);
    return c.json({
      message: 'Internal server error. Please try again later.',
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
        message: "Input validation failed.",
        errors: error.flatten().fieldErrors,
      });
    }

    const prisma = new PrismaClient({
      datasources: {
        db: { url: c.env.DATABASE_URL }
      }
    }).$extends(withAccelerate());

    try {
      const user = await prisma.user.findFirst({
        where: {
          email: data.email.trim(),
        }
      });

      if (!user || !(await bcrypt.compare(data.password, user.password))) {
        c.status(403);
        return c.json({
          message: "Incorrect credentials!",
        });
      }

      const payload = { id: user.id, exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60) }; // Expire in 5 hours
      const jwt = sign(payload, c.env.JWT_SECRET);

      return c.json({
        message: 'Signin successful.',
        jwt,
        user: { id: user.id, username: user.username, email: user.email },
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (e) {
    console.error('Error during signin:', e);
    c.status(500);
    return c.json({
      message: 'Internal server error. Please try again later.',
    });
  }
});
