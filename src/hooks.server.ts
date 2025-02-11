import { redirect, type Handle } from '@sveltejs/kit';
import type { User } from './lib/types/user';

type MaybePromise<T> = T | Promise<T>;
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import { isValidResetToken } from '$lib/auth/isValidResetToken';

async function authorizationHandle({ event, resolve }: { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> }) {
    const session = await event.locals.auth();
    // Protect any routes under /authenticated
    if (event.url.pathname.startsWith('/dashboard')) {


        if (!session) {
            throw redirect(303, '/auth/login');
        }
        // console.log("Sessionnnnnn:", session);
        // console.log("User Role:", session?.user?.User_Role);
    }

    if (event.url.pathname.startsWith('/api/_private') || event.url.pathname.startsWith('/dashboard/admin')) {
        if (session) {
            const user = session.user as User;


            const isAdmin = Array.isArray(user.User_Role)
                ? user.User_Role.some(role => role.role === 'ADMIN')  // Si c'est un tableau, chercher "ADMIN"
                : user.User_Role === 'ADMIN';  // Sinon, comparer directement

            if (!isAdmin) {
                throw redirect(303, '/auth/login');
            }
        }
    }


    if (event.url.pathname.startsWith('/auth/reset-password')) {
        const urlParams = new URLSearchParams(event.url.search);
        const token = urlParams.get('token');

        if (!token || !isValidResetToken(token)) {
            // Si le token est invalide ou absent, on redirige
            throw redirect(303, '/auth/login');
        }
    }


    return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authenticationHandle, authorizationHandle)