import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { 
  createProgressSchema,
  updateProgressSchema 
} from "@/lib/validation";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createProgressSchema.safeParse(body);

    if (!parsed.success) {
      console.error(parsed.error);
      return NextResponse.json(
        { message: "Data tidak valid", errors: parsed.error.flatten() },
        { status: 422 }
      );
    } 

    const { trackingId, persentase } = parsed.data;

    const tracking = await prisma.trackingMasjid.findUnique({
      where: {
        id: trackingId
      },
      select: {
        persentase: true
      },
    });

    if(persentase !== undefined && persentase > 100){
      return NextResponse.json(
        {
          message: "Nilai lebih dari 100",
        },
        {
          status: 400,
        }
      )
    }

    if(!tracking){  
      return NextResponse.json(
        {
          message: "Tracking tidak ditemukan"
        },
        {
          status: 404
        }
      );
    }


    const trackingPersentase = tracking.persentase ?? 0;

    if (persentase !== undefined && persentase == trackingPersentase ) {
      return NextResponse.json(
        {
          message: `Persentase tidak boleh sama dengan ${trackingPersentase}%`,
        },
        {
          status: 400,
        }
      )
    }

    if (persentase !== undefined && persentase < trackingPersentase ) {
      return NextResponse.json(
        {
          message: `Persentase tidak boleh sama atau kurang dari progres terbaru (${trackingPersentase}%)`,
        },
        {
          status: 400,
        }
      )
    }

    console.log(parsed.data);

    const result = await prisma.$transaction(async (tx) => {
      const createLog = await tx.trackingMasjidLog.create({
        data: {
          ...parsed.data
        },
      });

      if (persentase == 100) {
        await tx.trackingMasjid.update({
          where: { id: trackingId },
          data: {
            status: "SELESAI",
          },
        });
      }

      await tx.trackingMasjid.update({
        where: { id: trackingId },
        data: {
          persentase,
        },
      });

      await tx.trackingMasjid.updateMany({
        where: {
          id: trackingId,
          firstUpdate: null,
        },
        data: {
          firstUpdate: new Date(),
        },
      });

      return createLog;
    });

    // return NextResponse.json(log);
    return NextResponse.json(
      {
        message: "Proses berhasil dilakukan",
        data: result
      },
      {
        status: 201
      }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed" },
      { status: 500 }
    );
  }
} 

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
          {
              message: "Data tidak valid",
              errors: parsed.error.flatten(),
          },
          { status: 422 }
      );
    }

    const currentLog = await prisma.trackingMasjidLog.findUnique({
      where: {
        id: parsed.data?.id
      },
    });

    if (!currentLog) {
      return NextResponse.json(
        {
          message: "Log tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const tracking = await prisma.trackingMasjid.findUnique({
      where: {
        id: parsed.data?.trackingId
      },
      select: {
        persentase: true
      }
    });

    if (!tracking) {
      return NextResponse.json(
        {
          message: "Tracking tidak ditemukan",
        },
        {
          status: 404,
        }
      );
    }

    const previousLog = await prisma.trackingMasjidLog.findFirst({
      where: {
        trackingId: parsed.data?.trackingId,
        createdAt: {
          lt: currentLog.createdAt,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const nextLog = await prisma.trackingMasjidLog.findFirst({
      where: {
        trackingId: parsed.data.trackingId,
        createdAt: {
          gt: currentLog.createdAt,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const currPercent = parsed.data?.persentase ?? 0;
    const prevPercent = previousLog?.persentase ?? 0;
    const nextPercent = nextLog?.persentase ?? 100;
    const trackPercent = tracking.persentase ?? 0;

    if(currPercent !== undefined && currPercent > 100){
      return NextResponse.json(
        {
          message: "Nilai lebih dari 100",
        },
        {
          status: 400,
        }
      )
    }

    // if (currPercent != trackPercent){
    //   if (currPercent == trackPercent || currPercent > trackPercent) {
    //     return NextResponse.json(
    //       {
    //         message: `Persentase tidak boleh melebihi ${trackPercent}%`,
    //       },
    //       {
    //         status: 400,
    //       }
    //     );
    //   }
    // }

    if (currPercent == prevPercent || currPercent < prevPercent) {
      return NextResponse.json(
        {
          message: `Persentase tidak boleh kurang dari progres sebelumnya (${prevPercent}%)`,
        },
        {
          status: 400,
        }
      );
    }

    if (currPercent == nextPercent || currPercent > nextPercent) {
      return NextResponse.json(
        {
          message: `Persentase tidak boleh lebih dari progres selanjutnya (${nextPercent}%)`,
        },
        {
          status: 400,
        }
      );
    }

    
    const log = await prisma.trackingMasjidLog.update({
      where: { id: parsed.data?.id },
      data: {
        ...parsed.data
      },
    });

    await prisma.trackingMasjid.update({
      where: { id: parsed.data?.trackingId },
      data: {
        persentase: parsed.data?.persentase,
      },
    });
    return NextResponse.json(
      {
        message: "Berhasil memperbarui data",
        data: log
      },
      {
        status: 200
      }
    );
  } catch (err) {
    return NextResponse.json(
      { 
        message: "Failed" 
      }, { 
        status: 500 
      }
    );
  }
}