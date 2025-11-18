import { Hero } from "@/components/hero";
import SearchBarHomepage from "@/components/search-bar-homepage";
import * as actions from "@/app/actions/actions";

const urlImageHero = "/illustration-books-and-desk.jpg";

export default async function Home() {
  const topics: any[] = await actions.getListTopics();

  return (
    <section className="flex items-center h-full justify-center gap-4 bg-white dark:bg-black/90 w-full p-0 m-0">
      <div className="flex flex-row w-full h-full items-stretch justify-between gap-8">
        <div className="hidden xl:w-1/2 items-center xl:flex justify-center mx-auto">
          <Hero
            imageUrl={urlImageHero}
            imageAlt="Books and watches on a desk"
          />
        </div>

        <div className="w-full 2xl:w-1/2 h-full flex flex-col gap-10 items-start justify-center">
          <div className="mx-auto flex flex-col gap-4">
            <h1 className="text-5xl xl:text-4xl 2xl:text-5xl font-bold text-default-600 dark:text-white/90 text-wrap">
              Quel domaine souhaitez-vous{" "}
              <span className="text-sky-500">maîtriser</span> ?
            </h1>
            <SearchBarHomepage topics={topics} />
          </div>
        </div>
      </div>
    </section>
  );
}
