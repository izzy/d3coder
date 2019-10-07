var D3menu = 
{
 /**
  * Version number
  * 
  * @var String
  */
 version: "2.1.0",
 /**
  * list all message types so we can use this while saving
  * @var Array 
  */
 options: Array("message_type1", "message_type2", "message_type3", "message_type4", "message_type5"),
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

 tabs: [
    'message',
    'context-menu',
    'misc',
    'credits'
 ]
}

function upgrade() {
    var clipboardSave, checkboxes, version;

    chrome.storage.sync.get({version: false}, function(items) {
        if (version) {
            console.log("D3coder version " + version + " found.");
            return;
        }
        console.log("New install or upgrade, checking local storage");

        clipboardSave = localStorage.getItem("message_automatic_clipboardcopy") == 1 ? true : false;
        checkboxes = [];
        messageType = localStorage.getItem("message_type") ? localStorage.getItem("message_type") : "notification";
        
    });
}

function save_options() {
    var checkboxes = [],
        messageType = document.getElementById(''),
        clipboardSave = document.getElementById("message_automatic_clipboardcopy").checked == true ? true : false;

    upgrade();

    for (option in D3menu.checkboxes) {
        if (D3menu.checkboxes.hasOwnProperty(option)) {
            var elem = document.getElementById(D3menu.checkboxes[option]);
            var value = "0";
            if(elem.checked) {
                value = elem.checked ? "1" : "0";
            } else {
                value = "0";
            }

            checkboxes[option] = value;
        }
    }
   
    //chrome.storage.sync.set
    console.log({
      checkboxes: checkboxes,
      messageType: messageType,
      clipboardSave: clipboardSave,
      version: D3menu.version
    })/*, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });*/
  }

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
      checkboxes: [],
      messageType: 'message',
      clipboardSave: false,
      version: 0
    }, function(items) {
      console.log(items.checkboxes);
      console.log(items.messageType);
      console.log(items.clipboardSave);
      console.log(items.version);
    });
  }
  document.addEventListener('DOMContentLoaded', restore_options);
  //document.getElementById('save').addEventListener('click', save_options);
  