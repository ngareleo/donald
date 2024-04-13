# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && NODE_OPTIONS=--no-experimental-fetch bun install --verbose --force --production

# Final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# Run the app
EXPOSE 3000
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]