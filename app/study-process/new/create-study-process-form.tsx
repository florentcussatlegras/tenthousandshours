"use client";

import { createStudyProcess } from "@/app/actions/create-study-process.action";
import {
  Form,
  Input,
  Button,
  Textarea,
  addToast,
  Select,
  SelectItem,
} from "@heroui/react";
import { Topic } from "@prisma/client";
import { useActionState, useState } from "react";

export default function StudyProcessCreateForm({
  topics,
}: {
  topics: Topic[];
}) {

const [formState, formAction] = useActionState(createStudyProcess, {
    errors: {},
});

const [currentName, setCurrentName] = useState("");
// const [currentDescription, setCurrentDescription] = useState(description);
const topicName = localStorage.getItem('new_study_process') ? localStorage.getItem('new_study_process') : "";

const [currentTopicId, setCurrentTopicId] = useState(
    topics.filter(
        (topic) => topic.name === topicName
    )[0].id
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
          label: "self-start",
        }}
        size="lg"
      />
      {formState.errors.name ? (
        <div className="text-danger text-sm">
          {formState.errors.name?.join(", ")}
        </div>
      ) : null}

      {/* <Textarea
        color={formState.errors.content !== undefined ? "danger" : "default"}
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
      ) : null} */}

      <Select
        items={topics}
        label="Matière étudiée"
        placeholder="Selectionnez une matière"
        name="topicId"
        labelPlacement="outside"
        size="lg"
        selectedKeys={[currentTopicId]}
      >
        {(topic) => (
          <SelectItem
            key={topic.id}
            onClick={(e) => {
              setCurrentTopicId(topic.id);
            }}
          >
            {topic.name}
          </SelectItem>
        )}
      </Select>

      {formState.errors?._form ? (
        <div className="text-danger text-sm">
          {formState.errors?._form.join(", ")}
        </div>
      ) : null}

      <Button
        type="submit"
        className="uppercase text-white bg-sky-500 font-bold dark:text-black dark:bg-default-600"
      >
        Valider
      </Button>
    </Form>
  );
}
