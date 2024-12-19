import { error } from '@sveltejs/kit';
import { verifyToken } from './index';

import type { RequestEvent } from '@sveltejs/kit';

export function requireAuth(event: RequestEvent) {
    const token = event.cookies.get('token');
    if (!token) {
        throw error(401, 'Non autorisé');
    }

    const user = verifyToken(token);
    if (!user) {
        throw error(401, 'Token invalide');
    }

    return user;
}
