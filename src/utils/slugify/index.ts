import { faker } from '@faker-js/faker';

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

const randomSlug = (): string => slugify({
  name: [
    faker.word.adjective(), faker.color.human(), faker.animal.type(),
  ].join(' '),
});

slugify.random = randomSlug;

export default slugify;
