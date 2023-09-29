FROM node:20-alpine
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# The VOLUME instruction does not support specifying a host-dir parameter
# (unlike in docker-compose.yml). You must specify the mountpoint when you
# create or run the container.
VOLUME /app
VOLUME /app/node_modules

RUN npm install

# The EXPOSE instruction does not actually publish the port. It functions as a
# type of documentation between the person who builds the image and the person who
# runs the container, about which ports are intended to be published. To actually
# publish the port when running the container, use the -p flag on docker run to
# publish and map one or more ports, or the -P flag to publish all exposed ports
# and map them to high-order ports.
EXPOSE 3000

CMD ["npx", "vite", "dev"]
# CMD ["npm", "run", "dev"]
