import Link from "next/link";
import { Button } from "@heroui/button";
import { ArrowLeftIcon } from "lucide-react";

interface ReturnButtonProps {
    href: string;
    label: string;
}

export const ReturnButton = ({ href, label }: ReturnButtonProps) => {
    return (
        <Button>
            <Link href={href}>
                <ArrowLeftIcon /> {label}
            </Link>
        </Button>
    );
};