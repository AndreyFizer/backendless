// Created by andrey on 12.05.16.

'use strict';

require.config({
    shim : {
        Underscore: {
            exports: '_'
        },
        Backbone  : {
            deps   : [
                'Underscore',
                'jQuery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jQuery    : '../js/libs/jquery/jquery',
        Backbone  : '../js/libs/backbone/backbone',
        Underscore: '../js/libs/underscore/underscore'
    }
});

require([
    'app'
], function (app) {
    app.init();
    
    console.log('Hello from Backbone!');
});