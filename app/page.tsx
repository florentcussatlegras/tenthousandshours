import { Hero } from "@/components/hero";
import SearchBarHomepage from "@/components/search-bar-homepage";
import * as actions from "@/app/actions/actions";

const urlImageHero = "/illustration-books-and-desk.jpg";

export default async function Home() {
  const topics: any[] = await actions.getListTopics();

  return (
    <section className="flex items-center h-full justify-center gap-4 bg-white dark:bg-black/90">
      <div className="flex flex-row w-full h-full items-stretch justify-center flex-1/2">
        <div className="hidden items-center xl:flex justify-center max-w-7xl mx-auto">
          <Hero
            imageUrl={urlImageHero}
            imageAlt="Books and watches on a desk"
          />
        </div>
        <div className="w-full md:w-2/3 h-full flex flex-col gap-10 items-start justify-center">
          <h1 className="text-5xl font-bold text-default-600 dark:text-white/90">
            Quel domaine souhaitez-vous{" "}
            <span className="text-sky-500">maîtriser</span> ?
          </h1>
          <SearchBarHomepage topics={topics} />
        </div>
      </div>
    </section>
  );
}
