"use client";

import { updateTopic } from "@/app/actions/update-topic.action";
import {
  Form,
  Input,
  Button,
  Textarea,
  addToast,
  Select,
  SelectItem,
} from "@heroui/react";
import { CategoryTopic, Topic } from "@prisma/client";
import { useActionState, useState } from "react";

export default function TopicUpdateForm({
  topic,
  categoriesTopic,
}: {
  topic: Topic;
  categoriesTopic: CategoryTopic[];
}) {
  const [formState, formAction] = useActionState(updateTopic, {
    errors: {},
  });

  const { id, name, description } = topic;

  const [currentName, setCurrentName] = useState(name);
  const [currentDescription, setCurrentDescription] = useState(description);
  const [currentCategoryTopicId, setCurrentCategoryTopicId] = useState(
    categoriesTopic.filter(
      (category) => category.id === topic.categoryTopicId
    )[0].id
  );

  return (
    <Form action={formAction} className="gap-4">
      <Input type="hidden" name="id" value={id} />

      <Input
        color={formState.errors.name !== undefined ? "danger" : "default"}
        label="Nom"
        labelPlacement="outside-top"
        name="name"
        placeholder="Saisissez un titre"
        type="text"
        value={currentName}
        classNames={{
          base: "items-start",
          input: "w-80"
        }}
        size= "lg"
        onChange={(e) => {
          setCurrentName(e.currentTarget.value);
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
        classNames={{
          base: "items-start",
          input: "py-4"
        }}
        size= "lg"
        name="description"
        placeholder="Saisissez une description"
        value={currentDescription}
        type="text"
        onChange={(e) => {
          setCurrentDescription(e.currentTarget.value);
        }}
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
        labelPlacement="outside"
        size="lg"
        selectedKeys={[currentCategoryTopicId]}
      >
        {(categoryTopic) => (
          <SelectItem
            key={categoryTopic.id}
            onClick={(e) => {
              setCurrentCategoryTopicId(categoryTopic.id);
            }}
          >
            {categoryTopic.name}
          </SelectItem>
        )}
      </Select>

      {formState.errors?._form ? (
        <div className="text-danger text-sm">
          {formState.errors?._form.join(", ")}
        </div>
      ) : null}

      <Button type="submit" className="font-bold text-white bg-sky-500 dark:text-black dark:bg-default-600 uppercase">
        Valider
      </Button>
    </Form>
  );
}
