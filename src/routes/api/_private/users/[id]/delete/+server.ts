// src/ routes/ api/ _private/ users/ [id]/ delete/ +server.ts

import prisma from '$lib/prisma';
import { error } from 'console';
import type { User } from '$lib/types/user.js';

export const DELETE = async (event) => {
    const userId = event.params.id;

    try {
        const session = await event.locals.auth?.();
        const user = session?.user as User;
        const userRole = user?.User_Role;

        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const isAdmin = Array.isArray(userRole)
            ? userRole.some(role => role.role === 'ADMIN')  // Si c'est un tableau, chercher "ADMIN"
            : userRole === 'ADMIN';  // Sinon, comparer directement

        if (!isAdmin) {
            throw error(401, 'Non autorisé');
        }


        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw error(404, 'Utilisateur non trouvé');
        }

        await prisma.articles.updateMany({
            where: { user_id: userId },
            data: { user_id: undefined },
        });


        await prisma.user.delete({
            where: { id: userId }
        });



        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err) {
        if (err instanceof Error) {
            throw error(500, err.message);
        } else {
            throw error(500, 'Unknown error');
        }

    }


};