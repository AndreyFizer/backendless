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

], function ($, _, Backbone, DialogView, MainTemp, RetItemTemp) {
    var RetailerView;
    RetailerView = Backbone.View.extend({
        el: '#wrapper',

        template: _.template(MainTemp),
        retItm  : _.template(RetItemTemp),

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
            this.dialogView.on('retailerAction', this.retailerAction, this)

        },

        retailerAction: function (data) {
            var isNew = data.isNew;
            var retData = data.model;
            var usrId;
            var usrRow;

            if (isNew){

            } else {
                usrId = retData.objectId;
                this.collection.get(usrId).set(retData);
                usrRow = this.$el.find('#'+usrId);
                usrRow.find('.tLogo>img').attr('src', retData.logo || 'styles/libs/images/def_user.png');
                usrRow.find('.tRetLogo>img').attr('src', retData.retailerLogo || 'styles/libs/images/def_user.png');
                usrRow.find('.tRetName').text(retData.retailerName || '');
                usrRow.find('.tRetWeb').text(retData.website || '');
            }

        },

        render: function () {
            this.$el.html(this.template());
            this.renderRetailers();

            return this;
        }

    });

    return RetailerView;

});