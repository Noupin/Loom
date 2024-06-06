import { IStory, STORIES } from "../Stories";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Fuzzy search function
export const fuzzySearchStories = (query: string): IStory[] => {
  const normalizedQuery = normalizeString(query);

  return STORIES.filter((story) => {
    const haystack = `${story.title} ${story.authors} ${story.genres.join(
      " "
    )} ${story.description}`;
    const normalizedHaystack = normalizeString(haystack);
    return normalizedHaystack.includes(normalizedQuery);
  });
};
