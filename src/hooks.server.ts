import { redirect, type Handle } from '@sveltejs/kit';
import type { User } from './lib/types/user';

type MaybePromise<T> = T | Promise<T>;
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';

async function authorizationHandle({ event, resolve }: { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> }) {
    // Protect any routes under /authenticated
    if (event.url.pathname.startsWith('/dashboard')) {
        const session = await event.locals.auth();

        if (!session) {
            throw redirect(303, '/auth/login');
        }
        // console.log("Sessionnnnnn:", session);
        // console.log("User Role:", session?.user?.User_Role);
    }

    if (event.url.pathname.startsWith('/api/_private')) {
        const session = await event.locals.auth();

        if (session) {
            // Assurez-vous que session.user est de type User
            const user = session.user as User;

            // Vérifiez le rôle de l'utilisateur
            const userRole = user.User_Role?.find(role => role.role === 'ADMIN');

            if (!userRole) {
                throw redirect(303, '/auth/login');
            }
        }
    }


    return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authenticationHandle, authorizationHandle)