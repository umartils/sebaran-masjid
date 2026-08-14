import { DetailProgres } from "@/components/Tracking/ProgresDetail/DetailProgres";
import { getTrackingMasjidById } from "@/lib/tracking";

type Props = {
    from: string;
    id: string;
}

export default async function DetailListSection({ from, id }: Props) {
    const tracking = await getTrackingMasjidById(id);
    if (!tracking) return null;

    return (
        <DetailProgres tracking={tracking} from={from} />
    );
}