import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type { User } from "@/lib/types";

export async function getAllUser(): Promise<User[]> {
    noStore();
 
    try {
        const user = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return user;
    } catch(error) {
        console.error("[getMasjid] Prisma error:", error);
        return [];
    }
}