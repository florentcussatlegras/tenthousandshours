"use client";

import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import GetStartedButton from "@/components/get-started-button";
import { useSession } from "@/app/lib/auth-client";
import SearchBarHomepage from "@/components/search-bar-homepage";

import { Card } from "@heroui/react";
import { Hero } from "@/components/hero";

const urlImageHero = '/illustration-books-and-desk.jpg';

export default function Home() {
  return (
    <section className="flex items-center h-full justify-center gap-4 bg-white">
      <Hero imageUrl={urlImageHero} imageAlt="Books and watches on a desk" />
    </section>
  );
}
