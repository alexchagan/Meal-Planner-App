FROM node:latest

WORKDIR /usr/src/frontend/meal-planner
ENV PATH /usr/src/frontend/meal-planner/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/frontend/meal-planner/package.json

RUN npm install

EXPOSE 5173
CMD ["npm", "run", "dev"]
