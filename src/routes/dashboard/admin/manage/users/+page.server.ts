export async function load({ fetch }) {




    try {


        const response = await fetch(`/api/_private/users`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const allUsers = await response.json();


        return { allUsers };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}