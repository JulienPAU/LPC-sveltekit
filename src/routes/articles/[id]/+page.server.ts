import type { User } from '$lib/types/user';

export async function load({ params, fetch, locals, depends }) {
    const session = await locals.auth();
    const user = session?.user as User | undefined; // Sécurisation du typage
    const userRole = user?.User_Role?.[0]?.role ?? null; // Sécurisation + valeur par défaut

    depends("app:article");

    try {
        const response = await fetch(`/api/_public/article_id/${params.id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const article = await response.json();

        // Si l'utilisateur n'a pas de rôle (non connecté ou pas encore attribué), 
        // on considère qu'il est un simple visiteur
        const isModeratorOrAdmin = userRole === "MODERATOR" || userRole === "ADMIN";

        // Restreindre l'accès aux articles refusés ou en attente uniquement pour les modérateurs/admins
        if (isModeratorOrAdmin && (article.status === "REFUSED" || article.status === "SUBMITTED")) {
            throw new Error(`Article not found`);
        }

        return { article, id: params.id, user };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}
