"use client";

import { Card, CardBody } from "@heroui/react";
import SignUpForm from "./signup-form";

export default function SignUpPage() {

  return (
    <div className="px-8 container mx-auto max-w-screen-lg space-y-8">

        <div className="space-y-8 w-full flex flex-col items-center">

            <h1 className="text-2xl font-bold">Sign Up</h1>

            <Card className="w-1/2 py-6">
                <CardBody>
                    <SignUpForm />
                </CardBody>
            </Card>

        </div>

    </div>
  );
}