FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000
#CMD ["pm2-runtime", "src/index.ts"]
CMD [ "npm", "start" ]
