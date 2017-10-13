FROM quay.io/bannerbschafer/chess-engine as engine

FROM node:8.7-stretch

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

COPY --from=engine /home/chess-engine/target/release/rust-chess rust-chess

EXPOSE 3000

CMD [ "npm", "start" ]
