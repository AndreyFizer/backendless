/**
 *
 * Created by Anton on 02.06.16.
 */
"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/users/userEditTemp.html',

], function ($, _, Backbone, Backendless, Models, MainTemp) {
    var ItemView
    ItemView = Backbone.View.extend({

        template: _.template(MainTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'click #cancelBtn': 'letsCloseDialog',
            'click #saveBtn'  : 'letsSaveUser'
        },

        letsSaveUser: function (ev) {
            ev.stopPropagation();

            var $dialogCont = this.$dialogContainer;

            var name    = $dialogCont.find('#name').val().trim();
            var email   = $dialogCont.find('#email').val().trim();
            var surname = $dialogCont.find('#surname').val().trim();

            if (name === user.name && email === user.email) {
                self.dialog('close');
                self.remove();
            }

            user.name     = name;
            user.email    = email;
            user.lastName = surname;

            Backendless.UserService.update(user)
                .then(function () {
                    $dialogForm.remove();
                    self.render();
                })
                .catch(function (err) {
                    APP.handleError(err);
                });

        },

        letsCloseDialog: function () {
            this.remove();
        },

        render: function () {
            var self = this;
            this.$dialogContainer = this.$el.find('#dialog-form');

            var model = this.model;

            var userData = model ? model.toJSON() : { };

            this.undelegateEvents();

            var dialogOptions = {
                closeOnEscape: true,
                resizable    : false,
                draggable    : true,
                autoOpen     : true,
                modal        : true,
                height       : 400,
                width        : 320,
                title        : 'User page'
            };

            this.undelegateEvents();

            this.$el.html(this.template(userData)).dialog(dialogOptions);

            this.delegateEvents();


            return this;
        }

    });

    return ItemView;
});
