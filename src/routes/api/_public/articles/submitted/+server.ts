import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
    const articles = await prisma.articles.findMany({
        where: {
            status: 'SUBMITTED',
        },
        orderBy: {
            id: 'desc',
        },

    });

    return json(articles);
}
