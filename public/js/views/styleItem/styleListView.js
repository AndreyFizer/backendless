/**
 * Created by Anton Smirnov on 6/6/2016.
 */

'use strict';

define([
    'jQuery',
    'Backbone',
    'Underscore',
    'Backendless',
    'views/styleItem/styleCreateView',
    'text!templates/styleItem/styleTemp.html',
    'text!templates/styleItem/styleListTemp.html'

], function ($, Backbone, _, Backendless, DialogView, StyleTemp, StyleListTemp) {
    return Backbone.View.extend({

        el: '#wrapper',

        styleTemp    : _.template(StyleTemp),
        styleListTemp: _.template(StyleListTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'click #createBtn': 'letsCreateStyleItem'
        },

        letsCreateStyleItem: function (ev) {
            ev.stopPropagation();

            // render create styleItem page
            this.dialogView = new DialogView();
        },

        renderStyles: function () {
            var $styleCont = this.$el.find('#styleListContainer').html('');
            var stylesData = this.collection.toJSON();

            // render every style's data
            stylesData.forEach(function (style) {
                $styleCont.append(this.styleTemp(style));
            }.bind(this));
        },

        render: function () {
            this.$el.html(this.styleListTemp());
            this.renderStyles();

            return this;
        }
    });
});