// "use client";

// import { memo } from "react";

// import { progresStatusLabel } from "@/lib/format";
// import type { TrackingMasjidList } from "@/lib/types";

// import { MapPinned } from "lucide-react";

// import ProgresActions from "./ProgresActions";
// // import type { BuildingAction } from "./hooks/useApprovalPengajuan";

// import styles from "./ListProgres.module.scss";

// interface ProgresRowProps {
//   progres: TrackingMasjidList;

//   // onAction: (
//   //   progres: TrackingMasjidList,
//   //   // action: BuildingAction
//   // ) => void;
// }

// const getProgressColor = (
//   percentage: number
// ) => {
//   if (percentage < 25) return "#ef4444";
//   if (percentage < 50) return "#f59e0b";
//   if (percentage < 75) return "#3b82f6";

//   return "#22c55e";
// };

// function ProgresRow({
//   progres,
//   // onAction,
// }: ProgresRowProps) {
//   return (
//     <tr>
//       <td>
//         <strong>{progres.masjid.nama}</strong>

//         <br />

//         <span className={styles.tableAddress}>
//           <MapPinned size={13} /> {progres.masjid.alamat}
//         </span>
//       </td>

//       <td>
//         {progres.masjid.namaKota},

//         <br />

//         <span className={styles.tableProvince}>
//           {progres.masjid.namaProvinsi}
//         </span>
//       </td>

//       <td>
//         <span>
//           {progresStatusLabel(progres.status)}
//         </span>
//       </td>

//       <td>
//         <div className={styles.progressWrapper}>
//           <div className={styles.progressBar}>
//             <div
//               className={styles.progressFill}
//               style={{
//                 width: `${progres.persentase}%`,
//                 backgroundColor: getProgressColor(
//                   progres.persentase??0
//                 ),
//               }}
//             />
//           </div>

//           <span className={styles.progressText}>
//             {progres.persentase}%
//           </span>
//         </div>
//       </td>

//       <td>
//         <ProgresActions
//           progres={progres}
//           // onAction={onAction}
//         />
//       </td>
//     </tr>
//   );
// }

// export default memo(ProgresRow);