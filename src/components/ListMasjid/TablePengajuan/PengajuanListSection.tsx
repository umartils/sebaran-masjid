import { getMasjid, getMasjidByRelawan } from "@/lib/masjid";
import { TablePengajuan } from "@/components/ListMasjid/TablePengajuan/TablePengajuan";
import { DashboardStats } from "@/components/ListMasjid/DashboardStats";

type Props = {
    role: string;
    userId: string;
};

export default async function PengajuanListSection({role, userId}: Props) {
    const masjid =
        role == "Admin"
          ? await getMasjid()
          : await getMasjidByRelawan(userId as string);
    return (
        <>
            <DashboardStats masjid={masjid} />
            <TablePengajuan masjid={masjid} />
        </>
    );
}