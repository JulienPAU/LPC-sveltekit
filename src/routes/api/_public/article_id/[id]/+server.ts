

import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET({ params }: { params: { id: string } }) {
    try {

        const idPart = params.id.split('-')[0];

        const id = parseInt(idPart);

        // Validation de l'ID
        if (isNaN(id) || id <= 0) {
            throw error(400, {
                message: "Format d'ID invalide"
            });
        }

        try {
            const article = await prisma.articles.findUnique({
                where: { id },
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
                        'Cache-Control': 'public, max-age=300' // Cache 5 minutes
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