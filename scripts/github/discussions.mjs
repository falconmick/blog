import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function splitRepo(repo = process.env.GITHUB_REPOSITORY) {
  const [owner, name] = (repo ?? '').split('/');

  if (!owner || !name) {
    throw new Error('GITHUB_REPOSITORY must be set to owner/name.');
  }

  return { owner, name };
}

export function graphql(query, fields = {}) {
  const args = ['api', 'graphql', '-f', `query=${query}`];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) {
      continue;
    }

    args.push('-F', `${key}=${value}`);
  }

  const result = spawnSync('gh', args, {
    encoding: 'utf8',
    env: {
      ...process.env,
      GH_TOKEN: process.env.GH_TOKEN || process.env.GITHUB_TOKEN
    }
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'GitHub GraphQL request failed.');
  }

  return JSON.parse(result.stdout);
}

export function readTextFile(path) {
  return readFileSync(path, 'utf8');
}

export function writeTextFile(path, value) {
  writeFileSync(path, value, 'utf8');
}

export function postPathFromDirectory(directory) {
  return join('content', 'posts', directory, 'index.mdx');
}

export function commentsPathFromDirectory(directory) {
  return join('content', 'posts', directory, 'comments.json');
}

export function frontmatterBlock(fileContent) {
  const content = fileContent.replace(/^\uFEFF/, '');

  if (!content.startsWith('---\n')) {
    return null;
  }

  const end = content.indexOf('\n---', 4);

  if (end === -1) {
    return null;
  }

  return {
    bodyStart: end + '\n---'.length,
    frontmatter: content.slice(4, end),
    hadBom: fileContent.startsWith('\uFEFF'),
    original: content
  };
}

export function frontmatterTitle(frontmatter) {
  const match = frontmatter.match(/^title:\s*(.+)$/m);
  const rawTitle = match?.[1]?.trim();

  if (!rawTitle) {
    return null;
  }

  return rawTitle.replace(/^['"]|['"]$/g, '');
}

export function frontmatterDiscussionNumber(frontmatter) {
  const nestedNumber = frontmatter.match(/^discussion:\s*\n(?:  .+\n)*?  number:\s*(\d+)/m)?.[1];
  const flatNumber = frontmatter.match(/^discussionNumber:\s*(\d+)/m)?.[1];
  return nestedNumber ? Number(nestedNumber) : flatNumber ? Number(flatNumber) : null;
}

export function hasDiscussionFrontmatter(frontmatter) {
  return /^discussion:\s*(?:\n|$)/m.test(frontmatter) || /^discussionUrl:/m.test(frontmatter);
}

export function discussionFrontmatter({ id, number, url }) {
  return [`discussion:`, `  id: ${JSON.stringify(id)}`, `  number: ${number}`, `  url: ${JSON.stringify(url)}`].join('\n');
}

export function addDiscussionToPost(content, discussion) {
  const parsed = frontmatterBlock(content);

  if (!parsed) {
    throw new Error('Post does not have frontmatter.');
  }

  if (hasDiscussionFrontmatter(parsed.frontmatter)) {
    return content;
  }

  const updatedFrontmatter = `${parsed.frontmatter.replace(/\s+$/, '')}\n${discussionFrontmatter(discussion)}\n`;
  const updated = `---\n${updatedFrontmatter}---${parsed.original.slice(parsed.bodyStart)}`;
  return parsed.hadBom ? `\uFEFF${updated}` : updated;
}

export function postDirectoryFromPath(path) {
  return path.match(/^content\/posts\/(.+)\/index\.mdx$/)?.[1] ?? null;
}

export function discussionUrl(owner, name, number) {
  return `https://github.com/${owner}/${name}/discussions/${number}`;
}

export function discussionBody({ owner, name, postPath, postUrl }) {
  const sourceUrl = `https://github.com/${owner}/${name}/blob/main/${postPath}`;
  const lines = [
    `Comments for ${postUrl ?? sourceUrl}.`,
    '',
    `Blog post source: ${sourceUrl}`,
    '',
    `<!-- blog-post: ${postPath} -->`
  ];

  return lines.join('\n');
}
