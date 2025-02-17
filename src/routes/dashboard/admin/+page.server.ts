import { json } from '@sveltejs/kit';


export async function load({ fetch, locals }) {

    try {

        const session = await locals.auth();
        const user = session?.user;

        if (!user) {
            return json({ error: 'Forbidden' }, { status: 400 });
        }

        const articlesCount = await fetch(`/api/_private/articles/count`);
        const usersCount = await fetch(`/api/_private/users/count`);

        if (!articlesCount.ok) {
            throw new Error(`API error: ${articlesCount.status}`);
        }
        if (!usersCount.ok) {
            throw new Error(`API error: ${usersCount.status}`);
        }


        const allArticlesCount = await articlesCount.json();
        const allUsersCount = await usersCount.json();

        return { allArticlesCount, allUsersCount };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}