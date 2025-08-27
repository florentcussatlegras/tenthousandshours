
import * as actions from "@/app/actions/actions";
import StudyProcessCreateForm from "./create-study-process-form";

export default async function createStudyProcessPage() {

  const topics = await actions.getListTopics();

  return (
    <StudyProcessCreateForm topics={topics}  />
  );
}
