import type { User } from '$lib/types/user';

export async function load({ params, fetch, locals, depends }) {
    const session = await locals.auth();
    const user = session?.user as User | undefined;
    const userRole = user?.User_Role?.[0]?.role ?? null;

    depends("app:article");

    try {
        const response = await fetch(`/api/_public/article_slug/${params.slug}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const article = await response.json();

        const isModeratorOrAdmin = userRole === "MODERATOR" || userRole === "ADMIN";

        if (isModeratorOrAdmin && (article.status === "REFUSED" || article.status === "SUBMITTED")) {
            throw new Error(`Article not found`);
        }

        return { article, slug: params.slug, user };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}
