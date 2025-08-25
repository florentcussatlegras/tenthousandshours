"use client";

import { deleteTopic } from "@/app/actions/delete-topic.action";
import { Form, Input, Button, Textarea, addToast } from "@heroui/react";
import { Topic } from "@prisma/client";
import Link from "next/link";

export default function TopicDeleteForm({
  topic,
}: {
  topic: Topic;
}) {

  const { id, name, description } = topic;

  return (
    <Form action={deleteTopic} className="gap-4">
      Etes-vous sûr de vouloir supprimer la matière {name} ?

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
