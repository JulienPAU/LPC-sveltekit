import prisma from "$lib/prisma";
import { json } from '@sveltejs/kit';



export async function GET() {
    const articlesImages = await prisma.articles.findMany(
        {
            orderBy: { id: 'desc' },
            select:
            {

                images: true,
            }
        }
    )


    return json(articlesImages)
}