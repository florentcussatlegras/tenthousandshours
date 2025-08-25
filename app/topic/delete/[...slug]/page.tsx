

import * as actions from "@/app/actions/actions";
import TopicDeleteForm from "./category-topic-delete-form";

export default async function TopicDeletePage({ params }) {

    const { slug } = await params;
    const topic = await actions.getTopic(String(slug));

    return <TopicDeleteForm topic={topic}  />;
}