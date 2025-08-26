"use client";

import { deleteCategoryTopic } from "@/app/actions/delete-category-topic.action";
import { Form, Input, Button, Textarea, addToast } from "@heroui/react";
import { CategoryTopic } from "@prisma/client";
import Link from "next/link";

export default function CategoryTopicDeleteForm({
  categoryTopic,
}: {
  categoryTopic: CategoryTopic;
}) {

  const { id, name, description } = categoryTopic;

  return (
    <Form action={deleteCategoryTopic} className="gap-4">
      
      <div className="flex items-center">
        <span>Etes-vous sûr de vouloir supprimer la catégorie</span>
        <span className="font-bold ml-2">{name}</span> ?
      </div> 

      <Input type="hidden" value={id} name="id" />

      <div className="flex gap-4">
        <Button type="submit" color="danger" className="uppercase font-bold">
          Valider
        </Button>
        <Button type="submit" color="default" variant="flat" className="uppercase font-bold">
          <Link href="/category-topic/list">Annuler</Link>
        </Button>
      </div>
    </Form>
  );
}
