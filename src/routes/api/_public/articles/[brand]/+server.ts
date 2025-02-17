import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET({ params }) {
    const { brand } = params;




    if (!brand) {
        return json({ error: 'Brand is required' }, { status: 400 });
    }

    try {
        const articles = await prisma.articles.findMany({
            where: {
                ArticleWatches: {
                    some: {
                        watch: {
                            brand: { equals: brand, mode: 'insensitive' }
                        }
                    }
                },
                status: 'PUBLISHED'
            },
            include: {
                ArticleWatches: {
                    include: { watch: true }
                },
                user: {
                    select: {
                        username: true,
                    }
                }
            }
        });




        return json(articles);
    } catch (error) {
        console.error('Erreur Prisma:', error);
        return json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
