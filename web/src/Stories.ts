export interface IStory {
  title: string;
  contributors: string[];
  timeToRead: number;
  genres: string[];
  description: string;
  image: string;
  datePublished: string;
  link: string;
}

export const STORIES: IStory[] = [
  {
    title: "My X, the Vampire Slayer",
    contributors: ["Alexandre Cabello", "Noah Perkins"],
    timeToRead: 6,
    genres: ["Gothic", "16+"],
    description:
      "A relentless vampire hunter battles his own physical and emotional wounds, torn between his love for his dying wife and his unyielding quest to eliminate vampires.",
    image:
      "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/dca445d6-e85b-4a14-b31a-5df34fca1ee4/width=1536,quality=90/ComfyUI_00801_2.jpeg",
    datePublished: "23June2024",
    link: "/my-x-the-vampire-slayer",
  },
  {
    title: "Android Tragedy",
    contributors: ["Noah Perkins"],
    timeToRead: 13,
    genres: ["Science Fiction", "Romance", "16+"],
    description: "Ha! You wish there was a summary ready.",
    image: "https://img.freepik.com/premium-photo/woman-rain_869640-17071.jpg",
    datePublished: "undefined",
    link: "/android-tragedy",
  },
  // {
  //   title: "Angel Of Death",
  //   contributors: ["Noah Perkins"],
  //   timeToRead: 13,
  //   genres: ["Science Fiction", "Romance", "16+"],
  //   description: "Ha! You wish there was a summary ready.",
  //   image:
  //     "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/12a08fcb-037a-48ac-8550-661ca3ef5853/width=896,quality=90/ComfyUI_00217_.jpeg",
  //   datePublished: "undefined",
  //   link: "/android-tragedy",
  // },
];
