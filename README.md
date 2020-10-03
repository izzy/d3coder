d3coder
=============================

Google Chrome Encoding/Decoding Plugin for various types of encoding like 
base64, rot13 or unix timestamp conversion.

CHANGELOG
=============================

* 4.4.0
  * Added Dutch translations
* 4.3.0
  * Added Portuguese - Brazil translation
* 4.2.0
  * Fixes missing permission ClipboardRead
  * Removes unneeded permission tabs
* 4.1.0
  * Removed native notifications output type (see #25)
* 4.0.0
  * Added i18n capabilities
  * Added English translation
  * Added German translation
* 3.0.0
  * Updated Options UI to Chrome's more modern v2 options
  * Changed storage to Chrome's sync storage
* 2.1.0
  * Added ASCII to Text function
  * Added Text to ASCII function
* 2.0.7
  * Fixed duplicate base64 options entry
* 2.0.5
  * Fixed broken unserialize function
* 2.0.4
  * Fixed update of context menu after disabling menu items
* 2.0.3
  * Fixed broken install
* 2.0.2
  * Small updates to options page
* 2.0.1
  * Bugfix: Fixed broken encryptions
* 2.0.0
  * Rewrite of core code to drop library
  * Updated options page theme
  * Rewrite of options page code
* 1.3.0
  * Feature: New menu for direct in-clipboard-conversion
* 1.2.6
  * Bugfix: Problems with context menu customization
* 1.2.5 / 1.2.4
  * Packaging problems
* 1.2.3
  * Added function URI encode
  * Added function URI decode
  * Added link to menu in context menu
* 1.2.2
  * Fixed not-working outputs (manifest v2 regression)
* 1.2.1
  * Fixed not-working options-page (manifest v2 regression)
* 1.2.0
  * Added function reverse
* 1.1.0
  * Changed manifest to version 2
* 1.0.0
  * Added in-place conversion
* 0.6.0
  * Added automatic clipboard funtionality
  * Added div-style clipboard button
* 0.5.0
  * Added function bin2txt
  * Added function L33T encode
  * Added function L33T decode
* 0.4.2
  * Fixed output of serialize function
* 0.4.1
  * Fixed broken output
* 0.4
  * Instant change of context menu items after removing/adding functions
  * Div-output is now resizable in height
  * Added function base64 encode
  * Added function base64 decode 
  * Added function unserialize
* 0.3:
  * Re-designed the options page to fit better into Chrome
  * Removed save and cancel button on options page
  * Changes made on the options page are saved immediately
  * Added DIV-output
  * Added Console.log()-output
* 0.2:
  * Moved the options from browser action to options page
  * Fixed the image for HTML5 notifications
* 0.1:
  * Output via alert() and native HTML5 Notifications
  * Functions:
    * Timestamp decoding
    * rot13 en-/decoding
    * base64 encoding
    * base64 decoding
    * CRC32 hashing
    * MD5 hashing
    * SHA1 hashing
    * bin2hex
    * HTML entity encoding
    * HTML entity decoding
    * HTML specialchars encoding
    * HTML specialchars decoding
    * Quoted printable decoding
    * Quoted printable encoding
    * Escapeshellarg
