FROM node:15.12.0 as builder
WORKDIR /workspace
EXPOSE 3000
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN alias cnpm="npm --registry=https://registry.npm.taobao.org \
  --cache=$HOME/.npm/.cache/cnpm \
  --disturl=https://npm.taobao.org/dist \
  --userconfig=$HOME/.cnpmrc"

# RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN cnpm install yarn -g
RUN  yarn config set registry https://registry.npm.taobao.org \
  && yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-s
# Install package cache
COPY package.json .
# COPY yarn.lock .
RUN yarn install

# Building
COPY . .
RUN yarn build

FROM nginx:1.19.0
COPY --from=builder workspace/build /usr/share/nginx/html/
COPY --from=builder workspace/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80