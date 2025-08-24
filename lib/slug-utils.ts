export const generateSlug = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/&/g, 'and') // Replace ampersands
    .replace(/[^\w\s-]/g, '') // Remove all non-word, non-space, non-hyphen chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
};


