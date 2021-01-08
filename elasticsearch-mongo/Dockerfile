FROM node:14-alpine as builder

EXPOSE 1776

# Install pm2
RUN yarn global add pm2

# Create working directory
RUN mkdir -p /var/www/elasticsearch-mongo
# Add `/usr/src/app/node_modules/.bin:$PATH`
ENV PATH /var/www/elasticsearch-mongo/node_modules/.bin:$PATH

# Create user no password
RUN adduser --disabled-password demo

# Set work directory: /var/www/elasticsearch-mong --> ./
WORKDIR /var/www/elasticsearch-mongo

# Install dependencies
COPY package*.json ./
COPY *.lock ./

RUN yarn install

# Grant a permission for app
RUN chown -R demo:demo /var/www/elasticsearch-mongo
USER demo

# clear application caching
RUN yarn cache clean --force

# Copy existing application directory contents
COPY . ./


# Start run in development enviroment
CMD [ "yarn", "start:dev" ]