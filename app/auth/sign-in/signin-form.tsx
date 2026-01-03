"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import signInEmailAction from "../../actions/sign-in-email.action";
import Link from "next/link";

export default function SignInForm() {
  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  async function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
    -evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await signInEmailAction(formData);

    if (error) {
      addToast({
        title: "Erreur identification",
        description: error,
        color: "danger",
      });
      setIsPending(false);
    } else {
      addToast({
        title: "Succès identification",
        description: "Bonjour! Heureux de vous revoir :)",
        color: "success",
      });
      router.refresh();
      router.push("/profile");
    }
  }

  return (
    <Form
      className="justify-center items-start mx-auto w-3/4 md:w-2/3"
      // validationErrors={errors}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* {globalErrors !== '' && (
          <div className="text-danger text-tiny mt-4 justify-start w-full">
            {globalErrors}
          </div>
        )} */}
        <Input
          // isRequired
          // errorMessage={({validationDetails}) => {
          //   if (validationDetails.valueMissing) {
          //     return "Please enter your email";
          //   }
          // }}
          label="Email"
          labelPlacement="inside"
          name="email"
          size="md"
        />

        <div className="space-y-2">
          <Input
            // isRequired
            // errorMessage={getPasswordError(password)}
            // isInvalid={getPasswordError(password) !== null}
            label="Mot de passe"
            labelPlacement="inside"
            name="password"
            type="password"
            size="md"
          />

          <Link
            href="/auth/forget-password"
            className="text-sm text-muted-foreground hover:text-foreground text-sky-500"
          >
            Vous avez oublié votre mot de passe?
          </Link>
        </div>

        <div className="flex gap-4">
          <Button
            className="bg-sky-500 text-white font-bold dark:bg-default-500 dark:text-white"
            type="submit"
            disabled={isPending}
          >
            VALIDER
          </Button>
          <Button className="font-bold" type="reset" variant="flat">
            ANNULER
          </Button>
        </div>
      </div>
      <div className="text-sm text-foreground-400 mt-6">
        Vous n'avez pas encore de compte ?{" "}
        <Link
          href="/auth/sign-up"
          className="hover:text-foreground text-sky-500"
        >
          Inscrivez-vous
        </Link>
      </div>
    </Form>
  );
}
