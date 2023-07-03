FROM node:18.14.2-alpine3.16 as building

WORKDIR /app

COPY package.json yarn.lock ./
COPY ./tsconfig*.json ./
COPY ./src ./src

RUN yarn install --frozen-lockfile --non-interactive && yarn cache clean
RUN yarn build

FROM node:18.14.0-alpine3.17

WORKDIR /app

COPY --from=building /app/dist ./dist
COPY --from=building /app/node_modules ./node_modules
COPY ./package.json ./

CMD ["yarn", "start:prod"]
