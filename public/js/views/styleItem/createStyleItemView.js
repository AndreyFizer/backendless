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
    'text!templates/styleItem/createStyleItemTemp.html'

], function ($, _, Backbone, Backendless, Models, MainTemp) {

    return Backbone.View.extend({

        template: _.template(MainTemp),

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
            var $dialogForm = this.$el.find('#styleItem-form');
            var file = $dialogForm.find('#styleImage')[0].files[0];
            var description = $dialogForm.find('#description').val().trim();
            var gender = $dialogForm.find('input:checked').val().trim();
            var title = $dialogForm.find('#title').val().trim();

            var StyleModel = Models.Style;
            var style = new StyleModel();
            style.gender = gender;
            style.styleTitle = title;
            style.styleDescription = description;

            // upload style image
            this.letsUploadFile(file, 'styleImages', function (error, result) {
                if (error) {
                    return APP.errorHandler(error);
                }

                // add file url to created style model
                result ? style.imageString = result.fileURL : style.imageString = '';

                console.log(style);

                // save created style in database
                Backendless.Persistence.of(StyleModel)
                    .save(style, new Backendless.Async(
                        function success() {
                            // append new style to list of styleItems
                            self.appendStyle(style);

                            // close create style page
                            self.remove();
                            APP.successNotification('New style has successfully created!');
                        },
                        function (err) {
                            APP.errorHandler(err);
                        }
                    ));
            });
        },

        appendStyle: function (style) {
            var imgUrl = style.imageString || 'images/style_default.png';

            $('#styleItemsList').append(
                '<tr>' +
                '<td><img width="60px" height="60px" src=' + imgUrl + '/></td>' +
                '<td>' + style.gender + '</td>' +
                '<td>' + style.styleTitle + '</td>' +
                '<td>' + style.styleDescription + '</td>' +
                '</tr>'
            );
        },

        render: function () {
            this.undelegateEvents();

            this.$el.html(this.template()).dialog({
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
