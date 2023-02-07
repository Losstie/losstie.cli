const webpackConfig = require('./config/index');
// const server = require('./server');
const builder = require('./builder');

module.exports = {
    /**
     * @description 本地开发
     * @param {*} config 
     * @param {*} serverConfig 
     */
    // run: function(config, serverConfig){
    //     server.run(webpackConfig(config), serverConfig);
    // },
    /**
     * @description 构建应用
     * @param {*} config 
     * @param {*} serverConfig 
     */
    build:function(config, callback){
        builder(webpackConfig(config)).run(callback);
    }
}