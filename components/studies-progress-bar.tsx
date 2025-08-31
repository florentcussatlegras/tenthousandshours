"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import {
  Divider,
  Progress,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { DeleteIcon } from "./icons";

interface StudyProgression {
  totalHours?: Number;
  topic?: {
    name?: String;
  };
}

import React from "react";

export const EyeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-eye-icon lucide-eye text-default-600"
    >
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

export const ThreeDotsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
};

export default function StudiesProgressbar({
  userStudies,
}: {
  userStudies: StudyProgression[];
}) {
  return (
    <Card className="h-full rounded-none">
      <CardHeader className="flex flex-col items-start gap-3 p-4">
        <h2 className="text-md font-medium text-black/90">
          Mes apprentissages
        </h2>
        <Divider />
      </CardHeader>
      <CardBody className="p-6">
        <div className="flex flex-col gap-4 h-full justify-center">
          {userStudies.map((study) => {
            const ratioProgress = (Number(study.totalHours) / 10000) * 100;
            return (
              <div className="flex items-end gap-4 relative">
                <Progress
                  aria-label="Loading..."
                  label={study?.topic?.name}
                  className="w-full"
                  classNames={{
                    indicator: "bg-sky-500",
                    track: "drop-shadow-md border border-default",
                    value: "ml-auto text-foreground/60 text-sm",
                  }}
                  value={ratioProgress}
                  showValueLabel={true}
                />
                <Dropdown>
                  <DropdownTrigger>
                    <Button className="bg-white w-[20px] border border-default-100 place-items-end">
                      <ThreeDotsIcon />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem key="details">
                      <Link
                        href={`/study-process/${study.topic?.name}`}
                        className="text-lg cursor-pointer active:opacity-50 flex flex-row items-center gap-2"
                      >
                        <EyeIcon />
                        <span className="text-sm">
                          Afficher les détails
                        </span>
                      </Link>
                    </DropdownItem>
                    <DropdownItem key="delete">
                        <Link
                          href=""
                          className="text-lg text-danger cursor-pointer active:opacity-50 flex flex-row items-center gap-2"
                        >
                          <DeleteIcon />
                          <span className="text-sm">
                            Supprimer l'apprentissage
                          </span>
                        </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
