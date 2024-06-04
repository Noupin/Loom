import { STORIES } from "../Stories";

export const getPreviousStoryIdx = (currentIndex: number) => {
  return (currentIndex - 1 + STORIES.length) % STORIES.length;
};

export const getNextStoryIdx = (currentIndex: number) => {
  return (currentIndex + 1) % STORIES.length;
};
