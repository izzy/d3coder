/**
 * Localize the settings page
 * curtesy of https://stackoverflow.com/a/25612056
 */
let localizeHtmlPage = function(){
  let elems = document.getElementsByTagName('html');
  for (let j = 0; j < elems.length; j++) {
    let obj = elems[j];

    let valStrH = obj.innerHTML.toString();
    let valNewH = valStrH.replace(/__MSG_(\w+)__/g, function(match, v1) {
      return v1 ? chrome.i18n.getMessage(v1) : "";
    });

    if(valNewH != valStrH)
    {
        obj.innerHTML = valNewH;
    }
  }
}();

var D3menu = {
  /**
    * Version number
    * 
    * @var String
    */
  version: "4.0.0",
  
  /**
    * list all functions. Needed to upgrade from older versions
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
                    "functions_reverse")
}

function upgrade() {
    var clipboardSave, checkboxes = {}, version = D3menu.version;

    chrome.storage.sync.get({version: false}, function(items) {
        if (items.version) {
            console.log("Upgrade: D3coder version " + version + " found.");
            return;
        }

        console.log("Upgrade: New install or upgrade, checking local storage");
    });
}

function save_options() {
    var checkboxes = {},
        messageType = document.getElementById('message_type').value,
        clipboardSave = document.getElementById("message_automatic_clipboardcopy").checked == true ? true : false;

    for (option of document.querySelectorAll("input[id^='functions_'")) {
      checkboxes[option.id] = document.getElementById(option.id).checked == true ? true : false;
    }
  
    chrome.storage.sync.set(
      {
        checkboxes: checkboxes,
        messageType: messageType,
        clipboardSave: clipboardSave,
        version: D3menu.version
      }, function() {
        console.log("Save: Options saved to storage");
        var status = document.getElementById('status');
        status.textContent = chrome.i18n.getMessage('options_saved');
        status.style.display = "block";
        status.style.opacity = 1;
        setTimeout(function() {
          status.style.opacity = 0;
          status.style.display = "block";
        }, 2000);
    });
  }

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  console.log("Restore: Starting restore");
  chrome.storage.sync.get({
    checkboxes: [],
    messageType: 'message',
    clipboardSave: false,
    version: 0
  }, function(items) {
    console.log("Restore: Loaded these items:");
    console.log("Restore: Checkboxes", items.checkboxes);
    console.log("Restore: Message Type", items.messageType);
    console.log("Restore: Clipboard save", items.clipboardSave);
    console.log("Restore: Version", items.version);

    if (!items.version) {
      console.log("No version found during startup, running upgrade");
      upgrade();
    } else {
      document.getElementById("message_automatic_clipboardcopy").checked = items.clipboardSave;
      document.getElementById("message_type").value = items.messageType;

      for (checkbox in items.checkboxes) {
        document.getElementById(checkbox).checked = items.checkboxes[checkbox];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', restore_options);

for (tag of document.querySelectorAll("input, select")) {
  tag.addEventListener('change', save_options);
}