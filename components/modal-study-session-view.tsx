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
                <h1 className="text-3xl text-sky-500">{topicName}</h1>
                <span>{dateCreatedAtStr.slice(0, 1).toUpperCase() + dateCreatedAtStr.slice(1)}</span>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1 py-4">
                  <div className="flex flex-row gap-2 text-base mb-2">
                    <span>Horaires de travail : </span>
                    <span>
                      {new Intl.DateTimeFormat("fr-Fr", {
                        timeStyle: "short",
                      }).format(studySession.startedAt)}
                    </span>
                    <span>-</span>
                    <span>
                      {new Intl.DateTimeFormat("fr-Fr", {
                        timeStyle: "short",
                      }).format(studySession.finishedAt)}
                    </span>
                  </div>
                  <div>Vous avez travaillé {studySession.study_process_total_hours} heures au total sur cette matière</div>
                  <p className="my-4">
                    {studySession?.description === '' ?
                      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus optio delectus harum beatae debitis nihil molestias, animi laboriosam, sint mollitia labore neque sequi soluta ea? Hic dignissimos quam voluptas neque."
                    :
                      studySession?.description
                    }
                  </p>
                  {/* {studySession.urls !== '' ?
                    <div className="flex flex-col">
                      <h2>Vous avez utilisé le contenu suivant lors de cette session de travail :</h2>
                      <ul>
                        {studySession.urls.split(',').map((url) => (
                          <li className="text-sky-500"><Link href={url}>{url}</Link></li>
                        ))}
                      </ul>
                    </div>
                    : <span>Vous n'avez indiqué aucun contenu particulier utilisé lors de cette session de travail</span>
                  } */}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Fermer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ModalStudySessionView;
