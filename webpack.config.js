const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/react-input-number-format.js',
    output: {
        path: './dist/',
        filename: 'react-input-number-format.js'
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        }),
    ],
    resolve: {
        extensions: ['', '.js']
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel','eslint-loader'], exclude: /node_modules/ },
        ]
    }
}
