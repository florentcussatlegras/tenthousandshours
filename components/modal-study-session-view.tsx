import { getTopicStudySession } from "@/app/actions/actions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { StudySession } from "@prisma/client";
import React, { useCallback, useEffect, useState } from "react";

function ModalStudySessionView(props: any) {
  const studySession = props.studySession;
  const [topicName, setTopicName] = useState("");

  React.useEffect(() => {
    async function getTopicName() {
        if(studySession !== null) {
            const topic = await getTopicStudySession(studySession);
            setTopicName(String(topic?.name));
        }
    }
    getTopicName();
  }, [studySession]);

  let dateCreatedAt, hourStartedAt, hourFinishedAt;

  if (studySession !== null) {
    dateCreatedAt = studySession.createdAt;
    hourStartedAt = studySession.startedAt;
    hourFinishedAt = studySession.finishedAt;
  } else {
    dateCreatedAt = new Date();
    hourStartedAt = new Date();
    hourFinishedAt = new Date();
  }

  const dateCreatedAtStr = new Intl.DateTimeFormat("fr-Fr", {
    dateStyle: "full",
  }).format(dateCreatedAt);

  const hourStartedAtStr = new Intl.DateTimeFormat("fr-Fr", {
    timeStyle: "short",
  }).format(hourStartedAt);

  const hourFinishedAtStr = new Intl.DateTimeFormat("fr-Fr", {
    timeStyle: "short",
  }).format(hourFinishedAt);

  return (
    <div>
      <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-sky-500">{topicName}</span>
                {dateCreatedAtStr.slice(0, 1).toUpperCase() +
                  dateCreatedAtStr.slice(1)}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-row gap-4">
                  <span>Heure de début: {hourStartedAtStr}</span>
                  <span>Heure de fin: {hourFinishedAtStr}</span>
                </div>
                <p>{studySession?.description}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fermer
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ModalStudySessionView;
