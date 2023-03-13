# FROM node:16.15-alpine3.15 As development

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=development

# COPY . .

# RUN npm run build

# FROM node:16.15-alpine3.15 As production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install --only=production

# COPY . .

# COPY --from=development /usr/src/app/dist ./dist

# EXPOSE 3000

# CMD ["node", "dist/main"]

FROM node:16.15-alpine3.15
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 3000





# FROM node:16-alpine
# ENV PORT 3000

# # Create app directory
# # RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # Installing dependencies
# COPY package*.json /usr/src/app/
# # RUN yarn install 
# RUN npm install --legacy-peer-deps

# # Copying source files
# COPY . /usr/src/app

# # Building app
# # RUN yarn dev
# RUN npm run build
# EXPOSE 3000

# # Running the app
# CMD ["npm", "run", "start"]
