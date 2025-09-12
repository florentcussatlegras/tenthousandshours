import {
  CheckboxGroup,
  Chip,
  tv,
  useCheckbox,
  VisuallyHidden,
} from "@heroui/react";
import { UUID } from "crypto";
import { CheckIcon } from "lucide-react";
import React from "react";

interface TopicState {
  id: UUID;
  name: string;
  studyProcesses: string[];
}

export const CustomCheckbox = (props) => {
  const checkbox = tv({
    slots: {
      base: "bg-secondary hover:bg-secondary border-none",
      content: "text-white px-4 font-bold",
    },
    variants: {
      isSelected: {
        true: {
          base: "bg-secondary hover:bg-secondary",
          content: "text-white text-base pl-1 w-full",
        },
      },
      isFocusVisible: {
        true: {
          // base: "outline-solid outline-transparent",
        },
      },
    },
  });

  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="secondary"
        startContent={isSelected ? <CheckIcon className="ml-1" /> : null}
        variant="faded"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};

export function ListTopicsUser({ topics }: { topics: TopicState[] }) {
  const [groupSelected, setGroupSelected] = React.useState([]);

  return (
    <div className="flex flex-col w-full gap-2">
      <CheckboxGroup
        className="gap-1"
        orientation="horizontal"
        value={groupSelected}
        onChange={setGroupSelected}
      >
        {topics.map((topic) => (
          <CustomCheckbox value={topic.id}>{topic.name}</CustomCheckbox>
        ))}
      </CheckboxGroup>
      <p className="mt-4 ml-1 text-default-500">Selected: {groupSelected.join(", ")}</p>
    </div>
  );
}
