"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/react";

export default function StudiesProgressbar() {
  return (
    <Card className="h-full rounded-none">
      <CardBody className="p-6">
        <h1 className="text-default-600 text-xl">Mes progrès</h1>
        <div className="flex flex-col gap-2 h-full justify-center">
            <span>Javascript</span>
            <Progress aria-label="Loading..." className="w-full" value={60} />
            <span>PHP</span>
            <Progress aria-label="Loading..." className="w-full" value={30} />
            <span>Laravel</span>
            <Progress aria-label="Loading..." className="w-full" value={56} />
            <span>React</span>
            <Progress aria-label="Loading..." className="w-full" value={90} />
            <span>Formule 1</span>
            <Progress aria-label="Loading..." className="w-full" value={5} />
        </div>
      </CardBody>
    </Card>
  );
}

