FROM node:14.17
# Add a work directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

# Copy app files
COPY . /usr/src/app
# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]