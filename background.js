if (typeof browser === 'undefined')
    var browser = chrome;

var lastImage = '';
var lastImageRect = null;

browser.contextMenus.create({
    id: "qr-img",
    title: browser.i18n.getMessage("contextMenu"),
    contexts: ["image"]
});

browser.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId === "qr-img") {
        lastImage = info.srcUrl;
        // console.log(lastImage);
        // alert(lastImage);
        browser.browserAction.openPopup();
    }

});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request === 'get_last_image') {
            sendResponse({
                img: lastImage,
                rect: lastImageRect
            });
            lastImage = '';
            lastImageRect = null;
        }
    });

