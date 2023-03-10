const koa = require('koa');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const buildMiddleware = require('./middleware');

module.exports = function run(webpackConfig, serverConfig){

    let localServer = koa();
    let proxyServer = koa();

    localServer.use(bodyParser.json());
    localServer.use(bodyParser.urlencoded({extended: false}));

    const middleware = buildMiddleware(webpackConfig, serverConfig);

    // ----------------本地mock服务-------------
    localServer.use(middleware.basePathMiddleware);
    localServer.use(middleware.webpackExtractPathMiddleware)


}