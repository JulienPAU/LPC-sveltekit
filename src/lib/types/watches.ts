import type { Articles } from './article';
import type { Categories } from './categories';

// Type pour le modèle Watches
export type Watches = {
    id: number;
    brand: string;
    model: string;
    movement?: string;
    water_resistance?: string;
    case_material?: string;
    category_id?: number;
    straps: WatchStraps[];
    category?: Categories;
    articles: ArticleWatches[];
};

// Type pour le modèle ArticleWatches
export type ArticleWatches = {
    article_id: number;
    watch_id: number;
    article: Articles;
    watch: Watches;
};

// Type pour le modèle Straps
export type Straps = {
    id: number;
    material: string;
    watches: WatchStraps[];
};

// Type pour le modèle WatchStraps
export type WatchStraps = {
    watch_id: number;
    strap_id: number;
    watch: Watches;
    strap: Straps;
};

