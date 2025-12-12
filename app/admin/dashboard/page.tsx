import { auth } from "@/app/lib/auth";
import { ReturnButton } from "@/components/return-button";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/app/lib/prisma";
import {
  DeleteUserButton,
  PlaceholderDeleteUserButton,
} from "@/components/delete-user-button";
import { UserRoleSelect } from "@/components/user-role-select";
import { UserRole } from "@prisma/client";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@heroui/button";
import Link from "next/link";
import TableListUsers from "@/components/table-list-users";
import MenuAdminDashBoard from "@/components/menu-admin-dashboard";

export default async function DashboardPage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) redirect("/auth/sign-in");

  if (session.user.role !== "admin") {
    return (
      <div className="px-8 py-16 container mx-auto max-w-[1536px] space-y-8 border">
        <div className="space-y-8">
          <ReturnButton href="/profile" label="Profile" />

          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

          <p className="p-2 rounded-md text-lg bg-red-600 text-white font-bold">
            FORBIDDEN
          </p>
        </div>
      </div>
    );
  }

  const { users } = await auth.api.listUsers({
    headers: headersList,
    query: {
      sortBy: "name",
    },
  });

  const sortedUsers = users.sort((a, b) => {
    if (a.role === "ADMIN" && b.role !== "ADMIN") return -1;
    if (a.role !== "ADMIN" && b.role === "ADMIN") return 1;

    return 0;
  });

  return (
    <div className="w-full space-y-8">

      <Breadcrumb steps={[{ label: "Tableau de bord administrateur" }]} />

      <h1 className="text-3xl font-bold">Liste des utilisateurs</h1>

      <div className="grid grid-flow-col grid-col-6 gap-4">
        <div className="col-span-2">
            <MenuAdminDashBoard keySelected="user" />
        </div>
        <div className="col-span-4">
            <TableListUsers sortedUsers={sortedUsers} />
        </div>
      </div>
    
    </div>

    // <div className="px-8 py-16 container mx-auto max-w-[1536px] space-y-8">
    //   <div className="space-y-8">
    //     <ReturnButton href="/profile" label="Profile" />

    //     <h1 className="text-3xl font-bold">Admin Dashboard</h1>

    //     <p className="p-2 rounded-md text-lg bg-green-600 text-white font-bold">
    //       ACCESS GRANTED
    //     </p>
    //   </div>

    //   <div className="w-full overflow-x-auto">
    //     <table className="table-auto min-w-full whitespace-nowrap">
    //       <thead>
    //         <tr className="border-b text-sm text-left">
    //           <th className="px-2 py-2">ID</th>
    //           <th className="px-2 py-2">Name</th>
    //           <th className="px-2 py-2">Email</th>
    //           <th className="px-2 py-2">Role</th>
    //           <th className="px-2 py-2">Actions</th>
    //         </tr>
    //       </thead>

    //       <tbody>
    //         {sortedUsers.map((user) => (
    //           <tr key={user.id} className="border-b text-sm text-left">
    //             <td className="px-2 py-2">{user.id.slice(0, 8)}</td>
    //             <td className="px-2 py-2">{user.name}</td>
    //             <td className="px-2 py-2">{user.email}</td>
    //             <td className="px-2 py-2">
    //               <UserRoleSelect
    //                 userId={user.id}
    //                 role={user.role as UserRole}
    //               />
    //             </td>
    //             <td className="px-2 py-2">
    //               {user.role === "USER" ? (
    //                 <DeleteUserButton userId={user.id} />
    //               ) : (
    //                 <PlaceholderDeleteUserButton />
    //               )}
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}
