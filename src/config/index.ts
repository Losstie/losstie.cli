const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-exteact-plugin');
const CrossOriginWebpackPlugin = require('cross-origin-webpack-plugin');
const autoprefixer = require('autoprefixer');
const rucksack = require('rucksack-css');

const defaultBabelConfig = require('./babelConfig');

console.log(`node-version:${process.version}`); 

module.exports=function(customConfig){
    const {babelPlugins, cssOptions={}, pxToRem, postcss, useImgCompression=true} = customConfig;

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

    const arrImgs:any = [];
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
        mode: "development",
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
                    test: /\.less$/,
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
                         'less-loader',
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
            mouleIds: 'named',
            chunkIds: 'named',

        },
        plugins: [
            new CrossOriginWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[hash:8].css',
                chunkFilename: 'static/css/[id].[chunkhash:8].css',
                ignoreOrder: true,
            })
        ]
    }

    return config;

};
