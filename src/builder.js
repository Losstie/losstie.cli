/**
 * node运行时调用webpack，自定义构建，参考：https://webpack.docschina.org/api/node/
 */
const webpack = require('webpack');

module.exports = function(webpackOptions){
    const builder = {};

    builder.compiler = webpack(webpackOptions);
    // 只在发生错误或新的编译开始时输出, https://webpack.docschina.org/configuration/stats
    builder.outputOptions = "minimal";

    let lastHash = null;

    builder.compilerCallback = function(err, stats) {
        if(err) {
            lastHash = null;
            console.error(err.stack || err);

            if(err.details) {
                console.error(err.details);
            }

            process.on('exit', function(){
                process.exit(1);
            });
            return;
        }

        if(stats.hash !== lastHash) {
            lastHash = stats.hash;

            process.stdout.write(stats.toString(builder.outputOptions) + "\n"); 

            if(stats.compilation.errors && stats.compilation.errors.length > 0) {
                process.on("exit", function(){
                    process.exit(1);
                });
                return;
            }

            if(builder.callback) {
                builder.callback(stats);
            }
        }
    }

    builder.run = function(callback) {
        builder.callback = callback;
        builder.compiler.run(builder.compilerCallback);
    }

    return builder;

}