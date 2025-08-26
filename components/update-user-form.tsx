"use client";

import { updateUser } from "@/app/lib/auth-client";
import { addToast, Button, Form, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return addToast({
        title: "Erreur utilisateur",
        description: "Merci de saisir un nom ou une image",
        color: "danger",
      });
    }

    await updateUser({
      ...(name && { name }),
      image,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          addToast({
            title: "Erreur modification utilisateur",
            description: ctx.error.message,
            color: "warning",
          });
        },
        onSuccess: () => {
          addToast({
            title: "Succès modification utilisateur",
            description: "Vos modifications ont bien été prises en compte",
            color: "success",
          });
          (evt.target as HTMLFormElement).reset();
          router.refresh();
        },
      },
    });
  }

  return (
    <Form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4 p-4">
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="name">Nom</label>
        <Input id="name" name="name" defaultValue={name}></Input>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="image">Image</label>
        <Input type="url" id="image" name="image" defaultValue={image} />
      </div>

      <Button type="submit" disabled={isPending} color="primary">
        Valider
      </Button>
    </Form>
  );
};
