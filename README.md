dreamyLiteBox
=============

A super simple jQuery lite box


Overview
=============

* **Options**
  -type: 'modal', // String with the type of the message(alert, confirm, prompt, wait, modal).
  -event: 'click', // click & hover are allowed. "Manual" to manually open the litebox.
  -title: true, // Add a title to the lite box. False: no title, True: button/link value/text, String: title text.
  -msg: false, //String(HTML or just text) or jQuery object with the content for the message.
  -buttons: null, // Add extra buttons as an object where the key is the label and the value the callback:
               //  {'myButton': function(){doSomething()}}
               // For close the lite box you must add the close method to the callback like this:
               //  {'myButton': function(){doSomething();$(this).dreamyLiteBox('close')}}
  -useDefaultBtns: true, // Use the defaults buttons
  -bg: true, // Whaterver to use background or not
  -bgColor: "#000", // Background color of the background layer
  -useDefaultSizeType: true, // Boolean to use the default size for each type  
  -width: 530, // Number for a custom with. Optional, if is undefined use a default value.
  -height: 150, //Number for a custom height. Optional, if is undefined use a default value.
  -callbackOnConfirm: null, // Callback used only for the confirm and prompt messages, with the function to call after confirm the message.
  -callbackOnCancel: null, // Callback used only for the confirm and prompt messages, with the function to call after cancel the message.
  -callbackOnOpen: null, // Callback for appear function
  -callbackOnClose: null, // Callback for disappear function
  -callbackBeforeOpen: null, // Callback before open the lite box
  -callbackBeforeClose: null // Callback before close the lite box


* **Theming**
  - You can easily edit the `dreamyLiteBox.css` with your own styles.
  - If you are handy with LESS, you also have the `dreamyLiteBox.less` file.