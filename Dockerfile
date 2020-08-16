FROM node:10

# Create directory
WORKDIR /usr/src/app

# Copy Package.json
COPY package*.json ./

RUN npm install

# Copy app source
COPY . .

# !! MAKE SURE THIS IS THE RIGHT PORT YOU WANT TO USE !!
EXPOSE 3000

CMD ["node", "index.js"]
