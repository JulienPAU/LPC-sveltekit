

export async function load({ fetch }: { fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> }) {

    try {



        const response = await fetch(`/api/_public/articles/submitted`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const submittedArticles = await response.json();


        return { submittedArticles };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}