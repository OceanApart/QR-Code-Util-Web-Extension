const path = require("path");

module.exports = {
    entry: {
        popup: "./popup/show_qrcode.js"
    },
    output: {
        path: path.resolve(__dirname, "addon"),
        filename: "[name]/show_qrcode.js"
    },
    mode: 'none',
};
