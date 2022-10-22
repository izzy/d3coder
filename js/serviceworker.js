importScripts("/js/D3lib.js");
console.log("Successfully loaded D3 lib");

importScripts("/js/D3.js");
console.log("Successfully loaded D3 main");

importScripts("/js/browser-polyfill.min.js");
console.log("Successfully loaded browser-polyfill");

browser.runtime.onInstalled.addListener(() => {
    D3.checkInstall(D3.createContextMenu());
});

browser.storage.onChanged.addListener((changes, namespace) => {
    D3.createContextMenu();
});

browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log([request, sender, sendResponse]);

        if (request.command == "doCopy") {
            var responseStatus = D3.copyToClipboard(D3.lastMessage);
            sendResponse({
                status: [browser.i18n.getMessage("message_copied_to_clipboard"), responseStatus]
            });
        } else if (request.command == "setContextMenuTitle") {
            browser.contextMenus.update(contextMenuId, {
                title: request.message
            });
        } else {
            sendResponse({});
        }
    });

browser.contextMenus.onClicked.addListener(
    (info, tab) => {
        menuId = info.menuItemId;

        // Get just the name and a boolean for editable text
        let fn_normalized = menuId.replace(/d3coder-(selection-|)/, "");

        let fn_name = Object.entries(D3.function_list).find(fn => fn[1].includes(fn_normalized))[1][0];

        let fn_selection = menuId.includes("-selection-");

        // Menu item for the extension's settings page
        if (menuId === 'd3coder-settings') {
            browser.runtime.openOptionsPage();
            // Menu for selected/editable text
        } else if (fn_selection === true && fn_normalized in D3lib) {
            browser.storage.sync.get(null).then((items) => {
                D3.createPopup(
                    D3.translate(`${fn_name}`),
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