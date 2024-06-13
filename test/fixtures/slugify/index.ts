type Input = {
  name: string;
  prefix?: string;
};
const slugify = ({ name, prefix }: Input): string => {
  const baseSlug = name
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');
  const finalText = prefix ? `${prefix}-${baseSlug}` : baseSlug;

  // Remove leading '-' and trailing '-' from the finalText
  const cleanedText = finalText.replace(/^-+|-+$/g, '');

  return cleanedText;
};

export default slugify;
