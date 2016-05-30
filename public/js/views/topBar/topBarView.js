/**
 * Created by andrey on 30.05.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'text!templates/topBar/topBarTemp.html'
    
], function ($, _, Backbone, Backendless, TopBarTemp) {
    var TopBarView;
    TopBarView = Backbone.View.extend({
        el: '#topBar',
        
        template: _.template(TopBarTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {
            'click #logOutBtn' : 'letsLogOut'
        },
        
        letsLogOut: function (ev) {
            ev.preventDefault();
    
            Backendless.UserService.logout( new Backendless.Async(
                function () {
                    APP.sessionData.set({
                        authorized: false,
                        userId    : null
                    });
                    $('body').removeClass('loggedState');
                    Backbone.history.navigate('login', {trigger: true});
                },
                APP.errorHandler
            ))
        },
        
        render: function () {
            
            this.$el.html(this.template());
            
            return this;
        }
        
    });
    
    return TopBarView;
    
});