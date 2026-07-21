import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { statusSchema } from "@/lib/validation/status.schema";

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
    const parsed = statusSchema.safeParse(body);

    const { status, idApproval } = body;
    // const status = parsed.data?.status ?? "";
    // const idApproved = parsed.data?.idApproval ?? "";

    if (!["APPROVED", "REJECTED", "DELETED", "ON_AIR"].includes(status)) {
      return NextResponse.json(
        {
          message: "Status tidak valid",
        },
        {
          status: 400,
        }
      );
    } 

    // if (idApproval !== undefined )
    const userExist = await prisma.user.findUnique({
      where: {
        id: parsed.data?.idApproval
      },
    })

    if (idApproval === undefined || !userExist || userExist.role !== "Admin" ) {
      return NextResponse.json(
        {
          message: "User tidak terdeteksi",
        },
        {
          status: 400,
        }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.masjid.update({
        where: { id },
        data: {
          statusPengajuan: status,
          editedBy: body.approvedBy,
        },
      }); 

      if (status === "ON_AIR") {
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
              userId: body.idApproval,
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
      message: `Status berhasil diperbarui menjadi (${status})`,
      data: {
        nama: result.nama,
        alamat: result.alamat
      },
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