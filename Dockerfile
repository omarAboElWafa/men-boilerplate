#use base image for node.js and typescript
FROM node:18-alpine

#set working directory inside the container
WORKDIR /app

#copy package.json and package-lock.json to the working directory
COPY package*.json ./

#Install dependencies
RUN npm install


#copy all files from current directory to the working directory
COPY . .

#build the app
RUN npm run build


#remove the source files
RUN rm -rf src

#specify the command to run the app
CMD ["npm", "run", "start:prod"]