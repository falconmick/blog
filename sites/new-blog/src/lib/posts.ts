import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'posts'>;
export interface ManualPost {
  id: string;
  data: {
    title: string;
    date: Date;
    excerpt?: string;
    image?: string;
    caption?: string;
    tags?: string[];
    videoSrcURL?: string;
    videoTitle?: string;
    embeddedImagesLocal?: string[];
  };
}

export interface BlogPostView {
  post: BlogPost | ManualPost;
  slug: string;
  url: string;
  imageUrl?: string;
  embeddedImageUrls: string[];
  manualContent?: string;
}

const POSTS_PER_PAGE = 5;

const imageModules = import.meta.glob('../../../blog/content/posts/**/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  import: 'default',
  query: '?url'
}) as Record<string, string>;

export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const manualPosts: BlogPostView[] = [
  {
    post: {
      id: '2026-04-09-setup-fvdb-ubuntu-22-04/index',
      data: {
        title: 'Setting up Ubuntu 22.04 to run fVDB Reality Capture',
        date: new Date('2026-04-09'),
        excerpt: 'Got a macOS and want to do Gaussian splatting? Hosted GPU as a service is the best way!',
        tags: ['gaussian-splat', 'ubuntu']
      }
    },
    slug: 'setup-fvdb-ubuntu-22-04',
    url: '/blog/2026/04/setup-fvdb-ubuntu-22-04/',
    imageUrl: 'https://www.mcrook.com/static/683eecc4bc035db938c9d32f78d88370/7f832/house-splat.png',
    embeddedImageUrls: [],
    manualContent: `
      <pre><code class="language-html">&lt;!-- This post is a work in progress, please excuse the mess --&gt;</code></pre>
      <p>I found myself wanting to dabble in Gaussian splats but at the same time not wanting to have to buy a GPU (with prices how they are!) so instead of following the typical flow for Gaussian splatters' and starting on a gaming GPU and working my way up to hosted GPU I have decided to jump directly to hosted GPUs!</p>
      <p>For this process I have gone with <a href="https://www.paperspace.com">paperspace</a> however any GPU as a service host should work all we need is ssh access, you will find that you can only really gain access to Gaming computer as a service providers without approval from the IaaS providers like paperspace/aws/azure but I have found their offerings to be a bit too expensive for what you get + typically they are windows boxes (so that won't work for fVDB). Just open a support ticket and get your access, you will have to wait a day but that's just a part of the cost of getting good access.</p>
      <h2 id="setting-up-the-box">setting up the box</h2>
      <p>as soon as you boot up the box the first thing is to start updating the box and installing software:</p>
      <pre><code class="language-bash">sudo apt update</code></pre>
      <p>Now we will need to install the nvidia GPU drivers, to do so we will run <code>sudo ubuntu-drivers devices</code> and find the row which has <code>recommended</code> on it, it will look something like so:</p>
      <pre><code class="language-bash">driver   : nvidia-driver-580 - distro non-free recommended
driver   : nvidia-driver-535 - distro non-free
driver   : nvidia-driver-570-server-open - distro non-free
driver   : nvidia-driver-570-open - distro non-free</code></pre>
      <p>in the above example we want <code>nvidia-driver-580</code>, so we will install the drivers like so:</p>
      <pre><code class="language-bash">sudo apt install -y nvidia-driver-580
sudo reboot</code></pre>
      <p>after this completes you want to restart the machine which is why I have included the reboot command. Don't forget that you need to place the <code>recommended</code> driver after the <code>-y</code> and not what my example showed.</p>
      <p>From there we will see what cuda is supported by these drivers with the following command:</p>
      <pre><code class="language-bash">nvidia-smi
Wed Apr  8 16:59:16 2026
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.126.09             Driver Version: 580.126.09     CUDA Version: 13.0     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA RTX A4000               Off |   00000000:00:05.0 Off |                  Off |
| 61%   80C    P2            137W /  140W |    2857MiB /  16376MiB |     90%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A            1546      C   ...space/fvdb-env/bin/python3.10       2850MiB |
+-----------------------------------------------------------------------------------------+</code></pre>
      <p>From this we can see this box now supports CUDA 13.0, keep this in mind.</p>
      <p>Now that we have the GPU drivers setup we will need to install all the python and fVDB dependencies, to simplify this I have created a setup script that automates the process and makes customisation a bit easier:</p>
      <pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail

PYTHON_VERSION=3.10
VENV_NAME=fvdb-env

TORCH_VERSION=2.10.0
TORCH_CUDA=cu128
FVDB_CORE_VERSION="0.4.2+pt210.\${TORCH_CUDA}"

echo "[0/5] Checking GPU..."
command -v nvidia-smi &gt;/dev/null || { echo "nvidia-smi not found"; exit 1; }
nvidia-smi &gt;/dev/null || { echo "GPU not working"; exit 1; }

echo "[1/5] System deps..."
sudo apt update
sudo apt install -y \\
  python\${PYTHON_VERSION} \\
  python\${PYTHON_VERSION}-venv \\
  python3-pip \\
  build-essential \\
  git \\
  ninja-build \\
  cmake \\
  libgl1 \\
  libglib2.0-0

echo "[2/5] Python env..."
python\${PYTHON_VERSION} -m venv $VENV_NAME
source $VENV_NAME/bin/activate
pip install --upgrade pip setuptools wheel

echo "[3/5] PyTorch..."
pip install \\
  torch==\${TORCH_VERSION} \\
  --index-url https://download.pytorch.org/whl/\${TORCH_CUDA}

python - &lt;&lt;EOF
import torch
assert torch.cuda.is_available(), "CUDA not available"
print("Torch:", torch.__version__)
print("GPU:", torch.cuda.get_device_name(0))
EOF

echo "[4/5] fVDB..."
pip install \\
  fvdb-core==\${FVDB_CORE_VERSION} \\
  fvdb-reality-capture \\
  --extra-index-url https://d36m13axqqhiit.cloudfront.net/simple

echo "[5/5] Verify..."
python - &lt;&lt;EOF
import torch, fvdb
assert torch.cuda.is_available()
x = torch.randn(1, device="cuda")
print("OK:", x)
EOF

echo "DONE -> source $VENV_NAME/bin/activate"</code></pre>
      <p>By default, this script has CUDA 12.8 selected as to make this applicable to as many people as possible, however if your GPU supports CUDA 13 you can swap <code>TORCH_CUDA=cu128</code> to be <code>TORCH_CUDA=cu128</code>.</p>
      <p>You should also update your <code>~/.bashrc</code> to include <code>export PATH=$PATH:$(pwd)/fvdb-env/bin</code> at the end of it so that on a new bash shell instance you have access to the <code>frgs</code> cli tool.</p>
      <p>Given this blog post will be out of date the second a new version of fVDB is released i will also recommend that you check out <a href="https://openvdb.github.io/fvdb-core/installation.html">https://openvdb.github.io/fvdb-core/installation.html</a> and look at the Software requirements and adjust the torch and python versions as required.</p>
      <h2 id="getting-started-with-splatting-over-ssh">Getting started with splatting over SSH</h2>
      <p>From this point onwards you can follow the tutorial over at <a href="https://openvdb.github.io/fvdb-core/reality-capture/tutorials/frgs.html">https://openvdb.github.io/fvdb-core/reality-capture/tutorials/frgs.html</a> one little trick I can give is when you start using the commands like <code>frgs show</code> a web server will be hosted on port 8080 (or on any port you choose if you provide a <code>-p 8888</code> argument). To view this site on your local machine you can open up a second SSH session which is mapping over that port via: <code>ssh -L 8080:127.0.0.1:8080 username@host</code> where <code>username@host</code> is what you are using to connect to your ssh box. now you will be able to follow along fully with the tutorial!</p>
    `
  }
];

export function postDirectory(post: BlogPost | ManualPost) {
  return post.id.replace(/\/index$/, '');
}

export function postSlug(post: BlogPost | ManualPost) {
  return slugify(postDirectory(post).replace(/^\d{4}-\d{1,2}-\d{1,2}-/, ''));
}

export function postUrl(post: BlogPost | ManualPost) {
  const year = post.data.date.getFullYear();
  const month = String(post.data.date.getMonth() + 1).padStart(2, '0');
  return `/blog/${year}/${month}/${postSlug(post)}/`;
}

export function tagUrl(tag: string) {
  return `/blog/tags/${slugify(tag)}/`;
}

function resolvePostAsset(post: BlogPost | ManualPost, assetPath?: string) {
  if (!assetPath) {
    return undefined;
  }

  const cleanPath = assetPath.replace(/^\.\//, '');
  return imageModules[`../../../blog/content/posts/${postDirectory(post)}/${cleanPath}`];
}

export function toPostView(post: BlogPost): BlogPostView {
  return {
    post,
    slug: postSlug(post),
    url: postUrl(post),
    imageUrl: resolvePostAsset(post, post.data.image),
    embeddedImageUrls: (post.data.embeddedImagesLocal ?? [])
      .map((imagePath) => resolvePostAsset(post, imagePath))
      .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
  };
}

export async function getSortedPosts() {
  const posts = await getCollection('posts');
  return [...posts.map(toPostView), ...manualPosts].sort(
    (a, b) => b.post.data.date.getTime() - a.post.data.date.getTime()
  );
}

export function paginatePosts(posts: BlogPostView[]) {
  const pages: BlogPostView[][] = [];

  for (let i = 0; i < posts.length; i += POSTS_PER_PAGE) {
    pages.push(posts.slice(i, i + POSTS_PER_PAGE));
  }

  return pages;
}

export function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
}

export function getAllTags(posts: BlogPostView[]) {
  return [...new Set(posts.flatMap(({ post }) => post.data.tags ?? []))].sort((a, b) =>
    slugify(a).localeCompare(slugify(b))
  );
}

export function tagTitle(tag: string) {
  return slugify(tag) === 'conference-talk' ? 'See me Speak' : tag;
}
