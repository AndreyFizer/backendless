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
            'change #styleImage': 'letsPrepareForImageUpload'
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

        letsSaveStyleItem: function () {
            var self = this;
            var retailerStorage = Backendless.Persistence.of(Models.Retailer);
            var query;

            // get user data from dialog form
            var $dialogForm = this.$el.find('#styleItem-form');
            var retailerName = $dialogForm.find('.retailers').val().trim();
            var description = $dialogForm.find('#description').val().trim();
            var gender = $dialogForm.find('input:checked').val().trim();
            var title = $dialogForm.find('#title').val().trim();
            var file = $dialogForm.find('#styleImage')[0].files[0];

            if (!title && !description) {
                return APP.warningNotification('Enter, please, title or description!');
            }

            // define query to get such retailer from db
            query = new Backendless.DataQuery();
            query.condition = "retailerName='" + retailerName + "'";

            // get retailer model by retailerName from database
            retailerStorage.find(query, new Backendless.Async(
                function success(response) {
                    var retailer = response.data[0];
                    var style;

                    // create style instance and add props
                    style = new Models.Style();
                    style.styleDescription = description;
                    style.retailerString = retailerName;
                    style.styleTitle = title;
                    style.gender = gender;

                    // upload style image
                    self.letsUploadFile(file, 'styleImages', function (err, result) {
                        if (err) {
                            return APP.errorHandler(err);
                        }

                        // define style imageString
                        result ? style.imageString = result.fileURL : style.imageString = 'images/def_user.png';

                        // add created style to retailer
                        retailer.trendingStyles.push(style);

                        // save created style and update retailer in database
                        retailerStorage.save(retailer, new Backendless.Async(
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
                function error(err) {
                    APP.errorHandler(err);
                }
            ));
        },

        render: function () {
            this.undelegateEvents();

            var self = this;

            Backendless.Persistence.of(Models.Retailer).find(new Backendless.Async(
                function success(response) {
                    var retailers = response.data;

                    self.$el.html(self.dialogTemp({retailers: retailers})).dialog({
                        closeOnEscape: false,
                        autoOpen     : true,
                        dialogClass  : "cardDialog",
                        title        : 'Style item page',
                        modal        : true,
                        resizable    : false,
                        draggable    : false,
                        width        : "500px",
                        close        : function () {
                            self.remove()
                        },
                        buttons      : [
                            {
                                text   : "Cancel",
                                'class': 'btn btnMedium btnError',
                                click  : function () {
                                    self.remove();
                                }
                            },
                            {
                                text   : "Save",
                                'class': 'btn btnMedium btnSuccess',
                                click  : function () {
                                    self.letsSaveStyleItem();
                                }
                            }
                        ]
                    });
                },

                function error(err) {
                    APP.handleError(err);
                }
            ));

            this.delegateEvents();

            return this;
        }
    });
});
