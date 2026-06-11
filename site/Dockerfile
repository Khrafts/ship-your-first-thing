# Build context is the REPO ROOT (railway.json sets dockerfilePath to
# site/Dockerfile) because the app renders the course markdown from
# ../modules and root-level docs at runtime — they must ship in the image.

FROM node:22-slim AS base
RUN corepack enable
WORKDIR /app/site

FROM base AS deps
COPY site/package.json site/pnpm-lock.yaml site/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/site/node_modules ./node_modules
COPY site/ ./
COPY modules/ /app/modules/
COPY screenshots/ /app/screenshots/
COPY diagrams/ /app/diagrams/
COPY GLOSSARY.md SETUP.md CHEATSHEET.md BUDGET.md COMMON-ISSUES.md \
     WHAT-CHANGED.md VERSIONS.md LICENSING.md CONTRIBUTING.md README.md /app/
RUN pnpm build

FROM base AS run
ENV NODE_ENV=production
COPY --from=build /app /app
EXPOSE 3000
# start:railway = run migrations, seed-if-empty, then next start on $PORT
CMD ["pnpm", "start:railway"]
