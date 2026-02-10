import slugify from '@sindresorhus/slugify';

const DATE_PREFIX_REGEX = /^\d{4}-\d{1,2}-\d{1,2}-/;

const removeIndexSuffix = (id: string) => id.replace(/\/index$/, '');

const getRelativeDirectory = (id: string) => {
  const normalizedId = removeIndexSuffix(id);
  const parts = normalizedId.split('/').filter(Boolean);

  return parts[parts.length - 1] ?? normalizedId;
};

const getPostSlug = (id: string, frontmatterSlug?: string) => {
  if (frontmatterSlug) {
    return frontmatterSlug;
  }

  const relativeDirectory = getRelativeDirectory(id);
  const relativeDirectoryWithoutDate = relativeDirectory.replace(DATE_PREFIX_REGEX, '');

  return slugify(relativeDirectoryWithoutDate);
};

const getPostYearMonth = (date: Date) => {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  return { year, month };
};

export const getLegacyBlogPostPath = ({
  id,
  date,
  frontmatterSlug,
}: {
  id: string;
  date: Date;
  frontmatterSlug?: string;
}) => {
  const slug = getPostSlug(id, frontmatterSlug);
  const { year, month } = getPostYearMonth(date);

  return `/blog/${year}/${month}/${slug}/`;
};
