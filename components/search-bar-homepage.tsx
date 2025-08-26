import {Card, Input} from "@heroui/react";
import { useState } from "react";
import Trie from "@/app/lib/trie";
import Link from "next/link";

const dictionary = {
  words: ['hello','helium','world','car','carpet','test','this','that','those','working','is']
}

export const SearchIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

export default function SearchBarHomepage() {
  const [prefix, setPrefix] = useState("");
  const [suggestion, setSuggestion] = useState("");

  var myTrie = new Trie();

  (async()=>{
    // const dictionary = await getWords();
    const words = dictionary.words;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        myTrie.insert(word)
    }
  })();

  const onChange = (e) => {
    var value = e.target.value;
    setPrefix(value);
    var words = value.split(" ");
    var trie_prefix = words[words.length - 1].toLowerCase();
    var found_words = myTrie.find(trie_prefix).sort((a, b) => {
      return a.length - b.length;
    });
    var first_word = found_words[0];
    if (
      found_words.length !== 0 &&
      value !== "" &&
      value[value.length - 1] !== " "
    ) {
      if (first_word != null) {
        var remainder = first_word.slice(trie_prefix.length);
        setSuggestion(value + remainder);
      }
    } else {
      setSuggestion(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 39) {
      setPrefix(suggestion);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-10 items-start justify-center pr-12">
      <h1 className="text-5xl font-bold text-sky-500 dark:text-white/90">Quelle matière voulez-vous maitriser?</h1>
      {/* <Input
        name="search-bar"
        id="search-bar"
        isClearable
        classNames={{
          label: "uppercase text-xl text-black/90 dark:text-white/90",
          input: [
            "bg-transparent absolute top-0",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ], 
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-sm",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focus=true]:bg-default-200/50",
            "dark:group-data-[focus=true]:bg-default/60",
            "cursor-text!",
          ],
        }}
        label="Choisissez la matière que vous souhaitez étudier"
        placeholder="Exple: saxophone, javascript, céramique..."
        size="lg"
        radius="full"
        labelPlacement="outside-top"
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none shrink-0" />
        }
        value={prefix}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <Input
        type="text"
        name="search-bar"
        id="search-bar2"
        value={suggestion}
        classNames={{
          input: "-z-10"
        }}
      /> */}
      <div className="w-full relative place-items-center grid">
        <input
          type="text"
          name="search-bar"
          id="search-bar"
          placeholder="Exple: saxophone, javascript, maçonnerie..."
          value={prefix}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="bg-transparent wrap-break-word rounded-full absolute w-full h-16 px-10 outline-0 text-black/90 dark:text-white/90 shadow-md cursor-text"
        />
        <input
          type="text"
          name="search-bar"
          id="search-bar2"
          value={suggestion}
          className="text-gray-500 cursor-none h-16 px-10 w-full rounded-full bg-white"
          style={{ "border": "1px solid #EAF5F8" }}
        />
      </div>
      <button className="bg-sky-500 text-white px-8 py-4 text-xl font-bold rounded-xl cursor-pointer">
        <Link href="#">C'est parti !</Link>
      </button>
    </div>
  );
}
