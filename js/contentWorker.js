/** 
 * @version 2.0.5
 * @author Izzy Kulbe <github@unikorn.me>
 * @copyright (c) 2010 - 2018 Izzy Kulbe
 */
D3content = {
    createDiv: function(title, text)
    {
        text = D3content.base64_decode(text);
        var hr = document.createElement('hr'),
            infoDiv,
            infoText,
            infoHeading,
            infoClipboardCopy,
            backUrl,
            resizeHandle,
            heading,
            closeElem,
            centerBottomResize,
            startX,
            startY,
            startWidth,
            startHeight;

        if(!document.getElementById('D3-inject')) {
            infoDiv           = document.createElement('div');
            infoDiv.id        = 'D3-inject';
            infoDiv.className = 'content';

            backUrl = chrome.extension.getURL("images/grip.png"),

            resizeHandle                        = document.createElement('div');
            resizeHandle.id                     = 'D3-inject_handle';
            resizeHandle.className              = 'handle vertical';
            resizeHandle.style.backgroundColor  = '#333';
            resizeHandle.style.backgroundImage  = 'url(\'' + backUrl + '\')';
            resizeHandle.style.backgroundRepeat = ' no-repeat;';

            heading           = document.createElement('h1');
            heading.id        = 'D3-inject-heading';
            heading.innerText = 'd3coder Output:';

            closeElem           = document.createElement('a');
            closeElem.id        = 'D3-inject-close';
            closeElem.innerText = 'CLOSE [X]';

            document.body.appendChild(resizeHandle);
            document.body.appendChild(infoDiv);
            document.getElementById('D3-inject').appendChild(closeElem);
            document.getElementById('D3-inject').appendChild(heading);
            document.getElementById('D3-inject').appendChild(hr);

            document.getElementById('D3-inject-close').addEventListener('click', function(){
                document.getElementById('D3-inject_handle').parentNode.removeChild(document.getElementById('D3-inject_handle'));                
                document.getElementById('D3-inject').parentNode.removeChild(document.getElementById('D3-inject'));
            });

            document.getElementById('D3-inject_handle').addEventListener('mousedown', initDrag, false);

            function initDrag(e) {
                var oldSelectStart = document.body.onselectstart;
                document.body.onselectstart = function() {return false;};

                function doDrag(e) {
                    var y = startHeight + (startY - e.clientY);
                    if (y < 100) {
                        return;
                    }

                    document.getElementById('D3-inject').style.height = 
                        y + 'px';
                    document.getElementById('D3-inject_handle').style.bottom =
                        y + 'px';
                }

                function stopDrag(e) {
                    document.documentElement.removeEventListener('mousemove', doDrag, false);
                    document.documentElement.removeEventListener('mouseup', stopDrag, false);
                    document.body.onselectstart=oldSelectStart;
                }

                startY = e.clientY;
                startHeight = parseInt(
                                  document.defaultView.getComputedStyle(
                                      document.getElementById('D3-inject')
                                  ).height,
                              10);

                document.documentElement.addEventListener('mousemove', doDrag, false);
                document.documentElement.addEventListener('mouseup', stopDrag, false);
            }
        } else {
            infoDiv = document.getElementById('D3-inject');
        }

        infoHeading           = document.createElement('h3');
        infoHeading.className = 'D3-inject-heading';
        infoHeading.innerText = title;

        infoText           = document.createElement('pre');
        infoText.className = 'D3-inject-text';
        infoText.innerText = text;

        infoClipboardCopy              = document.createElement('a');
        infoClipboardCopy.href         = 'javascript:void';
        infoClipboardCopy.innerText    = ' ';
        infoClipboardCopy.style.width  = 20;
        infoClipboardCopy.style.height = 20;
        infoClipboardCopy.style.backgroundImage = 'url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAAUABQDASIAAhEBAxEB/8QAGAABAAMBAAAAAAAAAAAAAAAAAAQFBgf/xAAmEAABAwQCAQMFAAAAAAAAAAABAgMEAAUGERIhYRMiMQcjY5Gz/8QAFQEBAQAAAAAAAAAAAAAAAAAABAP/xAAcEQACAQUBAAAAAAAAAAAAAAAAAQIDERIx0SL/2gAMAwEAAhEDEQA/AOnZVerjbp1rg2lmOt+cp3an0qUEpQkKOgkgk6J/XmqGdkWR2aG5NdQy+y2pBeS/FcbI2dew70OyOjvXfZq1ydfHNsS8ql/zFQ/qOtQw24FSSPez8j8go8m8Zu+uIvFK8FbfTcUpSkEDPZNjMa9ORpD0yfHejKV6TkZ7gU8hpWjo/OhVCnBIkz7Uy83x9kkcmnZnJKu99jj4pSi1EsxNN+TeNN+kgJ5rX5WdmlKUoMf/2Q==)';
        infoClipboardCopy.style.position = 'absolute';
        infoClipboardCopy.style.top      = 0;
        infoClipboardCopy.style.right    = 0;
        infoClipboardCopy.title          = 'Copy last conversion to clipboard';
        infoClipboardCopy.id             = 'D3-clipboard-button';

        hr = document.createElement('hr');
	        
        infoDiv.appendChild(infoHeading);
        infoDiv.appendChild(infoClipboardCopy);
        infoDiv.appendChild(infoText);
        infoDiv.appendChild(hr);

        document.getElementById('D3-clipboard-button').addEventListener('click', function(){
            chrome.extension.sendRequest({command: "doCopy"}, function(response) {
                console.log(response);
            });

            /*
                var bg = chrome.extension.getBackgroundPage();
                var clipboard = bg.document.getElementById("clipboard");
                clipboard.style.display = "block";
                clipboard.value = text;
                clipboard.select();
                bg.document.execCommand("Copy");
                clipboard.style.display = "none";
            */
        });
    },

    replaceText: function(text)
    {
        var selection, range;

        text = D3content.base64_decode(text);
        if (window.getSelection) {
            selection = window.getSelection();
            if (selection.rangeCount) {
                range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.text = text;
        }
	},

    logConsole: function(text) 
    {
	    console.log(D3content.base64_decode(text));
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
	    dec = D3content.utf8_decode(dec);
	 
	    return dec;
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
	}
};
