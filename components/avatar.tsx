"use client";

import { Avatar as BaseAvatar } from "@heroui/react";

export default function Avatar({ imgSrc }: { imgSrc: string }) {
  return (
    <BaseAvatar isBordered radius="full" src={imgSrc} className="w-20 h-20 text-large" />
  );
}
