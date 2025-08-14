import Link from "next/link";
import { Button } from "@heroui/button";
import { ArrowLeftIcon } from "lucide-react";

interface ReturnButtonProps {
    href: string;
    label: string;
}

export const ReturnButton = ({ href, label }: ReturnButtonProps) => {
    return (
        <Button color="primary">
            <Link href={href} className="flex items-center gap-2">
                <ArrowLeftIcon /> {label}
            </Link>
        </Button>
    );
};