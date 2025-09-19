
import { getStudySession } from "@/app/actions/actions";
import { CurrentStudySessionValidationForm } from "./current-study-session-validation-form";

export default async function validateCurrentStudySessionPage({ params }) {

  const { id } = await params;
  const currentStudySession = await getStudySession(String(id));

  return <CurrentStudySessionValidationForm currentStudySession={currentStudySession}  />;
}
