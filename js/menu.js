/** 
 * @version 2.0
 * @author Maik Kulbe <info@linux-web-development.de>
 * @copyright (c) 2010 Maik Kulbe
 */

var D3menu = 
{
 /**
  * Version number
  * 
  * @var String
  */
 version: "1.0",
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
 ],

		
 /**
  * initialization to collect startup errors
  */
 init: function() {
	try {
	    D3menu.checkInstall();
		D3menu.restore_options();
	} catch(e) {
		alert("An error accured:\n" + e + "\n\n Feel free to report errors to "+
				"info@linux-web-development.de so I can fix them.");
	}
 },
 
 checkInstall: function() {
     if(!localStorage.getItem('D3installed'+this.version) || localStorage.getItem('D3installed'+this.version) != 'true') {
         if(!localStorage.getItem("message_type")) 
             localStorage.setItem("message_type", "alert");
         if(!localStorage.getItem("message_type1"))
             localStorage.setItem("message_type1", "1"); 
         if(!localStorage.getItem("message_type2"))
             localStorage.setItem("message_type2", "0");
         if(!localStorage.getItem("message_type3"))
             localStorage.setItem("message_type3", "0");
         if(!localStorage.getItem("message_type4"))
        	 localStorage.setItem("message_type4", "0");
         if(!localStorage.getItem("message_type5"))
        	 localStorage.setItem("message_type5", "0");
         
         if(!localStorage.getItem("message_automatic_clipboardcopy"))
             localStorage.setItem("message_automatic_clipboardcopy", "0");
         
         for (el in D3menu.checkboxes) {
             if(D3menu.checkboxes.hasOwnProperty(el)) {
                 if(localStorage.getItem(el) != "0" && localStorage.getItem(el) != "1") {
                     localStorage.setItem(el, "1");
                 }
             }
         }

         localStorage.setItem('D3installed'+this.version, 'true');
         if(localStorage.getItem('D3lastversion')) {
        	 localStorage.removeItem('D3installed'+localStorage.getItem('lastversion'));
         }
         localStorage.setItem('D3lastversion',this.version);
         
     }   
 },
 
 /**
  * Save options to localStorage
  */
 save_options: function(alertText) {
     console.log("Called save_options");
	 if(alertText == undefined) {
		 alert = true;
	 }
     var value = false;
     for (option in D3menu.options) {
         if(D3menu.options.hasOwnProperty(option)) {
		     if(document.getElementById(D3menu.options[option]) && document.getElementById(D3menu.options[option]).checked == true) {
			     value = document.getElementById(D3menu.options[option]).value; 
		     }
         }
	 }

     localStorage.setItem("message_type", value ? value : "notifications");
     
     if(document.getElementById("message_automatic_clipboardcopy").checked == true) {
    	 localStorage.setItem("message_automatic_clipboardcopy", 1);
     } else {
    	 localStorage.setItem("message_automatic_clipboardcopy", 0);
     }

	 console.log('Updating functions');
	 for (option in D3menu.checkboxes) {
         if (D3menu.checkboxes.hasOwnProperty(option)) {
		     var elem = document.getElementById(D3menu.checkboxes[option]);
		     var value = "0";
		     if(elem.checked) {
			     value = elem.checked ? "1" : "0";
		     } else {
                value = "0";
             }

		     localStorage.setItem(D3menu.checkboxes[option], value); 
         }
	 }
 },

 /**
  * Restore options from localStorage
  */
 restore_options: function() {
	 var type 				= localStorage.getItem("message_type") ? 
			 						localStorage.getItem("message_type") : 
			 						"notifications"; 
	 var somethingChecked   = false;
	 
	 if(localStorage.getItem("message_automatic_clipboardcopy") == 1) {
		 document.getElementById("message_automatic_clipboardcopy").checked = true;
     } else {
    	 document.getElementById("message_automatic_clipboardcopy").checked = false;
     }
	 
	 for (option in D3menu.options) {
         if (D3menu.options.hasOwnProperty(option)) {
		     var optionValue = document.getElementById(D3menu.options[option]).value;
		     if(optionValue==type) {
			     document.getElementById(D3menu.options[option]).checked = true;
			     somethingChecked = true;
		     }
         }
	 }

	 if(somethingChecked == false) {
		 document.getElementById('message_type2').checked = true;
	 }
	 
	 for (option in D3menu.checkboxes) {
         if (D3menu.checkboxes.hasOwnProperty(option)) {
		     var value = localStorage.getItem(D3menu.checkboxes[option]) == 1 ? true : false;
		     var elem = document.getElementById(D3menu.checkboxes[option]).checked = value;
         }
	 }
 },
 
 /**
  * menu tab functions
  * TODO:  better code to switch between tabs than this massive block of JS
  */
 showTab: function(name) {
    var deactivate = function(id) {
            document.getElementById(id).style.display    = 'none';
            document.getElementById(id).style.opacity    = '0';
            document.getElementById(id+'-tab').className = '';
        },
        activate = function(id) {
            document.getElementById(id).style.display    = '';
            document.getElementById(id).style.opacity    = '1';
            document.getElementById(id+'-tab').className = 'active';
        };

    for (n in D3menu.tabs) {
        if (D3menu.tabs.hasOwnProperty(n)) {
            if (D3menu.tabs[n] !== name) {
                deactivate(D3menu.tabs[n]);
            } else {
                activate(D3menu.tabs[n])
            }
        }
    }

    document.location.hash = name;
 }
};

D3menu.init();

var inputs = document.querySelectorAll('input');
for (el in inputs) {
    if (inputs.hasOwnProperty(el) && inputs[el] && el != 'length') {
	    inputs[el].addEventListener('change', function() {
            D3menu.save_options(false);
        });
    }
}

var listenerForTab = function(n) {
    document.getElementById(n + '-tab').addEventListener('click', function () {
        D3menu.showTab(n);
    });
}

for (tab in D3menu.tabs) {
    if (D3menu.tabs.hasOwnProperty(tab)) {
        listenerForTab(D3menu.tabs[tab]);
    }
}

if (document.location.hash) {
    D3menu.showTab(document.location.hash.substr(1));
}
