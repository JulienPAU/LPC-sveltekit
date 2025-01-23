// src/lib/services/uploadService.ts
import { cloudinary } from '$lib/cloudinary';

export class UploadService {
    static async uploadImage(file: File, userId: string, articleId?: number) {
        // const customPublicId = `${userId}_${articleId}_${Date.now()}`;

        const folderPath = articleId
            ? `articles/${articleId}`
            : `articles/${userId}`; const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const customPublicId = `${userId}_${articleId ? articleId + '_' : ''}${formattedDate}_${Date.now()}`;
        try {
            // Convertir le File en Buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload vers Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: folderPath,
                        resource_type: 'auto',
                        format: 'webp', // Conversion automatique en WebP
                        quality: 'auto', // Optimisation automatique de la qualité,
                        // timeout: 60000, // 60 secondes
                        public_id: customPublicId, // Nom personnalisé ou généré automatiquement

                        transformation: [
                            { width: 1200, crop: 'limit' }, // Limite la taille max
                        ],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });



            // return image; // Retourner les données enregistrées
            return result as CloudinaryUploadResult;

        } catch (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
        }
    }

    static async deleteImage(publicId: string) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            console.error('Delete error:', error);
            throw new Error('Failed to delete image');
        }
    }
}

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    format: string;
    width: number;
    height: number;
}