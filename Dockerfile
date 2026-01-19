# Simple production Dockerfile for the backend (in-memory only)
# This runs ONLY the Node/Express + Socket.io server.
# Deploy frontend separately (GitHub Pages/Vercel/Netlify) and set CLIENT_URL accordingly.

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY server ./server

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server/index.js"]

