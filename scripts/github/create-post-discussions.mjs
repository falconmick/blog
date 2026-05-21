import { readTextFile, writeTextFile, splitRepo, graphql, postPathFromDirectory, postDirectoryFromPath, frontmatterBlock, frontmatterTitle, hasDiscussionFrontmatter, addDiscussionToPost, discussionBody } from './discussions.mjs';

const TRUSTED_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);
const categoryName = process.env.DISCUSSION_CATEGORY_NAME ?? 'Comments';
const blogBaseUrl = process.env.BLOG_BASE_URL?.replace(/\/$/, '');
const prNumber = Number(process.env.PR_NUMBER ?? process.env.GITHUB_EVENT_PULL_REQUEST_NUMBER);

if (!Number.isInteger(prNumber) || prNumber <= 0) {
  throw new Error('PR_NUMBER must be set to the merged pull request number.');
}

const { owner, name } = splitRepo();

const pullRequestQuery = `
  query($owner: String!, $name: String!, $number: Int!) {
    repository(owner: $owner, name: $name) {
      id
      pullRequest(number: $number) {
        merged
        baseRefName
        authorAssociation
        files(first: 100) {
          nodes {
            path
          }
        }
      }
    }
  }
`;

const pullRequestData = graphql(pullRequestQuery, { owner, name, number: prNumber });
const repository = pullRequestData.data.repository;
const pullRequest = repository.pullRequest;

if (!pullRequest?.merged || pullRequest.baseRefName !== 'main') {
  console.log('Pull request was not merged into main. Nothing to do.');
  process.exit(0);
}

if (!TRUSTED_ASSOCIATIONS.has(pullRequest.authorAssociation)) {
  console.log(`Pull request author association ${pullRequest.authorAssociation} is not trusted for discussion creation.`);
  process.exit(0);
}

const postDirectories = pullRequest.files.nodes
  .map((file) => postDirectoryFromPath(file.path))
  .filter(Boolean);

if (postDirectories.length === 0) {
  console.log('No post index.mdx files changed in the merged pull request.');
  process.exit(0);
}

const categoriesQuery = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      discussionCategories(first: 25) {
        nodes {
          id
          name
        }
      }
    }
  }
`;

const categoriesData = graphql(categoriesQuery, { owner, name });
const category = categoriesData.data.repository.discussionCategories.nodes.find(
  (node) => node.name.toLowerCase() === categoryName.toLowerCase()
);

if (!category) {
  throw new Error(`Could not find a GitHub Discussions category named "${categoryName}".`);
}

const createDiscussionMutation = `
  mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
    createDiscussion(input: {repositoryId: $repositoryId, categoryId: $categoryId, title: $title, body: $body}) {
      discussion {
        id
        number
        url
      }
    }
  }
`;

for (const directory of [...new Set(postDirectories)]) {
  const postPath = postPathFromDirectory(directory);
  const content = readTextFile(postPath);
  const parsed = frontmatterBlock(content);

  if (!parsed) {
    throw new Error(`${postPath} does not have valid frontmatter.`);
  }

  if (hasDiscussionFrontmatter(parsed.frontmatter)) {
    console.log(`${postPath} already has discussion frontmatter.`);
    continue;
  }

  const title = frontmatterTitle(parsed.frontmatter);

  if (!title) {
    throw new Error(`${postPath} is missing a title.`);
  }

  const directoryMatch = directory.match(/^(\d{4})-(\d{1,2})-\d{1,2}-(.+)$/);
  const postUrl = blogBaseUrl && directoryMatch
    ? `${blogBaseUrl}/blog/${directoryMatch[1]}/${directoryMatch[2].padStart(2, '0')}/${directoryMatch[3].replace(/\./g, '-').toLowerCase()}/`
    : undefined;
  const created = graphql(createDiscussionMutation, {
    repositoryId: repository.id,
    categoryId: category.id,
    title,
    body: discussionBody({ owner, name, postPath, postUrl })
  }).data.createDiscussion.discussion;

  writeTextFile(postPath, addDiscussionToPost(content, created));
  console.log(`Created discussion ${created.url} for ${postPath}.`);
}
