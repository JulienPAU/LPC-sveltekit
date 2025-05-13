// // // src/routes/api/articles/+server.ts
// import { json } from '@sveltejs/kit';
// import prisma from '$lib/prisma';

// export async function GET() {
//     const users = await prisma.user.findMany({
//         orderBy: {
//             id: 'desc'
//         },
//         select: {
//             id: true,
//             email: true,
//             username: true,
//             first_name: true,
//             last_name: true,
//             User_Role: true,
//         }
//     });

//     return json(users);
// }



import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { RequestEvent } from '@sveltejs/kit';
import type { SessionUser } from '$lib/types/user';

export async function GET(event: RequestEvent) {
    try {
        const session = await event.locals.auth();
        if (!session) {
            throw error(401, {
                message: "Authentification requise"
            });
        }

        const user = session.user as SessionUser;

        const userRole = user.User_Role;
        const isAdmin = Array.isArray(userRole)
            ? userRole.some(role => role.role === 'ADMIN')
            : userRole === 'ADMIN';

        if (!isAdmin) {
            throw error(403, {
                message: "Accès non autorisé - Permissions administrateur requises"
            });
        }

        try {
            const users = await prisma.user.findMany({
                orderBy: {
                    id: 'desc'
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    first_name: true,
                    last_name: true,
                    User_Role: true,
                    lastLogin: true,
                    createdAt: true
                }
            });

            if (!users || !Array.isArray(users)) {
                throw error(500, {
                    message: "Erreur lors de la récupération des utilisateurs"
                });
            }

            if (users.length === 0) {
                return json({
                    success: true,
                    message: "Aucun utilisateur trouvé",
                    users: []
                });
            }

            return json({
                success: true,
                users: users
            }, {
                headers: {
                    'Cache-Control': 'no-store'
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
                            message: "Données non trouvées"
                        });
                    default:
                        throw error(500, {
                            message: "Erreur lors de l'accès à la base de données"
                        });
                }
            }
            throw error(500, {
                message: "Erreur lors de la récupération des utilisateurs"
            });
        }

    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Une erreur inattendue s'est produite"
        });
    }
}
