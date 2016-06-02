/**
 *
 * Created by andrey on 01.06.16.
 */
"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'text!templates/retailers/retailerEditTemp.html',
    'models'

], function ($, _, Backbone, Backendless, MainTemp, Models) {
    var ItemView;
    ItemView = Backbone.View.extend({

        template: _.template(MainTemp),

        initialize: function () {

            this.addMode = !this.model;

            this.render();
        },

        events: {
            'change .retInpmFile' : 'prepareForDrawing',
            'click #regCancelBtn' : 'closeDialog'
        },

        closeDialog: function () {
            this.remove();
        },
        
        letsSaveRetailer: function () {
            var retailerStorage = Backendless.Persistence.of(Models.Retailer);
            var retailerData = this.addMode ? new Models.Retailer : this.model.toJSON();

            var file1 = 

            this.letsUploadFile()
    
            // retailerStorage.save(retailerData, new Backendless.Async(
            //     function (respons) {
            //
            //     },
            //     APP.errorHandler
            // ))
        },
    
        prepareForDrawing: function (ev) {
            ev.preventDefault();
        
            var self = this;
            // var $inputFile = self.$el.find('#editFileImage');
            var $inputFile = $(ev.currentTarget);
            var $container = $inputFile.closest('.imgContainer');
            var file = $inputFile[0].files[0];
            var filesExt = ['jpg', 'png', 'jpeg', 'bmp', 'JPEG', 'JPG', 'PNG', 'BMP'];
            var parts = $inputFile.val().split('.');
            var fr;
        
            if (filesExt.join().search(parts[parts.length - 1]) !== -1) {
                fr = new FileReader();
            
                fr.onload = function () {
                    var src = fr.result;
                
                    // self.$el.find('#editImage').attr('src', src);
                    $container.find('img').attr('src', src);
                };
            
                if (file) {
                    fr.readAsDataURL(file);
                }
            
            } else {
                alert('Invalid file type!');
            }
        },

        render: function () {
            var retailerData = this.addMode ? {} : this.model.toJSON();

            this.undelegateEvents();

            this.$el.html(this.template(retailerData)).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                dialogClass  : "retailerDialog",
                title        : 'Retailer page',
                modal        : true,
                resizable    : false,
                draggable    : false,
                width        : "600px"
            });
            this.delegateEvents();

            return this;
        }

    });

    return ItemView;

});
