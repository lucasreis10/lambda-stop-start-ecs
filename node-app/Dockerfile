FROM --platform=linux/amd64 node:16-alpine

WORKDIR app

COPY --chown=node:node . .

RUN npm i

EXPOSE 3000

CMD ["node", "index.js"]