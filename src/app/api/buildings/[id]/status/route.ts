import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const updated = await prisma.building.update({
      where: {
        id,
      },
      data: {
        buildingStatus: status,
      },
    });

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