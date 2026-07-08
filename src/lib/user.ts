import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type { DataUser } from "@/lib/types";

export async function getAllUser(): Promise<DataUser[]> {
  noStore();

  try {
    const user = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        role: true,
        nomorTelepon: true,
        userInput: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return user;
  } catch (error) {
    console.error("[getAllUser] Prisma error:", error);
    return [];
  }
}

export async function getUserById(id: string): Promise<DataUser | null> {
  noStore();

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}