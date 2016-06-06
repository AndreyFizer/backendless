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
    'text!templates/contentCard/contentCardItemTemp.html',
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
            'change .retInpmFile': 'prepareForDrawing'
        },

        letsSaveCard: function () {
            var self = this;
            var cardStorage = Backendless.Persistence.of(Models.Feed);
            var cardData = this.addMode ? new Models.Feed : this.model;

            var $cardImage = this.$el.find('#contCardImgInpt');
            var cardImage = $cardImage[0] && $cardImage[0].files[0];

            var cardGender = this.$el.find('#editCardGender>input:checked').val();
            var cardTitle = this.$el.find('#editCardTitle').val().trim();
            var cardDescription = this.$el.find('#editCardDescrip').val().trim();
    
            this.letsUploadFile(cardImage, 'cardImage', function (error, result) {
                if (error) {
                    return APP.errorHandler(error);
                }
    
                if (result && result.fileURL) {
                    cardData.mainImage = result.fileURL;
                }
    
                cardData.gender = cardGender;
                cardData.offerTitle = cardTitle;
                cardData.offerDescription = cardDescription;
    
                cardStorage.save(cardData, new Backendless.Async(
                    function () {
                        self.remove();
                        APP.successNotification('Content card successfully saved.');
                        // Backbone.history.navigate('cards', {trigger: true});
                        window.location.reload();
                    },
                    APP.errorHandler
                ))
            });

        },

        prepareForDrawing: function (ev) {
            ev.preventDefault();

            var self = this;
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
            var cardData = this.addMode ? {} : this.model;

            this.undelegateEvents();

            this.$el.html(this.template({model : cardData})).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                dialogClass  : "cardDialog",
                title        : 'Content card page',
                modal        : true,
                resizable    : false,
                draggable    : false,
                width        : "600px",
                close: function() {
                    this.remove();
                }.bind(this),
                buttons: [
                    {
                        text: "Cancel",
                        icons: {
                            primary: "ui-icon-closethick"
                        },
                        click: function() {
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Save",
                        icons: {
                            primary: "ui-icon-check"
                        },
                        click: function() {
                            this.letsSaveCard();
                        }.bind(this)
                    }
                ]
            });
            this.delegateEvents();

            return this;
        }

    });

    return ItemView;
});
