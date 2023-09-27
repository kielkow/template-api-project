# Run image commands:
# docker build -t template-api-project .
# docker run --name template-api-project -p 3333:3333 template-api-project

# Stop container and remove image:
# docker stop template-api-project && docker rm template-api-project && docker rmi template-api-project

# Use Node.JS Image LTS version.
FROM node:18

# Create app directory.
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Copy Prisma file
COPY prisma ./prisma/

# Copy .env file
COPY .env ./

# Copy tsconfig file
COPY tsconfig.json ./

# Install dependencies.
RUN npm install

# Bundle app source.
COPY . .

# Generate Prisma Client.
RUN npx prisma generate

# Build app code.
RUN npm run build

# Container Image listening port 3333.
EXPOSE 3333

# After image build, the command bellow will be executed.
CMD [ "npm", "run", "start:migrate:prod" ]
