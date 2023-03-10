
const koa = require('koa');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const httpProxy = require('http-proxy');
const utils = require('../utils');

const { abspath, strToRegExp } = utils;

module.exports = function(webpackConfig, serveConfig) {
    const { publicPath='/' } = webpackConfig;
    const { proxyConf, local, fallbackToIndex, getBasePath } = serverConfig;
    let mockRootDir = serverConfig.mockRootDir ? abspath(serverConfig.mockRootDir) : '.'

    const webpackCompiler = webpack(webpackConfig);
    const webpackMiddleware = webpackDevMiddleware(webpackCompiler, { publicPath });

    const staticMiddleware = koa.static(mockRootDir);

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
        /**
         * @description
         * @param {*} req 
         * @param {*} res 
         * @param {*} next 
         * @returns 
         */
        staticMockedMiddleware: function(req, res, next) {
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
                let mockJSFilePath = mockFilePath.endsWith('js') ? mockFilePath : `${mockFilePath}.js`;
                let hasMockJsFile = fs.existsSync(mockFilePath) && fs.statSync(mockFilePath).isFile();

                if(hasMockJsFile) {
                    delete require.cache[require.resolve(mockFilePath)];
                    require(mockFilePath)(req, res, function(res){
                        if(Object.prototype.toString.call(res).slice(8, -1) === 'Object') {
                            res.set('Content-Type', 'application/json');
                            return res.end(JSON.stringify(res));
                        }
                        return res.end(res);
                    });
                } else {
                    if(!req.url.endsWith('.json')) {
                        req.url += '.json';
                    }
                    req.method = 'GET';
                    staticMiddleware.apply(this, arguments);
                }
            } else {
                req.method = 'GET';
                staticMiddleware.apply(this, arguments);
            }
        }
    
    }
}