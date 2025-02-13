// src/routes/api/_private/+server.ts

import type { User } from '$lib/types/user';
import { error, json } from '@sveltejs/kit';

export const GET = async (event) => {
    const session = await event.locals.auth();

    if (!session) {
        throw error(401, 'Unauthorized');
    }

    const user = session.user as User;

    if (user.role !== 'ADMIN') {
        throw error(403, 'Forbidden: You do not have access to this resource.');
    }

    return json({
        message: 'Bienvenue dans la route privée !',
        user: session.user,
    });
};
