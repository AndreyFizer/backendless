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
        
        template       : _.template(MainTemp),
        retailerItmTmpl: _.template("<li data-id='<%= retailer.objectId%>' class='retSelectItem'><%- retailer.retailerName || ''%></li>"),
        
        fileArray       : [],
        selectCollection: null,
        
        initialize: function () {
            
            this.addMode = !this.model;
            
            this.render();
        },
        
        events: {
            'change .retInpmFile' : 'prepareForDrawing',
            'change .vidInpmFile' : 'prepareForVideo',
            'click .retSelectItem': 'onSelectClick'
        },
        
        letsSaveCard: function () {
            var self = this;
            var cardStorage = Backendless.Persistence.of(Models.Feed);
            var retailerStorage = Backendless.Persistence.of(Models.Retailer);
            var cardData = this.addMode ? new Models.Feed : this.model;
            var cardGender = this.$el.find('#editCardGender>input:checked').val();
            var cardTitle = this.$el.find('#editCardTitle').val().trim();
            var cardDescription = this.$el.find('#editCardDescrip').val().trim();
            var $videoInput = this.$el.find('#contCardVideoInpt');
            var videoFile = $videoInput[0] && $videoInput[0].files[0];
            var retailerId = this.$el.find('#editCardRetailer').data('id');
            
            if (!cardTitle && !cardDescription) {
                return APP.warningNotification('Enter, please, title or description!');
            }

            APP.showSpiner();
            async.parallel({
                videoUrl: function (pCb) {
                    self.letsUploadFile(videoFile, 'cardVideo', function (err, res) {
                        if (err) {
                            return pCb(err);
                        }
                        
                        pCb(null, res);
                    })
                },
                
                imgArray: function (pCb) {
                    var urlArray = [];
                    var i = 0;
                    
                    async.each(self.fileArray, function (file, eCb) {
                        var j = ++i;
                        self.letsUploadFile(file, 'cardImage', function (err, res) {
                            if (err) {
                                return eCb(err);
                            }
                            
                            urlArray[j - 1] = res.fileURL;
                            eCb();
                        })
                    }, function (err) {
                        if (err) {
                            return pCb(err);
                        }
                        
                        pCb(null, urlArray);
                    })
                },

                removeFromRetailer: function (pCb) {
                    var query;
                    var targetId;

                    if (retailerId) {
                        targetId = self.model.retailer;
                        if (targetId) {
                            query = new Backendless.DataQuery();
                            //query.condition = "objectId = " + targetId;
                            query.options = {relations: ['contentCards']};

                            retailerStorage.findById(targetId, query, new Backendless.Async(
                                function (retailer) {
                                    var l = retailer.contentCards && retailer.contentCards.length;
                                    var newArray = [];

                                    if (l) {
                                        for (var i = 0; i < l; i++) {
                                            if (retailer.contentCards[i].objectId !== retailerId) {
                                                newArray.push(retailer.contentCards[i]);
                                            }
                                        }
                                    } else {
                                        return pCb(null, true);
                                    }

                                    retailer.contentCards = newArray;
                                    retailerStorage.save(retailer, new Backendless.Async(
                                        function () {
                                            pCb(null, true)
                                        },
                                        function (err) {
                                            return pCb(err);
                                        }
                                    ))
                                },
                                function (err) {
                                    return pCb(err);
                                }
                            ));
                        } else {
                            return pCb(null, true);
                        }
                    } else {
                        return pCb(null, true);
                    }
                }

            }, function (err, resObj) {
                APP.hideSpiner();
                var retailerItem;
                var l;
                var flag = true;

                if (err) {
                    return APP.errorHandler(err);
                }

                if (resObj.imgArray && resObj.imgArray.length) {
                    cardData.mainImage = resObj.imgArray[0];
                    cardData.altImages = resObj.imgArray.join(',');
                }

                if (resObj.videoUrl) {
                    cardData.videoURL = resObj.videoUrl.fileURL;
                }

                cardData.gender = cardGender;
                cardData.offerTitle = cardTitle;
                cardData.offerDescription = cardDescription;

                if (retailerId) {
                    retailerItem = self.selectCollection.get(retailerId).toJSON();

                    cardData.retailer = retailerId;
                    cardData.retailerString = retailerItem.retailerName;

                    l = retailerItem.contentCards.length;

                    for (var i = 0; i < l; i++) {
                        if (retailerItem.contentCards[i].objectId === retailerId) {
                            retailerItem.contentCards[i] = cardData;
                            flag = false;
                        }
                    }

                    if (flag) {
                        retailerItem.contentCards.push(cardData);
                    }

                    retailerStorage.save(retailerItem, new Backendless.Async(
                        function () {
                            self.remove();
                            APP.successNotification('Content card successfully saved.');
                            // Backbone.history.navigate('cards', {trigger: true});
                            window.location.reload();
                        },
                        APP.errorHandler
                    ))
                } else {
                    cardStorage.save(cardData, new Backendless.Async(
                        function () {
                            self.remove();
                            APP.successNotification('Content card successfully saved.');
                            // Backbone.history.navigate('cards', {trigger: true});
                            window.location.reload();
                        },
                        APP.errorHandler
                    ))
                }

            });
            
        },
        
        prepareForVideo: function (ev) {
            ev.preventDefault();
            
            var self = this;
            var $inputFile = $(ev.currentTarget);
            var $container = $inputFile.closest('.vidContainer');
            var file = $inputFile[0].files[0];
            // var filesExt = ['jpg', 'png', 'jpeg', 'bmp', 'JPEG', 'JPG', 'PNG', 'BMP'];
            // var parts = $inputFile.val().split('.');
            var fr = new FileReader();
            
            fr.onload = function () {
                var src = fr.result;
                
                APP.successNotification('Video successfully uploaded...')
            };
            
            if (file) {
                fr.readAsDataURL(file);
            }
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
                self.$el.find('#linkText').text('Add image');
                fr = new FileReader();
                
                fr.onload = function () {
                    var src = fr.result;
                    
                    if (self.fileArray.length > 1) {
                        $container.find('#fileArrayList').append('<img src="' + src + '" alt="Img">');
                    } else {
                        $container.find('#fileArrayList').html('<img src="' + src + '" alt="Img">');
                    }
                };
                
                if (file) {
                    fr.readAsDataURL(file);
                }
                
            } else {
                APP.warningNotification('Invalid file type!');
            }
        },
        
        renderRetailerSelect: function () {
            var self = this;
            var $selectContainer = this.$el.find('#retSelectContainer');
            var query = new Backendless.DataQuery();
            var storageService = Backendless.Persistence.of(Models.Retailer);
            
            query.options = {relations: ['contentCards']};
            
            storageService.find(query, new Backendless.Async(
                function (list) {
                    var dataList = list.data;
                    var l = dataList.length;
                    var RetailerCollection = Backbone.Collection.extend({
                        model: Backbone.Model.extend({
                            'idAttribute': 'objectId'
                        })
                    });
                    
                    self.selectCollection = new RetailerCollection(dataList);
                    
                    while (l--) {
                        $selectContainer.append(self.retailerItmTmpl({retailer: dataList[l]}));
                    }
                    
                }
            ));
            
        },
        
        onSelectClick: function (ev) {
            ev.stopPropagation();
            
            var $selectedRow = $(ev.currentTarget);
            var $container = this.$el.find('#retSelectContainer');
            var currentId = $selectedRow.data('id');
            var currentName = $selectedRow.text() || '';
            
            this.$el.find('#editCardRetailer').data("id", currentId).text(currentName);
            
        },
        
        render: function () {
            var cardData = this.addMode ? {} : this.model;
            
            this.undelegateEvents();
            
            this.$el.html(this.template({model: cardData})).dialog({
                closeOnEscape: false,
                autoOpen     : true,
                dialogClass  : "cardDialog",
                title        : 'Content card page',
                modal        : true,
                resizable    : false,
                draggable    : false,
                width        : "500px",
                close        : function () {
                    this.remove();
                }.bind(this),
                buttons      : [
                    {
                        text   : "Cancel",
                        'class': 'btn btnMedium btnError',
                        click  : function () {
                            $(this).dialog("close");
                        }
                    },
                    {
                        text   : "Save",
                        'class': 'btn btnMedium btnSuccess',
                        click  : function () {
                            this.letsSaveCard();
                        }.bind(this)
                    }
                ]
            });
            this.renderRetailerSelect();
            this.delegateEvents();
            
            return this;
        }
        
    });
    
    return ItemView;
});
