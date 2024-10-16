FROM node:lts-buster

RUN git clone https://github.com/Twst666/Phoenix-MD-botwa/ /root/Phoenix-MD-botwa

WORKDIR /root/Phoenix-MD-botwa

RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

RUN npm install


CMD ["node", "."]
