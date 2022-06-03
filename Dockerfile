FROM node

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
RUN npm install --silent --force

# Copy the app
COPY . ./

# Start the app
CMD ["npm", "start"]
