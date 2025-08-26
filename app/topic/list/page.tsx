import TableListTopic from "@/components/table-list-topic";
import prisma from "@/app/lib/prisma";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default async function App() {
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      category: true
    }
  });

  return (
    <div>
        <div className="justify-self-end mb-6">
            <Button className="bg-black dark:bg-default-600">
                <Link href="/topic/new" className="text-white dark:text-black">Ajouter une matière</Link>
            </Button>
        </div>
        <TableListTopic topics={topics} />
    </div>
  );
}

