// src/ routes/ dashboard/ +layout.server.ts

import { error } from '@sveltejs/kit';

export async function load({ fetch, locals, depends }) {

    const session = await locals.auth();


    if (!session) {
        throw error(403, {
            message: 'Non autorisé'
        });
    }


    try {
        depends('app:user');

        const userId = await fetch(`/api/_public/dashboard/${session?.user?.id}`);

        if (!userId.ok) {
            throw new Error(`API error: ${userId.status}`);
        }


        const user = await userId.json();


        return { user };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}