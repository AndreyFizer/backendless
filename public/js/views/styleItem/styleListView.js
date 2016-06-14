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
    'views/styleItem/styleCreateView',
    'text!templates/styleItem/styleTemp.html',
    'text!templates/styleItem/styleListTemp.html'

], function ($, Backbone, _, Backendless, Models, DialogView, StyleTemp, StyleListTemp) {
    return Backbone.View.extend({

        el: '#wrapper',

        styleTemp    : _.template(StyleTemp),
        styleListTemp: _.template(StyleListTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'click #styleCreateBtn': 'letsCreateStyleItem',
            'click .styleDeleteBtn': 'letsDeleteStyleItem',
            'click .styleEditBtn'  : 'letsEditStyleItem'
        },

        letsCreateStyleItem: function (ev) {
            ev.stopPropagation();

            // render create styleItem page
            this.dialogView = new DialogView();
        },

        letsDeleteStyleItem: function (ev) {
            ev.preventDefault();

            var self = this;
            var $styleRow = $(ev.currentTarget).closest('tr');
            var styleId = $styleRow.data('id');
            var styleModel = this.collection.get(styleId);

            if (confirm('Do you really wanna remove this style?')) {
                // hide such style row
                $styleRow.hide();

                // remove style from db
                Backendless.Persistence.of(Models.Style)
                    .remove(styleModel, new Backendless.Async(
                        function success() {
                            self.collection.remove(styleModel);
                            $styleRow.remove();
                        },
                        function (err) {
                            $styleRow.show();
                            APP.errorHandler(err);
                        }
                    ));
            }
        },

        letsEditStyleItem: function (ev) {
            ev.preventDefault();

            var $styleRow = $(ev.currentTarget).closest('tr');
            var styleId = $styleRow.data('id');
            var styleModel = this.collection.get(styleId);

            this.dialogView = new DialogView({model: styleModel});
            this.dialogView.on('userAction', this.userAction, this);
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