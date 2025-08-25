import TableListCategoryTopic from "@/components/table-list-category-topic";
import prisma from "@/app/lib/prisma";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";


export default async function App() {
  const categories = await prisma.categoryTopic.findMany();

  return (
    <div>
        <div className="justify-self-end mb-6">
            <Button className="bg-black">
                <Link href="/category-topic/new" className="text-white">Ajouter une catégorie</Link>
            </Button>
        </div>
        <TableListCategoryTopic categories={categories} />
    </div>
  );
}

