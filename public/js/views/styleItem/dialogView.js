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
    'Jcrop',
    'models',
    'text!templates/styleItem/styleTemp.html',
    'text!templates/styleItem/dialogTemp.html'

], function ($, _, Backbone, Backendless, Jcrop, Models, StyleTemp, DialogTemp) {

    return Backbone.View.extend({

        dialogTemp: _.template(DialogTemp),
        styleTemp : _.template(StyleTemp),

        initialize: function () {
            this.retailerStorage = Backendless.Persistence.of(Models.Retailer);
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
                    var $imgContainer = $container.find('img');

                    $imgContainer.attr('src', src);

                    // function imgSelect(coordinates) {
                    //     var canvasCrop;
                    //     var ctx;
                    //     var img;
                    //     var src;
                    //
                    //     if (parseInt(coordinates.w, 10) > 0) {
                    //         img = $('#cropImage')[0];
                    //
                    //         canvasCrop = document.createElement('canvas');
                    //         canvasCrop.height = 600;
                    //         canvasCrop.width = 600;
                    //         ctx = canvasCrop.getContext('2d');
                    //         ctx.drawImage(img, coordinates.x, coordinates.y, coordinates.w, coordinates.h, 0, 0, canvasCrop.width, canvasCrop.height);
                    //         src = canvasCrop.toDataURL('images/' + parts[1]);
                    //     }
                    // }
                    //
                    // $('#cropImage').Jcrop({
                    //     aspectRatio: 1,
                    //     // setSelect  : [0, 0, 200, 200],
                    //     onSelect   : imgSelect,
                    //     onChange   : imgSelect,
                    //     boxWidth   : 550,
                    //     boxHeight  : 550,
                    //     minSize    : [50, 50]
                    // });
                };

                if (file) {
                    fr.readAsDataURL(file);
                }
            } else {
                APP.warningNotification('Invalid file type!');
            }
        },

        letsSaveStyle: function () {
            var self = this;
            var $dialogForm = this.$el.find('#styleItem-form');
            var retailerName = $dialogForm.find('.retailers').val().trim();
            var description = $dialogForm.find('#description').val().trim();
            var gender = $dialogForm.find('input:checked').val().trim();
            var title = $dialogForm.find('#title').val().trim();
            var file = $dialogForm.find('#styleImage')[0].files[0];
            var query;

            if (!title || !description) {
                return APP.warningNotification('Enter, please, title or description!');
            }

            // define query to get retailer from database
            query = new Backendless.DataQuery();
            query.condition = "retailerName='" + retailerName + "'";

            // get retailer model by retailerName from database
            this.retailerStorage.find(query, new Backendless.Async(
                function success(response) {
                    var defaultImageUrl = 'images/def_user.png';
                    var retailer = response.data[0];
                    var style = new Models.Style();

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
                        result ? style.imageString = result.fileURL : style.imageString = defaultImageUrl;

                        // add created style to retailer
                        retailer.trendingStyles.push(style);

                        // save created style and updated retailer in database
                        self.retailerStorage.save(retailer, new Backendless.Async(
                            function success(response) {
                                var createdStyle = response.trendingStyles[0];

                                // append new style to list of styleItems
                                $('#styleListContainer').before(self.styleTemp(createdStyle));

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

        // TODO update
        letsUpdateStyleItem: function () {
            var self = this;
            var query = new Backendless.DataQuery();

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

            query.condition = "retailerName='" + retailerName + "'";

            // get retailer model by retailerName from database
            this.retailerStorage.find(query, new Backendless.Async(
                function success(response) {
                    var StyleModel = Models.Style;
                    var retailer = response.data[0];
                    var style = new StyleModel();

                    // add style props
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
                        self.retailerStorage.save(retailer, new Backendless.Async(
                            function success(response) {
                                var createdStyle = response.trendingStyles[0];

                                // append new style to list of styleItems
                                $('#styleListContainer').before(self.styleTemp(createdStyle));

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
            var self = this;

            this.model = this.model || {};
            this.undelegateEvents();

            this.retailerStorage.find(new Backendless.Async(
                function success(response) {
                    var retailers = response.data;

                    self.$el.html(self.dialogTemp({retailers: retailers, model: self.model})).dialog({
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
                                    self.letsSaveStyle();
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
