/**
 * Created by andrey on 02.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/retailers/bigRetailerTemp.html',
    'views/styleItem/styleItemView',
    'views/contentCard/contentCardView'

], function ($, _, Backbone, Backendless, Models, MainTemp, StyleView, CardView) {
    var RetailerView;
    RetailerView = Backbone.View.extend({
        el: '#bigRetailerItem',
        
        template: _.template(MainTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {
            'click #editStyleRelations': 'letsEditStyleList',
            'click #editCardRelations' : 'letsEditCardList'
        },
    
        letsEditCardList: function (ev) {
            var self = this;
            var $currentButton = $(ev.currentTarget);
            var retData = this.model.toJSON();
            var currentCards;
            var cardData;
        
            if ($currentButton.text() === 'Accept') {
                if (this.cardNestedView) {
                    this.cardNestedView.acceptNewCards(function (err, newCards) {
                        if (err) {
                            return APP.errorHandler(err);
                        }
                        retData.contentCards = newCards;
                        Backendless.Persistence.of(Models.Retailer).save(retData, new Backendless.Async(
                            function (respons) {
                                APP.successNotification('Successfully saved');
                                self.trigger('retailerAction', {
                                    isNew: false,
                                    model: respons
                                });
                            },
                            APP.errorHandler
                        ));
                    });
                }
            } else {
                cardData = retData.contentCards;
                currentCards = _.pluck(cardData, 'objectId');
            
                if (this.cardNestedView) {
                    this.cardNestedView.undelegateEvents();
                }
            
                this.cardNestedView = new CardView({currentCards: currentCards});
            }
        
        },
        
        letsEditStyleList: function (ev) {
            var self = this;
            var $currentButton = $(ev.currentTarget);
            var retData = this.model.toJSON();
            var currentStyles;
            var styleData;
            
            if ($currentButton.text() === 'Accept') {
                if (this.styleNestedView) {
                    this.styleNestedView.acceptNewStyles(function (err, newStyles) {
                        if (err) {
                            return APP.errorHandler(err);
                        }
                        retData.trendingStyles = newStyles;
                        Backendless.Persistence.of(Models.Retailer).save(retData, new Backendless.Async(
                            function (respons) {
                                APP.successNotification('Successfully saved');
                                self.trigger('retailerAction', {
                                    isNew: false,
                                    model: respons
                                });
                            },
                            APP.errorHandler
                        ));
                    });
                }
            } else {
                styleData = retData.trendingStyles;
                currentStyles = _.pluck(styleData, 'objectId');
                
                if (this.styleNestedView) {
                    this.styleNestedView.undelegateEvents();
                }
                
                this.styleNestedView = new StyleView({currentStyles: currentStyles});
            }
            
        },
        
        render: function () {
            var retData = this.model.toJSON();
            
            this.$el.html(this.template({model: retData}));
            this.$el.find('#acordion').accordion({
                collapsible: true,
                heightStyle: "content"
            });
            
            return this;
        }
        
    });
    
    return RetailerView;
    
});