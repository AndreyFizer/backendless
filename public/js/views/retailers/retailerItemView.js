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
    'models',
    'async'

], function ($, _, Backbone, Backendless, MainTemp, Models, async) {
    var ItemView;
    ItemView = Backbone.View.extend({

        template: _.template(MainTemp),

        initialize: function () {

            this.addMode = !this.model;

            this.render();
        },

        events: {
            'change .retInpmFile': 'prepareForDrawing',
            'click #regCancelBtn': 'closeDialog',
            'click #regSaveBtn'  : 'letsSaveRetailer'
        },

        closeDialog: function () {
            this.remove();
        },

        letsSaveRetailer: function () {
            var self = this;
            var retailerStorage = Backendless.Persistence.of(Models.Retailer);
            var retailerData = this.addMode ? new Models.Retailer : this.model.toJSON();

            var $fileLogo = this.$el.find('#retLogoImgInpt');
            var $fileRetLogo = this.$el.find('#retRetLogoImgInpt');

            var fileLogo = $fileLogo[0] && $fileLogo[0].files[0] ? $fileLogo[0].files[0] : null;
            var fileRetLogo = $fileRetLogo[0] && $fileRetLogo[0].files[0] ? $fileRetLogo[0].files[0] : null;
            var retName = this.$el.find('#regName').val().trim();
            var retWebsite = this.$el.find('#regWeb').val().trim();

            async.parallel([
                function (cb) {
                    self.letsUploadFile(fileLogo, 'logos', cb)
                },

                function (cb) {
                    self.letsUploadFile(fileRetLogo, 'retailerLogos', cb)
                }

            ], function (error, result) {
                if (error) {
                    return APP.errorHandler(error);
                }

                if (result[0]) {
                    retailerData.logo = result[0].fileURL;
                }
                if (result[1]) {
                    retailerData.retailerLogo = result[1].fileURL;
                }

                retailerData.retailerName = retName;
                retailerData.website = retWebsite;

                retailerStorage.save(retailerData, new Backendless.Async(
                    function (respons) {
                        self.remove();
                        self.trigger('retailerAction', {
                            isNew: self.addMode,
                            model: respons
                        });
                    },
                    APP.errorHandler
                ))
            });

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
