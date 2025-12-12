// app/verify-email/page.tsx
export const dynamic = "force-dynamic"; // <-- must be in a server component
export const fetchCache = "force-no-store";

import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  // Server component: just renders the client component
  return <VerifyEmailClient />;
}
