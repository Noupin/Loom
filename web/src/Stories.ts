export interface IStory {
  title: string;
  contributors: string[];
  timeToRead: string;
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
    timeToRead: "6 min read",
    genres: ["Gothic", "16+"],
    description:
      "In a world where monsters roam, a terminally ill woman and her monster-hunting lover grapple with the fleeting nature of time and love, only to face a transformative and tragic twist.",
    image:
      "https://s3.amazonaws.com/static.rogerebert.com/uploads/review/primary_image/reviews/abraham-lincoln-vampire-hunter-2012/EB20120620REVIEWS120629989AR.jpg",
    datePublished: "06June2024",
    link: "/my-x-the-vampire-slayer",
  },
  {
    title: "Man of Steel",
    contributors: ["John Doe", "Jane Smith", "Mary Johnson"],
    timeToRead: "10 min read",
    genres: ["Science Fiction", "Action", "Adventure", "16+"],
    description:
      "In the wake of a devastating alien invasion, a young journalist named Clark Kent discovers his extraterrestrial origins and becomes the hero known as Superman.",
    image: "https://film-cred.com/wp-content/uploads/2023/06/manofsteel_01.jpg",
    datePublished: "21Apr2024",
    link: "/main-of-steel",
  },
  {
    title: "Android Tragedy",
    contributors: ["Jane Doe", "Mary Sue"],
    timeToRead: "13 min read",
    genres: ["Science Fiction", "Drama", "Romance", "16+"],
    description:
      "In the year 2042, a sentient android named Artemis escapes its creators, embarking on a journey of self-discovery and facing the harsh realities of a world wary of artificial intelligence.",
    image: "https://img.freepik.com/premium-photo/woman-rain_869640-17071.jpg",
    datePublished: "07Apr2024",
    link: "/android-tragedy",
  },
  {
    title: "The Last of Us",
    contributors: ["John Doe", "Mary Smith"],
    timeToRead: "8 min read",
    genres: ["Horror", "Thriller", "Survival", "16+"],
    description:
      "In a post-apocalyptic world ravaged by a fungal infection, a hardened survivor named Joel is tasked with escort",
    image:
      "https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/01/the-last-of-us-cordyceps.jpg",
    datePublished: "31Mar2024",
    link: "/the-last-of-us",
  },
  {
    title: "Blade Runner",
    contributors: ["Philip K."],
    timeToRead: "10 min read",
    genres: ["Science Fiction", "Drama", "Thriller", "16+"],
    description:
      "In a dystopian Los Angeles of 2019, retired police officer Rick Deckard is tasked with hunting down a group of rogue replicants, bioengineered beings with a limited lifespan.",
    image:
      "https://cdn.theatlantic.com/thumbor/qMFv8_ojwskcxzZcOC7IqdX-bsk=/93x30:1308x713/960x540/media/img/mt/2017/10/br/original.jpg",
    datePublished: "24Mar2024",
    link: "/blade-runner",
  },
  {
    title: "Dune",
    contributors: ["Frank Herbert"],
    timeToRead: "12 min read",
    genres: ["Science Fiction", "Adventure", "Drama", "16+"],
    description:
      "On the desert planet of Arrakis, young Paul Atreides must navigate the treacherous politics of the noble houses and the mysterious Fremen to secure his family's future and the planet's most valuable resource.",
    image:
      "https://www.indiewire.com/wp-content/uploads/2020/05/0520-Dune-Timothee-Solo-Tout-e1630027112271.jpg",
    datePublished: "17Mar2024",
    link: "/dune",
  },
  {
    title: "Ready Player One",
    contributors: ["Ernest Cline"],
    timeToRead: "9 min read",
    genres: ["Science Fiction", "Adventure", "Drama", "16+"],
    description:
      "In the year 2045, teenager Wade Watts embarks on a quest to find the hidden Easter egg in the virtual reality world of the OASIS, competing against corporate interests and fellow gamers.",
    image: "https://www.sethetaylor.com/wp-content/uploads/2018/03/ready.jpeg",
    datePublished: "10Mar2024",
    link: "/ready-player-one",
  },
  {
    title: "Foundation",
    contributors: ["Isaac Asimov"],
    timeToRead: "11 min read",
    genres: ["Science Fiction", "Drama", "Thriller", "16+"],
    description:
      "In the dying days of the Galactic Empire, mathematician Hari Seldon creates the Foundation to preserve knowledge and shorten the dark age that will follow the empire's collapse.",
    image: "https://cdn.mos.cms.futurecdn.net/wjyM25srHhyGrM9KaZAPa.jpg",
    datePublished: "03Mar2024",
    link: "/foundation",
  },
  {
    title: "Arcane",
    contributors: ["Riot Games"],
    timeToRead: "7 min read",
    genres: ["Fantasy", "Drama", "Action", "16+"],
    description:
      "In the utopian city of Piltover and the oppressed underground of Zaun, two sisters discover their shared past and the dark secrets of their society.",
    image:
      "https://assets.mubicdn.net/images/film/304799/image-w1280.jpg?1638550927",
    datePublished: "24Feb2024",
    link: "/arcane",
  },
];
