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
        imgMode         : 'add',
        
        initialize: function () {
            
            this.addMode = !this.model;
            this.hasFiles = Boolean(this.model && this.model.altImages);
            
            this.render();
        },
        
        events: {
            'change .retInpmFile'    : 'prepareForDrawing',
            // 'change .vidInpmFile'    : 'prepareForVideo',
            'click .retSelectItem'   : 'onSelectClick',
            'click #editCardRetailer': 'onSelectHeaderClick',
            'click .imgAct'          : 'changeImageMode'
        },

        changeImageMode: function (ev) {
            this.imgMode = $(ev.currentTarget).data('val') || 'add';

            switch (this.imgMode) {
                case 'remove':
                    this.fileArray = [];
                    this.hasFiles = false;
                    this.$el.find('#fileArrayList').html('<img src="images/def_user.png" alt="Img">');
                    break;
                case 'change':
                    this.fileArray = [];
                    this.hasFiles = false;
                    this.$el.find('#contCardImgInpt').trigger('click');
                    break;
                default:
                    this.$el.find('#contCardImgInpt').trigger('click');
                    break;
            }
        },
        
        letsSaveCard: function () {
            var self = this;
            var cardStorage = Backendless.Persistence.of(Models.Feed);
            var retailerStorage = Backendless.Persistence.of(Models.Retailer);
            var cardData = this.addMode ? new Models.Feed : this.model;
            var cardGender = this.$el.find('#editCardGender>input:checked').val();
            var cardTitle = this.$el.find('#editCardTitle').val().trim();
            var cardDescription = this.$el.find('#editCardDescrip').val().trim();
            var cardVideUrl = this.$el.find('#editCardVideoUrl').val().trim();
            var cardProductId = this.$el.find('#editCardProductId').val().trim();
            var retailerId = this.$el.find('#editCardRetailer').data('id');
            // var $videoInput = this.$el.find('#contCardVideoInpt');
            // var videoFile = $videoInput[0] && $videoInput[0].files[0];
            
            if (!cardTitle && !cardDescription) {
                return APP.warningNotification('Enter, please, title or description!');
            }
            
            APP.showSpiner();
            async.parallel({
                // videoUrl: function (pCb) {
                //     self.letsUploadFile(videoFile, 'cardVideo', function (err, res) {
                //         if (err) {
                //             return pCb(err);
                //         }
                //
                //         pCb(null, res);
                //     })
                // },
                
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
                    
                    if (!self.addMode && retailerId) {
                        targetId = self.model.retailer;
                        if (targetId) {
                            query = new Backendless.DataQuery();
                            
                            query.condition = "objectId = '" + targetId + "'";
                            query.options = {relations: ['contentCards']};
                            
                            retailerStorage.find(query, new Backendless.Async(
                                function (retailer) {
                                    var myData = retailer.data[0];
                                    var l = myData.contentCards && myData.contentCards.length;
                                    var newArray = [];
                                    
                                    if (l) {
                                        for (var i = 0; i < l; i++) {
                                            if (myData.contentCards[i].objectId !== self.model.objectId) {
                                                newArray.push(myData.contentCards[i]);
                                            }
                                        }
                                    } else {
                                        return pCb(null, true);
                                    }
                                    
                                    myData.contentCards = newArray;
                                    retailerStorage.save(myData, new Backendless.Async(
                                        function () {
                                            pCb(null, true)
                                        },
                                        function (err) {
                                            pCb(err);
                                        }
                                    ))
                                },
                                function (err) {
                                    pCb(err);
                                }
                            ));
                        } else {
                            pCb(null, true);
                        }
                    } else {
                        pCb(null, true);
                    }
                }
                
            }, function (err, resObj) {
                // APP.hideSpiner();
                var retailerItem;
                var l;
                var flag = true;
                
                if (err) {
                    return APP.errorHandler(err);
                }
                
                if (resObj.imgArray && resObj.imgArray.length) {
                    if (self.hasFiles) {
                        cardData.altImages = self.model.altImages + ',' + resObj.imgArray.join(',')
                    } else {
                        cardData.mainImage = resObj.imgArray[0];
                        cardData.altImages = resObj.imgArray.join(',');
                    }
                }

                if (self.imgMode === 'remove') {
                    cardData.mainImage = '';
                    cardData.altImages = '';
                }
                
                cardData.gender = cardGender;
                cardData.offerTitle = cardTitle;
                cardData.offerDescription = cardDescription;
                cardData.videoURL = cardVideUrl;
                cardData.featuredProductId = cardProductId;
                
                if (retailerId) {
                    retailerItem = self.selectCollection.get(retailerId).toJSON();
                    
                    cardData.retailer = retailerId;
                    cardData.retailerString = retailerItem.retailerName;
                    
                    if (!self.addMode) {
                        l = retailerItem.contentCards.length;
                        
                        for (var i = 0; i < l; i++) {
                            if (retailerItem.contentCards[i].objectId === self.model.objectId) {
                                retailerItem.contentCards[i] = cardData;
                                flag = false;
                            }
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
                            APP.hideSpiner();
                            window.location.reload();
                        },
                        function (err) {
                            APP.hideSpiner();
                            APP.errorHandler(err);
                        }
                    ))
                } else {
                    cardStorage.save(cardData, new Backendless.Async(
                        function () {
                            self.remove();
                            APP.successNotification('Content card successfully saved.');
                            // Backbone.history.navigate('cards', {trigger: true});
                            APP.hideSpiner();
                            window.location.reload();
                        },
                        function (err) {
                            APP.hideSpiner();
                            APP.errorHandler(err);
                        }
                    ))
                }
                
            });
            
        },
        
        // prepareForVideo: function (ev) {
        //     ev.preventDefault();
        //
        //     var self = this;
        //     var $inputFile = $(ev.currentTarget);
        //     var $container = $inputFile.closest('.vidContainer');
        //     var file = $inputFile[0].files[0];
        //     // var filesExt = ['jpg', 'png', 'jpeg', 'bmp', 'JPEG', 'JPG', 'PNG', 'BMP'];
        //     // var parts = $inputFile.val().split('.');
        //     var fr = new FileReader();
        //
        //     fr.onload = function () {
        //         var src = fr.result;
        //
        //         APP.successNotification('Video successfully uploaded...');
        //         $container.find('video').attr('poster','images/def_video.png');
        //
        //     };
        //
        //     if (file) {
        //         fr.readAsDataURL(file);
        //     }
        // },
        
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
                // self.$el.find('#linkText').text('Add image');
                fr = new FileReader();
                
                fr.onload = function () {
                    var src = fr.result;
                    
                    if (self.imgMode === 'change' || !self.hasFiles) {
                        $container.find('#fileArrayList').html('<img src="' + src + '" alt="Img">');
                    } else {
                        $container.find('#fileArrayList').append('<img src="' + src + '" alt="Img">');
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
            $container.slideUp();
            
        },
        
        onSelectHeaderClick: function (ev) {
            ev.preventDefault();
            
            this.$el.find('#retSelectContainer').slideToggle();
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
