importScripts("/js/D3lib.js");
console.log("Successfully loaded D3 lib");

importScripts("/js/D3.js");
console.log("Successfully loaded D3 main");

chrome.runtime.onInstalled.addListener(() => {
    D3.checkInstall(D3.createContextMenu());
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    D3.createContextMenu();
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log([request, sender, sendResponse]);

        if (request.command == "doCopy") {
            var responseStatus = D3.copyToClipboard(D3.lastMessage);
            sendResponse({status: [chrome.i18n.getMessage("message_copied_to_clipboard"), responseStatus] });
        } else if (request.command == "setContextMenuTitle") {
            chrome.contextMenus.update(contextMenuId, {title: request.message});
        } else {
            sendResponse({});
        }
});

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        menuId = info.menuItemId;

        // Get just the name and a boolean for editable text
        let fn_normalized = menuId.replace(/d3coder-(selection-|)/, "");
        let fn_name = menuId.replace(/d3coder-(selection-|)function_/, "")
        let fn_selection = menuId.includes("-selection-");

        // Menu item for the extension's settings page
        if (menuId === 'd3coder-settings') {
            chrome.runtime.openOptionsPage();
        // Menu for selected/editable text
        } else if (fn_selection === true && fn_normalized in D3lib) {
            chrome.storage.sync.get(null, (items) => {
                D3.createPopup(
                    D3.translate(`function_${fn_normalized}`),
                    D3lib[fn_normalized](info.selectionText),
                    items["messageType"],
                    items["clipboardSave"],
                    tab.id
                );
            });
        } else {
            console.error("Unknown function in onClicked: " + menuId)
        }
    }
);