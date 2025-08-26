import { Hero } from "@/components/hero";

const urlImageHero = '/illustration-books-and-desk.jpg';

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section className="flex items-center h-full justify-center gap-4 bg-white">
        <div className="flex flex-row w-full h-full items-stretch justify-center flex-1/2">
            <div className="hidden flex-1/2 items-center md:flex justify-center">
                <Hero imageUrl={urlImageHero} imageAlt="Books and watches on a desk" />
            </div>
            <div className="flex-1/2 items-center flex">
                {children}
            </div>
        </div>
      </section>
    );
}
