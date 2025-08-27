"use server";

import { addToast } from "@heroui/react";
import { APIError, getSession } from "better-auth/api";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { CategoryTopic } from "@prisma/client";
import slugify from "slugify";
// import prisma from "@/app/lib/prisma";

const createCategoryTopicSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(5),
});

interface CreateCategoryTopicState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createCategoryTopic(
  formState: CreateCategoryTopicState,
  formData: FormData
): Promise<CreateCategoryTopicState> {

  const result = createCategoryTopicSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  let categoryTopic: CategoryTopic;

  try {
    var slugify = require('slugify');

    categoryTopic = await prisma.categoryTopic.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        slug: slugify(result.data.name),
        status: "active"
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
        return {
          errors: {
            _form: [err.message],
          },
        };
    } else {
        return {
          errors: {
            _form: ['Une erreur est survenue lors de la création de la catégorie'],
          },
        };
    }
  }

  revalidateTag("categoryTopic");
  redirect("/admin/dashboard/category-topic/list");
}
