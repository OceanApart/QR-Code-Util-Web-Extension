var qrcode = new QRCode("qrcode", {
    // text: "asdf",
    width: 150,
    height: 150,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
});

function setInputText(url) {
    document.getElementById("text").setAttribute("value", url);
}

function curURLToCode() {
    /* old Firefox API */
    if (self && self.port) {
        self.port.on('show', function onShow(data) {
            qrcode.makeCode(data.url);
            setInputText(data.url);
        });
    }
    /* WebExtensions API */
    activeTab = browser.tabs.query({currentWindow: true, active: true});
    if (browser.tabs && browser.tabs.query) {
        activeTab.then(function (data) {
            data = data[0];
            /* only tab in set */
            qrcode.makeCode(data.url);
            setInputText(data.url);
        });
    }
}

function makeCode() {
    var elText = document.getElementById("text");

    if (!elText.value) {
        curURLToCode();
        return;
    }
    qrcode.makeCode(elText.value);

}

//  init
makeCode();
//  listen on mouse event
$("#text").on("blur", function () {
    // lose focus
    makeCode();
}).on("keydown", function (e) {
    if (e.keyCode == 13) {
        makeCode();
    }
});