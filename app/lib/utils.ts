import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getValidDomains () {
    const domains = ["gmail.com", "yahoo.com", "outlook.com"];

    if (process.env.NODE_ENV === "development") {
        domains.push("example.com");
    }

    return domains;
}

export function normalizeName(name: string) {
    return name
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^a-zA-Z\s'-]/g, "")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function convertSecondsInHourMin(sec: number) {
    const dateObj = new Date(sec * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();

    if (hours === 0) {
        return minutes.toString() + ' min';
    }

    if (minutes === 0) {
        return hours.toString() + ' h';
    }

    return hours.toString() + ' h ' +
        minutes.toString().padStart(2, '0') + ' min';
}