import TableListTopic from "@/components/table-list-topic";
import prisma from "@/app/lib/prisma";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AddIcon } from "@/components/icons";

export default async function App() {
  const topics: any[] = await prisma.topic.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      slug: true,
      description: true,
      status: true,
      category: true
    }
  });

  return (
    <div>
        <TableListTopic topics={topics} />
    </div>
  );
}

