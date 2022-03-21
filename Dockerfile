FROM node:lts-buster

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  @discordjs/collection \
  webp && \
  apt-get upgrade -y

COPY package.json .

RUN npm install

COPY . .

CMD ["npm run start", "."]
