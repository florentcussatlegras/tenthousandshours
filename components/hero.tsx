import Image from "next/image";
import SearchBarHomepage from "./search-bar-homepage";

interface HeroProps {
    imageUrl: string,
    imageAlt: string,
}

export const Hero = (props: HeroProps) => {
  return (
    <div className="flex flex-row w-full h-full items-stretch justify-center flex-1/2">
        <div className="hidden flex-1/2 items-center md:flex justify-center">
            <Image
                src={props.imageUrl}
                alt={props.imageAlt}
                width={700}
                height={700}
                style={{ objectFit: "cover" }}
            /> 
        </div>
        <div className="flex-1/2">
              <SearchBarHomepage />
        </div>
    </div>
  )
}
