/**
 * @fileoverview DreamyLiteBox v1.0 - jQuery lite box widget
 * @author andres(at)dreamsiteweb.com (Andres Pi)
 *
 * Andres Leandro Pi:
 *   gplus.to/andres_314
 *   twitter.com/andres_314
 *   github.com/andres314
 */

// TODO: Delete the above banner comment and fill out this real banner
//       comment below describing this plugin.
/**  
 * jQuery DreamyLiteBox Plugin
 * Version: x.x.x
 * URL: URL
 * Descripton: DESCRIPTION
 * Requires: JQUERY_VERSION, OTHER_PLUGIN(S), ETC.
 * Author: AUTHOR (AUTHOR_URL)
 * Copyright: Copyright (c) 2010 YOUR_NAME
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
 *   $(selector).dreamyLiteBox('publicMethod2', 'foo', 'bar');
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
                hidelBox(lbox, data);
            }
        });
        //Close Popups and Fade Layer
        var elements = (data.opts.type=='alert')?'#close-lbox':'#close-lbox, #fade';
        //When clicking on the close or fade layer...
        $(elements).live('click', function() { 
            hidelBox(lbox, data);
        }); 
    }
    var unbindEvents = function(){
        $(document).unbind('keydown.' + DREAMY_LITE_BOX);
        $('#close-lbox, #fade').die();
    }

    var showlBox = function($this, data, lbox){
        /*
         * Set width and height. 
         */
        if(data.opts.type == 'wait'){
            data.opts.width = (data.useDefaultSizeType)?data.opts.width:90;
            data.opts.height = (data.useDefaultSizeType)?data.opts.height:24;
        }else if(data.opts.type == 'prompt'){
            data.opts.width = (data.useDefaultSizeType)?data.opts.width:530;
            data.height = (data.useDefaultSizeType)?data.opts.height:84;
        }else if(data.opts.type == 'alert'){
            data.opts.width = (data.useDefaultSizeType)?data.opts.width:250;
            data.height = (data.useDefaultSizeType)?data.opts.height:50;
        }
        //Add the class
        lbox.addClass('lbox lbox_' + data.opts.type);
        
        // Array with the strings needed for the lbox
        var modal = ['<a id="close-lbox" class="item ir">Close</a>', '<div class="lbox-content">', '<input type="text" id="input-prompt-lbox" class="">','<div id="confirm-lbox">','<button type="button" id="btn-accept" class="btn">Accept</button>','<button type="button" id="btn-cancel" class="btn">Cancel</button>','</div>'];

        if(data.opts.title){
            modal[7] =  '<h2 class="lbox-title">' + data.opts.title + '</h2>';
        }else{
            modal[7] =  '';
        }

        //Fade in the Popup and add close button
        switch(data.opts.type){
            case 'alert':
                lbox.html(modal[0] + modal[7] +  modal[1] + data.opts.msg + modal[6] + modal[3] + modal[4] + modal[6]);
                
                $('#confirm-lbox .btn').click(function(){
                    hidelBox(lbox, data);
                })
                break;
            case 'confirm':
                lbox.html(modal[0] + modal[7] + modal[1] + data.opts.msg + modal[6] + modal[3] + modal[4] + modal[5] + modal[6]);
                                    
                $('#confirm-lbox .btn').click(function(){
                    if($(this).val()=='Accept'){
                        data.opts.callbackOnConfirm();
                    }else{
                        data.opts.callbackOnCancel();
                    }
                    hidelBox(lbox, data);
                })
                break;
            case 'prompt':
                lbox.html(modal[0] + modal[7] + modal[1] + data.opts.msg + modal[6] + modal[2] + modal[3] + modal[4] + modal[5] + modal[6]);
                
                $('#confirm-lbox .btn').click(function(){
                    if($(this).val()=='Accept'){
                        data.opts.callbackOnConfirm($('#input-prompt-lbox').val());
                    }else{
                        data.opts.callbackOnCancel();
                    }
                    hidelBox(lbox, data);
                })
                break;
            default:
                lbox.html(modal[0] + modal[7] + modal[1] + data.opts.msg + modal[6]);
        }

        if(data.opts.buttons){
            $('#confirm-lbox').empty();
            for(var key in data.opts.buttons) {
                var newID = key.replace(/\s+/gi,'');
                $('#confirm-lbox').append('<button type="button" id="lbox-' + newID + '" class="btn">' + key + '</button>');
                $('#lbox-' + newID).click(function(){
                    data.opts.buttons[key]();    
                    hidelBox(lbox, data);
                })
            }
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
        $this.bg.css('background',(data.opts.bg)?data.opts.bgColor:'transparent').fadeIn(); 
        if(data.type != 'wait'){
            bindEvents($this);  
        }

        // Callback on show
        data.opts.callbackOnShow();
    }




    var hidelBox = function(lbox, data){
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
        data.opts.callbackOnHide();
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
            
            var data  = $this.data(DREAMY_LITE_BOX);
            if (!data) {
                $this.data(DREAMY_LITE_BOX, {
                    opts: opts,
                    lbox: $('#' + DREAMY_LITE_BOX)
                });
            }

            // Event
            if(opts.event != 'manual'){
                $this.bind(opts.event + '.' + DREAMY_LITE_BOX,
                    function(){
                        showlBox($this, $this.data(DREAMY_LITE_BOX), $this.data(DREAMY_LITE_BOX).lbox);
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
        show: function(msg){  return this.each(function() {       
            var $this = $(this),
                data  = $this.data(DREAMY_LITE_BOX),
                lbox = data.lbox;
            data.opts.msg = (msg)?msg:data.opts.msg;
            showlBox($this, data, lbox);
        })},
        hide: function(){  return this.each(function() {
            var $this = $(this);
            var data  = $this.data(DREAMY_LITE_BOX);
            var lbox = data.lbox;
            hidelBox(lbox, data);
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
        event: 'click', // click & hover are allowed. "Manual" to manually show the litebox.
        title: null, // Add a title to the lite box.
        msg: false, //String with the content for the message. It could be HTML or just text.
        buttons: null, // Add extra buttons as an object where the key is the lable and the value the callback:
                       //  {'myButton': function(){doSomething()}}
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
    };
})(jQuery);