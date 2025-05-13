// // src/ routes/ api/ _private/ users/ [id]/ +server.ts

// import { json } from '@sveltejs/kit';
// import prisma from '$lib/prisma';

// export const GET = async ({ params }: { params: { id: string }, request: Request }) => {

//     const id = params.id;

//     try {

//         const userById = await prisma.user.findUnique({
//             where: {
//                 id: id
//             },
//             select: {
//                 id: true,
//                 email: true,
//                 first_name: true,
//                 last_name: true,
//                 username: true,
//                 profile_picture: true,
//                 authProvider: true,
//                 verified: true,
//                 lastLogin: true,
//                 User_Role: {
//                     select: {
//                         role: true
//                     }
//                 }
//             }
//         });
//         return json(userById)

//     } catch (error) {
//         console.error("Load error:", error);
//         throw error;

//     }


// }


import { error, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import type { SessionUser } from '$lib/types/user';

export const GET = async (event: RequestEvent) => {
    const userId = event.params.id;

    try {
        if (!userId) {
            throw error(400, {
                message: "ID utilisateur requis"
            });
        }

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
                message: "Accès non autorisé"
            });
        }

        const userById = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                username: true,
                profile_picture: true,
                authProvider: true,
                verified: true,
                lastLogin: true,
                moderatorRequestAt: true,
                moderatorRequestStatus: true,
                User_Role: {
                    select: {
                        role: true
                    }
                }
            }
        });

        if (!userById) {
            throw error(404, {
                message: "Utilisateur non trouvé"
            });
        }

        return json(
            userById
        );

    } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur:", err);

        if (err instanceof Error && 'status' in err) {
            throw err;
        }

        throw error(500, {
            message: "Erreur lors de la récupération de l'utilisateur"
        });
    }
};