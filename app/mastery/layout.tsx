"use client";

export default function MasteryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-start py-0 md:py-10 max-w-[1536] mx-auto">
      {children}
    </section>
  );
}