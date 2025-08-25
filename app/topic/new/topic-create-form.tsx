"use client";

import { createTopic } from "@/app/actions/create-topic.action";
import {
  Form,
  Input,
  Button,
  Textarea,
  addToast,
  Select,
  SelectItem,
} from "@heroui/react";
import { CategoryTopic } from "@prisma/client";
import { useActionState, useState } from "react";

export default function TopicCreateForm({
  categoriesTopic,
}: {
  categoriesTopic: CategoryTopic[];
}) {
  const [formState, formAction] = useActionState(createTopic, {
    errors: {},
  });

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
        color={
          formState.errors.description !== undefined ? "danger" : "default"
        }
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

      <Select
        className="max-w-xs"
        items={categoriesTopic}
        label="Catégorie de la matière"
        placeholder="Selectionnez une catégorie"
        name="categoryTopicId"
      >
        {(categoryTopic) => <SelectItem>{categoryTopic.name}</SelectItem>}
      </Select>

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
