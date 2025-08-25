"use client";

import { updateCategoryTopic } from "@/app/actions/update-category-topic.action";
import { Form, Input, Button, Textarea, addToast } from "@heroui/react";
import { CategoryTopic } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

export default function CategoryTopicUpdateForm({
  categoryTopic,
}: {
  categoryTopic: CategoryTopic;
}) {
  const [formState, formAction] = useActionState(updateCategoryTopic, {
    errors: {},
  });

  const { id, name, description } = categoryTopic;

  const [currentName, setCurrentName] = useState(name);
  const [currentDescription, setCurrentDescription] = useState(description);

  return (
    <Form action={formAction} className="gap-4">
      <Input type="hidden" name="id" value={id} />

      <Input
        color={formState.errors.name !== undefined ? "danger" : "default"}
        label="Nom"
        labelPlacement="inside"
        name="name"
        placeholder="Saisissez un titre"
        type="text"
        value={currentName}
        onChange={(e) => {
          setCurrentName(e.currentTarget.value)
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
        labelPlacement="inside"
        name="description"
        placeholder="Saisissez une description"
        value={currentDescription}
        type="text"
        onChange={(e) => {
          setCurrentDescription(e.currentTarget.value)
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

      <Button type="submit" color="primary">
        Valider
      </Button>
    </Form>
  );
}
