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
      "In a world where monsters roam, a terminally ill woman and her monster-hunting lover grapple with the fleeting nature of time and love, only to face a transformative and tragic twist.",
    image:
      "https://s3.amazonaws.com/static.rogerebert.com/uploads/review/primary_image/reviews/abraham-lincoln-vampire-hunter-2012/EB20120620REVIEWS120629989AR.jpg",
    datePublished: "20June2024",
    link: "/my-x-the-vampire-slayer",
  },
  {
    title: "Android Tragedy",
    contributors: ["Noah Perkins"],
    timeToRead: 13,
    genres: ["Science Fiction", "Romance", "16+"],
    description: "Ha! You wish there was a summary ready.",
    image: "https://img.freepik.com/premium-photo/woman-rain_869640-17071.jpg",
    datePublished: "23Aug2024",
    link: "/android-tragedy",
  },
];
