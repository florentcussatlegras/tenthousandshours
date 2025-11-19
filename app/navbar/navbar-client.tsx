// "use client";

// default function UserMenuClient({ session }: {session: any}) {
//   const { data, isPending } = useSession();

//   // On utilise la session client si disponible, sinon celle du serveur
//   const finalSession = data ?? session;

//   if (!finalSession && isPending) return null;

//   return finalSession ? (
//     <div>Bonjour {finalSession.user.name}</div>
//   ) : (
//     <div>Connexion</div>
//   );
// }

"use client";

import { SignOutButton } from "@/app/auth/sign-out/sign-out-button";

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
import { ThemeSwitch } from "../../components/theme-switch";
import { GithubIcon } from "../../components/icons";
import {
  Calendar,
  GraduationCap,
  HelpCircle,
  LogOut,
  Menu,
  Mail,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchCurrentStudySession } from "@/app/actions/actions";
import { CurrentStudySession } from "../../components/current-study-session";
import { useSession } from "@/app/lib/auth-client";

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
  width = null,
  height = null,
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

export default function NavBarClient({ session }: { session: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, isPending } = useSession();

  // On utilise la session client si disponible, sinon celle du serveur
  const finalSession = data ?? session;

  if (!finalSession && isPending) return null;

  return (
    <>
      <Navbar
        classNames={{
          base: "w-full px-2 2xl:px-0", // enleve padding du <nav>
          wrapper: "w-full px-2 2xl:px-0", // enleve padding du wrapper interne
        }}
        maxWidth="full" // IMPORTANT : sinon HeroUI remet un max-w + centrage
        className="bg-white dark:bg-black/90 max-w-[1536px] mx-auto"
      >
        <NavbarContent className="md:hidden" justify="start">
          <button className="p-2" onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </NavbarContent>

        <NavbarBrand className="hidden md:flex md:w-1/10 md:max-w-1/10 lg:w-1/5 lg:min-w-1/5">
          <Link href="/" className="text-default-600 hidden md:flex">
            <AcmeLogo />
            <p className="hidden lg:flex font-bold text-default-600 text-xl">
              Ten Thousand Hours
            </p>
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarContent className="flex-row flex-nowrap items-center bg-content2 dark:bg-content1 hidden h-12 w-full max-w-fit gap-4 rounded-full px-4 md:flex">
            <NavbarItem className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary">
              <Link
                className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                href="/profile"
                data-react-aria-pressable="true"
                role="link"
              >
                <GraduationCap />
                <span className="hidden xl:block">Mes apprentissages</span>
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
                <span className="hidden xl:block">Votre calendrier</span>
              </Link>
            </NavbarItem>
            <NavbarItem
              className="text-medium whitespace-nowrap box-border list-none data-[active=true]:font-semibold data-[active=true]:text-primary"
              // data-active="true"
            >
              <Link
                className="relative items-center tap-highlight-transparent outline-solid outline-transparent data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-medium no-underline hover:opacity-hover active:opacity-disabled transition-opacity flex gap-2 text-inherit"
                href="/about"
                data-react-aria-pressable="true"
                role="link"
                aria-current="page"
              >
                <HelpCircle />
                <span className="hidden 2xl:block">Qui sommes-nous?</span>
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
                <span className="hidden 2xl:block">Nous contacter</span>
              </Link>
            </NavbarItem>
          </NavbarContent>
          {finalSession?.user ? (
            <>
              <CurrentStudySession />
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
                  {finalSession.user.image ? (
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform cursor-pointer"
                      color="primary"
                      name="Jason Hughes"
                      size="sm"
                      src={finalSession.user.image}
                    />
                  ) : (
                    <button className="w-10 h-10 rounded-full border flex items-center justify-center bg-sky-500 text-white cursor-pointer">
                      {finalSession.user.name.slice(0, 1)}
                    </button>
                  )}
                </DropdownTrigger>
                <DropdownMenu aria-label="profil" variant="flat">
                  <DropdownItem
                    key="profile"
                    className="gap-2 bg-default-200 flex flex-row"
                  >
                    <Link
                      href="/profile"
                      className="font-semibold text-sky-500 text-md items-center gap-1"
                    >
                      <User />
                      {finalSession.user.email}
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="settings">
                    <Link href="/settings" className="text-md gap-1 text-black">
                      <Settings />
                      Mes paramètres
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="about">
                    <Link href="/contact" className="text-md gap-1 text-black">
                      <HelpCircle />
                      Aide
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="contact">
                    <Link href="/about" className="text-md gap-1 text-black">
                      <Mail />
                      Nous contacter
                    </Link>
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    <SignOutButton />
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <GithubIcon />
              <ThemeSwitch />
              <div className="hidden md:flex gap-2">
                <NavbarItem>
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
              </div>
            </>
          )}
        </NavbarContent>
      </Navbar>

      {/* ===== SIDEBAR MOBILE ===== */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white dark:bg-neutral-900 shadow-xl z-50 
          transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <p className="font-bold text-lg">Menu</p>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-col py-4 gap-4 px-4 text-lg">
          <Link href="/profile" className="flex items-center gap-2">
            <GraduationCap /> Mes apprentissages
          </Link>

          <Link href="/scheduler" className="flex items-center gap-2">
            <Calendar /> Votre calendrier
          </Link>

          <Link href="/about" className="flex items-center gap-2">
            <HelpCircle /> Qui sommes-nous ?
          </Link>

          <Link href="/contact" className="flex items-center gap-2">
            <Mail /> Nous contacter
          </Link>

          {!session && (
            <>
              <Link href="/auth/sign-in" className="mt-4 font-semibold">
                Connexion
              </Link>
              <Link href="/auth/sign-up" className="font-semibold">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
