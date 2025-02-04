interface Params {
    id: string;
}

export async function load({ params, fetch }: { params: Params, fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> }) {

    try {
        const response = await fetch(`/api/_public/article_id/${params.id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const article = await response.json();



        return { article, id: params.id };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}