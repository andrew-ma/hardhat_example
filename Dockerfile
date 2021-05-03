FROM node:alpine
# Create app directory
WORKDIR /usr/src/app

# Install App dependencies
# only copying the package.json and packge-lock.json files to use cached Docker layers
COPY package*.json ./

RUN npm install

# bundle app source code inside Docker image
COPY . .

EXPOSE 8545

CMD npx hardhat node

# docker exec CONTAINER_ID npx hardhat deploy --network localhost