"use client";

import { createCategoryTopic } from "@/app/actions/create-category-topic.action";
import { Form, Input, Button, Textarea, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function CategoryTopicCreateForm() {
  const [formState, formAction] = useActionState(
    createCategoryTopic,
    {
      errors: {},
    }
  );
  
  return (
    <Form action={formAction} className="gap-4">

      <Input
        color={formState.errors.name !== undefined ? "danger" : "default"}
        label="Nom"
        labelPlacement="outside-top"
        name="name"
        placeholder="Saisissez un titre"
        type="text"
        classNames={{
          base: "items-start"
        }}
        size="lg"
      />
      {formState.errors.name ? (
        <div className="text-danger text-sm">
          {formState.errors.name?.join(", ")}
        </div>
      ) : null}
      
      <Textarea
        color={formState.errors.description !== undefined ? "danger" : "default"}
        label="Description"
        labelPlacement="outside-top"
        name="description"
        placeholder="Saisissez une description"
        type="text"
        size="lg"
        classNames={{
          base: "items-start",
          input: "py-4"
        }}
      />
      {formState.errors.description ? (
        <div className="text-danger text-sm">
          {formState.errors.description?.join(", ")}
        </div>
      ) : null}

      {formState.errors?._form ? (
        <div className="text-danger text-sm">
          {formState.errors?._form.join(", ")}
        </div>
      ) : null}

      <Button type="submit" className="uppercase text-white bg-sky-500 font-bold dark:text-black dark:bg-default-600">
        Valider
      </Button>
      
    </Form>
  );
}
