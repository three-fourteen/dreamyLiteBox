dreamyLiteBox
=============

A super simple jQuery lite box


Options
=============

type: 'modal', // String with the type of the message(alert, confirm, prompt, wait, modal).
event: 'click', // click & hover are allowed. "Manual" to manually show the litebox.
title: null, // Add a title to the lite box.
msg: false, //String with the content for the message. It could be HTML or just text.
buttons: null, // Add extra buttons as an object where the key is the label and the value the callback:
		       //  {'myButton': function(){doSomething()}}
               // For close the lite box you must add the close method to the callback like this:
               //  {'myButton': function(){doSomething();$(this).dreamyLiteBox('hide')}}
useDefaultBtns: true, // Use the defaults buttons
bg: true, // Whaterver to use background or not
bgColor: "#000", // Background color of the background layer
useDefaultSizeType: true, // Boolean to use the default size for each type  
width: 530, // Number for a custom with. Optional, if is undefined use a default value.
height: 100, //Number for a custom height. Optional, if is undefined use a default value.
callbackOnConfirm: function(){}, // Callback used only for the confirm and prompt messages, with the function to call after confirm the message.
callbackOnCancel: function(){}, // Callback used only for the confirm and prompt messages, with the function to call after cancel the message.
callbackOnShow: function(){}, // Callback for appear function
callbackOnHide: function(){} // Callback for disappear function