// src/routes/dashboard/admin/manage/users/%5Bid%5D/edit/+page.server.ts


export async function load({ fetch, params, depends }) {

    try {

        depends("app:user");



        const response = await fetch(`/api/_private/users/${params.id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const userById = await response.json();


        return { userById };
    } catch (error) {
        console.error("Load error:", error);
        throw error;
    }
}