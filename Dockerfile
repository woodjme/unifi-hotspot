FROM node:20-alpine as build

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM node:20-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY --from=build /usr/src/app/dist /usr/src/app/
COPY --from=build /usr/src/app/public /usr/src/app/public

#Expose Port
EXPOSE 4545

#Start
CMD [ "node", "index.js" ]
