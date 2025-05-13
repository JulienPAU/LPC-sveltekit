// src/routes/api/articles/+server.ts
import { json, error } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET() {
    try {
        const articles = await prisma.articles.findMany({
            orderBy: {
                id: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                    }
                }
            }
        });

        if (!articles) {
            throw error(404, {
                message: "Aucun article trouvé"
            });
        }

        return json(articles);

    } catch (e: unknown) {
        if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case 'P2002':
                    throw error(400, { message: "Conflit de données" });
                case 'P2025':
                    throw error(404, { message: "Ressource non trouvée" });
                default:
                    throw error(500, { message: "Erreur lors de l'accès à la base de données" });
            }
        }

        if (e instanceof Error && 'status' in e) throw e;

        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
}