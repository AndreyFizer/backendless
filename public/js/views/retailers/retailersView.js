/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'views/retailers/retailerItemView',
    'views/retailers/bigRetailerView',
    'text!templates/retailers/retailersTemp.html',
    'text!templates/retailers/retailItemTemp.html'

], function ($, _, Backbone, Backendless, Models, DialogView, BigRetView, MainTemp, RetItemTemp) {
    var RetailerView;
    RetailerView = Backbone.View.extend({
        el: '#wrapper',

        template: _.template(MainTemp),
        retItm  : _.template(RetItemTemp),

        initialize: function (opts) {
            this.currentId = opts && opts.currentId ? opts.currentId : null;

            this.render();
        },

        events: {
            'click .retEditBtn': 'letsEditRetailer',
            'click .retDelBtn' : 'letsDeleteRetailer',
            'click #retCreate' : 'letsCreateRetailer',
            'click .retItem'   : 'onRowClick'
        },

        checkFirstRetailer: function () {
            var firstRetailer;
            var firstId;

            if (this.currentId) {
                firstId = this.currentId;
                firstRetailer = this.$container.find('#' + firstId);
                this.currentId = null;
            } else {
                firstRetailer = this.$container.children() && this.$container.children().first() ? this.$container.children().first() : null;
                firstId = firstRetailer ? firstRetailer.attr('id') : null;
                Backbone.history.navigate('retailers');
            }

            this.$container.find('.active').removeClass('active');
            firstRetailer ? firstRetailer.addClass('active') : false;

            this.renderRightView(firstId);
        },

        renderRightView: function (id) {
            var renderModel = this.collection.get(id);

            if (this.rightView) {
                this.rightView.undelegateEvents();
            }

            this.rightView = new BigRetView({model: renderModel});
            this.rightView.on('retailerAction', this.retailerAction, this)
        },

        renderRetailers: function () {
            var retData = this.collection.toJSON();
            this.$container.html('');

            retData.forEach(function (ret) {
                this.$container.append(this.retItm({model: ret}));
            }.bind(this));
        },

        onRowClick: function (ev) {
            ev.stopPropagation();

            var $currentRow = $(ev.currentTarget);
            var $container = this.$el.find('#retailContainer');
            var currentId;

            Backbone.history.navigate('retailers');

            $container.find('.active').removeClass('active');
            $currentRow.addClass('active');

            currentId = $currentRow.attr('id');
            this.renderRightView(currentId);
        },

        letsCreateRetailer: function () {
            this.dialogView = new DialogView();
            this.dialogView.on('retailerAction', this.retailerAction, this);
        },

        letsEditRetailer: function (ev) {
            var retId = $(ev.target).closest('.retItem').attr('id');
            var retModel = this.collection.get(retId);
            
            this.dialogView = new DialogView({model: retModel});
            this.dialogView.on('retailerAction', this.retailerAction, this);

        },

        letsDeleteRetailer: function (ev) {
            ev.stopPropagation();

            if (confirm('Do you really want to delete this retailer?')) {

                var retailerStorage = Backendless.Persistence.of(Models.Retailer);
                var retId = $(ev.target).closest('.retItem').attr('id');
                var retModel = this.collection.get(retId).toJSON();

                retailerStorage.remove(retModel, new Backendless.Async(
                    function () {
                        this.$el.find('#' + retId).remove();
                        this.collection.remove(retId);
                        APP.successNotification('Retailer successfully deleted.');
                        this.checkFirstRetailer();
                    }.bind(this),
                    APP.errorHandler
                ));

                this.dialogView = new DialogView({model: retModel});
                this.dialogView.on('retailerAction', this.retailerAction, this);
            }
        },

        retailerAction: function (data) {
            var isNew = data.isNew;
            var retData = data.model;
            var usrId;
            var usrRow;

            if (isNew) {
                var $container = this.$el.find('#retailContainer');

                this.collection.add(retData);

                $container.prepend(this.retItm({model: retData}));
                this.checkFirstRetailer();
            } else {
                usrId = retData.objectId;
                this.collection.add(retData, {merge: true});
                usrRow = this.$el.find('#' + usrId);
                usrRow.find('.tLogo>img').attr('src', retData.logo || 'styles/libs/images/def_user.png');
                usrRow.find('.tRetLogo>img').attr('src', retData.retailerLogo || 'styles/libs/images/def_user.png');
                usrRow.find('.tRetName').text(retData.retailerName || '');
                usrRow.find('.tRetWeb').text(retData.website || '');
                usrRow.find('.tRetDescrip').text(retData.retailerDescription || '');

                this.renderRightView(usrId);
            }
        },

        render: function () {
            this.$el.html(this.template());
            this.$container = this.$el.find('#retailContainer');
            this.$el.tooltip({
                track: true,
                show : {delay: 800, duration: 800}
            });
            this.renderRetailers();
            this.checkFirstRetailer();

            return this;
        }

    });

    return RetailerView;

});