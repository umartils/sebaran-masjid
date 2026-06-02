import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      trackingId,
      progres,
      nextProgres,
      persentase,
      imgUrls,
      waktuProgres,
    } = body;

    const log = await prisma.trackingMasjidLog.create({
      data: {
        trackingId,
        progres,
        nextProgres,
        persentase,
        imgUrls,
        waktuProgres,
      },
    });

    // OPTIONAL: update progress utama
    await prisma.trackingMasjid.update({
      where: { id: trackingId },
      data: {
        persentase,
      },
    });

    return NextResponse.json(log);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed" },
      { status: 500 }
    );
  }
}