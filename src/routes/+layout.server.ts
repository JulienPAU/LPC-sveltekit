// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';



export const load: LayoutServerLoad = async ({ fetch, locals, depends }) => {

    depends("app:articles");

    const response = await fetch('/api/_public/articles');
    const fetchWatches = await fetch('/api/_public/watches');

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    if (!fetchWatches.ok) {
        throw new Error(fetchWatches.statusText);
    }


    const articles = await response.json();
    const watches = await fetchWatches.json();
    const session = await locals.auth();



    return { articles, session, watches };
};

