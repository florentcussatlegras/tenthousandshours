

import * as actions from "@/app/actions/actions";
import CategoryTopicUpdateForm from "./category-topic-update-form";

export default async function CategoryTopicUpdatePage({ params }) {

    const { slug } = await params;
    const categoryTopic = await actions.getCategoryTopic(String(slug));

    return <CategoryTopicUpdateForm categoryTopic={categoryTopic}  />;
}