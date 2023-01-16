const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-exteact-plugin');

const defaultBabelConfig = require('./babelConfig');

console.log(`node-version:${process.version}`);

module.exports=function(defaultConfig){

    const babelConfig = [];
    const cssOptions = [];
    const postcssPlugins = [];
    const arrImgs = [];

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
        plugins: []
    }

};
