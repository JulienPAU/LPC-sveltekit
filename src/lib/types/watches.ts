import type { Articles } from './article';
import type { Categories } from './categories';

export type Watches = {
    id: number;
    brand: string;
    model: string;
    movement?: string;
    water_resistance?: string;
    case_size?: string;
    lug_width?: string;
    thickness?: string;
    lug_to_lug?: string;
    glass?: string;
    price?: string;
    case_material?: string;
    category_id?: number;
    straps: WatchStraps[];
    category?: Categories;
    articles: ArticleWatches[];
};

export type ArticleWatches = {
    article_id: number;
    watch_id: number;
    article: Articles;
    watch: Watches;
};

export type Straps = {
    id: number;
    material: string;
    watches: WatchStraps[];
};

export type WatchStraps = {
    watch_id: number;
    strap_id: number;
    watch: Watches;
    strap: Straps;
};

