/**
 * Created by andrey on 26.05.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'text!templates/login/loginTemp.html'

], function ($, _, Backbone, Backendless, LoginTemp) {
    var LoginView;
    LoginView = Backbone.View.extend({
        el: '#wrapper',
        
        template: _.template(LoginTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {
            'click #logBtn'   : "letsLogin",
            'click #logBtnReg': "letsGoRegistr"
        },
        
        letsGoRegistr: function (ev) {
            ev.preventDefault();
            
            Backbone.history.navigate('registr', {trigger: true});
        },
        
        letsLogin: function (ev) {
            ev.preventDefault();
            
            var $loginBox = this.$el.find('#logBox');
            var userEmail = $loginBox.find('#logEmail').val().trim();
            var userPass = $loginBox.find('#logPass').val().trim();
            var stayLoggedIn = $loginBox.find('#logStay').prop('checked');
            
            Backendless.UserService.login(userEmail, userPass, stayLoggedIn, new Backendless.Async(
                function (usr) {
                    APP.sessionData.set({
                        authorized: true,
                        userId    : usr.objectId
                    });
                    $('body').addClass('loggedState');
                    Backbone.history.navigate('users', {trigger: true});

                },function (err) {
                    APP.errorHandler(err);
                    document.getElementById('logForm').reset();
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