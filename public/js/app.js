// Created by andrey on 16.05.16.
/*global APP*/

"use strict";

define([
    'jQuery',
    'Backbone',
    'Backendless',
    'views/topBar/topBarView',
    'router'

], function ($, Backbone, Backendless, TopBarView, Router) {
    
    var initialize = function () {
        var usr;
        var url;
        
        APP.sessionData = new Backbone.Model({
            authorized: false,
            userId    : null
        });
        
        APP.errorHandler = function (errObj) {
            alert(errObj.message);
        };

        new TopBarView;
        APP.router = new Router();
        
        Backbone.history.start({silent: true});

        usr = Backendless.UserService.getCurrentUser();

        url = Backbone.history.fragment || 'home';
        Backbone.history.fragment = '';

        if (usr && usr.objectId) {
            APP.sessionData.set({
                authorized: true,
                userId    : usr.objectId
            });
            $('body').addClass('loggedState');
            Backbone.history.navigate(url, {trigger: true});
        } else {
            APP.sessionData.set({
                authorized: false,
                userId    : null
            });
            $('body').removeClass('loggedState');
            Backbone.history.navigate('login', {trigger: true});
        }

    };
    
    return {
        init: initialize
    };
});