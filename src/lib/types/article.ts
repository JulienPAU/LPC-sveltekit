import type { Article_Type, Category, WatchCaseMaterial } from '@prisma/client';
import type { User } from './user';
import type { ArticleWatches } from './watches';
import type { Categories } from './categories';

export interface ArticleFormData {
    'titre-article': string;
    'introduction': string;
    'corps-article': string;
    'end': string;
    'type': Article_Type;
    'category': Category;
    'files'?: File[];
    'brand': string;
    'model': string;
    'movement': string | null;
    'water_resistance': string | null;
    'case_material': WatchCaseMaterial;
    'straps': string[];
}

export interface ArticleUploadResponse {
    success: boolean;
    articleId?: number;
    imageUrls?: string[];
    error?: string;
    errors?: { [key: string]: { _errors: string[] } };
    message?: string;
}

export const DEFAULT_FILE_VALIDATION = {
    maxFileSize: 2 * 1024 * 1024,
    maxFileCount: 6,
    minFileCount: 1,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
};



// Enum pour les statuts d'article
export enum Status {
    PUBLISHED = "PUBLISHED",
    SUBMITTED = "SUBMITTED",
    DRAFT = "DRAFT",
}

// Enum pour les types d'article
export enum ArticleType {
    GUIDE = "GUIDE",
    ARTICLE = "ARTICLE",
    REVIEW = "REVIEW",
    TECHNICAL = "TECHNICAL",
    LEXIQUE = "LEXIQUE",
}

// Interface pour le modèle Articles
export type Articles = {
    id: number;
    user_id: string;
    category_id?: number;
    title: string;
    introduction?: string;
    body?: string;
    ending?: string;
    publish_date?: Date;
    submit_date?: Date;
    update_date?: Date;
    images: string[];
    status: Status;
    article_type: ArticleType;
    ArticleWatches: ArticleWatches[];
    category?: Categories;
    user: User;
}

