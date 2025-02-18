

export async function load({ fetch, locals }) {

    try {

        const session = await locals.auth();




        const user = session?.user;

        const response = await fetch(`/api/_public/articles/count/${user?.id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const articlesByUserId = await response.json();

        return { articlesByUserId };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}