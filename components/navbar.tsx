// import {
//   Navbar as HeroUINavbar,
//   NavbarContent,
//   NavbarMenu,
//   NavbarMenuToggle,
//   NavbarBrand,
//   NavbarItem,
//   NavbarMenuItem,
// } from "@heroui/navbar";

// import { Button } from "@heroui/button";
// import { Kbd } from "@heroui/kbd";
// import { Link } from "@heroui/link";
// import { Input } from "@heroui/input";
// import { link as linkStyles } from "@heroui/theme";
// import NextLink from "next/link";
// import clsx from "clsx";

// import { siteConfig } from "@/config/site";
// import { ThemeSwitch } from "@/components/theme-switch";
// import {
//   TwitterIcon,
//   GithubIcon,
//   DiscordIcon,
//   HeartFilledIcon,
//   SearchIcon,
//   Logo,
// } from "@/components/icons";
// import { headers } from "next/headers";
// import { auth } from "@/app/lib/auth";
// import { SignOutButton } from "@/app/auth/sign-out/sign-out-button";

// export const AcmeLogo = () => {
//   return (
//     <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
//       <path
//         clipRule="evenodd"
//         d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
//         fill="currentColor"
//         fillRule="evenodd"
//       />
//     </svg>
//   );
// };

// export async function Navbar() {

//   const headerList = await headers();

//   const session = await auth.api.getSession({
//     headers: headerList,
//   });

//   return (
//     <div className="container mx-auto border">
//       <HeroUINavbar>
//         <NavbarBrand>
//           <AcmeLogo />
//           <p className="font-bold text-inherit">Ten Thousands Hours</p>
//         </NavbarBrand>
//         <NavbarContent className="hidden sm:flex gap-4" justify="center">
//           <NavbarItem>
//             <Link color="foreground" href="#">
//               Features
//             </Link>
//           </NavbarItem>
//           <NavbarItem isActive>
//             <Link aria-current="page" href="#">
//               Customers
//             </Link>
//           </NavbarItem>
//           <NavbarItem>
//             <Link color="foreground" href="#">
//               Integrations
//             </Link>
//           </NavbarItem>
//         </NavbarContent>
//         <ThemeSwitch />
//         {session !== null ? (
//           <NavbarContent justify="end">
//             <NavbarItem className="hidden lg:flex">
//               <SignOutButton />
//             </NavbarItem>
//           </NavbarContent>
//         ) : (
//           <NavbarContent justify="end">
//             <NavbarItem className="hidden lg:flex">
//               <Button as={Link} color="primary" variant="bordered" href="/auth/sign-in" radius="sm">
//                 CONNEXION
//               </Button>
//             </NavbarItem>
//             <NavbarItem>
//               <Button as={Link} color="primary" href="/auth/sign-up" radius="sm">
//                 INSCRIPTION
//               </Button>
//             </NavbarItem>
//           </NavbarContent>
//         )}
//       </HeroUINavbar>
//     </div>
//   );
// }

"use client";

import { SignOutButton } from "@/app/auth/sign-out/sign-out-button";
import { useSession } from "@/app/lib/auth-client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@heroui/react";
import { ThemeSwitch } from "./theme-switch";
import { GithubIcon } from "./icons";
import { Calendar, GraduationCap, HelpCircle, LogOut, Mail, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCurrentStudySession } from "@/app/actions/actions";
import { CurrentStudySession } from "./current-study-session";

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

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export const UserIcon = ({}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-user-icon lucide-user text-sky-500 border"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export default function NavBarPage() {
  const { data: session } = useSession();

  console.log(session?.user.id);

  return (
    <Navbar
      className="bg-white dark:bg-black/90 p-0 m-0"
      maxWidth="2xl"
      classNames={{ wrapper: "px-0" }}
    >
      <NavbarContent className="w-1/3">
        <NavbarBrand>
          <Link href="/" className="text-default-600">
            <AcmeLogo />
            <p className="hidden sm:block font-bold text-default-600 text-xl">
              Ten Thousands Hours
            </p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="flex-row flex-nowrap items-center data-[justify=start]:justify-start data-[justify=start]:flex-grow data-[justify=start]:basis-0 data-[justify=center]:justify-center data-[justify=end]:justify-end data-[justify=end]:flex-grow data-[justify=end]:basis-0 bg-content2 dark:bg-content1 ml-4 hidden h-12 w-full max-w-fit gap-4 rounded-full px-4 sm:flex"
        data-justify="start"
      >
        <NavbarItem className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary">
          <Link
            className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
            href="/profile"
            data-react-aria-pressable="true"
            role="link"
          >
            <GraduationCap />
            Mes apprentissages
          </Link>
        </NavbarItem>
        <NavbarItem
          className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary"
          // data-active="true"
        >
          <Link
            className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
            href="/scheduler"
            data-react-aria-pressable="true"
            role="link"
            aria-current="page"
          >
            <Calendar />
            Votre calendrier
          </Link>
        </NavbarItem>
        <NavbarItem
          className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary"
          // data-active="true"
        >
          <Link
            className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
            href="#"
            data-react-aria-pressable="true"
            role="link"
            aria-current="page"
          >
            <HelpCircle />
            Qui sommes-nous?
          </Link>
        </NavbarItem>
        <NavbarItem className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary">
          <Link
            className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
            href="/contact"
            data-react-aria-pressable="true"
            role="link"
          >
            <Mail />
            Nous contacter
          </Link>
        </NavbarItem>
      </NavbarContent>

      {session !== null ? (
        <NavbarContent justify="end">
          <GithubIcon />
          <ThemeSwitch />
          <Link href="/settings">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-settings-icon lucide-settings text-default-500"
            >
              <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
          {/* <Input
              classNames={{
                base: "max-w-full sm:max-w-[10rem] h-10",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              placeholder="Type to search..."
              size="sm"
              startContent={<SearchIcon size={18} />}
              type="search"
            /> */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              {session.user.image ? (
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform cursor-pointer"
                  color="primary"
                  name="Jason Hughes"
                  size="sm"
                  src={session.user.image}
                />
              ) : (
                <button className="w-10 h-10 rounded-full border flex items-center justify-center bg-sky-500 text-white cursor-pointer">
                  {session.user.name.slice(0, 1)}
                </button>
              )}
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="gap-2 bg-default-200 flex flex-row">
                <Link href="/profile" className="font-semibold text-sky-500 text-md items-center gap-1">
                  <User />
                  {session.user.email}
                </Link>
              </DropdownItem>
              <DropdownItem key="settings">
                <Link href="/settings" className="text-md gap-1 text-black">
                  <Settings />
                  Mes paramètres
                </Link>
              </DropdownItem>
              <DropdownItem key="contact">
                <Link href="/profile" className="text-md gap-1 text-black">
                  <HelpCircle />
                  Aide
                </Link>
              </DropdownItem>
              <DropdownItem key="contact">
                <Link href="/profile" className="text-md gap-1 text-black">
                  <Mail />
                  Nous contacter
                </Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                <SignOutButton />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <GithubIcon />
          <ThemeSwitch />
          <NavbarItem className="hidden lg:flex">
            <Button
              as={Link}
              className="border-2 border-sky-500 text-sky-500 font-bold dark:border-default-500 dark:text-white"
              variant="bordered"
              href="/auth/sign-in"
              radius="sm"
            >
              CONNEXION
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              className="bg-sky-500 text-white font-bold dark:bg-default-500 dark:text-white"
              href="/auth/sign-up"
              radius="sm"
            >
              INSCRIPTION
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
