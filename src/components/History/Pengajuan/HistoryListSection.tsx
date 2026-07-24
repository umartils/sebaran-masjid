import { getMasjidByRelawan } from "@/lib/masjid";
import { HistoryPengajuan } from "./HistoryPengajuan";

type Props = {
    userId: string
}

export default async function PengajuanListSection({userId}: Props) {
    const masjid = await getMasjidByRelawan(userId as string);
    return (
        <>
            <HistoryPengajuan masjid={masjid} />
        </>
    );
} 