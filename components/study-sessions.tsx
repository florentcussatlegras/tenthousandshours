"use client";

import { NewStudySessionForm } from "./new-study-session-form";
import ListStudiesSession from "./list-studies-session";
import { StudyProcess, StudySession } from "@prisma/client";
import React, { useState } from "react";
import { UpdateStudySessionForm } from "./update-study-session-form";
import { getStudySession } from "@/app/actions/actions";

export function StudySessions({
  studySessions,
  studyProcess,
}: {
  studySessions: StudySession[];
  studyProcess: StudyProcess;
}) {
  const [currentStudySession, setCurrentStudySession] = useState(null);

  const handleToggleForm = React.useCallback(async (studySessionId) => {
      const studySessionToEdit = await getStudySession(studySessionId);
      setCurrentStudySession(studySessionToEdit);
  }, []);

  return (
    <div className="flex flex-row w-full gap-4">
      {currentStudySession === null ? (
        <NewStudySessionForm studyProcess={studyProcess} />
      ) : (
        <UpdateStudySessionForm studySession={currentStudySession} />
      )}
      <ListStudiesSession
        onEditClick={handleToggleForm}
        studySessions={studyProcess?.studySessions}
      />
    </div>
  );
}
