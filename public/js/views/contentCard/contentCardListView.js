/**
 * Created by andrey on 06.06.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone'
    
], function ($, _, Backbone) {
    var CardsListView;
    CardsListView = Backbone.View.extend({
        
        initialize: function () {
            
            this.render();
        },
        
        events: {},
        
        render: function () {
            
            return this;
        }
        
    });
    
    return CardsListView;
    
});