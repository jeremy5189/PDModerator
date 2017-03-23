# PDModerator

PDModerator (PDMod) is a conference software developed for SITCON 2017 Panel Discussion. 

PDMod aims to provide equal speaking rights to every attendee in the conference room. Attendee can submit speaker application via the PDMod interface. Which was later review by the moderator (set `config.direct_to_queue` to true will skip this process) and been put on the speaker queue (projected on the screen to everyone).

PDMod 致力於會議或論壇中提供所有參與者平等的發言權利。與會者透過系統介面提出發言申請後，所提交的資訊會即時送至主持人介面，由主持人審核後 (調整 `config.direct_to_queue` 設定可省略此步驟) 排入發言佇列。發言佇列介面會透過投影機展示給所有參與者，即時呈現最近六位發言者、目前發言者，目前討論主題（由主持人介面設定）以及計時器剩餘時間。

## Live Demo

- [Attendee](https://pd.cloudmun.com.tw/#/attendee)
- [Moderate](https://pd.cloudmun.com.tw/#/moderate)
- [Queue](https://pd.cloudmun.com.tw/#/queue)

## SITCON 2017 @ Academia Sinica

![https://i.imgur.com/4pIJhN3.png](https://i.imgur.com/4pIJhN3.png)

Two contributors was hosting the event on stage. @pcchou on the left and @jeremy5189 on the right.

![https://i.imgur.com/aBEEf4X.png](https://i.imgur.com/aBEEf4X.png)

![https://i.imgur.com/8f2rbUD.png](https://i.imgur.com/8f2rbUD.png)

## Interface

### Attendee Interface (與會者介面)

![http://i.imgur.com/75LlBLY.png](http://i.imgur.com/75LlBLY.png)

### Queue Interface (發言佇列)

![http://i.imgur.com/w7tXh28.png](http://i.imgur.com/w7tXh28.png)

#### Timer Control 

- Start/Pause: Space/Ctrl or Left Click
- Reset: Alt or Right Click
- Click "remaining time" to set custom time

### Moderator Interface (主持人介面)

![http://i.imgur.com/cwcbA74.png](http://i.imgur.com/cwcbA74.png)

## Requirements

- node.js >= 4.0.0
- npm >= 3.0.0
- MongoDB
- reCAPTCHA

## Install

```bash
git clone https://github.com/jeremy5189/PDModerator.git
cd PDModerator
npm install
cp common-config.sample.json common-config.json
cp server-config.sample.json server-config.json
# Edit config to fill in your reCAPTCHA key, MongoDB URL, server secret and site url.
npm run build # build frontend to server/public

PORT=3001 pm2 start server/bin/www --name=pdmod
```

### Page

- Moderator Page: http://localhost:3001/#/Moderate
- Queue Page: http://localhost:3001/#/Queue

## Config

```js
{
  "reCAPTCHA": {
    "enabled": false,
    "site_key": ""
  },
  "ws_url": "http://localhost:3000",
  "api_url": "http://localhost:3000",
  "mongodb": "mongodb://localhost:27017/pdmod",
  "direct_to_queue": false, // Set true to bypass moderation process
  "allow_speaker_ts": {
    "start": 1489809600,
    "comment1": "2017/3/18 12:00 (UTC+8)",
    "end": 1489820400,
    "comment2": "2017/3/18 15:00 (UTC+8)",
    "force_ignore": false // Set true to bypass time check
  }
}

```

## Restrict API access & Nginx settings

It's important to restrict /api/* access if you are running PDModerator on public domain.

```nginx
 upstream nodejs {
     server localhost:3001;
 }

 server {
     listen 80;
     listen [::]:80;

     root ~/PDModerator/server/public;
     server_name DOMAIN;

     location / {
         # First attempt to serve request as file, then
         # as directory, then fall back Express.js
         try_files $uri $uri/ @nodejs;
     }

     location /api {
         auth_basic "Restricted";
         auth_basic_user_file /etc/nginx/.htpasswd;
         include /etc/nginx/nodejs_proxy.conf;
         proxy_pass         http://nodejs;
     }

     location @nodejs {
         include /etc/nginx/nodejs_proxy.conf;
         proxy_pass         http://nodejs;
     }
 }
```

Generate http basic auth password with 

```bash
sudo apt-get install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd pdmod
```

### /etc/nginx/nodejs_proxy.conf

```nginx
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
