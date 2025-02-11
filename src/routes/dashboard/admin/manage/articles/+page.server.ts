export async function load({ fetch }) {




    try {


        const response = await fetch(`/api/_private/articles`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const articles = await response.json();


        return { articles };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}