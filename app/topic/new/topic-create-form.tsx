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
        labelPlacement="outside-top"
        name="name"
        placeholder="Saisissez un titre"
        type="text"
        size="lg"
        classNames={{
          base: "items-start",
          input: "w-full"
        }}
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
        labelPlacement="outside-top"
        name="description"
        placeholder="Saisissez une description"
        type="text"
        size="lg"
        classNames={{
          base: "items-start",
          input: "py-6"
        }}
      />
      {formState.errors.description ? (
        <div className="text-danger text-sm">
          {formState.errors.description?.join(", ")}
        </div>
      ) : null}

      <Select
        items={categoriesTopic}
        label="Catégorie de la matière"
        labelPlacement="outside"
        placeholder="Selectionnez une catégorie"
        name="categoryTopicId"
        size="lg"
      >
        {(categoryTopic) => <SelectItem>{categoryTopic.name}</SelectItem>}
      </Select>

      {formState.errors?._form ? (
        <div className="text-danger text-sm">
          {formState.errors?._form.join(", ")}
        </div>
      ) : null}

      <Button type="submit" className="font-bold uppercase bg-sky-500 text-white dark:text-black dark:bg-default-600">
        Valider
      </Button>
    </Form>
  );
}
