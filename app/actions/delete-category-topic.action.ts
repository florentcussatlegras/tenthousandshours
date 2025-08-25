"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";


export async function deleteCategoryTopic(
  formData: FormData
) {
    console.log(formData.get('id'));
  try {
    await prisma.categoryTopic.delete({
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
            _form: ['Une erreur est survenue lors de la suppression de la catégorie'],
          },
        };
    }
  }

  revalidateTag("categoryTopic");
  redirect("/category-topic/list");
}
