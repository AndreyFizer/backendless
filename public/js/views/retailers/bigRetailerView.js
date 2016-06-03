/**
 * Created by andrey on 02.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/retailers/bigRetailerTemp.html'
    
], function ($, _, Backbone, MainTemp) {
    var RetailerView;
    RetailerView = Backbone.View.extend({
        el: '#bigRetailerItem',
        
        template: _.template(MainTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {},
        
        render: function () {
            var retData = this.model.toJSON();
            
            this.undelegateEvents();
            
            this.$el.html(this.template({model : retData}));
            this.$el.find('#acordion').accordion();
            
            this.delegateEvents();
            
            return this;
        }
        
    });
    
    return RetailerView;
    
});