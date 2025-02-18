

export async function load({ fetch }) {

    try {


        const response = await fetch(`/api/_public/lexical`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const definitions = await response.json();

        return { definitions };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}