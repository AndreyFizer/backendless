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
    'text!templates/styleItem/styleItemListTemp.html'

], function ($, _, Backbone, Backendless, Models, StyleTemp) {
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

            
        },

        render: function () {
            this.$el.html(this.template({collection: this.collection.toJSON()}));

            return this;
        }

    });
});