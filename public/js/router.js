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
        },
        
        routes: {
            'login'          : 'loginRout',
            'registr'        : 'registrationRout',
            'users'          : 'usersRout',
            'styles'         : 'styleItemsRout',
            'cards'          : 'contentCardsRout',
            'retailers(/:id)': 'retailerRout',
            '*any'           : 'anyRout'
        },
        
        anyRout: function () {
            Backbone.history.navigate('users', {trigger: true})
        },
        
        retailerRout: function (argId) {
            var self = this;
            var query = new Backendless.DataQuery();
            
            query.options = {relations: ['trendingStyles', 'contentCards']};
            
            if (APP.sessionData.get('authorized')) {
                
                Backendless.Persistence.of(Models.Retailer).find(query, new Backendless.Async(
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
                            
                            self.wrapperView = new View({
                                collection: retailerCollection,
                                currentId : argId
                            });
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
                queryData.options = {pageSize: 50, relations: ["followedRetailers"]};
                
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
        
        contentCardsRout: function () {
            var self = this;
            var query = new Backendless.DataQuery();
            
            query.options = {pageSize: 50};
            
            if (APP.sessionData.get('authorized')) {
                
                Backendless.Persistence.of(Models.Feed).find(query, new Backendless.Async(
                    function (list) {
                        var dataList = list.data;
                        var cardsCollection;
                        var CardsCollection = Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                'idAttribute': 'objectId'
                            })
                        });
                        
                        cardsCollection = new CardsCollection(dataList);
                        
                        require(['views/contentCard/contentCardListView'], function (View) {
                            if (self.wrapperView) {
                                self.wrapperView.undelegateEvents();
                            }
                            
                            self.wrapperView = new View({
                                collection: cardsCollection
                            })
                        });
                    },
                    APP.errorHandler
                ));
                
            } else {
                Backbone.history.navigate('login', {trigger: true});
            }
        },
        
        styleItemsRout: function () {
            var self = this;
            var styleItemsStorage;
            var queryData;
            
            if (APP.sessionData.get('authorized')) {
                queryData = new Backendless.DataQuery();
                queryData.options = {pageSize: 50};
                
                styleItemsStorage = Backendless.Persistence.of(Models.Style);
                styleItemsStorage.find(queryData, new Backendless.Async(
                    function (list) {
                        var dataList = list.data;
                        var StyleItemsCollection = Backbone.Collection.extend({
                            model: Backbone.Model.extend({
                                'idAttribute': 'objectId'
                            })
                        });
                        var styleItemsCollection = new StyleItemsCollection(dataList);
                        
                        require(['views/styleItem/styleListView'], function (View) {
                            self.wrapperView ? self.wrapperView.undelegateEvents() : null;
                            self.wrapperView = new View({collection: styleItemsCollection});
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