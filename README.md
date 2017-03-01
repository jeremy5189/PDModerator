# PDModerator

Panel Discussion Moderator for SITCON

## Requirements

- node.js >= 4.0.0
- npm >= 3.0.0
- MongoDB

## Install

```bash
git clone https://github.com/jeremy5189/PDModerator.git
cd PDModerator
npm install
vim common-config.json # Edit `common-config.json` to fill in your reCAPTCHA key, MongoDB URL and site url.
npm run build # build frontend to server/public
npm run server # start express.js server on localhost:3000

PORT=3001 pm2 start server/bin/www --name=pdmod
```

## Restrict API access & Nginx settings

It's important to restrict /api/* access if you are running PDModerator on public domain.

```
location /api {
    auth_basic "Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    include /etc/nginx/nodejs_proxy.conf;
    proxy_pass         http://127.0.0.1:3001;
}

location / {
    include /etc/nginx/nodejs_proxy.conf;
    proxy_pass         http://127.0.0.1:3001;
}
```

Generate http basic auth password with 

```
sudo apt-get install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd pdmod
```

### /etc/nginx/nodejs_proxy.conf

```
proxy_set_header   Upgrade          $http_upgrade;
proxy_set_header   Connection       "upgrade";
proxy_http_version 1.1;
proxy_set_header   X-Real-IP        $remote_addr;
proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
proxy_set_header   Host             $http_host;
```

## Dev documents

[https://hackmd.io/JzAmBYAYHYCMEYC0AzArAJgMyPNAHEntKNIgMbQCGqlEAbKgKbThA===?both](https://hackmd.io/JzAmBYAYHYCMEYC0AzArAJgMyPNAHEntKNIgMbQCGqlEAbKgKbThA===?both)

## Development

``` bash
# start server with nodemon on localhost:3000
npm run mon

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
