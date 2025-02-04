// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';



export const load: LayoutServerLoad = async ({ fetch, locals, depends }) => {

    depends("app:articles");

    const response = await fetch('/api/_public/articles');
    const articles = await response.json();


    const session = await locals.auth();



    return { articles, session };
};

