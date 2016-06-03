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
    'views/styleItem/styleItemView'
    
], function ($, _, Backbone, Backendless, Models, MainTemp, StyleView) {
    var RetailerView;
    RetailerView = Backbone.View.extend({
        el: '#bigRetailerItem',
        
        template: _.template(MainTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {
            'click #editStyleRelations' : 'letsEditStyleList'
        },
    
        letsEditStyleList: function (ev) {
            var self = this;
            var $currentButton = $(ev.currentTarget);
            var retData = this.model.toJSON();
            var currentStyles;
            var styleData;
            
            if ($currentButton.text() === 'Accept'){
                if (this.nestedView){
                    this.nestedView.acceptNewStyles(function (err, newStyles) {
                        if (err){
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
    
                if (this.nestedView){
                    this.nestedView.undelegateEvents();
                }
        
                $currentButton.text('Accept');
                this.nestedView = new StyleView({currentStyles : currentStyles});
            }
            
        },
        
        render: function () {
            var retData = this.model.toJSON();
            
            this.$el.html(this.template({model : retData}));
            this.$el.find('#acordion').accordion();
            
            return this;
        }
        
    });
    
    return RetailerView;
    
});