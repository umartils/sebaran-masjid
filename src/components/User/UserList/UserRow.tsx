"use client";
import type { DataUser } from "@/lib/types";

import UserActions from "./UserActions";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

interface UserRowProps {
  user: DataUser;
  no: number;

  // onAction: (user: DataUser, action: BuildingAction) => void;
}

export default function UserRow({
  user,
  no,
}: // onAction,
UserRowProps) {
  return (
    <tr>
      <td>
        <center>
          <strong>{no}</strong>
        </center>
      </td>
      <td>
        <strong>{user?.name}</strong>
      </td>

      <td>{user?.email}</td>

      <td>{user?.nomorTelepon}</td>

      <td>{user?.role}</td>

      <td>{user?.userInput}</td>

      <td>
        <UserActions user={user} />
      </td>
    </tr>
  );
}

// export default memo(UserRow);
