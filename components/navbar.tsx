import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";

import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { SignOutButton } from "@/app/auth/sign-out/sign-out-button";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export async function Navbar() {

  const headerList = await headers();

  const session = await auth.api.getSession({
    headers: headerList,
  });

  return (
    <HeroUINavbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">Ten Thousands Hours</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      {session !== null ? (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <SignOutButton />
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button as={Link} color="primary" variant="bordered" href="/auth/sign-in" radius="sm">
              CONNEXION
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="/auth/sign-up" radius="sm">
              INSCRIPTION
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </HeroUINavbar>
  );
}
