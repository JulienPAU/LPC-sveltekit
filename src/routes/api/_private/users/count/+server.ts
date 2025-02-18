// import prisma from "$lib/prisma";
// import { json } from "@sveltejs/kit";

// export async function GET() {
//     const roleCounts = await prisma.user_Role.groupBy({
//         by: ['role'],
//         _count: {
//             role: true
//         }
//     });

//     const totalUsers = await prisma.user.count();

//     const countByRole = roleCounts.reduce((acc: { [key: string]: number }, item) => {
//         acc[item.role.toLowerCase()] = item._count.role;
//         return acc;
//     }, {});

//     return json({
//         total: totalUsers,
//         roles: countByRole
//     });
// }


import prisma from "$lib/prisma";
import { error, json } from "@sveltejs/kit";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    try {
        // Vérification de l'authentification si nécessaire
        const session = await event.locals.auth();
        if (!session) {
            throw error(401, {
                message: "Authentification requise"
            });
        }

        // Récupération des comptages par rôle
        try {
            const roleCounts = await prisma.user_Role.groupBy({
                by: ['role'],
                _count: {
                    role: true
                }
            });

            const totalUsers = await prisma.user.count();

            // Vérification des données
            if (!roleCounts || !Array.isArray(roleCounts)) {
                throw error(500, {
                    message: "Erreur lors de la récupération des rôles"
                });
            }

            // Transformation des données
            const countByRole = roleCounts.reduce((acc: { [key: string]: number }, item) => {
                if (item.role) {
                    acc[item.role.toLowerCase()] = item._count.role;
                }
                return acc;
            }, {});

            return json({
                success: true,
                total: totalUsers,
                roles: countByRole
            });

        } catch (dbError) {
            // Gestion des erreurs Prisma
            if (dbError instanceof PrismaClientKnownRequestError) {
                switch (dbError.code) {
                    case 'P2002':
                        throw error(409, {
                            message: "Conflit de données"
                        });
                    case 'P2025':
                        throw error(404, {
                            message: "Données non trouvées"
                        });
                    default:
                        throw error(500, {
                            message: "Erreur lors de l'accès à la base de données"
                        });
                }
            }
            throw error(500, {
                message: "Erreur lors de la récupération des statistiques"
            });
        }

    } catch (err) {
        // Log de l'erreur
        console.error('Erreur dans le comptage des rôles:', err);

        // Si c'est une erreur SvelteKit, la propager
        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        // Pour toute autre erreur inattendue
        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
}