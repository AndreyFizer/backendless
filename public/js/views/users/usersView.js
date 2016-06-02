/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/users/usersTemp.html',
    'text!templates/users/userItemTemp.html'

], function ($, _, Backbone, MainTemp, UstItemTrmp) {
    var UserView;
    UserView = Backbone.View.extend({
        el: '#wrapper',
        
        template: _.template(MainTemp),
        usrItm  : _.template(UstItemTrmp),
        
        initialize: function () {
            
            this.render();
        },

        events: {
            'click .usrEditBtn' : 'onEditUser'
        },

        onEditUser: function (ev) {
            // ev.stopPropagation();

            alert('Edit user');
        },
        
        renderUsers: function () {
            var usersData = this.collection.toJSON();
            var $container = this.$el.find('#usrContainer').html('');
            
            usersData.forEach(function (usr) {
                $container.append(this.usrItm(usr));
            }.bind(this));
        },
        
        render: function () {
            this.$el.html(this.template());
            this.renderUsers();
            
            return this;
        }
        
    });
    
    return UserView;
    
});