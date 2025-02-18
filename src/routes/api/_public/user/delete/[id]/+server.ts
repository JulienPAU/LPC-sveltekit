import prisma from '$lib/prisma';
import { error } from 'console';

export const DELETE = async (event) => {
    const userId = event.params.id;

    try {
        const session = await event.locals.auth?.();
        if (!session?.user) {
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

        event.cookies.delete('authjs.session-token', { path: '/' });

        event.setHeaders({
            'Cache-Control': 'no-store'
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