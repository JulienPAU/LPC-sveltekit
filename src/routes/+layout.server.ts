// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async ({ fetch, }) => {
    const response = await fetch('/api/_public/articles');
    const articles = await response.json();


    return { articles };
};

