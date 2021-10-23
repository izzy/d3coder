/** 
 * Some functions from php.js (see phpjs.org)
 *
 * @version 4.1.0
 * @author Izzy Kulbe <github@unikorn.me>
 * @copyright (c) 2010 - 2019 Izzy Kulbe
 */

/**
 * KEY FUNCTION NAMESPACE
 */
var D3 = 
{	
	//needs a new Icon - best would be an icon per decoding type
	//icon: "popupIcon.png",
	icon: "../images/icon128.png",
	/**
     * Version number
     * 
     * @var String
     */
   version: "4.7.0",

   translations: {},

    /**
     * list all functions so we can use this while saving
     * @var Array 
     */
   checkboxes: Array( "functions_rot13",
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

	
			 	       
	checkInstall: function(callback) {
		chrome.storage.sync.get(null, function(items) {
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

			chrome.storage.sync.set(update, function(){
				console.log("Installed decoder version " + D3.version);
			});
		});               
	 },
	
	createPopup: function(title, text, type, clipboardCopy, tabId)
	{
		if(clipboardCopy) {
			D3.copyToClipboard(text);
		}
        
        D3.lastMessage = text;
		
		switch (type) {
			case 'console':
				chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/contentWorker.js']});
				
				let inject_console = function(title, text) {
					console.log('d3coder:: FUNCTION:' + title)
					console.log('d3coder:: VALUE:', text);
				};

				chrome.scripting.executeScript({target: {tabId: tabId}, func: inject_console, args: [title, text]});
				
				break;
			case 'alert': 
				let inject_alert = function(title, text) {
					alert(title + '\n\n' + text);
				};

				chrome.scripting.executeScript({target: {tabId: tabId}, func: inject_alert, args: [title, text]});

				break;
			case 'div':
				chrome.scripting.insertCSS({target: {tabId: tabId}, files: ["styles/content.css"]});
				chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/contentWorker.js']});

				text = D3.base64_encode(text);
				let inject_div = function(title, text) {
					D3content.createDiv(title, text);
				};

				chrome.scripting.executeScript({target: {tabId: tabId}, func: inject_div, args: [title, text]});

				break;
			default:
            case 'inplace':
				chrome.scripting.executeScript({target: {tabId: tabId}, files: ['js/contentWorker.js']});
				
                text = D3.base64_encode(text);
				let inject_inplace = function(text) {
					D3content.replaceText(text);
				};

				chrome.scripting.executeScript({target: {tabId: tabId}, func: inject_inplace, args: [text]});
				
                break;
		}	
	},
	copyToClipboard: function(text, fromClipboard=false) {
		async function getCurrentTab() {
			let queryOptions = {active: true, currentWindow: true};
			let [tab] = await chrome.tabs.query(queryOptions);
			return tab;
		}

		function copyToClipboard_inject (text) {
			let input = document.createElement('textarea');
			document.body.appendChild(input);
			input.value = text;
			input.focus();
			input.select();
			document.execCommand("copy");
			input.remove();
		}

		if (fromClipboard === true) {
			function pasteFromClipboard_inject () {
				let input = document.createElement('textarea');
				document.body.appendChild(input);
				input.focus();
				input.select();
				document.execCommand("paste");
				copyToClipboard_inject(D3lib[fn_name](clipboardText));
			}
	
			getCurrentTab().then(function (tab) {
				chrome.scripting.executeScript({
					target: {tabId: tab.id},
					func: pasteFromClipboard_inject
				});
			});
		}

		getCurrentTab().then(function (tab) {
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				func: copyToClipboard_inject,
				args: [text]}
				);
		});
        return true;
	},
	
	menus: false,
	
	menuLoadTime: 1000,
	
	createContextMenu: function() {
		D3.menus = true;

		var function_list = {
			'functions_rot13':                   ['function_rot13', "rot13decode"],
			'functions_timestamp':               ['function_timestamp', "timestampToDate"],
			'functions_bin2hex':                 ['function_bin2hex', "bin2hex"],
			'functions_bin2txt':                 ['function_bin2txt', "bin2txt"],
			'functions_txt2hex':                 ['function_ascii2hex', "txt2hex"],
			'functions_hex2txt':                 ['function_hex2ascii', "hex2txt"],
			'functions_uri_encode':              ['function_uri_encode', "uri_encode"],
			'functions_uri_decode':              ['function_uri_decode', "uri_decode"],
			'functions_htmlentities':            ['function_html_entities', "htmlentities"],
			'functions_html_entity_decode':      ['function_html_entity_decode', "html_entity_decode"],
			'functions_htmlspecialchars':        ['function_htmlspecialchars', "htmlspecialchars"],
			'functions_htmlspecialchars_decode': ['function_htmlspecialchars_decode', "htmlspecialchars_decode"],
			'functions_md5':                     ['function_md5', "md5"],
			'functions_sha1':                    ['function_sha1', "sha1"],
			'functions_crc32':                   ['function_crc32', "crc32"],
			'functions_quoted_printable_decode': ['function_quoted_printable_decode', "quoted_printable_decode"],
			'functions_quoted_printable_encode': ['function_quoted_printable_encode', "quoted_printable_encode"],
			'functions_escapeshellarg':          ['function_escapeshellarg', "escapeshellarg"],
			'functions_base64_encode':           ['function_base64_encode', "base64_encode"],
			'functions_base64_decode':           ['function_base64_decode', "base64_decode"],
			'functions_unserialize':             ['function_unserialize', "unserialize"],
			'functions_leet_encode':             ['function_leet_encode', "leetEncode"],
			'functions_leet_decode':             ['function_leet_decode', "leetDecode"],
	    	'functions_reverse':                 ['function_reverse_text', "reverseText"],
		};

		function clearMenu() {
			//while (localStorage.getItem("clearmenumutex") === "1") { }

			console.log("Menu: Clearing old menus");
			//localStorage.setItem("clearmenumutex", "1");
			for (id in D3.menuIds) {
				console.log("Menu: Removing menu entry: " + D3.menuIds[id]);
				console.log("Menu: Menu ID: " + id);
				if (id && D3.menuIds[id] != null) {
					chrome.contextMenus.remove(D3.menuIds[id]);
				}
				D3.menuIds[id] = null;
			}
			//localStorage.setItem("clearmenumutex", "0");
		}

		function createMenu(items, name) {
			let menu = null, changed = false;
			console.log("Menu: " + name);
			if (items.checkboxes[name] == true && !D3.menuIds[name]) {
				console.log("Menu: Creating " + name);
				
				// Menu for selected text
				menu = {
					"title"     : D3.translate(function_list[name][0]),
					"contexts"  : ["selection", "editable"],
					"id": "d3coder-selection-" + function_list[name][1]
				};
				D3.menuIds[name]=chrome.contextMenus.create(menu);

				// Menu for normal page
				menu = {
					"title"     : D3.translate(function_list[name][0]), 
					"contexts"  : ["page"],
					"id": "d3coder-" + function_list[name][1]
				};
				D3.menuIds[name + '_c']=chrome.contextMenus.create(menu);

				changed = true;
			} else if (items.checkboxes[name] == false) {
				if (D3.menuIds[name]) {
					console.log("Menu: Removing " + D3.menuIds[name]);
					chrome.contextMenus.remove(D3.menuIds[name]);
					D3.menuIds[name] = null;
				}

				if (D3.menuIds[name + '_c']) {
					console.log("Menu: Removing " + D3.menuIds[name + '_c']);
					chrome.contextMenus.remove(D3.menuIds[name + '_c']);
					D3.menuIds[name + '_c'] = null;
				}
			}	
		}

		chrome.storage.sync.get(null, function (items) {
			clearMenu();

			for (itemName in items.checkboxes) {
				createMenu(items, itemName);
			}
			
			if (!D3.menuIds["options"]) {
				// Menu item for options
				menu = {
					"title"     : D3.translate("extName") + " " + D3.translate("settings"),
					"contexts"  : ["all"],
					"id": "d3coder-settings"
				}
	
				D3.menuIds["options"]=chrome.contextMenus.create(menu);
			}
			console.log(D3.menuIds);
		});
    },

	translate: function(name) {
		if ("getMessage" in chrome.i18n) {
			return chrome.i18n.getMessage(name);
		} else {
			// TODO: Fill translations table from the content page
			if (name in D3.translations) {
				return D3.translations[name];
			} else {
				return "Could not translate " + name;
			}
		}
	}
};
