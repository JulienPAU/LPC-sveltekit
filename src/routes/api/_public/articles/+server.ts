


import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function GET() {
    try {
        const articles = await prisma.articles.findMany({
            where: {
                status: 'PUBLISHED',
            },
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
                title: true,
                introduction: true,
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
                    },
                },
                ArticleWatches: {
                    select: {
                        watch: {
                            select: {
                                brand: true,
                                model: true,
                            },
                        },
                    },
                },
            },
        });

        if (!articles || articles.length === 0) {
            return json({
                message: "Aucun article publié trouvé",
                articles: []
            });
        }

        return json(articles);

    } catch (err) {
        console.error('Erreur lors de la récupération des articles:', err);

        throw error(500, {
            message: "Erreur lors de la récupération des articles"
        });
    }
}