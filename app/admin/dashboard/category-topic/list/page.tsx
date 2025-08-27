import TableListCategoryTopic from "@/components/table-list-category-topic";
import prisma from "@/app/lib/prisma";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AddIcon } from "@/components/icons";


export default async function App() {
  const categories = await prisma.categoryTopic.findMany();

  return (
    <div>
        <TableListCategoryTopic categories={categories} />
    </div>
  );
}

