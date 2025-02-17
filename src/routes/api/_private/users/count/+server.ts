import prisma from "$lib/prisma";
import { json } from "@sveltejs/kit";

export async function GET() {
    const roleCounts = await prisma.user_Role.groupBy({
        by: ['role'],
        _count: {
            role: true
        }
    });

    const totalUsers = await prisma.user.count();

    const countByRole = roleCounts.reduce((acc: { [key: string]: number }, item) => {
        acc[item.role.toLowerCase()] = item._count.role;
        return acc;
    }, {});

    return json({
        total: totalUsers,
        roles: countByRole
    });
}