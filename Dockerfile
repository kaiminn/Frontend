FROM node:12.16.1
ENV NODE_ENV environment
WORKDIR /usr/src/app
COPY . .
RUN yarn install --frozen-lockfile --cache-folder yarn-cache
EXPOSE 8902
CMD sh entry.sh