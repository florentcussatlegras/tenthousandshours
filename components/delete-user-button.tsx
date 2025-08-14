"use client";

import { deleteUserAction } from "@/app/actions/delete-user.action";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/react";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

interface DeleteUserButtonProps {
    userId: string
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        setIsPending(true);

        const {error} = await deleteUserAction({userId});

        if (error) {
            addToast({
              title: "Erreur suppression utilisateur",
              description: error,
              color: "danger",
            });
        } else {
            addToast({
              title: "Succès suppression utilisateur",
              description: "L'utilisateur a été supprimé avec succès!",
              color: "success",
            });
        }

        setIsPending(false);
    }

    return (
        <Button
            color="danger"
            variant="solid"
            className="size-7 rounded-sm"
            disabled={isPending}
            onPress={handleClick}
        >
            <span className="sr-only">Delete User</span>
            <TrashIcon />
        </Button>
    )
}

export const PlaceholderDeleteUserButton = () => {
    return (
        <Button
            color="danger"
            variant="flat"
            className="size-7 rounded-sm cursor-default"
            disabled
        >
            <span className="sr-only">Delete User</span>
            <TrashIcon />
        </Button>
    )
}