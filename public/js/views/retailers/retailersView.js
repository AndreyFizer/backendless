/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/retailers/retailerItemView',
    'text!templates/retailers/retailersTemp.html',
    'text!templates/retailers/retailItemTemp.html'

], function ($, _, Backbone, DialogView, MainTemp, RetItemTrmp) {
    var RetailerView;
    RetailerView = Backbone.View.extend({
        el: '#wrapper',

        template: _.template(MainTemp),
        retItm  : _.template(RetItemTrmp),

        initialize: function () {

            this.render();
        },

        events: {
            'click .retEditBtn' : 'letsEditRetailer'
        },

        renderRetailers: function () {
            var retData = this.collection.toJSON();
            var $container = this.$el.find('#retailContainer').html('');
    
            retData.forEach(function (ret) {
                $container.append(this.retItm(ret));
            }.bind(this));
        },
    
        letsEditRetailer: function (ev) {
            ev.stopPropagation();
            
            var retId = $(ev.target).closest('.retItem').attr('id');
            var retModel = this.collection.get(retId);
            
            this.dialogView = new DialogView({model : retModel});
        },

        render: function () {
            this.$el.html(this.template());
            this.renderRetailers();

            return this;
        }

    });

    return RetailerView;

});