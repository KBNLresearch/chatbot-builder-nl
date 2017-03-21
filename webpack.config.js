const webpack = require('webpack');

module.exports = {
    entry: "./src/client/index.js",
    output: {
        path: "./public/js",
        filename: "index.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': Object.keys(process.env)
                .filter(function(k) { return k === "NODE_ENV"})
                .reduce(function(o, k) {
                    o[k] = JSON.stringify(process.env[k]);
                    return o;
                }, {})
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-2']
                }
            }
        ]
    }
};