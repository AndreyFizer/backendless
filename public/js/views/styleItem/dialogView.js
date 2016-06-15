/**
 *
 * Created by Anton on 14.06.16.
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
            'change #styleImage': 'letsPrepareForImageUpload',
            'click #cropBtn'    : 'letsCropImage'
        },

        // TODO implement crop function
        letsCropImage: function (ev) {
            ev.preventDefault();

            var dataURL = $('canvas')[0].toDataURL('image/png');

            console.log(dataURL);

            $('#cropImage').attr('src', dataURL);
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
                    $container.find('img').attr('src', fr.result);
                };

                if (file) {
                    fr.readAsDataURL(file);
                }
            } else {
                APP.warningNotification('Invalid file type!');
            }
        },

        letsSaveStyle: function () {
            var $dialogForm = this.$el.find('#styleItem-form');
            var retailerName = $dialogForm.find('.retailers').val().trim();
            var description = $dialogForm.find('#description').val().trim();
            var gender = $dialogForm.find('input:checked').val().trim();
            var title = $dialogForm.find('#title').val().trim();
            var file = $dialogForm.find('#styleImage')[0].files[0];
            var userData = {
                retailerName: retailerName,
                description : description,
                gender      : gender,
                title       : title,
                file        : file
            };

            // validate user data
            if (!title || !description) {
                return APP.warningNotification('Enter, please, title or description!');
            }

            if (_.isEmpty(this.model)) {
                this.lestCreateStyleItem(userData);
            } else {
                this.letsUpdateStyleItem(userData);
            }
        },

        lestCreateStyleItem: function (userData) {
            var self = this;
            var query = new Backendless.DataQuery();
            query.condition = "retailerName='" + userData.retailerName + "'";

            // get retailer model by retailerName from database
            this.retailerStorage.find(query, new Backendless.Async(
                function success(response) {
                    var defaultImageUrl = 'images/def_user.png';
                    var retailer = response.data[0];
                    var style = new Models.Style();

                    style.styleDescription = userData.description;
                    style.retailerString = userData.retailerName;
                    style.styleTitle = userData.title;
                    style.gender = userData.gender;

                    // upload style image
                    self.letsUploadFile(userData.file, 'styleImages', function (err, result) {
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

        letsUpdateStyleItem: function (userData) {
            var self = this;
            var currentRetailer = this.model.retailerString;

            // if user update retailer
            if (currentRetailer !== userData.retailerName) {
                var query = new Backendless.DataQuery();
                query.condition = "retailerName='" + currentRetailer + "'";
                query.options = {relations: ["trendingStyles"]};

                // get current retailer model by retailerName from database
                this.retailerStorage.find(query, new Backendless.Async(
                    function success(response) {
                        var retailer = response.data[0];


                        // find position in retailer styles and remove it
                        var index = retailer.trendingStyles.map(function (item) {
                            return item.objectId;
                        }).indexOf(self.model.objectId);

                        retailer.trendingStyles.splice(index, 1);

                        self.retailerStorage.save(retailer, new Backendless.Async(
                            function success() {
                            },
                            function error(err) {
                                APP.errorHandler(err);
                            }
                        ))
                    })
                );
            }
            // update style item
            this.updateStyle(userData);
        },

        updateStyle: function (userData) {
            var self = this;
            var queryData = new Backendless.DataQuery();
            queryData.condition = "retailerName='" + userData.retailerName + "'";

            // get retailer model by retailerName from database
            this.retailerStorage.find(queryData, new Backendless.Async(
                function success(response) {
                    var defaultImageUrl = 'images/def_user.png';
                    var retailer = response.data[0];
                    var style = self.model;

                    style.styleDescription = userData.description;
                    style.retailerString = userData.retailerName;
                    style.styleTitle = userData.title;
                    style.gender = userData.gender;

                    // upload style image
                    self.letsUploadFile(userData.file, 'styleImages', function (err, result) {
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

                                // hide current style item
                                $('tr[data-id=' + style.objectId + ']').hide();

                                // append new style to list of styleItems
                                $('#styleListContainer').before(self.styleTemp(createdStyle));

                                // close dialog page
                                self.remove();
                                APP.successNotification('Style item have successfully updated')
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
