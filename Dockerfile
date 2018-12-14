FROM node:10-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . /usr/src/app

#Expose Port
EXPOSE 4545

#Start
CMD [ "npm", "start" ]
