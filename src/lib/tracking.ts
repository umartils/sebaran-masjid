import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type { TrackingMasjidList, TrackingMasjidDetail } from "@/lib/types";

export async function getTrackingMasjidList(): Promise<TrackingMasjidList[]> {
  const records = await prisma.trackingMasjid.findMany({
    include: {
      masjid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records;
}

export async function getTrackingMasjidById(
  id: string
): Promise<TrackingMasjidDetail | null> {
  const record = await prisma.trackingMasjid.findUnique({
    where: {
      id,
    },
    include: {
      masjid: true,
      logs: true,
    },
  });

  return record;
}