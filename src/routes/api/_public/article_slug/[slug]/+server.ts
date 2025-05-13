// src/routes/api/_public/article_slug/[slug]/+server.ts

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET({ params }: { params: { slug: string } }) {
    try {
        const { slug } = params;

        if (!slug || slug.trim() === '') {
            throw error(400, {
                message: "Slug invalide"
            });
        }

        try {
            const article = await prisma.articles.findFirst({
                where: { slug },
                include: {
                    user: {
                        select: {
                            username: true,
                            User_Role: {
                                select: {
                                    role: true
                                }
                            },
                        },
                    },
                    category: true,
                    ArticleWatches: {
                        include: {
                            watch: {
                                include: {
                                    straps: {
                                        include: {
                                            strap: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
            });

            if (!article) {
                throw error(404, {
                    message: "Article non trouvé"
                });
            }

            return json(
                article
                , {
                    headers: {
                        'Cache-Control': 'public, max-age=300' 
                    }
                });

        } catch (dbError) {
            if (dbError instanceof PrismaClientKnownRequestError) {
                switch (dbError.code) {
                    case 'P2002':
                        throw error(409, {
                            message: "Conflit de données"
                        });
                    case 'P2025':
                        throw error(404, {
                            message: "Article non trouvé"
                        });
                    default:
                        throw error(500, {
                            message: "Erreur lors de l'accès à la base de données"
                        });
                }
            }
            throw error(500, {
                message: "Erreur lors de la récupération de l'article"
            });
        }

    } catch (err) {
        console.error('Erreur lors de la récupération de l\'article:', err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
}
