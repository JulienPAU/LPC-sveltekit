// src/ api/ lexical/ publish/ +server.ts


import prisma from '$lib/prisma';
import type { SessionUser } from '$lib/types/user';
import { error, json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {


    try {
        const session = await locals.auth?.();

        if (!session?.user) {
            throw error(401, 'Non autorisé');
        }

        const user = session.user as SessionUser;


        const isAdmin = Array.isArray(user.User_Role)
            ? user.User_Role.some(role => role.role === 'ADMIN')
            : user.User_Role === 'ADMIN';

        if (!isAdmin) {
            throw error(403, {
                message: 'Accès refusé - Permissions administrateur requises'
            });
        }

        const formData = await request.formData();

        const data = {
            title: formData.get('title-def')?.toString().trim() || '',
            content: formData.get('content-def')?.toString().trim() || '',
        }

        if (!data.title || !data.content) {
            throw error(400, 'Veuillez remplir tous les champs');
        }

        const definition = await prisma.lexical.create({
            data: {
                title: data.title,
                content: data.content,
            },

        });

        return json(definition);

    } catch (err) {
        console.error(err);
        return error(500, 'Erreur serveur');

    }

}