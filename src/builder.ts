const webpack = require('webpack');

module.exports = function(webpackOptions){
    const builder:{[propName:string]: any} = {};

    builder.compiler = webpack(webpackOptions);
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

}