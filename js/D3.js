/** 
 * @version 1.0
 * @author Maik Kulbe <info@linux-web-development.de>
 * @copyright (c) 2010 Maik Kulbe
 */

/**
 * RegEx escaping
 */
RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

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
   version: "1.0",
    /**
     * list all functions so we can use this while saving
     * @var Array 
     */
   checkboxes: Array( "functions_rot13",
                      "functions_timestamp",
                      "functions_crc32",
                      "functions_bin2hex",
                      "functions_bin2txt",
                      "functions_html_entity_decode",
                      "functions_htmlentities",
                      "functions_htmlspecialchars",
                      "functions_htmlspecialchars_decode",
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

    lastMessage: '',

	PhrasesEnglish:
		new Array('crap', 'dude', 'hacker',
		  'hacks', 'you', 'cool', 'oh my god',
		  'fear', 'power', 'own', 'lol',
		  'what the hell', 'elite', 'for the win', 
		  'oh really', 'good game'),

	PhrasesLeet:
		new Array('carp', 'dood', 'haxor', 'hax', 'joo',
		  'kewl', 'omg', 'ph43', 'powwah', 'pwn', 'lawl',
		  'wth', 'leet', 'ftw', 'o rly', 'gg'),

	LettersEnglish:
		new Array('n', 'b', 'k', 'd', 'e', 'f', 'g', 'h',
		  'p', 'm', 'r', 'l', 'o', 'q', 's', 't',
		  'u', 'x', 'w', 'y', 'z', 'c', 'a', 'j', 
		  'i', 'v', ' '),

	LettersLeet: 
		new Array('/\\/', '|}', '|X', '[)', '3', '|=', 'gee', '|-|',
		  '|*', '(\\/)', '|2', '1', '()', '0', '$', '+',
		  '|_|', '><', '\\X/', '\'/', '2', '<', '/\\', '_|', 
		  '|', '\\/', '  '),
			 	       
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
            
            D3.checkboxes.each(function(el){
                if(localStorage.getItem(el) != "0" && localStorage.getItem(el) != "1") {
                    localStorage.setItem(el, "1");
                }
            });
            localStorage.setItem('D3installed'+this.version, 'true');
            if(localStorage.getItem('D3lastversion')) {
                localStorage.removeItem('D3installed'+localStorage.getItem('lastversion'));
            }
            localStorage.setItem('D3lastversion',this.version);
            
        }   
	 },
	
	createPopup: function(title, text)
	{
		var type = localStorage.getItem("message_type");
		/*if(localStorage.getItem("history_save") == "1") {
		    if(localStorage.getItem("history_content")) {
		        var content = JSON.parse(localStorage.getItem("history_content"));
		        if(content.itemsCount == 15) {
		            var tmp = { 
		                        "itemsCount": "15",
		                        "items" : []
		                      };
		            for(var i=0;i<=13;i++) {
		                tmp.items[i] = {
                                           "title":    title,
                                           "text":     text
                                      };
		            }
		        } else {
		            content.itemsCount = content.itemsCount++;
		            content.items[content.itemsCount-1] = {
                		                "title":    title,
                                        "text":     text
		                              };
		        }
		    } else {
		        var content = {
		            "itemsCount": "1",
		            "items": [
    		                      {
    		                          "title":    title,
    		                          "text":     text
    		                      }
		                     ]
		        };
		        localStorage.setItem("history_content", JSON.stringify(content));
		    }
		}*/
		
		if(localStorage.getItem("message_automatic_clipboardcopy") == 1) {
			D3.copyToClipboard(text);
		}
        
        D3.lastMessage = text;
		
		switch (type) {
			case 'console':
				text = D3.base64_encode(text);
				
				chrome.tabs.executeScript(null, {file:'js/mootools.js'});
				chrome.tabs.executeScript(null, {file:'js/contentWorker.js'});
				
				chrome.tabs.executeScript(null, {code:"console.log('d3coder:: FUNCTION: " + title + "');"});
				chrome.tabs.executeScript(null, {code:"console.log('d3coder:: VALUE:');"});
				window.setTimeout(function(){
                    chrome.tabs.executeScript(
                        null, 
                        {code:"D3content.logConsole('" + text + "');"}
                    );
                },400);
				
				break;
			case 'alert': 
				alert(title + '\n\n' + text);
				console.log(text);
				break;
			case 'div':
				chrome.tabs.insertCSS(null, {file: "styles/content.css"});
				chrome.tabs.executeScript(null, {file:'js/mootools.js'});
				chrome.tabs.executeScript(null, {file:'js/contentWorker.js'});
				
                window.setTimeout(function() {
                    text = D3.base64_encode(text);
					chrome.tabs.executeScript(
                        null, 
                        {code:"D3content.createDiv('" + title + "', '" + text + "');"}
                    );
                },400);

                break;
            case 'inplace':
                // TODO: replace text in page
				chrome.tabs.executeScript(null, {file:'js/mootools.js'});
				chrome.tabs.executeScript(null, {file:'js/contentWorker.js'});
				
                window.setTimeout(function() {
                    text = D3.base64_encode(text);
					chrome.tabs.executeScript(
                        null, 
                        {code:"D3content.replaceText('" + text + "');"}
                    );
                },400);
                break;                
			default:
			case 'notification':
				var popup = window.webkitNotifications.createNotification( D3.icon, title, text);
				popup.show();
				break;
		}	
	},
	copyToClipboard: function(text) {
		var bg = chrome.extension.getBackgroundPage();
		var clipboard = bg.document.getElementById("clipboard");
		clipboard.style.display = "block";
		clipboard.value = text;
		clipboard.select();
		bg.document.execCommand("Copy");
		clipboard.style.display = "none";
        return true;
	},
	rot13decode: function(text) 
	{
		var keycode	= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var textrot	= new String();

		for(var i = 0; i < text.length; i++)
		{
			var codechar = text.substring(i, i + 1);
			var pos = keycode.indexOf(codechar.toUpperCase());

			if(pos >= 0)
			{
				pos = (pos + keycode.length / 2) % keycode.length;
				codechar = (codechar == codechar.toUpperCase()) ? keycode.substring(pos, pos + 1) : keycode.substring(pos, pos + 1).toLowerCase();
			}
			textrot	= textrot + codechar;
		}
			
		return textrot;
	},

	timestampToDate: function(text)
	{
		var timestamp = parseInt(text);

		if(!timestamp) return;

		var dateObject = new Date();
		dateObject.setTime (timestamp * 1000);
		return dateObject;
	},
	crc32: function( str ) {
	    str = this.utf8_encode(str);
	    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
	 
	    var crc = 0;
	    var x = 0;
	    var y = 0;
	 
	    crc = crc ^ (-1);
	    for (var i = 0, iTop = str.length; i < iTop; i++) {
	        y = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
	        x = "0x" + table.substr( y * 9, 8 );
	        crc = ( crc >>> 8 ) ^ x;
	    }
	 
	    return crc ^ (-1);
	},
	bin2hex: function (s){
	    var i, f = 0, a = [];
	    
	    s += '';
	    f = s.length;
	    
	    for (i = 0; i<f; i++) {
	        a[i] = s.charCodeAt(i).toString(16).replace(/^([\da-f])$/,"0$1");
	    }
	    
	    return a.join('');
	},
    bin2txt: function (binary){
        var string = "";
        binary.replace(/(\r\n|\n|\r)/gm,"");
        binary.replace(" ", "");
        
        var stripped = "";
        for (i=0; i < binary.length; i++) {
        	if (binary.charAt(i) != '\n' &&
        		binary.charAt(i) != '\r' &&
        		binary.charAt(i) != '\t') {
        			stripped += binary.charAt(i);
        	}
        }
        binary = stripped;

        for(i=0; i<binary.length/8; i++){
            sub = binary.substr(i*8, 8);
            num = 0;
            for(j=0; j<sub.length; j++){
                if(sub.charAt(j) == '0') {}
                else num += Math.pow(2, 7-j);
            }
            string += String.fromCharCode(num);
        }

        return string;
    },
    html_entity_decode: function (string, quote_style) {
	    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
	    tmp_str = string.toString();
	    
	    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
	        return false;
	    }
	 
	    // fix &amp; problem
	    // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
	    delete(hash_map['&']);
	    hash_map['&'] = '&amp;';
	 
	    for (symbol in hash_map) {
	        entity = hash_map[symbol];
	        tmp_str = tmp_str.split(entity).join(symbol);
	    }
	    tmp_str = tmp_str.split('&#039;').join("'");
	    
	    return tmp_str;
	},
	htmlentities: function (string, quote_style) {
	    var hash_map = {}, symbol = '', tmp_str = '', entity = '';
	    tmp_str = string.toString();
	    
	    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
	        return false;
	    }
	    hash_map["'"] = '&#039;';
	    for (symbol in hash_map) {
	        entity = hash_map[symbol];
	        tmp_str = tmp_str.split(symbol).join(entity);
	    }
	    
	    return tmp_str;
	},
	htmlspecialchars: function (string, quote_style, charset, double_encode) {
	    var optTemp = 0, i = 0, noquotes= false;
	    if (typeof quote_style === 'undefined' || quote_style === null) {
	        quote_style = 2;
	    }
	    string = string.toString();
	    if (double_encode !== false) { // Put this first to avoid double-encoding
	        string = string.replace(/&/g, '&amp;');
	    }
	    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	 
	    var OPTS = {
	        'ENT_NOQUOTES': 0,
	        'ENT_HTML_QUOTE_SINGLE' : 1,
	        'ENT_HTML_QUOTE_DOUBLE' : 2,
	        'ENT_COMPAT': 2,
	        'ENT_QUOTES': 3,
	        'ENT_IGNORE' : 4
	    };
	    if (quote_style === 0) {
	        noquotes = true;
	    }
	    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
	        quote_style = [].concat(quote_style);
	        for (i=0; i < quote_style.length; i++) {
	            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
	            if (OPTS[quote_style[i]] === 0) {
	                noquotes = true;
	            }
	            else if (OPTS[quote_style[i]]) {
	                optTemp = optTemp | OPTS[quote_style[i]];
	            }
	        }
	        quote_style = optTemp;
	    }
	    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
	        string = string.replace(/'/g, '&#039;');
	    }
	    if (!noquotes) {
	        string = string.replace(/"/g, '&quot;');
	    }
	 
	    return string;
	},
	htmlspecialchars_decode: function (string, quote_style) {
	    var optTemp = 0, i = 0, noquotes= false;
	    if (typeof quote_style === 'undefined') {
	        quote_style = 2;
	    }
	    string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	    var OPTS = {
	        'ENT_NOQUOTES': 0,
	        'ENT_HTML_QUOTE_SINGLE' : 1,
	        'ENT_HTML_QUOTE_DOUBLE' : 2,
	        'ENT_COMPAT': 2,
	        'ENT_QUOTES': 3,
	        'ENT_IGNORE' : 4
	    };
	    if (quote_style === 0) {
	        noquotes = true;
	    }
	    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
	        quote_style = [].concat(quote_style);
	        for (i=0; i < quote_style.length; i++) {
	            // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
	            if (OPTS[quote_style[i]] === 0) {
	                noquotes = true;
	            }
	            else if (OPTS[quote_style[i]]) {
	                optTemp = optTemp | OPTS[quote_style[i]];
	            }
	        }
	        quote_style = optTemp;
	    }
	    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
	        string = string.replace(/&#0*39;/g, "'"); // PHP doesn't currently escape if more than one 0, but it should
	        // string = string.replace(/&apos;|&#x0*27;/g, "'"); // This would also be useful here, but not a part of PHP
	    }
	    if (!noquotes) {
	        string = string.replace(/&quot;/g, '"');
	    }
	    // Put this in last place to avoid escape being double-decoded
	    string = string.replace(/&amp;/g, '&');
	 
	    return string;
	},
	md5: function (str) {
	    var xl;
	 
	    var rotateLeft = function (lValue, iShiftBits) {
	        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	    };
	 
	    var addUnsigned = function (lX,lY) {
	        var lX4,lY4,lX8,lY8,lResult;
	        lX8 = (lX & 0x80000000);
	        lY8 = (lY & 0x80000000);
	        lX4 = (lX & 0x40000000);
	        lY4 = (lY & 0x40000000);
	        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
	        if (lX4 & lY4) {
	            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
	        }
	        if (lX4 | lY4) {
	            if (lResult & 0x40000000) {
	                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
	            } else {
	                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
	            }
	        } else {
	            return (lResult ^ lX8 ^ lY8);
	        }
	    };
	 
	    var _F = function (x,y,z) { return (x & y) | ((~x) & z); };
	    var _G = function (x,y,z) { return (x & z) | (y & (~z)); };
	    var _H = function (x,y,z) { return (x ^ y ^ z); };
	    var _I = function (x,y,z) { return (y ^ (x | (~z))); };
	 
	    var _FF = function (a,b,c,d,x,s,ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	 
	    var _GG = function (a,b,c,d,x,s,ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	 
	    var _HH = function (a,b,c,d,x,s,ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	 
	    var _II = function (a,b,c,d,x,s,ac) {
	        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
	        return addUnsigned(rotateLeft(a, s), b);
	    };
	 
	    var convertToWordArray = function (str) {
	        var lWordCount;
	        var lMessageLength = str.length;
	        var lNumberOfWords_temp1=lMessageLength + 8;
	        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
	        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
	        var lWordArray=new Array(lNumberOfWords-1);
	        var lBytePosition = 0;
	        var lByteCount = 0;
	        while ( lByteCount < lMessageLength ) {
	            lWordCount = (lByteCount-(lByteCount % 4))/4;
	            lBytePosition = (lByteCount % 4)*8;
	            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
	            lByteCount++;
	        }
	        lWordCount = (lByteCount-(lByteCount % 4))/4;
	        lBytePosition = (lByteCount % 4)*8;
	        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
	        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
	        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
	        return lWordArray;
	    };
	 
	    var wordToHex = function (lValue) {
	        var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;
	        for (lCount = 0;lCount<=3;lCount++) {
	            lByte = (lValue>>>(lCount*8)) & 255;
	            wordToHexValue_temp = "0" + lByte.toString(16);
	            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);
	        }
	        return wordToHexValue;
	    };
	 
	    var x=[],
	        k,AA,BB,CC,DD,a,b,c,d,
	        S11=7, S12=12, S13=17, S14=22,
	        S21=5, S22=9 , S23=14, S24=20,
	        S31=4, S32=11, S33=16, S34=23,
	        S41=6, S42=10, S43=15, S44=21;
	 
	    str = this.utf8_encode(str);
	    x = convertToWordArray(str);
	    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
	    
	    xl = x.length;
	    for (k=0;k<xl;k+=16) {
	        AA=a; BB=b; CC=c; DD=d;
	        a=_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
	        d=_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
	        c=_FF(c,d,a,b,x[k+2], S13,0x242070DB);
	        b=_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
	        a=_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
	        d=_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
	        c=_FF(c,d,a,b,x[k+6], S13,0xA8304613);
	        b=_FF(b,c,d,a,x[k+7], S14,0xFD469501);
	        a=_FF(a,b,c,d,x[k+8], S11,0x698098D8);
	        d=_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
	        c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
	        b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
	        a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);
	        d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);
	        c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);
	        b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);
	        a=_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
	        d=_GG(d,a,b,c,x[k+6], S22,0xC040B340);
	        c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
	        b=_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
	        a=_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
	        d=_GG(d,a,b,c,x[k+10],S22,0x2441453);
	        c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
	        b=_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
	        a=_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
	        d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
	        c=_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
	        b=_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
	        a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
	        d=_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
	        c=_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
	        b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
	        a=_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
	        d=_HH(d,a,b,c,x[k+8], S32,0x8771F681);
	        c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
	        b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
	        a=_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
	        d=_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
	        c=_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
	        b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
	        a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
	        d=_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
	        c=_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
	        b=_HH(b,c,d,a,x[k+6], S34,0x4881D05);
	        a=_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
	        d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
	        c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
	        b=_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
	        a=_II(a,b,c,d,x[k+0], S41,0xF4292244);
	        d=_II(d,a,b,c,x[k+7], S42,0x432AFF97);
	        c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
	        b=_II(b,c,d,a,x[k+5], S44,0xFC93A039);
	        a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);
	        d=_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
	        c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
	        b=_II(b,c,d,a,x[k+1], S44,0x85845DD1);
	        a=_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
	        d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
	        c=_II(c,d,a,b,x[k+6], S43,0xA3014314);
	        b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
	        a=_II(a,b,c,d,x[k+4], S41,0xF7537E82);
	        d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
	        c=_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
	        b=_II(b,c,d,a,x[k+9], S44,0xEB86D391);
	        a=addUnsigned(a,AA);
	        b=addUnsigned(b,BB);
	        c=addUnsigned(c,CC);
	        d=addUnsigned(d,DD);
	    }
	 
	    var temp = wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);
	 
	    return temp.toLowerCase();
	},
	sha1: function (str) {
	    var rotate_left = function (n,s) {
	        var t4 = ( n<<s ) | (n>>>(32-s));
	        return t4;
	    };
	 
	    var cvt_hex = function (val) {
	        var str="";
	        var i;
	        var v;
	 
	        for (i=7; i>=0; i--) {
	            v = (val>>>(i*4))&0x0f;
	            str += v.toString(16);
	        }
	        return str;
	    };
	 
	    var blockstart;
	    var i, j;
	    var W = new Array(80);
	    var H0 = 0x67452301;
	    var H1 = 0xEFCDAB89;
	    var H2 = 0x98BADCFE;
	    var H3 = 0x10325476;
	    var H4 = 0xC3D2E1F0;
	    var A, B, C, D, E;
	    var temp;
	 
	    str = this.utf8_encode(str);
	    var str_len = str.length;
	 
	    var word_array = [];
	    for (i=0; i<str_len-3; i+=4) {
	        j = str.charCodeAt(i)<<24 | str.charCodeAt(i+1)<<16 |
	        str.charCodeAt(i+2)<<8 | str.charCodeAt(i+3);
	        word_array.push( j );
	    }
	 
	    switch (str_len % 4) {
	        case 0:
	            i = 0x080000000;
	        break;
	        case 1:
	            i = str.charCodeAt(str_len-1)<<24 | 0x0800000;
	        break;
	        case 2:
	            i = str.charCodeAt(str_len-2)<<24 | str.charCodeAt(str_len-1)<<16 | 0x08000;
	        break;
	        case 3:
	            i = str.charCodeAt(str_len-3)<<24 | str.charCodeAt(str_len-2)<<16 | str.charCodeAt(str_len-1)<<8    | 0x80;
	        break;
	    }
	 
	    word_array.push( i );
	 
	    while ((word_array.length % 16) != 14 ) {word_array.push( 0 );}
	 
	    word_array.push( str_len>>>29 );
	    word_array.push( (str_len<<3)&0x0ffffffff );
	 
	    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
	        for (i=0; i<16; i++) {W[i] = word_array[blockstart+i];}
	        for (i=16; i<=79; i++) {W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);}
	 
	 
	        A = H0;
	        B = H1;
	        C = H2;
	        D = H3;
	        E = H4;
	 
	        for (i= 0; i<=19; i++) {
	            temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
	            E = D;
	            D = C;
	            C = rotate_left(B,30);
	            B = A;
	            A = temp;
	        }
	 
	        for (i=20; i<=39; i++) {
	            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
	            E = D;
	            D = C;
	            C = rotate_left(B,30);
	            B = A;
	            A = temp;
	        }
	 
	        for (i=40; i<=59; i++) {
	            temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
	            E = D;
	            D = C;
	            C = rotate_left(B,30);
	            B = A;
	            A = temp;
	        }
	 
	        for (i=60; i<=79; i++) {
	            temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
	            E = D;
	            D = C;
	            C = rotate_left(B,30);
	            B = A;
	            A = temp;
	        }
	 
	        H0 = (H0 + A) & 0x0ffffffff;
	        H1 = (H1 + B) & 0x0ffffffff;
	        H2 = (H2 + C) & 0x0ffffffff;
	        H3 = (H3 + D) & 0x0ffffffff;
	        H4 = (H4 + E) & 0x0ffffffff;
	    }
	 
	    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	    return temp.toLowerCase();
	},
	quoted_printable_decode: function (str) {
	    var RFC2045Decode1 = /=\r\n/gm,
	    // Decodes all equal signs followed by two hex digits
	    RFC2045Decode2IN = /=([0-9A-F]{2})/gim, // the RFC states against decoding lower case encodings, but following apparent PHP behavior
	    // RFC2045Decode2IN = /=([0-9A-F]{2})/gm,
	 
	    RFC2045Decode2OUT = function (sMatch, sHex) {
	        return String.fromCharCode(parseInt(sHex, 16));
	    };
	    return str.replace(RFC2045Decode1, '').replace(RFC2045Decode2IN, RFC2045Decode2OUT);
	},
	quoted_printable_encode: function (str) {
	   var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
	    RFC2045Encode1IN = / \r\n|\r\n|[^!-<>-~ ]/gm,
	    RFC2045Encode1OUT = function (sMatch) {
	        // Encode space before CRLF sequence to prevent spaces from being stripped
	        // Keep hard line breaks intact; CRLF sequences
	        if (sMatch.length > 1) {
	            return sMatch.replace(' ', '=20');
	        }
	        // Encode matching character
	        var chr = sMatch.charCodeAt(0);
	        return '=' + hexChars[((chr >>> 4) & 15)] + hexChars[(chr & 15)];
	    },
	    RFC2045Encode2IN = /.{1,72}(?!\r\n)[^=]{0,3}/g,
	    RFC2045Encode2OUT = function (sMatch) {
	        if (sMatch.substr(sMatch.length - 2) === '\r\n') {
	            return sMatch;
	        }
	        return sMatch + '=\r\n';
	    };
	    str = str.replace(RFC2045Encode1IN, RFC2045Encode1OUT).replace(RFC2045Encode2IN, RFC2045Encode2OUT);
	    return str.substr(0, str.length - 3);
	},
	escapeshellarg: function (arg) {
	    var ret = '';
	 
	    ret = arg.replace(/[^\\]'/g, function(m, i, s) {
	            return m.slice(0, 1)+'\\\'';
	    });
	 
	    return "'"+ret+"'";
	},
    leetEncode: function (inputString) {
        if(!inputString ) return "";
	
		for (i = 0; i < D3.PhrasesEnglish.length; ++i)
			inputString = inputString.replace(
				new RegExp(D3.PhrasesEnglish[i], "gi"),
				D3.PhrasesLeet[i]
				);

		for (i = 0; i < D3.LettersEnglish.length; ++i)
			inputString = inputString.replace(
				new RegExp(D3.LettersEnglish[i], "gi"),
				D3.LettersLeet[i]
				);
		return inputString;
	},
    leetDecode: function (inputString) {
		for (i = 0; i < D3.LettersLeet.length; ++i)
			inputString = inputString.replace(
				new RegExp(RegExp.escape(D3.LettersLeet[i]), "g"),
				D3.LettersEnglish[i]
				);

		for (i = 0; i < D3.PhrasesLeet.length; ++i)
			inputString = inputString.replace(
				new RegExp(RegExp.escape(D3.PhrasesLeet[i]), "g"),
				D3.PhrasesEnglish[i]
				);
		return inputString;
    },
    reverseText: function (inputString) {
        return inputString.split("").reverse().join("");
    },
    base64_encode: function (data) {
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];
	 
	    if (!data) {
	        return data;
	    }
	 
	    data = this.utf8_encode(data+'');
	    
	    do { // pack three octets into four hexets
	        o1 = data.charCodeAt(i++);
	        o2 = data.charCodeAt(i++);
	        o3 = data.charCodeAt(i++);
	 
	        bits = o1<<16 | o2<<8 | o3;
	 
	        h1 = bits>>18 & 0x3f;
	        h2 = bits>>12 & 0x3f;
	        h3 = bits>>6 & 0x3f;
	        h4 = bits & 0x3f;
	 
	        // use hexets to index into b64, and append result to encoded string
	        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	    } while (i < data.length);
	    
	    enc = tmp_arr.join('');
	    
	    switch (data.length % 3) {
	        case 1:
	            enc = enc.slice(0, -2) + '==';
	        break;
	        case 2:
	            enc = enc.slice(0, -1) + '=';
	        break;
	    }
	 
	    return enc;
	},
	base64_decode: function (data) {
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];
	 
	    if (!data) {
	        return data;
	    }
	 
	    data += '';
	 
	    do {  // unpack four hexets into three octets using index points in b64
	        h1 = b64.indexOf(data.charAt(i++));
	        h2 = b64.indexOf(data.charAt(i++));
	        h3 = b64.indexOf(data.charAt(i++));
	        h4 = b64.indexOf(data.charAt(i++));
	 
	        bits = h1<<18 | h2<<12 | h3<<6 | h4;
	 
	        o1 = bits>>16 & 0xff;
	        o2 = bits>>8 & 0xff;
	        o3 = bits & 0xff;
	 
	        if (h3 == 64) {
	            tmp_arr[ac++] = String.fromCharCode(o1);
	        } else if (h4 == 64) {
	            tmp_arr[ac++] = String.fromCharCode(o1, o2);
	        } else {
	            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
	        }
	    } while (i < data.length);
	 
	    dec = tmp_arr.join('');
	    dec = this.utf8_decode(dec);
	 
	    return dec;
	},
	get_html_translation_table: function (table, quote_style) {
	    
	    var entities = {}, hash_map = {}, decimal = 0, symbol = '';
	    var constMappingTable = {}, constMappingQuoteStyle = {};
	    var useTable = {}, useQuoteStyle = {};
	    
	    // Translate arguments
	    constMappingTable[0]      = 'HTML_SPECIALCHARS';
	    constMappingTable[1]      = 'HTML_ENTITIES';
	    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
	    constMappingQuoteStyle[2] = 'ENT_COMPAT';
	    constMappingQuoteStyle[3] = 'ENT_QUOTES';
	 
	    useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
	    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
	 
	    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
	        throw new Error("Table: "+useTable+' not supported');
	        // return false;
	    }
	 
	    entities['38'] = '&amp;';
	    if (useTable === 'HTML_ENTITIES') {
	        entities['160'] = '&nbsp;';
	        entities['161'] = '&iexcl;';
	        entities['162'] = '&cent;';
	        entities['163'] = '&pound;';
	        entities['164'] = '&curren;';
	        entities['165'] = '&yen;';
	        entities['166'] = '&brvbar;';
	        entities['167'] = '&sect;';
	        entities['168'] = '&uml;';
	        entities['169'] = '&copy;';
	        entities['170'] = '&ordf;';
	        entities['171'] = '&laquo;';
	        entities['172'] = '&not;';
	        entities['173'] = '&shy;';
	        entities['174'] = '&reg;';
	        entities['175'] = '&macr;';
	        entities['176'] = '&deg;';
	        entities['177'] = '&plusmn;';
	        entities['178'] = '&sup2;';
	        entities['179'] = '&sup3;';
	        entities['180'] = '&acute;';
	        entities['181'] = '&micro;';
	        entities['182'] = '&para;';
	        entities['183'] = '&middot;';
	        entities['184'] = '&cedil;';
	        entities['185'] = '&sup1;';
	        entities['186'] = '&ordm;';
	        entities['187'] = '&raquo;';
	        entities['188'] = '&frac14;';
	        entities['189'] = '&frac12;';
	        entities['190'] = '&frac34;';
	        entities['191'] = '&iquest;';
	        entities['192'] = '&Agrave;';
	        entities['193'] = '&Aacute;';
	        entities['194'] = '&Acirc;';
	        entities['195'] = '&Atilde;';
	        entities['196'] = '&Auml;';
	        entities['197'] = '&Aring;';
	        entities['198'] = '&AElig;';
	        entities['199'] = '&Ccedil;';
	        entities['200'] = '&Egrave;';
	        entities['201'] = '&Eacute;';
	        entities['202'] = '&Ecirc;';
	        entities['203'] = '&Euml;';
	        entities['204'] = '&Igrave;';
	        entities['205'] = '&Iacute;';
	        entities['206'] = '&Icirc;';
	        entities['207'] = '&Iuml;';
	        entities['208'] = '&ETH;';
	        entities['209'] = '&Ntilde;';
	        entities['210'] = '&Ograve;';
	        entities['211'] = '&Oacute;';
	        entities['212'] = '&Ocirc;';
	        entities['213'] = '&Otilde;';
	        entities['214'] = '&Ouml;';
	        entities['215'] = '&times;';
	        entities['216'] = '&Oslash;';
	        entities['217'] = '&Ugrave;';
	        entities['218'] = '&Uacute;';
	        entities['219'] = '&Ucirc;';
	        entities['220'] = '&Uuml;';
	        entities['221'] = '&Yacute;';
	        entities['222'] = '&THORN;';
	        entities['223'] = '&szlig;';
	        entities['224'] = '&agrave;';
	        entities['225'] = '&aacute;';
	        entities['226'] = '&acirc;';
	        entities['227'] = '&atilde;';
	        entities['228'] = '&auml;';
	        entities['229'] = '&aring;';
	        entities['230'] = '&aelig;';
	        entities['231'] = '&ccedil;';
	        entities['232'] = '&egrave;';
	        entities['233'] = '&eacute;';
	        entities['234'] = '&ecirc;';
	        entities['235'] = '&euml;';
	        entities['236'] = '&igrave;';
	        entities['237'] = '&iacute;';
	        entities['238'] = '&icirc;';
	        entities['239'] = '&iuml;';
	        entities['240'] = '&eth;';
	        entities['241'] = '&ntilde;';
	        entities['242'] = '&ograve;';
	        entities['243'] = '&oacute;';
	        entities['244'] = '&ocirc;';
	        entities['245'] = '&otilde;';
	        entities['246'] = '&ouml;';
	        entities['247'] = '&divide;';
	        entities['248'] = '&oslash;';
	        entities['249'] = '&ugrave;';
	        entities['250'] = '&uacute;';
	        entities['251'] = '&ucirc;';
	        entities['252'] = '&uuml;';
	        entities['253'] = '&yacute;';
	        entities['254'] = '&thorn;';
	        entities['255'] = '&yuml;';
	    }
	 
	    if (useQuoteStyle !== 'ENT_NOQUOTES') {
	        entities['34'] = '&quot;';
	    }
	    if (useQuoteStyle === 'ENT_QUOTES') {
	        entities['39'] = '&#39;';
	    }
	    entities['60'] = '&lt;';
	    entities['62'] = '&gt;';
	 
	 
	    // ascii decimals to real symbols
	    for (decimal in entities) {
	        symbol = String.fromCharCode(decimal);
	        hash_map[symbol] = entities[decimal];
	    }
	    
	    return hash_map;
	},
	unserialize: function (data) {
	    var that = this;
	    var utf8Overhead = function(chr) {
	        var code = chr.charCodeAt(0);
	        if (code < 0x0080) {
	            return 0;
	        }
	        if (code < 0x0800) {
	             return 1;
	        }
	        return 2;
	    };


	    var error = function (type, msg, filename, line){throw new that.window[type](msg, filename, line);};
	    var read_until = function (data, offset, stopchr){
	        var buf = [];
	        var chr = data.slice(offset, offset + 1);
	        var i = 2;
	        while (chr != stopchr) {
	            if ((i+offset) > data.length) {
	                error('Error', 'Invalid');
	            }
	            buf.push(chr);
	            chr = data.slice(offset + (i - 1),offset + i);
	            i += 1;
	        }
	        return [buf.length, buf.join('')];
	    };
	    var read_chrs = function (data, offset, length){
	        var buf;

	        buf = [];
	        for (var i = 0;i < length;i++){
	            var chr = data.slice(offset + (i - 1),offset + i);
	            buf.push(chr);
	            length -= utf8Overhead(chr); 
	        }
	        return [buf.length, buf.join('')];
	    };
	    var _unserialize = function (data, offset){
	        var readdata;
	        var readData;
	        var chrs = 0;
	        var ccount;
	        var stringlength;
	        var keyandchrs;
	        var keys;

	        if (!offset) {offset = 0;}
	        var dtype = (data.slice(offset, offset + 1)).toLowerCase();

	        var dataoffset = offset + 2;
	        var typeconvert = function(x) {return x;};

	        switch (dtype){
	            case 'i':
	                typeconvert = function (x) {return parseInt(x, 10);};
	                readData = read_until(data, dataoffset, ';');
	                chrs = readData[0];
	                readdata = readData[1];
	                dataoffset += chrs + 1;
	            break;
	            case 'b':
	                typeconvert = function (x) {return parseInt(x, 10) !== 0;};
	                readData = read_until(data, dataoffset, ';');
	                chrs = readData[0];
	                readdata = readData[1];
	                dataoffset += chrs + 1;
	            break;
	            case 'd':
	                typeconvert = function (x) {return parseFloat(x);};
	                readData = read_until(data, dataoffset, ';');
	                chrs = readData[0];
	                readdata = readData[1];
	                dataoffset += chrs + 1;
	            break;
	            case 'n':
	                readdata = null;
	            break;
	            case 's':
	                ccount = read_until(data, dataoffset, ':');
	                chrs = ccount[0];
	                stringlength = ccount[1];
	                dataoffset += chrs + 2;

	                readData = read_chrs(data, dataoffset+1, parseInt(stringlength, 10));
	                chrs = readData[0];
	                readdata = readData[1];
	                dataoffset += chrs + 2;
	                if (chrs != parseInt(stringlength, 10) && chrs != readdata.length){
	                    error('SyntaxError', 'String length mismatch');
	                }

	                // Length was calculated on an utf-8 encoded string
	                // so wait with decoding
	                readdata = that.utf8_decode(readdata);
	            break;
	            case 'a':
	                readdata = {};

	                keyandchrs = read_until(data, dataoffset, ':');
	                chrs = keyandchrs[0];
	                keys = keyandchrs[1];
	                dataoffset += chrs + 2;

	                for (var i = 0; i < parseInt(keys, 10); i++){
	                    var kprops = _unserialize(data, dataoffset);
	                    var kchrs = kprops[1];
	                    var key = kprops[2];
	                    dataoffset += kchrs;

	                    var vprops = _unserialize(data, dataoffset);
	                    var vchrs = vprops[1];
	                    var value = vprops[2];
	                    dataoffset += vchrs;

	                    readdata[key] = value;
	                }

	                dataoffset += 1;
	            break;
	            default:
	                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
	            break;
	        }
	        return [dtype, dataoffset - offset, typeconvert(readdata)];
	    };
	    
	    return D3.var_dump(_unserialize((data+''), 0)[2]);
	},
	utf8_encode: function ( argString ) {
	    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	 
	    var utftext = "";
	    var start, end;
	    var stringl = 0;
	 
	    start = end = 0;
	    stringl = string.length;
	    for (var n = 0; n < stringl; n++) {
	        var c1 = string.charCodeAt(n);
	        var enc = null;
	 
	        if (c1 < 128) {
	            end++;
	        } else if (c1 > 127 && c1 < 2048) {
	            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
	        } else {
	            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
	        }
	        if (enc !== null) {
	            if (end > start) {
	                utftext += string.substring(start, end);
	            }
	            utftext += enc;
	            start = end = n+1;
	        }
	    }
	 
	    if (end > start) {
	        utftext += string.substring(start, string.length);
	    }
	 
	    return utftext;
	},
	utf8_decode: function ( str_data ) {
	   var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;
	    
	    str_data += '';
	    
	    while ( i < str_data.length ) {
	        c1 = str_data.charCodeAt(i);
	        if (c1 < 128) {
	            tmp_arr[ac++] = String.fromCharCode(c1);
	            i++;
	        } else if ((c1 > 191) && (c1 < 224)) {
	            c2 = str_data.charCodeAt(i+1);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
	            i += 2;
	        } else {
	            c2 = str_data.charCodeAt(i+1);
	            c3 = str_data.charCodeAt(i+2);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }
	    }
	 
	    return tmp_arr.join('');
	},

	/**
	 * Concatenates the values of a variable into an easily readable string
	 * by Matt Hackett [scriptnode.com]
	 * @param {Object} x The variable to debug
	 * @param {Number} max The maximum number of recursions allowed (keep low, around 5 for HTML elements to prevent errors) [default: 10]
	 * @param {String} sep The separator to use between [default: a single space ' ']
	 * @param {Number} l The current level deep (amount of recursion). Do not use this parameter: it's for the function's own use
	 */
	var_dump: function (x, max, sep, l) {

	    l = l || 0;
	    max = max || 10;
	    sep = sep || ' ';

	    if (l > max) {
	        return "[WARNING: Too much recursion]\n";
	    }

	    var
	        i,
	        r = '',
	        t = typeof x,
	        tab = '';

	    if (x === null) {
	        r += "(null)\n";
	    } else if (t == 'object') {

	        l++;

	        for (i = 0; i < l; i++) {
	            tab += sep;
	        }

	        if (x && x.length) {
	            t = 'array';
	        }

	        r += '(' + t + ") :\n";

	        for (i in x) {
	            try {
	                r += tab + '[' + i + '] : ' + D3.var_dump(x[i], max, sep, (l + 1));
	            } catch(e) {
	                return "[ERROR: " + e + "]\n";
	            }
	        }

	    } else {

	        if (t == 'string') {
	            if (x == '') {
	                x = '(empty)';
	            }
	        }

	        r += '(' + t + ') ' + x + "\n";

	    }

	    return r;

	},
	
	menus: false,
	
	menuLoadTime: 1000,
	
	createContextMenu: function() {
	    if(D3.menus == true) {
	        return;
	    }

	    D3.menus = true;
	    
    	/**
    	 * MENU ITEM DEFINITIONS
    	 */
    	if(localStorage.getItem("functions_rot13") == '1') {
    	    menu = {
    	            "title"     : "Rot13 Decode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("rot13", D3.rot13decode(info.selectionText));} 
    	        };
    
    	    var idRot13=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_timestamp") == '1') {
    	    menu = {
    	            "title"     : "Unix timestamp to date conversion", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("Timestamp to Date", D3.timestampToDate(info.selectionText));}
    	        };
    	    
    	    var idTimestamp=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_bin2hex") == '1') {
    	    menu = {
    	            "title"     : "bin2hex", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("bin2hex", D3.bin2hex(info.selectionText));}
    	        };
    	    
    	    var idBin2hex=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_bin2txt") == '1') {
    	    menu = {
    	            "title"     : "bin2txt", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("bin2txt", D3.bin2txt(info.selectionText));}
    	        };
    	    
    	    var idBin2txt=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_htmlentities") == '1') {
    	    menu = {
    	            "title"     : "HTML entities", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("HTML entities", D3.htmlentities(info.selectionText));}
    	        };
    	    
    	    var idHtmlEntities=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_html_entity_decode") == '1') {
    	    menu = {
    	            "title"     : "HTML entity decode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("HTML entity decode", D3.html_entity_decode(info.selectionText));}
    	        };
    	    
    	    var idHtmlentitiedecode=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_htmlspecialchars") == '1') {
    	    menu = {
    	            "title"     : "HTML specialchars", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("HTML specialchars", D3.htmlspecialchars(info.selectionText,2,null,true));}
    	        };
    	    
    	    var idHtmlspecialchars=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_htmlspecialchars_decode") == '1') {
    	    menu = {
    	            "title"     : "HTML specialchars decode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("HTML specialchars decode", D3.htmlspecialchars_decode(info.selectionText));}
    	        };
    	    
    	    var idHtmlspecialchardecode=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_md5") == '1') {
    	    menu = {
    	            "title"     : "MD5", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("MD5", D3.md5(info.selectionText));}
    	        };
    	    
    	    var idMd5=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_sha1") == '1') {
    	    menu = {
    	            "title"     : "SHA1", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("SHA1", D3.sha1(info.selectionText));}
    	        };
    	    
    	    var idSha1=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_crc32") == '1') {
    	    menu = {
    	            "title"     : "CRC32", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("CRC32", D3.crc32(info.selectionText));}
    	        };
    	    
    	    var idCrc32=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_quoted_printable_decode") == '1') {
    	    menu = {
    	            "title"     : "Quoted printable decode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("Quoted printable decode", D3.quoted_printable_decode(info.selectionText));}
    	        };
    	    
    	    var idQuotetprintabledecode=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_quoted_printable_encode") == '1') {
    	    menu = {
    	            "title"     : "Quoted printable encode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("Quoted printable encode", D3.quoted_printable_encode(info.selectionText));}
    	        };
    	    
    	    var idQuotetprintableencode=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_escapeshellarg") == '1') {
    	    menu = {
    	            "title"     : "Escapeshellarg", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("Escapeshellarg", D3.escapeshellarg(info.selectionText));}
    	        };
    	    
    	    var idEscapeshellarg=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_base64_encode") == '1') {
    	    menu = {
    	            "title"     : "Base64 encode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("Base64 encode", D3.base64_encode(info.selectionText));}
    	        };
    	    
    	    var idBase64encode=chrome.contextMenus.create(menu);
    	}
    
    	if(localStorage.getItem("functions_base64_decode") == '1') {
    	    menu = {
    	            "title"     : "Base64 decode", 
    	            "contexts"  : ["selection", "editable"],
    	            "onclick"   : function(info, tab){D3.createPopup("Base64 decode", D3.base64_decode(info.selectionText));}
    	        };
    	    
    	    var idBase64decode=chrome.contextMenus.create(menu);
    	}
    	
    	if(localStorage.getItem("functions_unserialize") == '1') {
            menu = {
                    "title"     : "Unserialize", 
                    "contexts"  : ["selection", "editable"],
                    "onclick"   : function(info, tab){D3.createPopup("Unserialize", D3.unserialize(info.selectionText));}
                };
            
            var idBase64decode=chrome.contextMenus.create(menu);
        }

    	if(localStorage.getItem("functions_leet_encode") == '1') {
            menu = {
                    "title"     : "L33T Encode", 
                    "contexts"  : ["selection", "editable"],
                    "onclick"   : function(info, tab){D3.createPopup("L33T Encode", D3.leetEncode(info.selectionText));}
                };
            
            var idLeetEncode=chrome.contextMenus.create(menu);
        }

    	if(localStorage.getItem("functions_leet_decode") == '1') {
            menu = {
                    "title"     : "L33T Decode", 
                    "contexts"  : ["selection", "editable"],
                    "onclick"   : function(info, tab){D3.createPopup("L33T Decode", D3.leetDecode(info.selectionText));}
                };
            
            var idLeetDecode=chrome.contextMenus.create(menu);
        }

        if(localStorage.getItem("functions_reverse") == '1') {
            menu = {
                    "title"     : "Reverse text",
                    "contexts"  : ["selection", "editable"],
                    "onclick"   : function(info, tab) {D3.createPopup("Reverse", D3.reverseText(info.selectionText));}
            };

            var idReverseText=chrome.contextMenus.create(menu);
        }
    }
};
