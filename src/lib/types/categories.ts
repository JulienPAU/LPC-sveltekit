import type { Articles } from './article';
import type { Watches } from './watches';


// Enum pour les catégories
export enum Category {
    ANALOG = "ANALOG",
    DIGITAL = "DIGITAL",
    CHRONOGRAPH = "CHRONOGRAPH",
    SMARTWATCH = "SMARTWATCH",
    OTHER = "OTHER",
    HYBRID = "HYBRID",
    LUXURY = "LUXURY",
}

// Type pour le modèle Categories
export type Categories = {
    id: number;
    type: Category;
    name: string;
    Articles: Articles[];
    watches: Watches[];
};

// Types pour les autres modèles (à définir selon vos besoins)
