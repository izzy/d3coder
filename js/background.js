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
        console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
        if (request.command == "doCopy") {
            console.log("chrome.runtime.onMessage", D3);
            var responseStatus = D3.copyToClipboard(D3.lastMessage);
            sendResponse({status: [chrome.i18n.getMessage("message_copied_to_clipboard"), responseStatus] });
        } else if (request.command == "setContextMenuTitle") {
            chrome.contextMenus.update(contextMenuId, {title: request.message});
        } else {
            sendResponse({}); // snub them.
        }
});

chrome.contextMenus.onClicked.addListener(
    (info, tab) => {
        console.log("onClicked: ", info, tab);

        menuId = info.menuItemId;
        // Get just the name and a boolean for editable text
        let fn_normalized = menuId.replace(/d3coder-(selection-|)/, "");
        let fn_name = menuId.replace(/d3coder-(selection-|)function_/, "")
        let fn_selection = menuId.includes("-selection-");

        // Menu item for the extension's settings page
        if (menuId === 'd3coder-settings') {
            console.log("Open d3coder settings");
            if ("openOptionsPage" in chrome.runtime) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('html/menu_ui.html'));
            }

        // Menu for selected/editable text
        } else if (fn_selection === true && fn_normalized in D3lib) {
            chrome.storage.sync.get(null, (items) => {
                D3.createPopup(
                    D3.translate(fn_normalized),
                    D3lib[fn_normalized](info.selectionText),
                    items["messageType"],
                    items["clipboardSave"],
                    tab.id
                );
            });

        // Nothing selected(get text from clipboard)
        } else if (fn_normalized in D3lib) {
            var bg = chrome.extension.getBackgroundPage(),
                clipboard = bg.document.getElementById("clipboard"),
                clipboardText;

            clipboard.style.display = "block";
            clipboard.select();
            bg.document.execCommand("Paste");
            clipboardText = clipboard.value;
            clipboard.style.display = "none";

            D3.copyToClipboard(D3lib[fn_name](clipboardText));

        } else {
            console.log("Unknown function in onClicked: " + menuId)
        }
    }
);