import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";

interface StatusCount {
    [key: string]: number;
}

export async function GET({ locals }) {

    const session = await locals.auth()
    const user = session?.user




    if (!user) {
        return json({ error: 'Forbidden' }, { status: 400 });
    }

    const counts = await prisma.articles.groupBy({
        by: ['status'],
        _count: {
            status: true,
        },
    });

    const countByStatus: StatusCount = counts.reduce((acc: StatusCount, item) => {
        acc[item.status] = item._count.status;
        return acc;
    }, {});

    const total = Object.values(countByStatus).reduce((sum, count) => sum + count, 0);

    return json({ countByStatus, total });
}