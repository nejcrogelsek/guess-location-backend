FROM node:16

# Create app directory, this is in our container/in our image
WORKDIR /nejc/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN yarn run build

EXPOSE 8080
CMD [ "node", "dist/main.js" ]
