FROM node:alpine3.16 AS builder
RUN npm i -g pnpm
WORKDIR /app
RUN mkdir -p ./apps/til
COPY package*.json ./apps/til/
RUN mkdir -p ./pkg
COPY --from=project ./pkg/package.json ./pkg/package.json
COPY --from=project ./pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm i
COPY --from=project ./pkg ./pkg
COPY . ./apps/til
WORKDIR /app/apps/til
RUN npm run build
RUN npx next export -o /tmp/export
CMD ["npm", "run", "dev"]

FROM nginx:alpine
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80;
  server_name localhost;
  location / {
    root /usr/share/nginx/html;
    gzip on;
    # proxy_cache my_cache;
    # proxy_cache_valid 200 60m;
    # proxy_cache_valid 404 1m;
    try_files $uri $uri.html $uri/ =404;
  }
}
EOF
COPY --from=builder /tmp/export /usr/share/nginx/html
