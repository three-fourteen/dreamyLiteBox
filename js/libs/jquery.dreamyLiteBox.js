/**  
 * jQuery DreamyLiteBox Plugin
 * Version: 1.0
 * URL: https://github.com/andres314/dreamyLiteBox
 * Descripton: A super simple jQuery lite box
 * Requires: jQuery
 * Author: Andres (dreamsiteweb.com)
 *   gplus.to/andres_314
 *   bit.ly/apiLinkedin
 *   twitter.com/andres_314
 *   github.com/andres314
 *   
 * Copyright: Copyright (c) 2012 Andres Pi
 * License: MIT
 *
 * Usage:
 *
 *   // Init element with dreamyLiteBox, using the default options.
 *   $(selector).dreamyLiteBox();
 *
 *   // Init element with dreamyLiteBox, overriding some default options.
 *   $(selector).dreamyLiteBox({option1:true, option2:'foo'});
 *
 *   // Un-init a previous init of dreamyLiteBox on an element.
 *   $(selector).dreamyLiteBox('destroy');
 *
 *   // Call a public method on an init'd dreamyLiteBox element.
 *   $(selector).dreamyLiteBox('close');
 *
 * For documentation on the supported options, see the bottom of this file.
 */
(function($) {

    /**
     * Constants
     */
    var DREAMY_LITE_BOX = 'dreamyLiteBox';

    ////////////////////
    // Private Methods//
    ////////////////////

    // bind & unbind keydown events
    var bindEvents = function($this){
        var data  = $this.data(DREAMY_LITE_BOX);
        var lbox = data.lbox 
        $(document).bind('keydown.' + DREAMY_LITE_BOX, function (e) {
            if (e.keyCode === 27) { // ESC
                e.preventDefault();
                closelBox(lbox, data);
            }
        });
        //Close Popups and Fade Layer
        var elements = (data.opts.type=='alert')?'#close-lbox':'#close-lbox, #fade';
        //When clicking on the close or fade layer...
        $(elements).live('click', function() { 
            closelBox(lbox, data);
        }); 
    }
    
    var unbindEvents = function(){
        $(document).unbind('keydown.' + DREAMY_LITE_BOX);
        $('#close-lbox, #fade').die();
    }

    /**
     * Open the lite box
     */
    var openlBox = function($this, data, lbox){
        //Add the class
        lbox.addClass('lbox lbox_' + data.opts.type);
        
        // Array with the strings needed for the lbox
        var modal = [
                    '<a id="close-lbox" class="icon-cross">Close</a>',
                    '<div class="lbox-content">',
                    '<input type="text" id="input-prompt-lbox">',
                    '<div id="confirm-lbox">',
                    '<button type="button" id="btn-accept" class="btn">Accept</button>',
                    '<button type="button" id="btn-cancel" class="btn">Cancel</button>',
                    '</div>'
                    ];
        
        if(typeof data.opts.title === 'boolean'){        
            modal[7] = (data.opts.title)?'<h2 class="lbox-title">' + (($this.val())?$this.val():$this.text()) + '</h2>':'';
        }else if(typeof data.opts.title === 'string'){
            modal[7] = '<h2 class="lbox-title">' + data.opts.title + '</h2>';
        }
        var msg = (data.opts.msg)?data.opts.msg:'';

        modal[4] = (data.opts.useDefaultBtns)?modal[4]:''; 
        modal[5] = (data.opts.useDefaultBtns)?modal[5]:''; 


        //Create the lite box and show it
        switch(data.opts.type){
            case 'alert':
                // Set the modal content
                lbox.html(modal[0] + modal[7] +  modal[1] + msg + modal[6] + modal[3] + modal[4] + modal[6]);
                // Add the click event to the buttons
                $('#confirm-lbox .btn').click(function(){
                    closelBox(lbox, data);
                })
                // Set the size
                if(data.opts.useDefaultSizeType){
                    data.opts.width = 250;
                }
                break;
            case 'confirm':
                // Set the modal content
                lbox.html(modal[0] + modal[7] + modal[1] + msg + modal[6] + modal[3] + modal[4] + modal[5] + modal[6]);
                // Set the size
                $('#confirm-lbox .btn').click(function(){
                    if($(this).text()=='Accept'){
                        if($.isFunction(data.opts.callbackOnConfirm))data.opts.callbackOnConfirm($this);
                    }else{
                        if($.isFunction(data.opts.callbackOnCancel))data.opts.callbackOnCancel($this);
                    }
                    closelBox(lbox, data);
                })
                break;
            case 'prompt':
                // Set the modal content
                lbox.html(modal[0] + modal[7] + modal[1] + msg + modal[6] + modal[2] + modal[3] + modal[4] + modal[5] + modal[6]);
                if($.browser.msie && $.browser.version < 8){
                    $('#input-prompt-lbox').wrap('<div id="input-prompt-lbox-parent" />');
                }
                // Set the size
                $('#confirm-lbox .btn').click(function(){
                    if($(this).text()=='Accept'){
                        if($.isFunction(data.opts.callbackOnConfirm))data.opts.callbackOnConfirm($('#input-prompt-lbox').val(), $this);
                    }else{
                        if($.isFunction(data.opts.callbackOnCancel))data.opts.callbackOnCancel($this);
                    }
                    closelBox(lbox, data);
                });
                // Set the size
                if(data.opts.useDefaultSizeType){
                    data.opts.width = 530;
                }
                break;
            default:
                // Set the modal content
                if(data.opts.useDefaultBtns){
                    lbox.html(modal[0] + modal[7] + modal[1] + msg + modal[6]);
                }else{
                    lbox.html(modal[0] + modal[7] + modal[1] + msg +  modal[6] +  modal[3] + modal[6]);
                }
                if(data.opts.type == 'wait' && data.opts.useDefaultSizeType){
                    data.opts.width = 90;
                    data.opts.height = 24;
                }
        }

        if(typeof data.opts.buttons === 'object' && data.opts.buttons !== null){
            $.each(data.opts.buttons, function(name, props) {
                props = {click: props, text: name};
                $('<button type="button" class="btn" id="'+props.text.replace(/\s/g, '')+'">'+props.text+'</button>')
                    .click(function() {
                        props.click.apply($this, arguments);
                    })
                    .appendTo('#confirm-lbox');
            });
        }
        
        lbox.css({width: data.opts.width, height: data.opts.height}).fadeIn();

        //Define margin for center alignment (vertical + horizontal)        
        // and apply it to the lbox
        lbox.css({ 
            'margin-top' : -(lbox.outerHeight() / 2),
            'margin-left' : -(lbox.outerWidth() / 2)
        });
        
        //Create Background 
        //Add the fade layer to bottom of the body tag.
        $('body').append('<div id="fade" />'); 
        $this.bg = $('#fade');
        //Fade in the fade layer
        $this.bg.css('background',data.opts.bgColor).css('display','block').animate({opacity:(data.opts.bg)?.75:.001}); 
        if(data.opts.type != 'wait'){
            bindEvents($this);  
        }

        // Callback on open
        if($.isFunction(data.opts.callbackOnOpen))data.opts.callbackOnOpen($this);
    }

    /**
     * Close the lite box
     */
    var closelBox = function(lbox, data){
        //var lbox = this;
        function callback(){
            $('#fade, #close-lbox, #confirm-lbox').remove();
            lbox.removeClass();
        }
        //fade them both out
        if(data.opts.type=='alert'){
            lbox.css('display','none');
            callback(); 
        }else{
            $('#fade , #' + DREAMY_LITE_BOX ).fadeOut(function() {
                callback();
            });
        }
        // Close callback
        if($.isFunction(data.opts.callbackOnClose))data.opts.callbackOnClose($this);
        unbindEvents();
    }

    /**
     * Public methods
     */
    var publicMethods = {
        init: function(options) {return this.each(function() {
            var opts  = $.extend({}, $.fn[DREAMY_LITE_BOX].defaults, options);
            var $this = $(this);
            // Append the tooltip on the DOM
            if(!$('#'+ DREAMY_LITE_BOX).length){
                $('body').append('<div id="' + DREAMY_LITE_BOX + '" />'); 
            }            

            //Check if the content is an object
            if(typeof opts.msg === 'object'){
                var clone = opts.msg.clone();
                opts.msg.remove();
                opts.msg = clone.html();
            }
            
            var data  = $this.data(DREAMY_LITE_BOX);
            if (!data) {
                $this.data(DREAMY_LITE_BOX, {
                    opts: opts,
                    lbox: $('#' + DREAMY_LITE_BOX),
                    target : $this
                });
            }

            // Event
            if(opts.event != 'manual'){
                $this.bind(opts.event + '.' + DREAMY_LITE_BOX,
                    function(){
                        openlBox($this, $this.data(DREAMY_LITE_BOX), $this.data(DREAMY_LITE_BOX).lbox);
                });
            }

        })},

        destroy: function() {return this.each(function() {
            var $this = $(this);
            var data  = $this.data(DREAMY_LITE_BOX);
            $this.unbind('.' + DREAMY_LITE_BOX);
            data.lbox.remove();
            $this.removeData(DREAMY_LITE_BOX);
        })},

        //type,message,bg,callback,width,height
        open: function(msg){return this.each(function() {       
            var $this = $(this),
                data  = $this.data(DREAMY_LITE_BOX),
                lbox = data.lbox;
            data.opts.msg = (msg)?msg:data.opts.msg;
            if($.isFunction(data.opts.callbackBeforeOpen))data.opts.callbackBeforeOpen($this);
            openlBox($this, data, lbox);
        })},
        close: function(){return this.each(function() {
            var $this = $(this);
            var data  = $this.data(DREAMY_LITE_BOX);
            var lbox = data.lbox;
            if($.isFunction(data.opts.callbackBeforeClose))data.opts.callbackBeforeClose($this);
            closelBox(lbox, data);
        })}


    };


    /**
     *  Plugin Initialization
     */
    $.fn[DREAMY_LITE_BOX] = function(method) {
        if (publicMethods[method]) {
            return publicMethods[method].apply(
                this,
                Array.prototype.slice.call(arguments, 1)
            );
        }
        else if (typeof method == 'object' || !method) {
            return publicMethods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.' + DREAMY_LITE_BOX);
        }
    };

    /**
     * Options
     */
    $.fn[DREAMY_LITE_BOX].defaults = {
        type: 'modal', // String with the type of the message(alert, confirm, prompt, wait, modal).
        event: 'click', // click & hover are allowed. "Manual" to manually open the litebox.
        title: true, // Add a title to the lite box. False: no title, True: button/link value/text, String: title text.
        msg: false, //String(HTML or just text) or jQuery object with the content for the message.
        buttons: null, // Add extra buttons as an object where the key is the label and the value the callback:
                       //  {'myButton': function(){doSomething()}}
                       // For close the lite box you must add the close method to the callback like this:
                       //  {'myButton': function(){doSomething();$(this).dreamyLiteBox('close')}}
        useDefaultBtns: true, // Use the defaults buttons
        bg: true, // Whaterver to use background or not
        bgColor: "#000", // Background color of the background layer
        useDefaultSizeType: true, // Boolean to use the default size for each type  
        width: 530, // Number for a custom with. Optional, if is undefined use a default value.
        height: 150, //Number for a custom height. Optional, if is undefined use a default value.
        callbackOnConfirm: null, // Callback used only for the confirm and prompt messages, with the function to call after confirm the message. Returns the trigger element, except "promt" type which returns the param and the element.
        callbackOnCancel: null, // Callback used only for the confirm and prompt messages, with the function to call after cancel the message. Returns the trigger element.
        callbackOnOpen: null, // Callback for appear function. Returns the trigger element.
        callbackOnClose: null, // Callback for disappear function. Returns the trigger element.
        callbackBeforeOpen: null, // Callback before open the lite box. Returns the trigger element.
        callbackBeforeClose: null // Callback before close the lite box. Returns the trigger element.
    };
})(jQuery);