/**
 * Created by Anton Smirnov on 6/6/2016.
 */

'use strict';

define([
    'jQuery',
    'Backbone',
    'Underscore',
    'Backendless',
    'models',
    'views/styleItem/dialogView',
    'text!templates/styleItem/styleTemp.html',
    'text!templates/styleItem/styleListTemp.html'

], function ($, Backbone, _, Backendless, Models, DialogView, StyleTemp, StyleListTemp) {
    return Backbone.View.extend({

        el: '#wrapper',

        styleTemp    : _.template(StyleTemp),
        styleListTemp: _.template(StyleListTemp),

        initialize: function () {
            this.styleStorage = Backendless.Persistence.of(Models.Style);
            this.render();
        },

        events: {
            'click #styleCreateBtn': 'letsCreateStyleItem',
            'click .styleEditBtn'  : 'letsEditStyleItem'
        },

        letsCreateStyleItem: function (ev) {
            ev.stopPropagation();

            this.dialogView = new DialogView();
        },

        letsEditStyleItem: function (ev) {
            ev.preventDefault();

            var self = this;
            var $styleRow = $(ev.currentTarget).closest('tr');
            var styleId = $styleRow.data('id');

            this.styleStorage.findById(styleId, new Backendless.Async(
                function success(style) {
                    self.dialogView = new DialogView({model: style});
                },
                function error(err) {
                    APP.errorHandler(err);
                }
            ));
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