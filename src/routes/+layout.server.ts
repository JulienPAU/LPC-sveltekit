import type { LayoutServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: LayoutServerLoad = async () => {
    const articles = await prisma.articles.findMany({
        where: {
            status: 'PUBLISHED'
        },
        orderBy: {
            publish_date: 'desc'
        },
        include: {
            category: true,
            user: true
        }
    });

    return { articles };
};
