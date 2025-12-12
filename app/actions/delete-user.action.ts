"use server";

import { headers } from "next/headers";
import { auth } from "../lib/auth";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";

export async function deleteUserAction({ userId }: { userId: string }) {

  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session) throw new Error("Unautorized");

  if (session.user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
        role: "user",
      },
    });

    if (session.user.id === userId) {
        await auth.api.signOut({
            headers: headerList,
        });
        redirect("/auth/sign-in");
    }
    
    revalidatePath("/admin/dashboard");
    return { error: null };

  } catch (err) {
    if (isRedirectError(err)) {
        throw err;
    }

    if (err instanceof Error) {
      return { error: err.message };
    }

    return { error: "Internal Server Error" };
  }
}
