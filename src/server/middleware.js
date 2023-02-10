
const koa = require('koa');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const httpProxy = require('http-proxy');
const utils = require('../utils');

const { abspath, strToRegExp } = utils;

module.exports = function(webpackConfig, serveConfig) {
    const { publicPath='/' } = webpackConfig;
    const { proxyConf, local, fallbackToIndex, getBasePath } = serverConfig;


    return {
        /**
         * @description 去除url前缀
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         * @returns 
         */
        basicPathMiddleware: function(req, res, next) {
            if(!getBasePath) {
                return next();
            }
            const basePath = getBasePath(req);
            if(req.url.startsWidth(basePath)) {
                req.url = req.url.slice(basePath.lastIndex('/'));
                next();
            } else {
                res.status(404);
                res.end();
            }
        },
    
    }
}