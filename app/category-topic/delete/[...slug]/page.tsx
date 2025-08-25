

import * as actions from "@/app/actions/actions";
import CategoryTopicDeleteForm from "./category-topic-delete-form";

export default async function CategoryTopicDeletePage({ params }) {

    const { slug } = await params;
    const categoryTopic = await actions.getCategoryTopic(String(slug));

    return <CategoryTopicDeleteForm categoryTopic={categoryTopic}  />;
}