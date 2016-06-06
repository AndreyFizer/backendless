/**
 * Created by andrey on 06.06.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/contentCard/contentCardTemp.html'

], function ($, _, Backbone, Backendless, Models, CardTemp) {
    var StyleItemView;
    StyleItemView = Backbone.View.extend({
        el: '#cardViewContainer',

        template: _.template(CardTemp),

        initialize: function (opts) {
            var cardStorage = Backendless.Persistence.of(Models.Feed);
            var query = new Backendless.DataQuery();
            var currentCards = opts && opts.currentCards;
    
            query.options = {pageSize : 50};

            cardStorage.find(query, new Backendless.Async(
                function (res) {
                    this.collection = res.data;
                    this.render(currentCards);
                },
                APP.errorHandler,
                this
            ));
        },

        events: {},

        acceptNewCards: function (cb) {
            var checked = this.$el.find('input:checked');
            var aLength = checked.length;
            var checkedIds = [];
            var curEl;

            if (!aLength){
                return cb(null, []);
            }

            while (aLength--){
                curEl = $(checked[aLength]);
                checkedIds.push(curEl.closest('.cardItemRow').attr('id'));
            }

            var result = _.filter(this.collection, function (item) {
                return checkedIds.indexOf(item.objectId) !== -1;
            });

            cb(null, result);
        },

        render: function (cs) {
            var cardData = this.collection;

            this.$el.html(this.template({
                coll   : cardData,
                current: cs
            }));

            return this;
        }

    });

    return StyleItemView;

});