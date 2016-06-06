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
    'text!templates/users/userEditTemp.html'

], function ($, _, Backbone, Backendless, Models, MainTemp) {

    return Backbone.View.extend({

        template: _.template(MainTemp),

        initialize: function () {
            this.model.on('change', this.updateUserData, this);
            this.render();
        },

        events: {
            'click #cancelBtn': 'letsCloseDialog',
            'click #saveBtn'  : 'letsSaveUser'
        },

        letsCloseDialog: function () {
            this.remove();
        },

        letsSaveUser: function (ev) {
            ev.stopPropagation();

            var user     = this.model;
            var userId   = user.get('objectId');
            var $userRow = $('#' + userId);

            var $dialogCont = this.$el.find('#dialog-form');
            var firstName   = $dialogCont.find('#firstName').val().trim();
            var lastName    = $dialogCont.find('#lastName').val().trim();
            var email       = $dialogCont.find('#email').val().trim();

            // render user props
            $userRow.find('.userFirstName').text(firstName || '');
            $userRow.find('.userLastName').text(lastName || '');
            $userRow.find('.userEmail').text(email || '');

            user.set('firstName', firstName);
            user.set('lastName', lastName);
            user.set('email', email);

            // stop listen user's change event
            user.off('change');
            this.remove();
        },

        updateUserData: function (user) {
            var self = this;

            Backendless.UserService.update(user.toJSON(), new Backendless.Async(
                function success(response) {
                    self.trigger('userAction', {
                        isNew: true,
                        model: response
                    });
                },
                function error(err) {
                    APP.errorHandler(err);
                }
            ))
        },

        render: function () {
            var model    = this.model;
            var userData = model ? model.toJSON() : {};

            this.undelegateEvents();

            this.$el.html(this.template(userData)).dialog({
                closeOnEscape: true,
                resizable    : false,
                draggable    : true,
                autoOpen     : true,
                modal        : true,
                height       : 400,
                width        : 320,
                title        : 'User page',
                close        : function () {
                    this.remove()
                }.bind(this)
            });

            this.delegateEvents();

            return this;
        }
    });
});
