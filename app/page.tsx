import { Hero } from "@/components/hero";
import SearchBarHomepage from "@/components/search-bar-homepage";
import * as actions from "@/app/actions/actions";

const urlImageHero = '/illustration-books-and-desk.jpg';

export default async function Home() {

  const topics = await actions.getListTopics();

  return (
    <section className="flex items-center h-full justify-center gap-4 bg-white dark:bg-black/90">
      <div className="flex flex-row w-full h-full items-stretch justify-center flex-1/2">
          <div className="hidden flex-1/2 items-center md:flex justify-center">
              <Hero imageUrl={urlImageHero} imageAlt="Books and watches on a desk" />
          </div>
          <div className="flex-1/2">
              <SearchBarHomepage topics={topics} />
          </div>
      </div>
    </section>
  );
}
