// Created by andrey on 16.05.16.
/*global APP*/

"use strict";

define([
    'jQuery',
    'router',
    'Backbone',
    'helpers/messenger',
    'Backendless',
    'views/topBar/topBarView'

], function ($, Router, Backbone, messenger, Backendless, TopBarView) {
    
    var initialize = function () {
        var usr;
        var url;
        
        APP.sessionData = new Backbone.Model({
            authorized: false,
            userId    : null
        });

        APP.successNotification = function(message) {
            messenger.alert('success', message);
        };

        APP.warningNotification = function(message) {
            messenger.alert('warning', message);
        };

        APP.errorHandler = function(err) {
            messenger.alert('error', err.message);
        };

        new TopBarView;
        APP.router = new Router();

        Backbone.View.prototype.letsUploadFile = function (f, d, cb) {
            var fileImage = f;
            var folder = 'files';
            var onComplete;

            if (typeof d === 'function') {
                onComplete = d;
            } else {
                folder = d ? d : folder;
                onComplete = (typeof cb === 'function') ? cb : function (er, rs) {
                    if (er){
                        return console.log(er);
                    }
                    console.log(rs);
                };
            }

            if (fileImage) {
                Backendless.Files.upload(fileImage, folder, true, new Backendless.Async(
                    function (result) {
                        onComplete(null, result);
                    },
                    function (err) {
                        onComplete(err);
                    }
                ))
            } else {
                onComplete(null, null)
            }
        };
        
        Backbone.history.start({silent: true});

        usr = Backendless.UserService.getCurrentUser();

        url = Backbone.history.fragment || 'users';
        
        if (Backbone.history.fragment){
            Backbone.history.fragment = ''
        }

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