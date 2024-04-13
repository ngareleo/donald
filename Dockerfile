FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS dev
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install --force --ignore-scripts

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && NODE_OPTIONS=--no-experimental-fetch bun install --force --production

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

EXPOSE 3000
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]