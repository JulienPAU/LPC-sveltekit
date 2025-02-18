


import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET(event: RequestEvent) {
    const { brand } = event.params;

    if (!brand || brand.trim() === '') {
        throw error(400, {
            message: 'Marque requise'
        });
    }

    try {
        const articles = await prisma.articles.findMany({
            orderBy: {
                id: 'desc'
            },
            where: {
                ArticleWatches: {
                    some: {
                        watch: {
                            brand: {
                                equals: brand,
                                mode: 'insensitive'
                            }
                        }
                    }
                },
                status: 'PUBLISHED'
            },
            include: {
                ArticleWatches: {
                    include: {
                        watch: true
                    }
                },
                user: {
                    select: {
                        username: true,
                    }
                }
            }
        });

        if (articles.length === 0) {
            return json({
                message: 'Aucun article trouvé pour cette marque',
                articles: []
            });
        }

        return json(articles);

    } catch (err) {
        console.error('Erreur lors de la récupération des articles:', err);

        if (err instanceof PrismaClientKnownRequestError) {
            throw error(500, {
                message: "Erreur lors de l'accès à la base de données"
            });
        }

        throw error(500, {
            message: "Erreur lors de la récupération des articles"
        });
    }
}