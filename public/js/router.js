// Created by andrey on 12.05.16.
/*global APP*/

"use strict";

define([
    'Backbone',
    'Backendless',
    'models'

], function (Backbone, Backendless, Models) {
    var Router = Backbone.Router.extend({
        
        initialize: function () {
            
        },
        
        routes: {
            'login'  : 'loginRout',
            'registr': 'registrationRout',
            'home'   : 'homeRout',
            '*any'   : 'anyRout'
        },
        
        anyRout: function () {
            Backbone.history.navigate('home', {trigger: true})
        },
        
        homeRout: function () {
            var self = this;
            var UserModel = Models.User;

            if (APP.sessionData.get('authorized')) {

                Backendless.Persistence.of(UserModel).find(new Backendless.Async(
                    function (list) {
                        var dataList = list.data;
                        var userCollection;
                        var UserCollection = Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                'idAttribute': 'objectId'
                            })
                        });

                        userCollection = new UserCollection(dataList);

                        require(['views/home/homeView'], function (View) {
                            if (self.wrapperView) {
                                self.wrapperView.undelegateEvents();
                            }

                            self.wrapperView = new View({collection: userCollection});
                        })

                    },
                    APP.errorHandler
                ));

            } else {
                Backbone.history.navigate('login', {trigger: true});
            }
        },
        
        registrationRout: function () {
            if (!APP.sessionData.get('authorized')){
                require(['views/registration/registrationView'], function (View) {
                    if (this.wrapperView) {
                        this.wrapperView.undelegateEvents();
                    }
                    this.wrapperView = new View;
                }.bind(this))
            } else {
                Backbone.history.navigate('home', {trigger: true})
            }

        },

        loginRout: function () {
            if (!APP.sessionData.get('authorized')){
                require(['views/login/loginView'], function (View) {
                    if (this.wrapperView) {
                        this.wrapperView.undelegateEvents();
                    }
                    this.wrapperView = new View;
                }.bind(this))
            } else {
                Backbone.history.navigate('home', {trigger: true})
            }
        }
        
    });
    
    return Router;
});