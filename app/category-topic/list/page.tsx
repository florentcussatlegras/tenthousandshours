import TableListCategoryTopic from "@/components/table-list-category-topic";
import prisma from "@/app/lib/prisma";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AddIcon } from "@/components/icons";


export default async function App() {
  const categories = await prisma.categoryTopic.findMany();

  return (
    <div>
        <div className="justify-self-end mb-6">
            <Button className="bg-black dark:bg-default-600">
                <Link href="/category-topic/new" className="text-white dark:text-black gap-2">
                  <AddIcon />
                  <span>Ajouter une catégorie</span>
                </Link>
            </Button>
        </div>
        <TableListCategoryTopic categories={categories} />
    </div>
  );
}

