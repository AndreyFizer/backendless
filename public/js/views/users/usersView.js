/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'views/users/userItemView',
    'text!templates/users/usersTemp.html',
    'text!templates/users/userItemTemp.html'

], function ($, _, Backbone, DialogView, MainTemp, UstItemTemp) {

    return Backbone.View.extend({
        el: '#wrapper',
        
        template: _.template(MainTemp),
        usrItm  : _.template(UstItemTemp),
        
        initialize: function () {
            this.render();
        },

        events: {
            'click .usrEditBtn' : 'letsEditUser'
        },

        renderUsers: function () {
            var usersData = this.collection.toJSON();
            var $container = this.$el.find('#usrContainer').html('');

            usersData.forEach(function (usr) {
                $container.append(this.usrItm(usr));
            }.bind(this));
        },

        letsEditUser: function (ev) {
            ev.stopPropagation();

            var userId    = this.$el.find(ev.target).attr('id');
            var userModel = this.collection.get(userId);

            this.dialogView = new DialogView({ model: userModel });
        },
        
        render: function () {
            this.$el.html(this.template());
            this.renderUsers();
            
            return this;
        }
    });
});