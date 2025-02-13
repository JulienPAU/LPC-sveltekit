// src/routes/api/articles/+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
    const users = await prisma.user.findMany({
        orderBy: {
            id: 'desc'
        },
        select: {
            id: true,
            email: true,
            username: true,
            first_name: true,
            last_name: true,
            User_Role: true,
        }
    });

    return json(users);
}
