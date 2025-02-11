export async function load({ fetch }) {


    // ALLER RECUPERER LES USERS BY ID

    try {


        const response = await fetch(`/api/_private/users`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const users = await response.json();


        return { users };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}