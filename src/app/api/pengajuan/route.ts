import { NextResponse } from "next/server";
import { masjidSchema } from "@/lib/validation"
import { prisma } from "@/lib/prisma";
import { getMasjid } from "@/lib/masjid";


export async function GET() {
  const masjid = await getMasjid();
  return NextResponse.json(masjid);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        message:
          "DATABASE_URL belum diatur. Data belum disimpan ke PostgreSQL.",
      },
      { 
        status: 503 
      }
    );
  }

  const body = await request.json();
  const parsed = masjidSchema.safeParse(body);

  if (
    parsed.data?.userId === null ||
    parsed.data?.userId === undefined ||
    parsed.data?.userId === ""
  ) {
    return NextResponse.json(
      { 
        message: "Session not detected" 
      },
      { 
        status: 422 
      }
    );
  }

  if (!parsed.success) {
    console.error(parsed.error);
    return NextResponse.json(
      { 
        message: "Data tidak valid", 
        errors: parsed.error.flatten() 
      },
      { 
        status: 422 
      }
    );
  }

  try {
    const masjid = await prisma.masjid.create({
      data: {
        ...parsed.data,
        id: parsed.data.id,
      },
    });
    return NextResponse.json({ masjid }, { status: 201 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { 
        message: "Gagal menyimpan data masjid." 
      },
      { 
        status: 500 
      }
    );
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = masjidSchema.safeParse(body);

  if (
    parsed.data?.userId === null ||
    parsed.data?.userId === undefined ||
    parsed.data?.userId === ""
  ) {
    return NextResponse.json(
      { 
        message: "Session not detected" 
      },
      { 
        status: 422 
      }
    );
  }

  if (!parsed.success) {
    console.error(parsed.error);
    return NextResponse.json(
      { 
        message: "Data tidak valid", 
        errors: parsed.error.flatten() 
      },
      { 
        status: 422 
      }
    );
  }

  try {
    const masjid = await prisma.masjid.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        ...parsed.data,
      },
    });
    return NextResponse.json({ masjid }, { status: 200 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { 
        message: "Gagal memperbarui data masjid." 
      },
      { 
        status: 500 
      }
    );
  }
}