FROM node:13
WORKDIR /var/opt
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]