FROM node:18

# Set the working directory inside the Docker image
WORKDIR /app

COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . .

EXPOSE 7024

# Set the command to run your Node.js app
CMD ["npm", "start"]