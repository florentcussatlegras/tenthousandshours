"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import SignUpForm from "./signup-form";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

export default function SignUpPage() {

  return (
    <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

        <div className="space-y-8 w-full flex flex-col items-center">

             <Card className="w-1/2 py-6">
                <CardHeader className="flex flex-col">
                    <h1 className="text-2xl font-bold mb-4">Inscription</h1>
                    <div className="flex max-w-full gap-4 items-center">
                      <SignInOauthButton provider="google" />
                      <SignInOauthButton provider="github" />
                    </div>
                    <Divider className="mt-6" />
                </CardHeader>
                <CardBody>
                    <SignUpForm />
                </CardBody>
            </Card>

        </div>

    </div>
  );
}