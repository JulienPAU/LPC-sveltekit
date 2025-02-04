// src\routes\api\_public\article_id\+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);

    if (isNaN(id)) {
        return json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const article = await prisma.articles.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    username: true,
                    // role: true, // Expose uniquement le rôle si nécessaire
                },
            },
            category: true,
        },
    });

    if (!article) {
        return json({ error: 'Article not found' }, { status: 404 });
    }

    return json(article);
}