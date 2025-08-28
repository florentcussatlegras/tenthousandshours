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
  RadioGroup,
  Radio,
  NumberInput,
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

  // const [currentDescription, setCurrentDescription] = useState(description);
  const topicName = localStorage.getItem("new_study_process")
  ? localStorage.getItem("new_study_process")
  : "";

  const [currentName, setCurrentName] = useState(`Devenir un expert en ${topicName}`);

  const [currentTopicId, setCurrentTopicId] = useState(
    topics.filter((topic) => topic.name === topicName)[0].id
  );

  return (
    <div className="space-y-8">
      <h1 className="uppercase text-2xl font-medium">
        Je veux devenir une star du <span className="text-sky-500">{topicName}</span>
      </h1>

      <Form action={formAction} className="gap-6">
        {/* <Select
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
        </Select> */}

        <Input type="hidden" name="topicId" value={currentTopicId} />

        {formState.errors?._form ? (
          <div className="text-danger text-sm">
            {formState.errors?._form.join(", ")}
          </div>
        ) : null}

        <Input
          color={formState.errors.name !== undefined ? "danger" : "default"}
          label="Titre"
          labelPlacement="outside-top"
          name="name"
          type="text"
          value={currentName}
          classNames={{
            label: "self-start",
            inputWrapper: "h-[60px]"
          }}
          size="lg"
          onChange={(e) => setCurrentName(e.currentTarget.value)}
        />
        {formState.errors.name ? (
          <div className="text-danger text-sm">
            {formState.errors.name?.join(", ")}
          </div>
        ) : null}

        <div className="flex w-full">
          <div className="flex flex-col justify-start items-start gap-2">
            <label>Saisissez le nombre d'heure que vous envisagez d'y consacrer (facultatif)</label>
            <div className="flex flex-row gap-4">
              <NumberInput
                color={formState.errors.name !== undefined ? "danger" : "default"}
                name="timeDedicated"
                classNames={{
                  base: "flex-3",
                  // input: "w-[150px]",
                  mainWrapper: "w-[150px]",
                  inputWrapper: "w-[150px] h-[60px]"
                }}
                size="lg"
                maxValue={200}
                hideStepper
              />
              <RadioGroup
                name="timeDedicatedPeriod"
                className="flex items-center justify-end"
                defaultValue="day"
              >
                <Radio value="day">Par jour</Radio>
                <Radio value="week">Par semaine</Radio>
              </RadioGroup>
            </div>
          </div>
          {formState.errors.name ? (
            <div className="text-danger text-sm">
              {formState.errors.name?.join(", ")}
            </div>
          ) : null}
        </div>

        <Textarea
          color={
            formState.errors.description !== undefined ? "danger" : "default"
          }
          label="Description"
          labelPlacement="outside-top"
          name="description"
          type="text"
          size="lg"
          classNames={{
            base: "items-start",
            input: "py-4",
          }}
        />
        {formState.errors.description ? (
          <div className="text-danger text-sm">
            {formState.errors.description?.join(", ")}
          </div>
        ) : null}

        <Button
          type="submit"
          className="uppercase text-white bg-sky-500 font-bold dark:text-black dark:bg-default-600"
        >
          Valider
        </Button>
      </Form>
    </div>
  );
}
