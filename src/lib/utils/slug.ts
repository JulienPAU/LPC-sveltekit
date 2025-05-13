/**
 * Génère un slug à partir d'un texte
 * - Convertit en minuscules
 * - Remplace les caractères accentués par leur version non accentuée
 * - Supprime les caractères spéciaux
 * - Remplace les espaces par des tirets
 */
export function generateSlug(text: string): string {
    if (!text) return '';

    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
}

/**
 * Vérifie si un slug existe déjà et génère un slug unique si nécessaire
 * @param baseSlug 
 * @param existingSlugs 
 * @returns 
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
    let slug = baseSlug;
    let counter = 1;

    while (existingSlugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}
