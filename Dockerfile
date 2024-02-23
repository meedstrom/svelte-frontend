# ------------------ build environment -----------------------------------

FROM node:21-alpine as build
WORKDIR /app
COPY . .
RUN apk --no-cache -U upgrade
RUN npm install --quiet
# RUN npm audit fix --only=prod || echo
# RUN npm audit fix --only=prod --force
RUN npm run build

# ------------------ production environment ------------------------------
# Don't forget to add ./node_modules to .dockerignore, since the whole point of
# using two images was to reduce the waste done by docker images.

FROM node:21-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./
EXPOSE 4173
RUN apk --no-cache -U upgrade
CMD ["node", "./index.js"]
