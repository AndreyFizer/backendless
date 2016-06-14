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
    'models',
    'async'

], function ($, _, Backbone, Backendless, MainTemp, Models, async) {
    var ItemView;
    ItemView = Backbone.View.extend({

        template: _.template(MainTemp),
        
        fileArray: [],

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
            var cardGender = this.$el.find('#editCardGender>input:checked').val();
            var cardTitle = this.$el.find('#editCardTitle').val().trim();
            var cardDescription = this.$el.find('#editCardDescrip').val().trim();
            var fileLength = this.fileArray.length;
            var parallelArray = [];

            if (!cardTitle && !cardDescription){
                return APP.warningNotification('Enter, please, title or description!');
            }

            for (var i=0; i < fileLength; i +=1){
                parallelArray.push(
                    function (cb) {
                        var file = self.fileArray[i];

                        self.letsUploadFile(file, 'cardImage', cb)
                    }
                )
            }

            async.parallel(parallelArray, function (err, res) {
                if (err){
                    return APP.errorHandler(err);
                }

                if (res.length){
                    cardData.mainImage = res[0];
                    cardData.altImages= res.join(',');
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

            // this.letsUploadFile(cardImage, 'cardImage', function (error, result) {
            //     if (error) {
            //         return APP.errorHandler(error);
            //     }
            //
            //
            // });

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
                self.fileArray.push(file);
                fr = new FileReader();

                fr.onload = function () {
                    var src = fr.result;

                    if (self.fileArray.length > 1) {
                        $container.find('#fileArrayList').append('<img  src="' + src + '" alt="Img">');
                    } else {
                        $container.find('#fileArrayList').html('<img  src="' + src + '" alt="Img">');
                    }
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
                width        : "500px",
                close: function() {
                    this.remove();
                }.bind(this),
                buttons: [
                    {
                        text: "Cancel",
                        'class' : 'btn btnMedium btnError',
                        click: function() {
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Save",
                        'class' : 'btn btnMedium btnSuccess',
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
