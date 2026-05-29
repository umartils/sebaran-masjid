import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const { status } = body;

    if (!["APPROVED", "REJECTED", "DELETED"].includes(status)) {
      return NextResponse.json(
        {
          message: "Status tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.masjid.update({
        where: { id },
        data: {
          statusPengajuan: status,
          editedBy: body.approvedBy,
        },
      });

      if (status === "APPROVED") {
        const existingTracking = await tx.trackingMasjid.findUnique({
          where: {
            masjidId: id,
          },
        });

        if (!existingTracking) {
          await tx.trackingMasjid.create({
            data: {
              masjidId: id,
              status: "ON_PROGRESS",
              persentase: 0,
            },
          });
        }
      }

      return updated;
    });

    revalidatePath("/admin/masjid");
    revalidatePath("/admin");
    return NextResponse.json({
      success: true,
      message: "Status berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}