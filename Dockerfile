FROM node:14

ENV HOME=/home/app

COPY package.json package-lock.json $HOME/redirct/

WORKDIR $HOME/redirct

RUN apt-get update && apt-get install -y \
  ca-certificates \
  curl
RUN npm install --silent --progress=false

COPY . $HOME/redirct

COPY bin/docker-entrypoint.sh /usr/local/bin

RUN ["chmod", "+x", "/usr/local/bin/docker-entrypoint.sh"]


ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "start"]
