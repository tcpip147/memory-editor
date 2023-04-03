const webpack = require('webpack');
const rules = require('./webpack.rules');
const { inDev } = require('./webpack.helpers');

module.exports = {
    module: {
        rules
    },
    plugins: ([
        inDev() && new webpack.HotModuleReplacementPlugin()
    ]).filter(Boolean),
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.json'],
        alias: {
            ...require('./webpack.aliases')
        }
    }
};