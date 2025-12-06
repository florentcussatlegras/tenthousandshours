import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Geist } from "next/font/google";
import { CurrentStudySession } from "@/components/current-study-session";
import NavBarPage from "./navbar/page";
import { headers } from "next/headers";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          // fontSans.variable,
          geist.className
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <NavBarPage />
            <main className="mx-auto pt-8 px-6 flex-grow w-full">
              <div className="container mx-auto max-w-[1536px]">
                {/* <CurrentStudySession /> */}
              </div>
              {children}
            </main>
            <footer className="w-full bg-background border-t border-default-100 mt-10">
              <div className="max-w-[1536px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
                {/* Colonne 1 */}
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold text-lg">Ten Thousands Hours</h4>
                  <p className="text-sm text-foreground/70">
                    Progressez, apprenez et maîtrisez n'importe quel domaine
                    grâce à la pratique.
                  </p>
                </div>

                {/* Colonne 2 */}
                <div className="flex flex-col gap-2">
                  <h5 className="font-semibold text-sm mb-1">Navigation</h5>
                  <Link
                    href="/"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Accueil
                  </Link>
                  <Link
                    href="/topics"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Sujets
                  </Link>
                </div>

                {/* Colonne 3 */}
                <div className="flex flex-col gap-2">
                  <h5 className="font-semibold text-sm mb-1">Légal</h5>
                  <Link
                    href="/terms"
                    className="text-foreground/70 hover:text-primary text-sm"
                  >
                    Conditions
                  </Link>
                </div>
              </div>

              <div className="text-center py-4 border-t border-default-100 text-sm text-foreground/60">
                © {new Date().getFullYear()} Ten Thousands Hours. Tous droits
                réservés.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
