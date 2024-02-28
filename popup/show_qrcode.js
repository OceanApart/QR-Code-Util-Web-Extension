// var QRCode = require('qrcode')
// var jsQR = require("jsqr");
import QRCode from 'qrcode';
import jsQR from 'jsqr';

function setInputBox(text) {
    inputBox.setAttribute("value", text);
    // inputBox.focus();
    // inputBox.select();
}

function curURLToCode() {
    /* old Firefox API */
    if (self && self.port) {
        self.port.on('show', function onShow(data) {
            qrEncoder.makeCode(data.url);
            setInputBox(data.url);
        });
    }
    /* WebExtensions API */
    var activeTab = browser.tabs.query({currentWindow: true, active: true});
    if (browser.tabs && browser.tabs.query) {
        activeTab.then(function (data) {
            data = data[0];
            /* only tab in set */
            // qrEncoder.makeCode(data.url);
            QRCode.toCanvas(canvas, data.url, {
                width: 150,
                color: {
                    dark: '#000000ff',
                    light: '#ffffffff',
                }
            });
            setInputBox(data.url);
        });
    }
}

function generateQRCode() {
    // empty input
    if (!inputBox.value)
        curURLToCode();
    else
        QRCode.toCanvas(canvas, inputBox.value);
        // qrEncoder.makeCode(inputBox.value);
}


//  init
var inputBox = document.getElementById("inputbox");
var canvas = document.getElementById("qrbox");
// var qrDecoder = qrcode;
// var qrEncoder = new QRCodeEncoder(document.getElementById("qrbox"), {
//     // text: "asdf",
//     // TODO: popup windows size and custom CorrectLevel
//     width: 150,
//     height: 150,
//     colorDark: "#000000",
//     colorLight: "#ffffff",
//     correctLevel: QRCodeEncoder.CorrectLevel.M
// });
generateQRCode();
// init end

browser.runtime.sendMessage('get_data', function (data) {
    if (data?.type === 'img') {
        var img = new Image();
        var offscreenCanvas = document.createElement("canvas");
        var ctx = offscreenCanvas.getContext("2d");

        img.src = data.img;
        offscreenCanvas.width = img.width;
        offscreenCanvas.height = img.height;
        img.crossOrigin = '';
        // load image and decode
        img.onload = function () {
            offscreenCanvas.width = img.width;
            offscreenCanvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var imageData = offscreenCanvas.getImageData(0, 0, img.width, img.height);
            // var dataURL = offscreenCanvas.toDataURL("image/png");
            // console.log(dataURL);
            // qrDecoder.decode(dataURL);
            var code = jsQR(imageData, img.width, img.height);
            if (code) {
                setInputBox(code.data);
            } else {
                setInputBox(browser.i18n.getMessage("decode-error"));
            }
            generateQRCode();
        };
    } else if (data?.type === 'text') {
        setInputBox(data.text);
        generateQRCode();
    }
});

//  listen on mouse event
inputBox.addEventListener("keyup", function (e) {
    generateQRCode();
    // Enter keydown
    // if (e.keyCode == 13) {
    //     generateQRCode();
    // }
});

// Set qrDecoder.callback to function "func(data)", where data will get the decoded information.
// qrDecoder.callback = function (result) {
//     if (result === 'Failed to load the image') {
//         setInputBox(browser.i18n.getMessage("failed-load"));
//     }
//     else if (result === 'error decoding QR Code') {
//         setInputBox(browser.i18n.getMessage("decode-error"));
//     }
//     else {
//         console.log(result);
//         setInputBox(result);
//     }
//     generateQRCode();
// };
