import { error, json } from '@sveltejs/kit';
import prisma from "$lib/prisma";

export async function GET() {
    try {
        const watches = await prisma.watches.findMany({
            select: {
                brand: true,
                model: true,
            },
            where: {
                articles: {
                    some: {
                        article: {
                            status: 'PUBLISHED',
                        }
                    }
                }
            },
            orderBy: {
                brand: 'asc'
            }
        });

        if (!watches || watches.length === 0) {
            return json({
                message: "Aucune montre trouvée",
                watches: []
            });
        }

        return json(watches);

    } catch (err) {
        console.error('Erreur lors de la récupération des montres:', err);

        throw error(500, {
            message: "Erreur lors de la récupération des montres"
        });
    }
}