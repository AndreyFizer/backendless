// Created by andrey on 16.05.16.

"use strict";

define([
    'Backbone',
    'router'

], function (Backbone, Router) {
    
    var initialize = function () {
        
        APP.sessionData = new Backbone.Model({
            authorized: false
        });
        
        APP.router = new Router();
        
        Backbone.history.start(/*{silent: true}*/);
    
        //Backbone.history.navigate();
    };
    
    return {
        init: initialize
    };
});