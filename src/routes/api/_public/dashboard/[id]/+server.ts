// src\routes\api\_public\article_id\+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET({ params }: { params: { id: string } }) {
    const id = params.id;

    if (!id) {
        return json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const userArticle = await prisma.user.findUnique({
        where: { id },
        include: {
            articles: {
                orderBy: {
                    id: 'desc',
                },
            },
            User_Role: true,

        },
    });

    if (!userArticle) {
        return json({ error: 'User not found' }, { status: 404 });
    }

    return json(userArticle);
}