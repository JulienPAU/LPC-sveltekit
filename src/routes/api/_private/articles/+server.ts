// src/routes/api/articles/+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
    const articles = await prisma.articles.findMany({
        orderBy: {
            id: 'desc'
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    // email: true,
                    // first_name: true,
                    // last_name: true,
                    // User_Role: true,
                }
            }
        }
    }
    );

    return json(articles);
}
