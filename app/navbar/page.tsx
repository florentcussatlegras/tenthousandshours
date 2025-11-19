import { cookies, headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { Link } from "@heroui/link";
import { SignOutButton } from "../auth/sign-out/sign-out-button";
import NavBarClient from "./navbar-client";

export const dynamic = "force-dynamic";

export default async function NavBarPage() {
  const h = await headers();
  const c = await cookies();

  // Log basic cookie info
  console.log(">>> SERVER raw header cookie:", String(h.get("cookie")));
  console.log(">>> SERVER cookies list:", c.getAll().map(x => ({
    name: x.name,
    value: x.value
  })));

  // Build real headers object for the lib
  const H = new Headers(h as any);
  for (const ck of c.getAll()) {
    H.append("cookie", `${ck.name}=${ck.value}`);
  }

  // Now test session
  const session = await auth.api.getSession({ headers: H });

  console.log(">>> SERVER session from getSession:", session);

  return <NavBarClient session={session} />;
}
