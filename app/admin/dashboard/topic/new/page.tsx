import TopicCreateForm from "./topic-create-form";
import * as actions from "@/app/actions/actions";

export default async function TopicCreatePage() {
  const categoriesTopic = await actions.getListCategoryTopic();

  return <TopicCreateForm categoriesTopic={categoriesTopic} />;
}
