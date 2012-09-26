D3.checkInstall();
waitInterval = window.setInterval(
    function(){ D3.createContextMenu() },
    D3.menuLoadTime
);

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
    console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
    if (request.command == "doCopy") {
        console.log(D3);
        var responseStatus = D3.copyToClipboard(D3.lastMessage);
        sendResponse({status: ["Message copied to clip board!", responseStatus] });
    } else {
        sendResponse({}); // snub them.
    }
});
