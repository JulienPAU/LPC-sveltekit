

import { error, json } from '@sveltejs/kit';
import prisma from "$lib/prisma";

export async function GET() {
    try {
        const lexical = await prisma.lexical.findMany({
            orderBy: {
                title: 'asc'
            },

        });

        if (!lexical) {
            return json({
                message: "Aucune définition trouvée",
                lexical: []
            });
        }

        return json(lexical);

    } catch (err) {
        console.error('Erreur lors de la récupération du lexique:', err);

        throw error(500, {
            message: "Erreur lors de la récupération du lexique"
        });
    }
}