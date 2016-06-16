/**
 * Created by andrey on 26.05.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/login/loginTemp.html'

], function ($, _, Backbone, Backendless, Models, LoginTemp) {
    var LoginView;
    LoginView = Backbone.View.extend({
        el: '#wrapper',

        template: _.template(LoginTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'click #logBtnReg': 'letsRegister',
            'click #logBtn'   : 'letsLogin'
        },

        letsRegister: function (ev) {
            ev.preventDefault();

            Backbone.history.navigate('registr', {trigger: true});
        },

        letsLogin: function (ev) {
            ev.preventDefault();

            var $loginBox = this.$el.find('#logBox');
            var stayLoggedIn = $loginBox.find('#logStay').prop('checked');
            var userEmail = $loginBox.find('#logEmail').val().trim();
            var userPass = $loginBox.find('#logPass').val().trim();
            var queryData = new Backendless.DataQuery();
            queryData.condition = "email = '" + userEmail + "'";

            Backendless.Persistence.of(Models.User).find(queryData, new Backendless.Async(
                function success(response) {
                    var isAdmin;

                    if (!response.data.length) {
                        return APP.warningNotification('Sorry, you should register first');
                    }

                    isAdmin = response.data[0].admin || false;

                    if (isAdmin) {
                        Backendless.UserService.login(userEmail, userPass, stayLoggedIn, new Backendless.Async(
                            function (usr) {
                                APP.sessionData.set({
                                    authorized: true,
                                    userId    : usr.objectId
                                });
                                $('body').addClass('loggedState');
                                Backbone.history.navigate('retailers', {trigger: true});

                            }, function (err) {
                                APP.errorHandler(err);
                                document.getElementById('logForm').reset();
                            }
                        ));
                    } else {
                        APP.warningNotification('Sorry, permission to login only for admins');
                    }
                },
                function error(err) {
                    APP.errorHandler(err);
                }
            ));
        },

        render: function () {
            this.$el.html(this.template());

            return this;
        }
    });
    return LoginView;
});