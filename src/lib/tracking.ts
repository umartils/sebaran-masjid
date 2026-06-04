import { prisma } from "@/lib/prisma";
import { unstable_noStore as noStore } from "next/cache";
import type {
  TrackingMasjidList,
  TrackingMasjidDetail,
  TrackingMasjidLog,
} from "@/lib/types";

export async function getTrackingMasjidList(): Promise<TrackingMasjidList[]> {
  noStore();
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
  noStore();
  const record = await prisma.trackingMasjid.findUnique({
    where: {
      id,
    },
    include: {
      masjid: true,
      logs: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return record;
}

export async function getTrackingMasjidLogById(
  id: string
): Promise<TrackingMasjidLog | null> {
  noStore();
  const log = await prisma.trackingMasjidLog.findUnique({
    where: {
      id,
    },
    include: {
      tracking: true,
    },
  });
  return log;
}

export async function getMasjidIdByTrackingId(id: string) {
  noStore();
  const log = await prisma.trackingMasjid.findUnique({
    where: {
      id,
    },
    select: {
      masjid: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });

  return log?.masjid;
}