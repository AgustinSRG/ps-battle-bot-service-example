# Dockerfile

FROM node:20-alpine AS BUILDER

    # In order to build the project, we will do in the /root folder
    WORKDIR /root

    # Copy dependency list files
    COPY package*.json .

    # Install dependencies
    RUN npm install

    # Copy source files
    COPY . .

    # Build
    RUN npm run build

FROM node:20-alpine AS RUNNER

    # The server will be put in the /server path
    RUN mkdir /server
    WORKDIR /server

    # Copy dependency list files
    COPY package*.json .

    # Install dependencies
    RUN npm install --production

    # Copy files from BUILDER
    COPY --from=BUILDER /root/dist /server/dist

    # Environment
    ENV NODE_ENV=production

    # Entry point
    ENTRYPOINT ["npm", "start"]
