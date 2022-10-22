/**
 * @returns Object containing the current tab
 */
async function getCurrentTab() {
	let queryOptions = {
		active: true,
		currentWindow: true
	};
	let [tab] = await browser.tabs.query(queryOptions);
	return tab;
}

/**
 * KEY FUNCTION NAMESPACE
 */
var D3 = {
	//needs a new Icon - best would be an icon per decoding type
	//icon: "popupIcon.png",
	icon: "../images/icon128.png",
	/**
	 * Version number
	 * 
	 * @var String
	 */
	version: "5.1.0",

	/**
	 * Tabs that already had the content worker script injected
	 * 
	 * @var Array
	 */
	injected_tabs: incjected_tabs = [],

	/**
	 * list all functions so we can use this while saving
	 * @var Array 
	 */
	checkboxes: Array("functions_rot13",
		"functions_timestamp",
		"functions_crc32",
		"functions_bin2hex",
		"functions_bin2txt",
		"functions_txt2hex",
		"functions_hex2txt",
		"functions_html_entity_decode",
		"functions_htmlentities",
		"functions_htmlspecialchars",
		"functions_htmlspecialchars_decode",
		"functions_uri_encode",
		"functions_uri_decode",
		"functions_md5",
		"functions_sha1",
		"functions_quoted_printable_decode",
		"functions_quoted_printable_encode",
		"functions_escapeshellarg",
		"functions_base64_encode",
		"functions_base64_decode",
		"functions_unserialize",
		"functions_leet_decode",
		"functions_leet_encode",
		"functions_reverse"),

	menuIds: {},

	lastMessage: '',

	checkInstall: function (callback) {
		browser.storage.sync.get(null).then((items) => {
			console.log("Check Install: Start");
			update = {};
			if (!items["messageType"]) {
				update["messageType"] = "inplace";
			}

			if (!items["clipboardSave"]) {
				update["clipboardSave"] = false;
			}

			update["checkboxes"] = {};
			for (name of D3.checkboxes) {
				if (items["checkboxes"] && items["checkboxes"][name] === false) {
					update["checkboxes"][name] = false;
				} else {
					update["checkboxes"][name] = true;
				}
			}

			if (!items["version"]) {
				update["version"] = D3.version;
			}

			browser.storage.sync.set(update).then(() => {
				console.log("Installed decoder version " + D3.version);
			});
		});
	},

	createPopup: async (title, text, type, clipboardCopy, tabId) => {
		if (clipboardCopy) {
			D3.copyToClipboard(text);
		}

		D3.lastMessage = text;

		// Inject the content scripts once at the start
		if (!(tabId in D3.injected_tabs)) {
			await browser.scripting.insertCSS({
				target: {
					tabId: tabId
				},
				files: ["styles/content.css"]
			});
			await browser.scripting.executeScript({
				target: {
					tabId: tabId
				},
				files: ['js/contentWorker.js']
			});
			D3.injected_tabs.push(tabId);
		}

		switch (type) {
			case 'console':
				let inject_console = function (title, text) {
					console.log(['d3coder:: FUNCTION:' + title, text]);
				};

				browser.scripting.executeScript({
					target: {
						tabId: tabId
					},
					func: inject_console,
					args: [title, text]
				});

				break;
			case 'alert':
				let inject_alert = function (title, text) {
					alert(title + '\n\n' + text);
				};

				browser.scripting.executeScript({
					target: {
						tabId: tabId
					},
					func: inject_alert,
					args: [title, text]
				});

				break;
			case 'div':
				let inject_div = function (title, text) {
					D3content.createDiv(title, text);
				};

				browser.scripting.executeScript({
					target: {
						tabId: tabId
					},
					func: inject_div,
					args: [title, text]
				});

				break;
			default:
			case 'inplace':
				let inject_inplace = function (text) {
					D3content.replaceText(text);
				};

				browser.scripting.executeScript({
					target: {
						tabId: tabId
					},
					func: inject_inplace,
					args: [text]
				});

				break;
		}
	},
	copyToClipboard: function (text) {
		function copyToClipboard(text) {
			if (navigator.clipboard) {
				navigator.clipboard.writeText(text).then(function () {
					console.log('D3: Copied to clipboard');
				}, function (err) {
					console.error(['D3: Error writing to clipboard', err]);
				});
			} else {
				console.error('D3: Clipboard not accessible');
			}
		}

		getCurrentTab().then(function (tab) {
			browser.scripting.executeScript({
				target: {
					tabId: tab.id
				},
				func: copyToClipboard,
				args: [text]
			});
		});
	},

	function_list: {
		'functions_rot13': ['function_rot13', "rot13decode"],
		'functions_timestamp': ['function_timestamp', "timestampToDate"],
		'functions_bin2hex': ['function_bin2hex', "bin2hex"],
		'functions_bin2txt': ['function_bin2txt', "bin2txt"],
		'functions_txt2hex': ['function_ascii2hex', "txt2hex"],
		'functions_hex2txt': ['function_hex2ascii', "hex2txt"],
		'functions_uri_encode': ['function_uri_encode', "uri_encode"],
		'functions_uri_decode': ['function_uri_decode', "uri_decode"],
		'functions_htmlentities': ['function_html_entities', "htmlentities"],
		'functions_html_entity_decode': ['function_html_entity_decode', "html_entity_decode"],
		'functions_htmlspecialchars': ['function_htmlspecialchars', "htmlspecialchars"],
		'functions_htmlspecialchars_decode': ['function_htmlspecialchars_decode', "htmlspecialchars_decode"],
		'functions_md5': ['function_md5', "md5"],
		'functions_sha1': ['function_sha1', "sha1"],
		'functions_crc32': ['function_crc32', "crc32"],
		'functions_quoted_printable_decode': ['function_quoted_printable_decode', "quoted_printable_decode"],
		'functions_quoted_printable_encode': ['function_quoted_printable_encode', "quoted_printable_encode"],
		'functions_escapeshellarg': ['function_escapeshellarg', "escapeshellarg"],
		'functions_base64_encode': ['function_base64_encode', "base64_encode"],
		'functions_base64_decode': ['function_base64_decode', "base64_decode"],
		'functions_unserialize': ['function_unserialize', "unserialize"],
		'functions_leet_encode': ['function_leet_encode', "leetEncode"],
		'functions_leet_decode': ['function_leet_decode', "leetDecode"],
		'functions_reverse': ['function_reverse_text', "reverseText"],
	},

	createContextMenu: function () {
		function clearMenu() {
			for (id in D3.menuIds) {
				if (id && D3.menuIds[id] != null) {
					browser.contextMenus.remove(D3.menuIds[id]);
				}
				D3.menuIds[id] = null;
			}
		}

		function createMenu(items, name) {
			let menu = null;

			if (items.checkboxes[name] == true && !D3.menuIds[name]) {
				// Menu for selected text
				menu = {
					"title": D3.translate(D3.function_list[name][0]),
					"contexts": ["selection", "editable"],
					"id": "d3coder-selection-" + D3.function_list[name][1]
				};
				try {
					D3.menuIds[name] = browser.contextMenus.create(menu);
				} catch (e) {
					console.log(["Error creating menu", e]);
				}
			} else if (items.checkboxes[name] == false) {
				if (D3.menuIds[name]) {
					browser.contextMenus.remove(D3.menuIds[name]);
					D3.menuIds[name] = null;
				}
			}
		}

		browser.storage.sync.get(null).then((items) => {
			clearMenu();

			for (itemName in items.checkboxes) {
				createMenu(items, itemName);
			}

			if (!D3.menuIds["options"]) {
				// Menu item for options
				menu = {
					"title": D3.translate("extName") + " " + D3.translate("settings"),
					"contexts": ["all"],
					"id": "d3coder-settings"
				}

				try {
					D3.menuIds["options"] = browser.contextMenus.create(menu);
				} catch (e) {
					console.log(e);
				}
			}
		});
	},

	translate: function (name) {
		let e_msg = "Could not translate " + name;

		return browser.i18n.getMessage(name) || e_msg;
	}
};