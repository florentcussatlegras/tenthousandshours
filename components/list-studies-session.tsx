"use client";

import { createStudySessionAction } from "@/app/actions/create-study-session.action";
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
  TimeInput,
  Textarea,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from "@heroui/react";
import { StudyProcess, StudySession } from "@prisma/client";
import { useActionState } from "react";

export default function ListStudiesSession({
  studySessions,
  studyProcess,
}: {
  studySession: StudySession[];
  studyProcess: StudyProcess;
}) {
  const [formState, formAction] = useActionState(createStudySessionAction, {
    errors: {},
  });

  console.log(JSON.stringify(studySessions));

  return (
    <Card className="h-full rounded-none relative">
      <CardHeader className="flex flex-col gap-4 items-start">
        {/* <h2 className="text-md">
          Nouvelle session de travail du{" "}
          {new Intl.DateTimeFormat("fr-Fr", {
            dateStyle: "full",
          }).format(new Date())}
        </h2> */}
        <Form
          action={formAction}
          className="flex flex-col justify-start w-full"
        >
          <div className="flex flex-row w-full gap-3">
            <Input
              type="hidden"
              name="studyProcessId"
              value={studyProcess.id}
            />
            <TimeInput
              label="Débuté à"
              className="flex-1"
              name="startedAt"
              hourCycle={24}
            />
            <TimeInput
              label="Terminé à"
              className="flex-1"
              name="finishedAt"
              hourCycle={24}
            />
            <Textarea
              className="flex-3"
              label="Veuillez décrire le contenu de votre session"
              name="description"
            />
          </div>
          <Button type="submit" className="bg-sky-500 text-white">Ajouter une nouvelle session</Button>
        </Form>
        <Divider />
      </CardHeader>
      <CardBody>
        <div className="flex flex-col">
          <Table aria-label="Example static collection table" radius="none" shadow="none" className="p-0" classNames={{wrapper: "p-0 m-0 w-full"}}>
            <TableHeader>
              <TableColumn>Crée le</TableColumn>
              <TableColumn>Temps travaillé</TableColumn>
              <TableColumn>Début</TableColumn>
              <TableColumn>Fin</TableColumn>
            </TableHeader>
            <TableBody>
                {studySessions.map((studySession) => {
                  const createdAtFormat = new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "full",
                  }).format(studySession.createdAt);

                  return (
                    <TableRow key={studySession.id}>
                      <TableCell>{createdAtFormat.toUpperCase()}</TableCell>
                      <TableCell>{studySession.totalSeconds / 3600} heures</TableCell>
                      <TableCell>{new Intl.DateTimeFormat("fr-FR", {
                        "timeStyle": "short",
                      }).format(studySession.startedAt)}</TableCell>
                      <TableCell>{new Intl.DateTimeFormat("fr-FR", {
                        "timeStyle": "short",
                      }).format(studySession.finishedAt)}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
}
