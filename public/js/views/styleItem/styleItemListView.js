/**
 * Created by Anton Smirnov on 6/6/2016.
 */

'use strict';

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'views/styleItem/createStyleItemView',
    'text!templates/styleItem/styleItemListTemp.html'

], function ($, _, Backbone, Backendless, Models, DialogView, StyleTemp) {
    return Backbone.View.extend({
        el      : '#wrapper',
        template: _.template(StyleTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'click #createBtn': 'letsCreateStyleItem'
        },

        letsCreateStyleItem: function (ev) {
            ev.stopPropagation();

            // open create styleItem page
            this.dialogView = new DialogView();
        },

        render: function () {

            console.log(this.collection);

            this.$el.html(this.template({
                collection: this.collection.toJSON()
            }));

            return this;
        }

    });
});