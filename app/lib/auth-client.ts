import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields, adminClient } from 'better-auth/client/plugins';
import type { auth } from "@/app/lib/auth";
import { ac, roles } from "@/app/lib/permissions";

export const { signIn, signUp, signOut, useSession, admin } = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [inferAdditionalFields<typeof auth>(), adminClient({ ac, roles })],
});