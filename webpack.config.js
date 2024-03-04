const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        popup: "./popup/show_qrcode.js"
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        clean: true,
    },
    mode: 'none',
};
