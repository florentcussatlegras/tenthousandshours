import Image from "next/image";
import SearchBarHomepage from "./search-bar-homepage";

interface HeroProps {
    imageUrl: string,
    imageAlt: string,
}

export const Hero = (props: HeroProps) => {
  return (
    <Image
        src={props.imageUrl}
        alt={props.imageAlt}
        width={700}
        height={700}
        style={{ objectFit: "cover" }}
    /> 
  )
}
