"use client";

import { Card, CardBody, Divider } from "@heroui/react";
import SignInForm from "./signin-form";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

export default function SignUpPage() {

  return (
    <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

        <div className="space-y-8 w-full flex flex-col items-center">

            <h1 className="text-2xl font-bold">Sign In</h1>

            <Card className="w-1/2 py-6">
                <CardBody>
                    <SignInForm />
                    <Divider className="my-4" />
                    <div className="flex flex-col max-w-full gap-4 items-center">
                      <SignInOauthButton provider="google" />
                      <SignInOauthButton provider="github" />
                    </div>
                </CardBody>
            </Card>

        </div>

    </div>
  );
}