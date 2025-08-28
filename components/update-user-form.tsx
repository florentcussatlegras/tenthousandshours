"use client";

import { updateUser } from "@/app/lib/auth-client";
import { addToast, Button, Form, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpdateUserFormProps {
  firstname?: string;
  name?: string;
  image?: string;
}

export const UpdateUserForm = ({ firstname, name, image }: UpdateUserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const [currentFirstname, setCurrentFirstname] = useState(firstname);
  const [currentImage, setCurrentImage] = useState(image);
  
  const router = useRouter();

  console.log(firstname);

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const firstname = String(formData.get("firstname"));
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!firstname && !name && !image) {
      return addToast({
        title: "Erreur utilisateur",
        description: "Merci de saisir un prénom, un nom ou une image",
        color: "danger",
      });
    }

    await updateUser({
      ...(firstname && { firstname }),
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

    <Form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <Input
        id="firstname"
        name="firstname"
        value={currentFirstname}
        label="Prénom"
        labelPlacement="inside"
        classNames={{
          label: "self-start"
        }}
        size="md"
        onChange={(e) => setCurrentFirstname(e.currentTarget.value)}
      />

      <Input
        id="name"
        name="name"
        value={currentName}
        label="Nom"
        labelPlacement="inside"
        classNames={{
          label: "self-start"
        }}
        size="md"
        onChange={(e) => setCurrentName(e.currentTarget.value)}
      />

      <Input
        type="url"
        id="image"
        name="image"
        value={currentImage}
        label="Image"
        labelPlacement="inside"
        classNames={{
          label: "self-start"
        }}
        size="md"
        onChange={(e) => setCurrentImage(e.currentTarget.value)}
      />

      <Button
        type="submit"
        disabled={isPending}
        className="bg-sky-500 text-white uppercase font-bold dark:text-black dark:bg-default-600"
      >
        Valider
      </Button>
    </Form>
  );
};
