import { json, error } from "@sveltejs/kit";
import prisma from "$lib/prisma";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function GET() {
    try {



        try {
            const submittedCount = await prisma.articles.count({
                where: {
                    status: 'SUBMITTED'
                }
            });

            return json({
                countByStatus: { SUBMITTED: submittedCount },
                total: submittedCount,
                success: true,
                message: submittedCount === 0 ? "Aucun article SUBMITTED trouvé" : undefined
            });

        } catch (dbError) {
            if (dbError instanceof PrismaClientKnownRequestError) {
                switch (dbError.code) {
                    case 'P2002':
                        throw error(409, { message: "Conflit de données" });
                    case 'P2025':
                        throw error(404, { message: "Ressource non trouvée" });
                    default:
                        throw error(500, { message: "Erreur lors de l'accès à la base de données" });
                }
            }
            throw error(500, { message: "Erreur lors de la récupération des statistiques" });
        }

    } catch (e: unknown) {
        console.error('Erreur lors du comptage des articles:', e);
        if (e instanceof Error && 'status' in e) throw e;
        throw error(500, { message: "Une erreur inattendue s'est produite" });
    }
}