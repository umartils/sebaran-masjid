import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getMasjidMN } from "@/lib/masjid-mn";

const buildingSchema = z.object({
  name: z.string().min(3),
  address: z.string().min(5),
  provinceId: z.string().min(1),
  provinceName: z.string().min(1),
  regencyId: z.string().min(1),
  regencyName: z.string().min(1),
  districtId: z.string().optional(),
  districtName: z.string().optional(),
  villageId: z.string().optional(),
  villageName: z.string().optional(),
  latitude: z.coerce.number().min(-11).max(6),
  longitude: z.coerce.number().min(94).max(142),
  capacity: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  establishedYear: z.coerce.number().int().min(1500).max(new Date().getFullYear()).optional().or(z.literal("").transform(() => undefined)),
  landStatus: z.string().optional(),
  notes: z.string().optional()
});

export async function GET() {
  const buildings = await getMasjidMN();
  return NextResponse.json(buildings);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { message: "DATABASE_URL belum diatur. Data belum disimpan ke PostgreSQL." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = buildingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Data tidak valid", errors: parsed.error.flatten() }, { status: 422 });
  }

  try {
    const masjidMN = await prisma.masjidMN.create({
      data: parsed.data
    });

    return NextResponse.json({ masjidMN }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Gagal menyimpan data bangunan." }, { status: 500 });
  }
}

