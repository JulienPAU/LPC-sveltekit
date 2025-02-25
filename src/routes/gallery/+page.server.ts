export async function load({ fetch }) {

    try {

        const response = await fetch(`/api/_public/articles/images`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const gallery = await response.json();


        return { gallery: gallery.images ?? [] };

    } catch (error) {
        console.error("Load error:", error);
        throw error;

    }
}