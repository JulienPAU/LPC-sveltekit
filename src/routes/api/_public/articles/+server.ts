import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
    const articles = await prisma.articles.findMany({
        where: {
            status: 'PUBLISHED',
        },
        orderBy: {
            publish_date: 'desc',
        },
        select: {
            id: true,
            title: true,
            content: true,
            images: true,
            publish_date: true,
            article_type: true,

            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            user: {
                select: {
                    username: true,
                    // role: true, // Expose uniquement le rôle si nécessaire
                },
            },
        },
    });

    return json(articles);
}
