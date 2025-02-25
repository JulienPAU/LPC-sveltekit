// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';  // Import de l'utilitaire error de SvelteKit

export const load: LayoutServerLoad = async ({ fetch, locals, depends }) => {
    depends("app:articles");

    try {
        const [articlesResponse, watchesResponse] = await Promise.all([
            fetch('/api/_public/articles'),
            fetch('/api/_public/watches')
        ]);

        // Gestion des erreurs pour articles
        if (!articlesResponse.ok) {
            throw error(articlesResponse.status, {
                message: `Erreur lors de la récupération des articles: ${articlesResponse.statusText}`
            });
        }

        // Gestion des erreurs pour watches
        if (!watchesResponse.ok) {
            throw error(watchesResponse.status, {
                message: `Erreur lors de la récupération des watches: ${watchesResponse.statusText}`
            });
        }

        const articles = await articlesResponse.json();
        const watches = await watchesResponse.json();
        const session = await locals.auth();

        return { articles: articles.articles ?? [], session, watches };
    } catch (e) {
        // Si l'erreur vient déjà de error(), la propager
        if (e instanceof Error && 'status' in e) throw e;

        // Sinon, créer une nouvelle erreur 500
        throw error(500, {
            message: "Erreur serveur lors de la récupération des données"
        });
    }
};