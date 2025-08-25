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
      Etes-vous sûr de vouloir supprimer la catégorie {name} ?

      <Input type="hidden" value={id} name="id" />

      <div className="flex gap-6">
        <Button type="submit" color="danger">
          Valider
        </Button>
        <Button type="submit" color="default" variant="flat">
          <Link href="/category-topic/list">Annuler</Link>
        </Button>
      </div>
    </Form>
  );
}
