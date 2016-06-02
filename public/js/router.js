// Created by andrey on 12.05.16.
/*global APP*/

"use strict";

define([
    'Backendless',
    'Backbone',
    'models'

], function (Backendless, Backbone, Models) {
    var Router = Backbone.Router.extend({
        
        initialize: function () {

            var query = new Backendless.DataQuery();

            query.options = {relations:[ "favoritedContentCards", ]};

            Backendless.Persistence.of(Models.User).find(query, new Backendless.Async(
                function success (users) {
                    console.log(users.data)
                },
                function error (err) {
                    console.log(err)
                }
            ))


           
        },
        
        routes: {
            'login'    : 'loginRout',
            'registr'  : 'registrationRout',
            'users'    : 'usersRout',
            'retailers': 'retailerRout',
            '*any'     : 'anyRout'
        },
        
        anyRout: function () {
            Backbone.history.navigate('users', {trigger: true})
        },

        retailerRout: function () {
            var self = this;
            var RetailerModel = Models.Retailer;

            if (APP.sessionData.get('authorized')) {

                Backendless.Persistence.of(RetailerModel).find(new Backendless.Async(
                    function (list) {
                        var dataList = list.data;
                        var retailerCollection;
                        var RetailerCollection = Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                'idAttribute': 'objectId'
                            })
                        });

                        retailerCollection = new RetailerCollection(dataList);

                        require(['views/retailers/retailersView'], function (View) {
                            if (self.wrapperView) {
                                self.wrapperView.undelegateEvents();
                            }

                            self.wrapperView = new View({collection: retailerCollection});
                        })

                    },
                    APP.errorHandler
                ));

            } else {
                Backbone.history.navigate('login', {trigger: true});
            }
        },

        usersRout: function () {
            var self = this;
            var userStorage;
            var queryData;

            if (APP.sessionData.get('authorized')) {

                userStorage = Backendless.Persistence.of(Models.User);
                queryData = new Backendless.DataQuery();

                queryData.condition = "isAdmin = false";
                queryData.options = {relations:[ "favoritedContentCards" ]};

                userStorage.find(queryData, new Backendless.Async(
                    function (list) {
                        var dataList = list.data;
                        var userCollection;
                        var UserCollection = Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                'idAttribute': 'objectId'
                            })
                        });

                        userCollection = new UserCollection(dataList);

                        require(['views/users/usersView'], function (View) {
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
            if (!APP.sessionData.get('authorized')) {
                require(['views/registration/registrationView'], function (View) {
                    if (this.wrapperView) {
                        this.wrapperView.undelegateEvents();
                    }
                    this.wrapperView = new View;
                }.bind(this))
            } else {
                Backbone.history.navigate('users', {trigger: true})
            }

        },

        loginRout: function () {
            if (!APP.sessionData.get('authorized')) {
                require(['views/login/loginView'], function (View) {
                    if (this.wrapperView) {
                        this.wrapperView.undelegateEvents();
                    }
                    this.wrapperView = new View;
                }.bind(this))
            } else {
                Backbone.history.navigate('users', {trigger: true})
            }
        }
        
    });
    
    return Router;
});