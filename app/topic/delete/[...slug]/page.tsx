

import { getCategoryTopic } from "@/app/actions/update-category-topic.action";
import CategoryTopicDeleteForm from "./category-topic-delete-form";

export default async function CategoryTopicDeletePage({ params }) {

    const { slug } = await params;
    const categoryTopic = await getCategoryTopic(String(slug));

    return <CategoryTopicDeleteForm categoryTopic={categoryTopic}  />;
}