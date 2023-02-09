const koa = require('koa');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');

module.exports = function run(webpackConfig, serverConfig){
    let localServer = koa();
    let proxyServer = koa();

    localServer.use(bodyParser.json());
    localServer.use(bodyParser.urlencoded({extended: false}));

    // ----------------本地mock服务-------------



}