import { UserRole } from "@prisma/client";
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
    ...defaultStatements,
    studyProcesses: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
    [UserRole.USER]: ac.newRole({
        studyProcesses: ["create", "read", "update:own", "delete:own"]
    }),
    [UserRole.ADMIN]: ac.newRole({
        ...adminAc.statements,
        studyProcesses: ["create", "read", "update", "delete", "update:own", "delete:own"]
    }),
};