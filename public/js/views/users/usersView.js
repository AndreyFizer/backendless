/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'views/users/userItemView',
    'text!templates/users/usersTemp.html',
    'text!templates/users/userItemTemp.html',
    'text!templates/users/userFavConCardsTemp.html'

], function ($, _, Backbone,  Backendless, DialogView, MainTemp, UstItemTemp, UsrFavConCardsTemp) {

    return Backbone.View.extend({
        el: '#wrapper',

        mainTemp    : _.template(MainTemp),
        userItemTemp: _.template(UstItemTemp),
        favCardsTemp: _.template(UsrFavConCardsTemp),

        initialize: function () {
            this.collectionJSON = this.collection.toJSON();
            this.render();
        },

        events: {
            'click .usrEditBtn': 'letsEditUser',
            'click .usrItem'   : 'letsShowUserCards'
        },

        letsEditUser: function (ev) {
            ev.stopPropagation();

            var userId    = this.$el.find(ev.target).closest('.usrItem').attr('id');
            var userModel = this.collection.get(userId);

            this.dialogView = new DialogView({ model: userModel });
            this.dialogView.on('userAction', this.userAction, this)
        },

        letsShowUserCards: function (ev) {
            ev.stopPropagation();

            var userId = this.$el.find(ev.currentTarget).attr('id');
            this.renderFavCards(userId)
        },

        userAction: function (data) {
            var isNew    = data.isNew || false;
            var userData = data.model || { };
            var userId;

            if (isNew){
                userId = userData.objectId;
                this.collection.add(userData, { merge: true });
            }
        },
        
        renderUsers: function () {
            var usersData = this.collection.toJSON();
            var $userCont = this.$el.find('#userContainer').html('');

            var firstUserIdInList = usersData[0].objectId;

            // render every user's data
            usersData.forEach(function (user) {
                $userCont.append(this.userItemTemp(user));
            }.bind(this));

            this.renderFavCards(firstUserIdInList);
        },

        renderFavCards: function (userId) {
            var userFavCards  = this.collection.get(userId).get('favoritedContentCards');
            var $cardsContainer = this.$el.find('#favorContCardsContainer').html('');

            // render first user's favorites content cards
            $cardsContainer.append(this.favCardsTemp({ collection: userFavCards }));
        },
        
        render: function () {
            this.$el.html(this.mainTemp());
            this.renderUsers();
            
            return this;
        }
    });
});