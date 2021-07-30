FROM node

# diretorio de trabalho
WORKDIR /usr/app
#copia package.json para diretório raíz
COPY package.json ./
# instala as depedências
RUN npm install
# copia todos arquivos para pasta raíz
COPY . .
# usa a porta 3333
EXPOSE 3333
# ruda o comando npm run dev

CMD ["npm", "run", "dev"]


# docker compose
