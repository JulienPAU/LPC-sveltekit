import { redirect, type Handle } from '@sveltejs/kit';

type MaybePromise<T> = T | Promise<T>;
import { handle as authenticationHandle } from './auth';
import { sequence } from '@sveltejs/kit/hooks';

import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';

async function authorizationHandle({ event, resolve }: { event: RequestEvent, resolve: (event: RequestEvent, opts?: ResolveOptions) => MaybePromise<Response> }) {
    // Protect any routes under /authenticated
    if (event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/articles/publish')) {
        const session = await event.locals.auth();

        if (!session) {
            throw redirect(303, '/auth/login');
        }
        // console.log("Sessionnnnnn:", session);
        // console.log("User Role:", session?.user?.User_Role);
    }

    if (event.url.pathname.startsWith('/api/_private')) {
        const session = await event.locals.auth();

        // console.log("Session:", session?.user?.User_Role);

        if (session?.user?.User_Role !== 'ADMIN') {
            throw redirect(303, '/auth/login');
        }
        // console.log("Session:", session);
    }


    return resolve(event);
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(authenticationHandle, authorizationHandle)