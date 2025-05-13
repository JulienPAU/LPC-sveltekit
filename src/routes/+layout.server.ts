// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';  // Import de l'utilitaire error de SvelteKit

export const load: LayoutServerLoad = async ({ fetch, locals, depends }) => {
    depends("app:articles");
    depends("app:ariclesSubmitted");

    try {
        const [articlesResponse, watchesResponse, countSubmitted] = await Promise.all([
            fetch('/api/_public/articles'),
            fetch('/api/_public/watches'),
            fetch(`/api/_public/articles/count`)
        ]);

        if (!countSubmitted.ok) {
            throw new Error(`API error: ${countSubmitted.status}`);
        }



        if (!articlesResponse.ok) {
            throw error(articlesResponse.status, {
                message: `Erreur lors de la récupération des articles: ${articlesResponse.statusText}`
            });
        }

        if (!watchesResponse.ok) {
            throw error(watchesResponse.status, {
                message: `Erreur lors de la récupération des watches: ${watchesResponse.statusText}`
            });
        }

        const ariclesSubmitted = await countSubmitted.json();
        const articles = await articlesResponse.json();
        const watches = await watchesResponse.json();
        const session = await locals.auth();

        return { articles, session, watches, ariclesSubmitted };
    } catch (e) {
        if (e instanceof Error && 'status' in e) throw e;

        throw error(500, {
            message: "Erreur serveur lors de la récupération des données"
        });
    }
};