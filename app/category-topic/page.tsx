import TableListCategoryTopic from "@/components/table-list-category-topic";
import prisma from "../lib/prisma";

export default async function App() {
  const categories = await prisma.categoryTopic.findMany();

  return (
    <TableListCategoryTopic categories={categories} />
  );
}

