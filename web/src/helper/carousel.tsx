export const getPreviousStoryIdx = (currentIndex: number, arr: any[]) => {
  return (currentIndex - 1 + arr.length) % arr.length;
};

export const getNextStoryIdx = (currentIndex: number, arr: any[]) => {
  return (currentIndex + 1) % arr.length;
};
