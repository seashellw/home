FROM node:alpine AS builder
WORKDIR /root

RUN npm install -g pnpm

COPY ./package.json ./
COPY ./.npmrc ./
RUN pnpm install

COPY . ./

RUN pnpm run build

FROM alpine AS runner
WORKDIR /root
COPY --from=builder /root/dist ./dist
