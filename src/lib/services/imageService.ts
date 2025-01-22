import prisma from '$lib/prisma';

export class ImageService {
    /**
     * Enregistrer une image liée à un article dans la base de données.
     * @param articleId L'ID de l'article auquel l'image est liée.
     * @param publicId L'identifiant public généré par Cloudinary.
     * @param url L'URL sécurisée de l'image sur Cloudinary.
     * @returns L'image créée.
     */
    static async createImage(articleId: number, publicId: string, url: string) {
        return prisma.articleImage.create({
            data: {
                article_id: articleId,
                public_id: publicId,
                url: url,
            },
        });
    }
}
