import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";

export async function GET() {
    const watches = await prisma.watches.findMany({

        select: {

            brand: true,
            model: true,

        },
    });

    return json(watches);
}