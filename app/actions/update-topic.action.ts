"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { CategoryTopic, Topic } from "@prisma/client";


const createCategoryTopicSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(5),
  categoryTopicId: z.string(),
});

interface UpdateTopicState {
  errors: {
    name?: string[];
    description?: string[];
    categoryTopicId?: string[];
    _form?: string[];
  };
}

export async function updateTopic(
  formState: UpdateTopicState,
  formData: FormData
): Promise<UpdateTopicState> {

  const result = createCategoryTopicSchema.safeParse(
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

    topic = await prisma.topic.update({
      where: {
        id: String(formData.get('id')),
      },
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
            _form: ['Une erreur est survenue lors de la création de la matière'],
          },
        };
    }
  }

  revalidateTag("topic");
  redirect("/topic/list");
}
