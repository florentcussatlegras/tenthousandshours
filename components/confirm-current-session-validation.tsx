"use client";

import { addToast } from "@heroui/react";
import { useActionState, useEffect } from "react";

export const ConfirmCurrentSessionValidation = () => {
  useEffect(() => {
    addToast({
      title: "Confirmation validation session",
      description: "La session de travail a bien été ajoutée",
      color: "success",
    });
  });

  return null;
};
