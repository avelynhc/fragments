# Use node version 16.17.0
FROM node:16.17.0

# LABEL instruction adds key=value pairs with arbitrary metadata about your image
LABEL maintainer="Hyunjeong Choi <avelynhc@gmail.com>"
LABEL description="Fragments node.js microservice"

# Define environment variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Define and create app's working directory
# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
# /app/ - tells Docker that app is a directory
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy server's source code (src) to image (/app/src/)
COPY ./src ./src

# Start the container by running our server
CMD npm start

# We run our service on port 8080
EXPOSE 8080