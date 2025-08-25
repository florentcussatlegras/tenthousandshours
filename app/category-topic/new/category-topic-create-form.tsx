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
        labelPlacement="inside"
        name="name"
        placeholder="Saisissez un titre"
        type="text"
      />
      {formState.errors.name ? (
        <div className="text-danger text-sm">
          {formState.errors.name?.join(", ")}
        </div>
      ) : null}
      
      <Textarea
        color={formState.errors.description !== undefined ? "danger" : "default"}
        label="Description"
        labelPlacement="inside"
        name="description"
        placeholder="Saisissez une description"
        type="text"
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

      <Button type="submit" color="primary">
        Valider
      </Button>
    </Form>
  );
}
