/**
 * @description babel-config
 */

module.exports = {
    presets: [
        "@babel/preset-react",
        ["@babel/preset-env", 
        {
            "modules": "commonjs",
            "targets":{
                "browsers": ["last 4 versions", "ie >= 9", "safari>=10"]
            },
            "useBuiltIns": "entry",
            "corejs": 2,
            exclude:['proposal-dynamic-import']
        }],
        "@babel/preset-typescript"
    ],
    plugins: [
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-transform-async-to-generator",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        ["@babel/plugin-proposal-private-methods", {loose: true}],
        ["@babel/plugin-proposal-private-property-in-object", {loose: true}]
    ],
}