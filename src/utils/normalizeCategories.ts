export const normalizeCategories = (categories?: string | string[]): string | undefined => {
  if (!categories) return undefined;
  if (typeof categories === 'string') {
    try {
      const parsed = JSON.parse(categories);
      if (Array.isArray(parsed)) return parsed.join(',');
    } catch {
      return categories;
    }
  }
  return Array.isArray(categories) ? categories.join(',') : undefined;
};
