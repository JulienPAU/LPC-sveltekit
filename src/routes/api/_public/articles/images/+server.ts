

import { error, json } from '@sveltejs/kit';
import prisma from "$lib/prisma";

export async function GET() {
    try {
        const articlesImages = await prisma.articles.findMany({
            orderBy: {
                id: 'desc'
            },
            where: {
                status: 'PUBLISHED',
                images: {
                    isEmpty: false
                }
            },
            select: {
                images: true
            }
        });

        if (!articlesImages || articlesImages.length === 0) {
            return json({
                message: "Aucune image trouvée",
                images: []
            });
        }

        return json(articlesImages);

    } catch (err) {
        console.error('Erreur lors de la récupération des images:', err);

        throw error(500, {
            message: "Erreur lors de la récupération des images"
        });
    }
}