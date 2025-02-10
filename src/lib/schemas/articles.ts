import { z } from 'zod';
import { Article_Type, Category } from '@prisma/client';

export const articleUpdateSchema = z.object({
    'titre-article': z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    'introduction': z.string().min(10, "L'introduction est trop courte"),
    'corps-article': z.string().min(50, "Le corps de l'article est trop court"),
    'end': z.string().min(5, "La conclusion est trop courte"),
    'type': z.nativeEnum(Article_Type, { errorMap: () => ({ message: "Type d'article invalide" }) }),
    'category': z.nativeEnum(Category, { errorMap: () => ({ message: "Catégorie invalide" }) }),
    'brand': z.string().optional(),
    'model': z.string().optional(),
    'movement': z.string().nullable().optional(),
    'water_resistance': z.string().nullable().optional(),
    'straps': z.array(z.string()).optional()
});


export const articlePublishSchema = z.object({
    'titre-article': z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    'introduction': z.string().min(10, "L'introduction est trop courte"),
    'corps-article': z.string().min(50, "Le corps de l'article est trop court"),
    'end': z.string().min(5, "La conclusion est trop courte"),
    'type': z.nativeEnum(Article_Type, { errorMap: () => ({ message: "Type d'article invalide" }) }),
    'category': z.nativeEnum(Category, { errorMap: () => ({ message: "Catégorie invalide" }) }),
    'brand': z.string().optional(),
    'model': z.string().optional(),
    'movement': z.string().nullable().optional(),
    'water_resistance': z.string().nullable().optional(),
    'straps': z.array(z.string()).optional(),
    'files': z.array(z.instanceof(File))
        .min(1, "Au moins une image est requise")
        .max(5, "Maximum 5 fichiers sont autorisés")
        .optional(),
});