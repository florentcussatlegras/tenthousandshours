import { title } from "@/components/primitives";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
      <h1 className={title()}>Ajouter une matière</h1>
      <div className="inline-block w-1/2 text-center justify-center">
        {children}
      </div>
    </section>
  );
}
