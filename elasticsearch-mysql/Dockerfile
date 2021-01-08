FROM node:14-alpine as builder

EXPOSE 1776

# Install pm2
RUN yarn global add pm2


# Set work directory: /var/www/elasticsearch-mong --> ./
WORKDIR /usr/src/app

# Add `/usr/src/app/node_modules/.bin:$PATH`
ENV PATH ./node_modules/.bin:$PATH

# Create user no password
RUN adduser --disabled-password demo
# Grant a permission for app
RUN chown -R demo:demo .
USER demo
# clear application caching
RUN yarn cache clean --force

# Install dependencies
COPY package*.json ./
COPY *.lock ./

RUN yarn install





# Copy existing application directory contents
COPY . ./
RUN yarn typeorm migration:run
RUN yarn build


# Start run in development enviroment
CMD [ "yarn", "start:dev" ]