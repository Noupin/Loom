export const formatContributors = (contributors: string[]): string => {
  if (contributors.length === 1) {
    return contributors[0];
  }
  const lastContributor = contributors.pop();
  return `${contributors.join(", ")} & ${lastContributor}`;
};
