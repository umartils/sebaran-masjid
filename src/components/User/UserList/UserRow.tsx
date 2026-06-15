"use client";

import { memo } from "react";

import { kategoriLabel, statusTone } from "@/lib/format";
import type { User } from "@/lib/types";

import { MapPinned } from "lucide-react";

import UserActions from "./UserActions";
import type { BuildingAction } from "./hooks/useApprovalPengajuan";

interface UserRowProps {
  user: User;

  // onAction: (
  //   user: User,
  //   action: BuildingAction
  // ) => void;
}
 
export default function UserRow({
  user,
  // onAction,
}: UserRowProps) {
  return (
    <tr>
      <td>
        <strong>{user?.name}</strong>
      </td>

      <td>
        {user?.email}
      </td>

      <td>{user?.nomorTelepon}</td>

      <td>{user?.role}</td>

      <td>
        {user?.userInput}
      </td>

      {/* <td>
        <UserActions user={user} onAction={onAction} />
      </td> */}
    </tr>
  );
}

// export default memo(UserRow);