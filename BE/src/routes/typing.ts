import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';
import { z } from 'zod';


export const typeRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
  }>();

typeRouter.use("/*", async (c, next) => {
    try{
        const authHeader = c.req.header('authorization') || ""; // Remove error of TypeScript
        const user = await verify(authHeader, c.env.JWT_SECRET);

        if(user)
        {
            //@ts-ignore
            c.set("userId", user.id);
            await next();
        }else {
            c.status(403);
            return c.json({
              message: "You are not logged in"
            });
          }
    }catch(error){
        c.status(500);
        return c.json({
          message: "Internal server error"
        });
    }
})


typeRouter.post("/latest-typedata-insert", async (c) => {
    const body = await c.req.json();
    // const { success } = createBlogInput.safeParse(body);
    // if(!success){
    //     c.status(411);
    //     c.json({
    //         message: "Inputs are not correct"
    //     })

    // }

    const userId = c.get("userId");

    if(!userId)
    {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const type = await prisma.typingTest.create({
            data: {
                timer: body.timer,
                wpm: body.wpm,
                rawWpm: body.rawWpm,
                mistakes: body.mistakes,
                accuracy: body.accuracy,
                backspaceCount: body.backspaceCount,
                userId: Number(userId)
            }
        })

        return c.json({
            id: type.id,
            type
        })
    } catch(error){
        c.status(500);
        return c.json({
          message: "Internal server error"
        });
    }
})

typeRouter.get("/current-typedata", async (c) => {
    const userId = c.get("userId");

    if(!userId)
    {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const latest_type = await prisma.typingTest.findFirst({
            where: {
                userId: Number(userId),
            },
            orderBy: {
                createdAt: 'desc', // Sort by createdAt in descending order to get the most recent entry
            },
        })

        return c.json({
            latest_type
        })
    } catch(error){
        c.status(500);
        return c.json({
          message: "Internal server error"
        });
    }
})

typeRouter.get("/user-typing-data", async (c) => {
    // Extract query parameter with proper TypeScript handling
    const userId = c.get("userId");

    if (!userId) {
        c.status(403);
        return c.json({ message: "You are not logged in" });
    }

    // Initialize Prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Fetch user typing data sorted by creation date
        const typingData = await prisma.typingTest.findMany({
            where: {
                userId: Number(userId),
            },
            orderBy: {
                createdAt: 'desc', // Change 'desc' to 'asc' for earliest first
            },
        });

        if (!typingData.length) {
            return c.json({
                message: "No typing data found for the user"
            });
        }

        // Send the typing data as the response
        return c.json({
            typingData
        });

    } catch (e) {
        console.error('Error fetching user typing data:', e);
        c.status(500);
        return c.json({ message: 'Internal server error' });
    }
});


typeRouter.get("/top-10-typing-rank/:timer", async (c) => {
    // Extract query parameter with proper TypeScript handling
    const timer = c.req.param('timer');
  
    // Initialize Prisma client
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
        // Fetch top 10 TypingTest entries with specific timer and highest WPM, including the username
        const topTypingTests = await prisma.typingTest.findMany({
            where: {
                timer: timer,
            },
            orderBy: [
                {
                    wpm: 'desc', // Sort by WPM in descending order
                },
                {
                    mistakes: 'asc', // Then sort by mistakes (least errors first)
                },
                {
                    createdAt: 'asc', // Finally, sort by created date (earliest first)
                }
            ],
            take: 10, // Limit the results to 10 records
            include: {
                user: {
                    select: {
                        username: true, // Include the username from the User model
                    }
                }
            }
        });
  
        if (!topTypingTests.length) {
            return c.json({
                error: true,
                message: "No typing tests found with the specified criteria"
            });
        }
  
        // Send the top typing test entries along with usernames as the response
        return c.json({
            topTypingTests: topTypingTests.map(test => ({
                ...test,
            }))
        });
  
    } catch(error){
        c.status(500);
        return c.json({
            message: "Internal server error"
        });
    }
});



// typeRouter.delete("/clear-typing-tests", async (c) => {
//     // Ensure the request is authorized
//     const authHeader = c.req.header('authorization') || "";
//     try {
//         const user = await verify(authHeader, c.env.JWT_SECRET);
//         if (!user) {
//             c.status(403);
//             return c.json({ message: "You are not logged in" });
//         }

//         // Initialize Prisma client
//         const prisma = new PrismaClient({
//             datasourceUrl: c.env.DATABASE_URL,
//         }).$extends(withAccelerate());

//         try {
//             // Perform the deletion of all records from TypingTest table
//             await prisma.typingTest.deleteMany({});

//             return c.json({ message: "All typing tests have been deleted successfully" });
//         } catch (e) {
//             console.error('Error clearing TypingTest table:', e);
//             c.status(500);
//             return c.json({ message: 'Failed to clear TypingTest table' });
//         }
//     } catch (error) {
//         c.status(500);
//         return c.json({ message: "Internal server error" });
//     }
// });
