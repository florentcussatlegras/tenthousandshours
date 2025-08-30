"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Input,
  useDisclosure,
  Checkbox,
  Divider,
} from "@heroui/react";
import { StudySession } from "@prisma/client";
import Link from "next/link";
import { AddIcon } from "./icons";

export default function ListStudiesSession({
  studySessions,
}: {
  studySessions: StudySession[];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Card className="h-full rounded-none relative">
      <CardHeader className="flex flex-col gap-2 pb-4 px-4">
        <div className="flex flex-row justify-between w-full items-center">
            <h1 className="text-xl font-medium">
                Vos sessions de travail
            </h1>
            <div>
            <Button className="bg-sky-500 dark:bg-default-900" onPress={onOpen}>
                <Link href="" className="flex flex-row items-center text-white dark:text-black gap-2">
                    <AddIcon />
                </Link>
            </Button>
            <Modal
                isOpen={isOpen}
                placement="top-center"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">
                        Log in
                    </ModalHeader>
                    <ModalBody>
                        <Input
                        label="Email"
                        placeholder="Enter your email"
                        variant="bordered"
                        />
                        <Input
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        variant="bordered"
                        />
                        <div className="flex py-2 px-1 justify-between">
                        <Checkbox
                            classNames={{
                            label: "text-small",
                            }}
                        >
                            Remember me
                        </Checkbox>
                        <Link color="primary" href="#" size="sm">
                            Forgot password?
                        </Link>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                        </Button>
                        <Button color="primary" onPress={onClose}>
                        Sign in
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
            </div>
        </div>
        <Divider />
      </CardHeader>
      <CardBody>
        <div className="flex flex-row"></div>
      </CardBody>
    </Card>
  );
}
