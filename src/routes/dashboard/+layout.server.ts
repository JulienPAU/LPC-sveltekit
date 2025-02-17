// src/ routes/ dashboard/ +layout.server.ts

export async function load({ fetch, locals, depends }) {

    const session = await locals.auth();



    try {
        depends('app:user');

        const response = await fetch(`/api/_public/dashboard/${session?.user?.id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const user = await response.json();


        return { user };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}