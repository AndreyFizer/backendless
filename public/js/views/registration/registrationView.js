/**
 * Created by andrey on 26.05.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'text!templates/registration/registrationTemp.html'

], function ($, _, Backbone, Backendless, RegTemp) {
    var RegView;
    RegView = Backbone.View.extend({
        el: '#wrapper',
        
        template: _.template(RegTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {
            'click #regBtn'    : "letsRegistr",
            'click #regBtnBack': "letsGoLogin"
        },

        letsGoLogin: function (ev) {
            ev.preventDefault();

            Backbone.history.navigate('login', {trigger: true})
        },
        
        letsRegistr: function (ev) {
            ev.preventDefault();
            
            var $regBox = this.$el.find('#regBox');
            var userEmail = $regBox.find('#regEmail').val().trim();
            var userPass = $regBox.find('#regPass').val().trim();
            var userConf = $regBox.find('#regConfirm').val().trim();
            var userFN = $regBox.find('#regFirstName').val().trim();
            var userLN = $regBox.find('#regLastName').val().trim();
            var user = new Backendless.User();
            
            if (userFN && userLN && userEmail && userPass && (userPass === userConf)) {
                user.email = userEmail;
                user.password = userPass;
                user.firstName = userFN;
                user.lastName = userLN;

                Backendless.UserService.register(user, new Backendless.Async(
                    function () {
                        Backbone.history.navigate('login', {trigger: true})
                    },
                    APP.errorHandler
                ));
            } else {
                alert('Not enaught or wrong data...');
            }
            
        },
        
        render: function () {
            this.$el.html(this.template());
            
            return this;
        }
        
    });
    
    return RegView;
    
});