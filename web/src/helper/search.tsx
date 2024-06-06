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

  return [...STORIES].filter((story) => {
    const haystack = `${story.title} ${story.contributors.join(
      " "
    )} ${story.genres.join(" ")} ${story.description}`;
    const normalizedHaystack = normalizeString(haystack);
    return normalizedHaystack.includes(normalizedQuery);
  });
};

export const autoCompleteSearchStories = (
  query: string,
  limit: number
): IStory[] => {
  const normalizedQuery = normalizeString(query);

  return [...STORIES]
    .filter((story) => {
      const normalizedTitle = normalizeString(story.title);
      const contributorsMatch = story.contributors.some((contributor) =>
        normalizeString(contributor).startsWith(normalizedQuery)
      );
      return normalizedTitle.startsWith(normalizedQuery) || contributorsMatch;
    })
    .slice(0, limit);
};
