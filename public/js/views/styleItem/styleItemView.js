/**
 * Created by andrey on 03.06.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/styleItem/styleItemTemp.html'

], function ($, _, Backbone, Backendless, Models, StyleTemp) {
    var StyleItemView;
    StyleItemView = Backbone.View.extend({
        el: '#styleViewContainer',

        template: _.template(StyleTemp),

        initialize: function (opts) {
            var currentStyles = opts && opts.currentStyles;
            var styleStorage = Backendless.Persistence.of(Models.Style);
            var query = new Backendless.DataQuery();

            this.model.on('change', this.updateStyleData, this);
    
            query.options = {pageSize : 100};

            styleStorage.find(query, new Backendless.Async(
                function (res) {
                    this.collection = res.data;
                    this.render(currentStyles);
                },
                APP.errorHandler,
                this
            ));
        },

        updateStyleData: function () {

        },

        acceptNewStyles: function (cb) {
            var checked = this.$el.find('input:checked');
            var aLength = checked.length;
            var checkedIds = [];
            var curEl;

            if (!aLength) {
                return cb(null, []);
            }

            while (aLength--) {
                curEl = $(checked[aLength]);
                checkedIds.push(curEl.closest('.styleItemRow').attr('id'));
            }

            var result = _.filter(this.collection, function (item) {
                return checkedIds.indexOf(item.objectId) !== -1;
            });

            cb(null, result);
        },

        render: function (cs) {
            var styleData = this.collection;

            this.$el.html(this.template({
                coll   : styleData,
                current: cs
            }));

            return this;
        }

    });

    return StyleItemView;

});