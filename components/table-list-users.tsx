"use client";

import { DeleteUserButton, PlaceholderDeleteUserButton } from './delete-user-button'
import { UserRoleSelect } from './user-role-select'
import { User, UserRole } from '@prisma/client'
import { Card, CardBody } from '@heroui/react'
import { UserWithRole } from 'better-auth/plugins';

export default function TableListUsers({ sortedUsers }: {sortedUsers: UserWithRole[]}) {
  return (
    <Card className="rounded-none">
        <CardBody>
            <table className="table-auto min-w-full whitespace-nowrap">
                <thead>
                    <tr className="border-b text-sm text-left">
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2">Email</th>
                    <th className="px-2 py-2">Role</th>
                    <th className="px-2 py-2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedUsers.map((user) => (
                    <tr key={user.id} className="border-b text-sm text-left">
                        <td className="px-2 py-2">{user.id.slice(0, 8)}</td>
                        <td className="px-2 py-2">{user.name}</td>
                        <td className="px-2 py-2">{user.email}</td>
                        <td className="px-2 py-2">
                        <UserRoleSelect
                            userId={user.id}
                            role={user.role as UserRole}
                        />
                        </td>
                        <td className="px-2 py-2">
                        {user.role === "USER" ? (
                            <DeleteUserButton userId={user.id} />
                        ) : (
                            <PlaceholderDeleteUserButton />
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </CardBody>
    </Card>
  )
}
