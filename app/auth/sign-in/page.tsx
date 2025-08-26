"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import SignInForm from "./signin-form";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

export default function SignInPage() {
  return (
    <div className="px-8 container mx-auto max-w-screen-lg">

        <Card className="w-full flex flex-col items-center py-6">
            <CardHeader className="flex flex-col">
                <h1 className="text-4xl font-bold mb-4 text-default-600">Identification</h1>
                <div className="flex max-w-full gap-4 items-center">
                  <SignInOauthButton provider="google" />
                  <SignInOauthButton provider="github" />
                </div>
                {/* <Divider className="mt-6" /> */}
            </CardHeader>
            <CardBody>
                <SignInForm />
            </CardBody>
        </Card>

    </div>
  );
}