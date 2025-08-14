"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {Form, Input, Select, SelectItem, Checkbox, Button} from "@heroui/react";
import { signUp } from "../../lib/auth-client";
import { redirect } from "next/navigation";
import signUpEmailAction from "../../actions/sign-up-email.action";
// import { toast } from "sonner";
import { addToast, ToastProvider } from "@heroui/react"; 
import Link from "next/link";

export default function SignUpForm() {

  const [isPending, setIsPending] = React.useState(false);
  const router = useRouter();

  // const [password, setPassword] = React.useState("");
  // const [submitted, setSubmitted] = React.useState(null);
  // const [errors, setErrors] = React.useState({});
  // const [globalErrors, setGlobalErrors] = React.useState('');
  // const [isPending, setIsPending] = React.useState(false);

  // // Real-time password validation
  // const getPasswordError = (value) => {
  //   if (value.length < 4) {
  //     return "Password must be 4 characters or more";
  //   }
  //   if ((value.match(/[A-Z]/g) || []).length < 1) {
  //     return "Password needs at least 1 uppercase letter";
  //   }
  //   if ((value.match(/[^a-z]/gi) || []).length < 1) {
  //     return "Password needs at least 1 symbol";
  //   }

  //   return null;
  // };

  async function onSubmit(evt: React.FormEvent<HTMLFormElement>) {
    
    evt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evt.target as HTMLFormElement);

    const { error } = await signUpEmailAction(formData);

    if (error) {
      addToast({
        title: "Erreur registration",
        description: error,
        color: "danger",
      });
      setIsPending(false);
    } else {
      addToast({
        title: "Success registration",
        description: "Registration complete. You're all set",
        color: "success",
      });
      router.push("/auth/sign-in");
    }

    // const data = Object.fromEntries(new FormData(e.currentTarget));
    // // Custom validation checks
    // const newErrors = {};
    // // Password validation
    // const passwordError = getPasswordError(data.password);
    // if (passwordError) {
    //   newErrors.password = passwordError;
    // }
    // // Username validation
    // if (data.name === "admin") {
    //   newErrors.name = "Nice try! Choose a different username";
    // }
    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors);
    //   return;
    // }
    // if (data.terms !== "true") {
    //   setErrors({terms: "Please accept the terms"});
    //   return;
    // }

    // Clear errors and submit
    // setErrors({});
    // setSubmitted(data);

    // await signUp.email({
    //   name: data.name as string,
    //   email: data.email as string,
    //   password: data.password as string,
    // }, {
    //   onRequest: () => {
    //       setIsPending(true)
    //   },
    //   onResponse: () => {
    //     setIsPending(false)
    //   },
    //   onSuccess: () => {
    //       router.push("/")
    //   },
    //   onError: (ctx) => {
    //       console.log(ctx.error?.message);
    //       setGlobalErrors(ctx.error?.message);
    //   },
    // });

  }

  return (
    <Form
      className="justify-center items-start space-y-4 mx-auto w-2/3"
      // validationErrors={errors}
      // onReset={() => setSubmitted(null)}
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
          //     return "Please enter your name";
          //   }

          //   return errors.name;
          // }}
          label="Name"
          labelPlacement="outside"
          name="name"
          placeholder="Enter your name"
        />

        <Input
          // isRequired
          // errorMessage={({validationDetails}) => {
          //   if (validationDetails.valueMissing) {
          //     return "Please enter your email";
          //   }
          //   if (validationDetails.typeMismatch) {
          //     return "Please enter a valid email address";
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
          // value={password}
          // onValueChange={setPassword}
        />

        {/* <Select
          isRequired
          label="Country"
          labelPlacement="outside"
          name="country"
          placeholder="Select country"
        >
          <SelectItem key="ar">Argentina</SelectItem>
          <SelectItem key="us">United States</SelectItem>
          <SelectItem key="ca">Canada</SelectItem>
          <SelectItem key="uk">United Kingdom</SelectItem>
          <SelectItem key="au">Australia</SelectItem>
        </Select> */}

        <Checkbox
          isRequired
          classNames={{
            label: "text-small",
          }}
          // isInvalid={!!errors.terms}
          name="terms"
          validationBehavior="aria"
          value="true"
          // onValueChange={() => setErrors((prev) => ({...prev, terms: undefined}))}
        >
          I agree to the terms and conditions
        </Checkbox>

        {/* {errors.terms && <span className="text-danger text-tiny">{errors.terms}</span>} */}

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit">
            Submit
          </Button>
          <Button type="reset" variant="bordered">
            Reset
          </Button>
        </div>
      </div>
      <div className="text-sm text-foreground-400">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="hover:text-foreground">
              Sign In
          </Link>
      </div>
    </Form>
  );
}

