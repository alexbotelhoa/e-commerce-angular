FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install 

RUN npm install pm2 -g
RUN npm install typescript -g

RUN npm install @types/fastify-redis -g
RUN npm install fastify-multipart -g


COPY . .

EXPOSE 3000
#CMD ["pm2-runtime", "src/index.ts"]
CMD [ "npm", "start" ]
