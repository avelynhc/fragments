# Stage 0: install the base dependencies
# Use node version 16.17.0
FROM node:16.17.0-alpine3.17@sha256:a13d2d2aec7f0dae18a52ca4d38b592e45a45cc4456ffab82e5ff10d8a53d042 AS dependencies

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

ENV NODE_ENV=production

# Define and create app's working directory
# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
# /app/ - tells Docker that app is a directory
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --production

############################################################################################

# Stage 1: build the app by reusing cashed dependecies downlaoded in previous stage0.
FROM node:16.17.0-alpine3.17@sha256:a13d2d2aec7f0dae18a52ca4d38b592e45a45cc4456ffab82e5ff10d8a53d042 AS build

WORKDIR /app

# Copy the generated dependecies (node_modules)
COPY --chown=node:node --from=dependencies /app /app

# Copy server's source code (src) to image (/app/src/)
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Switch user to node before we run the app
USER node

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
    CMD curl --fail localhost:8080 || exit 1

# Start the container by running our server
CMD npm start