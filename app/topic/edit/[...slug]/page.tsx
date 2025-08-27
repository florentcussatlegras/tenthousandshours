import * as actions from "@/app/actions/actions";
import TopicUpdateForm from "./topic-update-form";

export default async function TopicUpdatePage({ params }) {

    const { slug } = await params;
    const topic = await actions.getTopic(String(slug));

    const categoriesTopic = await actions.getListCategoryTopic();

    return <TopicUpdateForm topic={topic} categoriesTopic={categoriesTopic}  />;
}