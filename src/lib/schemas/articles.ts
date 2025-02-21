import { z } from 'zod';
import { Article_Type, Category } from '@prisma/client';

// export const articleUpdateSchema = z.object({
//     'titre-article': z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
//     'introduction': z.string().min(10, "L'introduction est trop courte"),
//     'corps-article': z.string().min(50, "Le corps de l'article est trop court"),
//     'end': z.string().min(5, "La conclusion est trop courte"),
//     'type': z.nativeEnum(Article_Type, { errorMap: () => ({ message: "Type d'article invalide" }) }),
//     'category': z.nativeEnum(Category, { errorMap: () => ({ message: "Catégorie invalide" }) }),
//     'brand': z.string().optional(),
//     'model': z.string().optional(),
//     'movement': z.string().nullable().optional(),
//     'water_resistance': z.string().nullable().optional(),
//     'straps': z.array(z.string()).optional()
// });

export const articleUpdateSchema = z.object({
    'titre-article': z
        .string()
        .min(3, "Le titre doit contenir au moins 3 caractères")
        .max(100, "Le titre ne peut pas dépasser 100 caractères"),
    'introduction': z
        .string()
        .min(10, "L'introduction est trop courte")
        .max(300, "L'introduction ne peut pas dépasser 300 caractères"),
    'corps-article': z
        .string()
        .min(50, "Le corps de l'article est trop court")
        .max(2500, "Le corps de l'article ne peut pas dépasser 2500 caractères"),
    'end': z
        .string()
        .min(5, "La conclusion est trop courte")
        .max(200, "La conclusion ne peut pas dépasser 200 caractères"),
    'type': z.nativeEnum(Article_Type, {
        errorMap: () => ({ message: "Type d'article invalide" })
    }),
    'category': z.nativeEnum(Category, {
        errorMap: () => ({ message: "Catégorie invalide" })
    }),
    'brand': z.string().optional(),
    'model': z.string().optional(),
    'movement': z.string().nullable().optional(),
    'water_resistance': z.string().nullable().optional(),
    'straps': z.array(z.string()).optional()
});




export const articlePublishSchema = z.object({
    'titre-article': z
        .string()
        .min(3, "Le titre doit contenir au moins 3 caractères")
        .max(100, "Le titre ne peut pas dépasser 100 caractères"),
    'introduction': z
        .string()
        .min(50, "L'introduction doit contenir au moins 50 caractères")
        .max(300, "L'introduction ne peut pas dépasser 300 caractères"),
    'corps-article': z
        .string()
        .min(50, "Le corps de l'article doit contenir au moins 50 caractères")
        .max(2500, "Le corps de l'article ne peut pas dépasser 2500 caractères"),
    'end': z
        .string()
        .min(5, "La conclusion doit contenir au moins 5 caractères")
        .max(200, "La conclusion ne peut pas dépasser 200 caractères"),
    'type': z.nativeEnum(Article_Type, { errorMap: () => ({ message: "Type d'article invalide" }) }),
    'category': z.nativeEnum(Category, { errorMap: () => ({ message: "Catégorie invalide" }) }),
    'brand': z.string().optional(),
    'model': z.string().optional(),
    'movement': z.string().nullable().optional(),
    'water_resistance': z.string().nullable().optional(),
    'straps': z.array(z.string()).optional(),
    'files': z.array(z.instanceof(File))
        .min(1, "Au moins une image est requise")
        .max(6, "Maximum 6 fichiers sont autorisés")
        .optional(),
});
