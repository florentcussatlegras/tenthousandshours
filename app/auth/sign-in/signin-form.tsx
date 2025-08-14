"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {Form, Input, Select, SelectItem, Checkbox, Button} from "@heroui/react";
import { addToast } from "@heroui/react"; 
import signInEmailAction from "../../actions/sign-in-email.action";
import Link from "next/link";

export default function SignInForm() {

  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  async function onSubmit(evt: React.FormEvent<HTMLFormElement>) {-
    evt.preventDefault();

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
        title: "Success identification",
        description: "Registration complete. You're all set",
        color: "success",
      });
      router.push("/profile");
    }

  }

  return (
    <Form
      className="justify-center items-start space-y-4 mx-auto w-2/3"
      // validationErrors={errors}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-4 w-full">
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
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
        />

        <Input
          // isRequired
          // errorMessage={getPasswordError(password)}
          // isInvalid={getPasswordError(password) !== null}
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Enter your password"
          type="password"
        />

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit" disabled={isPending}>
            Submit
          </Button>
          <Button type="reset" variant="bordered">
            Reset
          </Button>
        </div>
      </div>
      <div className="text-sm text-foreground-400">
          Don't Already have an account?{" "}
          <Link href="/auth/sign-up" className="hover:text-foreground">
              Sign Up
          </Link>
      </div>
    </Form>
  );
}

