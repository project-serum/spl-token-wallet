FROM node:10 AS builder
WORKDIR /
COPY . .
RUN yarn install && yarn build
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]