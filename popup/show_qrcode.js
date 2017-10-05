var qrcode = new QRCode("qrcode", {
    // text: "asdf",
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
}

/* old Firefox API */
if (self && self.port) {
    self.port.on('show', function onShow(data) {
        qrcode.makeCode(data.url);
    });
}

/* WebExtensions API */
if (browser.tabs && browser.tabs.query) {
    getActiveTab().then(data => {
        data = data[0];
        /* only tab in set */
        qrcode.makeCode(data.url);
    });
}

function makeCode () {
    var elText = document.getElementById("text");

    // if (!elText.value) {
    //     alert("Input a text");
    //     elText.focus();
    //     return;
    // }

    qrcode.makeCode(elText.value);
}

makeCode();

$("#text").
on("blur", function () {
    // lose focus
    makeCode();
}).
on("keydown", function (e) {
    if (e.keyCode == 13) {
        makeCode();
    }
});