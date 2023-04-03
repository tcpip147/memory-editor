const rules = require('./webpack.rules');

module.exports = {
    entry: ['./src/main/main.js'],
    target: "electron-main",
    externals: {
        "ffi-napi": "ffi-napi"
    }
};
