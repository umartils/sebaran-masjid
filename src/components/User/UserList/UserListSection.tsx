// components/User/UserList/UserListSection.tsx
import { getAllUser } from "@/lib/user";
import { TableUser } from "@/components/User/UserList/TableUser";

export default async function UserListSection() {
  const user = await getAllUser();
  if (!user) {
    console.log("user not found");
  }
  return <TableUser user={user ?? []} />;
}