import { z } from 'zod';


export const updateUserSchema = z.object({
    username: z.string().min(3).or(z.literal("")).optional(),
    first_name: z.string().min(2).or(z.literal("")).optional(),
    last_name: z.string().min(2).or(z.literal("")).optional(),
    current_password: z.string().optional(),
    new_password: z.string().min(8).optional(),
});
