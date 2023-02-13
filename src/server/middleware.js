
const koa = require('koa');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const httpProxy = require('http-proxy');
const utils = require('../utils');

const { abspath, strToRegExp } = utils;

module.exports = function(webpackConfig, serveConfig) {
    const { publicPath='/' } = webpackConfig;
    const { proxyConf, local, fallbackToIndex, getBasePath } = serverConfig;

    const webpackCompiler = webpack(webpackConfig);
    const webpackMiddleware = webpackDevMiddleware(webpackCompiler, { publicPath });


    return {
        /**
         * @description 去除url前缀
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         * @returns 
         */
        basePathMiddleware: function(req, res, next) {
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
        /**
         * @description 静态资源中间件：请求url和webpack静态资源一致，则返回
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         */
        webpackExtractPathMiddleware: function(req, res, next) {
            webpackMiddleware.waitUntilValid(() => {
                const ofs = webpackCompiler.outputFileSystem;
                const filepath = webpackMiddleware.getFilenameFromUrl(req.url);
                const isFile = filepath && ofs.existsSync(filepath) && ofs.statSync(filepath).isFile();
                if(isFile) {
                    webpackMiddleware.apply(this, arguments);
                }else {
                    return next();
                }
            });
        },
        staticMiddleware: function(req, res, next) {
            const matched = localPathMap.some((item) => {
                const url = req.url;
                req.url = req.url.replace(item[0], item[1]);
                if(req.url !== url) {
                    res.set('X-Mock-Rule', item[0]);
                    res.set('X-Mock-File', req.url);
                    return true;
                }
            });
            if(!matched) return next();

            const mockFilePath = path.join(mackRootDir, req.url);
            if(!/\..+$/.test(req.url)) {
                
            }
        }
    
    }
}