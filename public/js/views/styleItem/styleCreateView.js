/**
 *
 * Created by Anton on 06.06.16.
 */
'use strict';

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/styleItem/styleTemp.html',
    'text!templates/styleItem/styleCreateTemp.html'

], function ($, _, Backbone, Backendless, Models, StyleTemp, DialogTemp) {

    return Backbone.View.extend({

        dialogTemp: _.template(DialogTemp),
        styleTemp : _.template(StyleTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'change #styleImage': 'letsPrepareForImageUpload',
            'click #cancelBtn'  : 'letsCloseDialog',
            'click #saveBtn'    : 'letsSaveStyleItem'
        },

        letsPrepareForImageUpload: function (ev) {
            ev.preventDefault();

            var $inputFile = $(ev.currentTarget);
            var $container = $inputFile.closest('.styleImageContainer');
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
                APP.warningNotification('Invalid file type!');
            }
        },

        letsCloseDialog: function () {
            this.remove();
        },

        letsSaveStyleItem: function (ev) {
            ev.stopPropagation();

            var self = this;

            // get user data from dialog form
            var $dialogForm = this.$el.find('#styleItem-form');
            var description = $dialogForm.find('#description').val().trim();
            var gender = $dialogForm.find('input:checked').val().trim();
            var title = $dialogForm.find('#title').val().trim();
            var file = $dialogForm.find('#styleImage')[0].files[0];

            // create instance of style and add props
            var Style = Models.Style;
            var style = new Style();
            style.styleDescription = description;
            style.styleTitle = title;
            style.gender = gender;

            // upload style image
            this.letsUploadFile(file, 'styleImages', function (err, result) {
                if (err) {
                    return APP.errorHandler(err);
                }
                // add file url style model
                result ? style.imageString = result.fileURL : style.imageString = '';
                // save created style in database
                Backendless.Persistence.of(Style)
                    .save(style, new Backendless.Async(
                        function success() {
                            // append new style to list of styleItems
                            $('#styleListContainer').before(self.styleTemp(style));

                            // close dialog page
                            self.remove();
                            APP.successNotification('New style has successfully created!');
                        },
                        function (err) {
                            APP.errorHandler(err);
                        }
                    ));
            });
        },

        render: function () {
            this.undelegateEvents();

            this.$el.html(this.dialogTemp()).dialog({
                closeOnEscape: true,
                resizable    : false,
                draggable    : true,
                autoOpen     : true,
                modal        : true,
                height       : 400,
                width        : 320,
                title        : 'Style item page',
                close        : function () {
                    this.remove()
                }.bind(this)
            });

            this.delegateEvents();

            return this;
        }
    });
});
