FROM node:20-bookworm

WORKDIR /app
COPY package.json package-lock.json ./
# RUN npm install
# npm installa la versione esatta definita nel package-lock e distrugge eventuali node modules giá presenti
RUN npm ci
COPY . .

## prod simulation
RUN npm run build
CMD ["node", "build"]
##

## dev
# CMD ["npm", "run", "dev"]
##
EXPOSE 3000
# usage: docker build -t sveltekit-shadowbox-dev
# docker run -p 3000:3000 sveltekit-shadowbox-dev
# open browser on localhost 3000



# multi-step
# FROM node:20-bookworm ## AS builder
# WORKDIR /app
# COPY package.json package-lock.json ./
# # RUN npm ci ## if you want to delete previous node_modules
# RUN npm install
#
# COPY . .
#
# RUN npm run build
# RUN npm prune --production
##
# FROM node:20-alpine
# WORKDIR /app
# COPY --from=builder /app/build build/
# COPY --from=builder /app/node_modules node_modules/
# COPY package.json .
# EXPOSE 3000
# ENV NODE_ENV=production
# CMD [ "node", "build" ]
