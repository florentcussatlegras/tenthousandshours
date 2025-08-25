"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";

export async function deleteTopic(
  formData: FormData
) {
    console.log(formData.get('id'));
  try {
    await prisma.topic.delete({
      where: {
        id: String(formData.get('id')),
      }
    });
  } catch (err: unknown) {
    console.log(err)
    if (err instanceof Error) {
        return {
          errors: {
            _form: [err.message],
          },
        };
    } else {
        return {
          errors: {
            _form: ['Une erreur est survenue lors de la suppression de la matière'],
          },
        };
    }
  }

  revalidateTag("topic");
  redirect("/topic/list");
}
