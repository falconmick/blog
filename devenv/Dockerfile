FROM node:24-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=development

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        dumb-init \
        ca-certificates \
        fonts-liberation \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libx11-xcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxrandr2 \
        python3 \
        xdg-utils \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@11 @openai/codex \
    && mkdir -p /home/node/.codex \
    && chown -R node:node /home/node/.codex

WORKDIR /code

USER node

CMD ["/bin/bash"]
