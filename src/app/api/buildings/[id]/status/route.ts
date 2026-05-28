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

    const updated = await prisma.masjid.update({
      where: {
        id,
      },
      data: {
        statusPengajuan: status,
        editedBy: body.approvedBy,
      },
    });

    revalidatePath("/admin/masjid");
    revalidatePath("/admin");
    return NextResponse.json(updated);
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