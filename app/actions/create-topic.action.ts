"use server";

import { addToast } from "@heroui/react";
import { APIError, getSession } from "better-auth/api";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { Topic } from "@prisma/client";
import slugify from "slugify";
// import prisma from "@/app/lib/prisma";}}


const createTopicSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(5),
  categoryTopicId: z.string(),
});

interface CreateTopicState {
  errors: {
    name?: string[];
    description?: string[];
    categoryTopicId?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicState,
  formData: FormData
): Promise<CreateTopicState> {

  const result = createTopicSchema.safeParse(
    Object.fromEntries(formData)
  );

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  let topic: Topic;

  try {
    var slugify = require('slugify');

    topic = await prisma.topic.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        slug: slugify(result.data.name),
        status: "active",
        categoryTopicId: result.data.categoryTopicId,
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

  revalidateTag("topic", {});
  redirect("/admin/dashboard/topic/list");
}
