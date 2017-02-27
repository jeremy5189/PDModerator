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
npm run server # start express.js server
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
