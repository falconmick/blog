import { mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import { commentsPathFromDirectory, frontmatterBlock, frontmatterDiscussionNumber, graphql, postDirectoryFromPath, readTextFile, splitRepo, writeTextFile } from './discussions.mjs';

const discussionNumber = Number(process.env.DISCUSSION_NUMBER ?? process.env.GITHUB_EVENT_DISCUSSION_NUMBER);

if (!Number.isInteger(discussionNumber) || discussionNumber <= 0) {
  throw new Error('DISCUSSION_NUMBER must be set to the GitHub Discussion number.');
}

const { owner, name } = splitRepo();

function findPostDirectory() {
  for (const path of postIndexFiles('content/posts')) {
    const content = readTextFile(path);
    const parsed = frontmatterBlock(content);

    if (parsed && frontmatterDiscussionNumber(parsed.frontmatter) === discussionNumber) {
      return postDirectoryFromPath(path);
    }
  }

  return null;
}

function postIndexFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const path = `${directory}/${entry}`;
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...postIndexFiles(path));
    } else if (path.endsWith('/index.mdx')) {
      files.push(path);
    }
  }

  return files;
}

const postDirectory = findPostDirectory();
const discussionQuery = `
  query($owner: String!, $name: String!, $number: Int!, $after: String) {
    repository(owner: $owner, name: $name) {
      discussion(number: $number) {
        body
        comments(first: 100, after: $after) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            id
            body
            url
            createdAt
            updatedAt
            author {
              login
              avatarUrl
              url
            }
            replies(first: 100) {
              nodes {
                id
                body
                url
                createdAt
                updatedAt
                author {
                  login
                  avatarUrl
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

let targetPostDirectory = postDirectory;
let after = '';
const comments = [];

function toCommentEntry(comment, replyToId) {
  return {
    id: comment.id,
    username: comment.author?.login ?? 'ghost',
    avatarUrl: comment.author?.avatarUrl ?? 'https://github.com/ghost.png',
    authorUrl: comment.author?.url ?? 'https://github.com/ghost',
    url: comment.url,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    replyToId,
    body: comment.body
  };
}

do {
  const data = graphql(discussionQuery, { owner, name, number: discussionNumber, after: after || undefined });
  const discussion = data.data.repository.discussion;

  if (!discussion) {
    throw new Error(`Discussion #${discussionNumber} was not found.`);
  }

  if (!targetPostDirectory) {
    targetPostDirectory = postDirectoryFromPath(discussion.body.match(/<!--\s*blog-post:\s*(content\/posts\/.+?\/index\.mdx)\s*-->/)?.[1] ?? '');
  }

  for (const comment of discussion.comments.nodes) {
    comments.push(toCommentEntry(comment));

    for (const reply of comment.replies.nodes) {
      comments.push(toCommentEntry(reply, comment.id));
    }
  }

  after = discussion.comments.pageInfo.hasNextPage ? discussion.comments.pageInfo.endCursor : '';
} while (after);

if (!targetPostDirectory) {
  console.log(`No post frontmatter or discussion body marker references discussion #${discussionNumber}. Nothing to sync.`);
  process.exit(0);
}

const outputPath = commentsPathFromDirectory(targetPostDirectory);
mkdirSync(dirname(outputPath), { recursive: true });
writeTextFile(outputPath, `${JSON.stringify(comments, null, 2)}\n`);
console.log(`Synced ${comments.length} comments to ${outputPath}.`);
