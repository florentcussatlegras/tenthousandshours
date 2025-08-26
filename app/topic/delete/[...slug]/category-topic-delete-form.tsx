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

      <div className="flex items-center">
        <span>Etes-vous sûr de vouloir supprimer la matière</span>
        <span className="font-bold ml-2">{name}</span> ?
      </div> 

      <Input type="hidden" value={id} name="id" />

      <div className="flex gap-4">
        <Button type="submit" color="danger" className="font-bold uppercase">
          Valider
        </Button>
        <Button type="submit" color="default" variant="flat" className="font-bold uppercase">
          <Link href="/topic/list">Annuler</Link>
        </Button>
      </div>
    </Form>
  );
}
