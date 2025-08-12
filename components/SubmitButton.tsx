"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@heroui/react";

// NOTE: Give the user some feedback about the form submission before being
// redirected by using a SubmitButton component that uses the useFormStatus hook

function SubmitButton({
  pendingText = "",
  text = "",
}) {
  const status = useFormStatus();
  return (
    <Button
      className="w-full"
      color="primary" 
      type="submit"
      disabled={status.pending}
    >
      {status.pending ? pendingText : text}
    </Button>
  );
}

export default SubmitButton;