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

export default function Home() {

  const { data: session } = useSession();

  if (!session) {

    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Make&nbsp;</span>
          <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
          <br />
          <span className={title()}>
            websites regardless of your design experience.
          </span>
        </div>
        <GetStartedButton />
      </section>
    );

  } 

  return (
    <section className="flex flex-col items-center h-full justify-center gap-4">
        <SearchBarHomepage />
    </section>
  );
}
