if (typeof browser === 'undefined')
    var browser = chrome;

var lastImage = '';
var text = '';

browser.contextMenus.create({
    id: "qr-img",
    title: browser.i18n.getMessage("contextMenu-img"),
    contexts: ["image"]
});

browser.contextMenus.create({
    id: "qr-text",
    title: browser.i18n.getMessage("contextMenu-text"),
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "qr-link",
    title: browser.i18n.getMessage("contextMenu-link"),
    contexts: ["link"]
});

// context menus clicked event
browser.contextMenus.onClicked.addListener(function (info) {
    if (info.menuItemId === "qr-img") {
        lastImage = info.srcUrl;
        // alert(lastImage);
        browser.browserAction.openPopup();
    }
    if (info.menuItemId === "qr-text") {
        text = info.selectionText;
        // alert(lastImage);
        browser.browserAction.openPopup();
    }
    if (info.menuItemId === "qr-link") {
        text = info.linkUrl;
        // alert(lastImage);
        browser.browserAction.openPopup();
    }
});

browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request === 'get_data') {
            if (text !== '') {
                sendResponse({
                    type: "text",
                    text: text
                });
                // set empty
                text = '';
            } else if (lastImage !== '') {
                sendResponse({
                    type: "img",
                    img: lastImage
                });
                // set empty
                lastImage = '';
            }
        }
    });

