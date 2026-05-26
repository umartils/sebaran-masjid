import { NextRequest, NextResponse } from 'next/server';
import { getMasjidById } from '@/lib/masjid';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const masjid = await getMasjidById(params.id);

  if (!masjid) {
    return NextResponse.json({ message: 'Data tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json(masjid);
}