import type { Article_Type, Category } from '@prisma/client';

export interface ArticleFormData {
    'titre-article': string;
    'introduction': string;
    'corps-article': string;
    'end': string;
    'type': Article_Type;
    'category': Category;
    'files'?: File[];
}

export interface ArticleUploadResponse {
    success: boolean;
    articleId?: number;
    imageUrls?: string[];
    error?: string;
}

export const DEFAULT_FILE_VALIDATION = {
    maxFileSize: 2 * 1024 * 1024,
    maxFileCount: 6,
    minFileCount: 1,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
};