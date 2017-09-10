FROM node:alpine

RUN apk add --update graphviz font-bitstream-type1 ghostscript-fonts git && \
  rm -rf /var/cache/apk/*

ADD package.json /tmp/package.json
RUN cd /tmp && npm install && mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

RUN mkdir -p /opt/app/static/graphs && chmod 0777 /opt/app/static/graphs

ENV NODE_ENV production
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
