"use server";

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";

interface ResumeCurrentStudySessionState {
  resumeCurrentStudySession: boolean;
}

export async function resumeCurrentStudySessionAction(
  formState: ResumeCurrentStudySessionState,
  formData: FormData
): Promise<ResumeCurrentStudySessionState> {
  const headerList = await headers();
  const cookieStore = await cookies();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  if (!session || !session.user) redirect("/auth/sign-in");

  revalidateTag('CurrentStudySession', {});

  return {
    resumeCurrentStudySession: true,
  };
}
