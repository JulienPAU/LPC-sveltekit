export async function load({ params, fetch }) {
    const { brand } = params;



    const response = await fetch(`/api/_public/articles/${brand}`);

    if (!response.ok) {
        console.error(`Erreur API: ${response.status}`);
        return { articles: [], brand };
    }

    try {
        const brandArticle = await response.json();

        if (brandArticle.length === 0) {
            console.warn(`Aucun article trouvé pour la marque: ${brand}`);
        }

        return { brandArticle, brand };
    } catch (error) {
        console.error('Erreur lors de l\'analyse du JSON:', error);
        return { brandArticle: [], brand };
    }
};
