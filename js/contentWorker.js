console.log("d3coder: Loaded contentWorker.js");

/** 
 * @version 5.0.0
 */
D3content = {
    createDiv: function(title, text)
    {
        let hr = document.createElement('hr');
        let infoDiv;
        let infoText;
        let infoHeading;
        let resizeHandle;
        let heading;
        let closeElem;
        let startY;
        let startHeight;

        if(!document.getElementById('D3-inject')) {
            infoDiv           = document.createElement('div');
            infoDiv.id        = 'D3-inject';
            infoDiv.className = 'content';

            resizeHandle                        = document.createElement('div');
            resizeHandle.id                     = 'D3-inject_handle';
            resizeHandle.className              = 'handle vertical';
            resizeHandle.style.backgroundColor  = '#333';
            resizeHandle.style.backgroundRepeat = ' no-repeat;';

            heading           = document.createElement('h1');
            heading.id        = 'D3-inject-heading';
            heading.innerText = 'd3coder Output:';

            closeElem           = document.createElement('a');
            closeElem.id        = 'D3-inject-close';
            closeElem.innerText = 'CLOSE [X]';

            document.body.appendChild(infoDiv);
            document.getElementById('D3-inject').appendChild(resizeHandle);
            document.getElementById('D3-inject').appendChild(closeElem);
            document.getElementById('D3-inject').appendChild(heading);
            document.getElementById('D3-inject').appendChild(hr);
            
            document.body.style.marginBottom = document.defaultView.getComputedStyle(document.getElementById('D3-inject')).height;

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
                    document.body.style.marginBottom = y + 'px';
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

        infoHeading           = document.createElement('h2');
        infoHeading.className = 'D3-inject-heading';
        infoHeading.innerText = title;

        infoText           = document.createElement('pre');
        infoText.className = 'D3-inject-text';
        infoText.innerText = text;

        hr = document.createElement('hr');
	        
        infoDiv.appendChild(infoHeading);
        infoDiv.appendChild(infoText);
        infoDiv.appendChild(hr);
    },

    replaceText: function(text)
    {
        console.log("replaceText", text);
        var selection, range;

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
	}
};