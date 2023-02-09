const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CrossOriginWebpackPlugin = require('crossorigin-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const autoprefixer = require('autoprefixer');
const rucksack = require('rucksack-css');

const defaultBabelConfig = require('./babelConfig');
const cwd = process.cwd();

function abbspath (p) {
    return p[0] === '/'?p:path.join(cwd, p);
}

console.log(`node-version:${process.version}`); 

module.exports=function(customConfig){
    const {mode="development", entry, html, output, babelPlugins, cssOptions={}, pxToRem, postcss, useImgCompression=true} = customConfig;

    // babel-config
    const babelConfig = {
        ...defaultBabelConfig,
        plugins: babelPlugins ? defaultBabelConfig.plugins.concat(babelPlugins): defaultBabelConfig.plugins,
    };

    let postcssPlugins = [
        rucksack(),
        autoprefixer({
            overrideBrowerslist:['last 2 version', 'Firefox ESR', '>1%', 'ie>=9', 'IOS >= 8', 'Android >= 4']
        })
    ];
    if(pxToRem) {
        postcssPlugins = postcssPlugins.concat(require('postcss-pxtorem')({
            rootValue:100,
            selectorBlackList: [],
            propList:['*']
        }))
    }

    if(postcss) {
        postcssPlugins = postcssPlugins.concat(postcss);
    }

    const arrImgs = [];
    if(useImgCompression) {
        arrImgs.push({
            loader: 'image-webpack-loader', // 图片压缩
            options: {
                gifsicle: {
                    interlaced: false,
                },
                optipng: {
                    enabled:true,
                },
                pngquant: {
                    quality:[0.3,0.8],
                    speed:1,
                },
                mozjpeg:{
                    quality: 65,
                    preogressive:true
                }
            }
        })
    }

    const config = {
        mode,
        entry:abbspath(entry),
        output: {
            path:path.resolve(__dirname, './dist'),
            filename:'bundle-[name].js',
            chunkFilename:'bundle-[name].js',
            publicPath:'/',
        },
        resolve: {
            extensions: ['.js', '.jsx', 'ts', 'tsx', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelConfig
                        }
                    ]
                },
                {
                    test:/\.(scss|css)$/,
                    use: [
                         MiniCssExtractPlugin.loader,
                         {
                            loader: 'css-loader',
                            options: cssOptions
                         },
                         {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: postcssPlugins,
                                }
                            }
                         },
                         'resolve-url-loader',
                         {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                         }

                    ]
                },
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    type:'asset',
                    generator: {
                        filename: 'static/imgs/[name]-[hash:8].[ext]',
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: 4120
                        }
                    },
                    use: arrImgs,
                },
                {
                    test: /\.svg$/,
                    type: 'asset/inline',
                },
                {
                    test: /favicon\.ico$/,
                    type: 'asset',
                    generator: {
                        filename: 'static/imgs/[name].[ext]',
                    },
                    parser: {
                        dataUrlCondition: {
                            maxSize: 2048
                        }
                    },
                },
                {
                    test: /\.(ttf|eot|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'static/fonts/[name]-[hash:8].[ext]',
                    },
                },
                {
                    test:/\.worker\.js$/,
                    loader: 'worker-loader',
                    options: {
                        filename: '[name].[contenthash:8].worker.js'
                    }
                }
            ]
        },
        optimization: {
            moduleIds: 'named',
            chunkIds: 'named',

        },
        plugins: [
            new CrossOriginWebpackPlugin({ crossorigin: 'anonymous' }),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[hash:8].css',
                chunkFilename: 'static/css/[id].[chunkhash:8].css',
                ignoreOrder: true,
            })
        ]
    }

    if(html) {
        config.plugins.push(new HtmlWebpackPlugin({
            hash:false,
            template: abbspath(html),
            minify: {
                removeComments:true,
                collapseWhitespace:true,
            }
        }))
    }
    if(output) {
        if(output.path) {
            config.output.path = abbspath(output.path);
        }
    }

    if(fs.existsSync('tsconfig.json')) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin({
            formatter:'codeframe',
            async:false,
        }))
    }

    return config;

};
