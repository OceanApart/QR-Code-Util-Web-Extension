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
            qrEncoder.makeCode(data.url);
            setInputBox(data.url);
        });
    }
}

function generateQRCode() {
    // empty input
    if (!inputBox.value)
        curURLToCode();
    else
        qrEncoder.makeCode(inputBox.value);
}


browser.runtime.sendMessage('get_last_image', function (data) {
    var img = new Image();
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    img.src = data.img;
    canvas.width = img.width;
    canvas.height = img.height;
    img.crossOrigin = '';
    // load image and decode
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        // console.log(dataURL);
        qrDecoder.decode(dataURL);
    };
});

//  init
var inputBox = document.getElementById("inputbox");
var qrDecoder = qrcode;
var qrEncoder = new QRCodeEncoder(document.getElementById("qrbox"), {
    // text: "asdf",
    // TODO popup windows size
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCodeEncoder.CorrectLevel.M
});
generateQRCode();

//  listen on mouse event
inputBox.addEventListener("keydown", function (e) {
    // Enter keydown
    if (e.keyCode == 13) {
        generateQRCode();
    }
});

// Set qrDecoder.callback to function "func(data)", where data will get the decoded information.
qrDecoder.callback = function (result) {
    if (result === 'error decoding QR Code') {
        console.log(result);
        // throw result
    } else {
        console.log(result);
        setInputBox(result);
        generateQRCode();
    }
};