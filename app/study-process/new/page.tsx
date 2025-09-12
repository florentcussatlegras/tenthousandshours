
import * as actions from "@/app/actions/actions";
import StudyProcessCreateForm from "./create-study-process-form";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardBody } from "@heroui/react";

export default async function createStudyProcessPage() {
  const topics = await actions.getListTopics();

  return (
      <StudyProcessCreateForm topics={topics} />
  );
}
