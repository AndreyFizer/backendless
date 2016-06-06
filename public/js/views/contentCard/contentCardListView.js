/**
 * Created by andrey on 06.06.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'text!templates/contentCard/contentCardListTemp.html',
    'views/contentCard/contentCardItemView'

], function ($, _, Backbone, ListTemp, DialogView) {
    var CardsListView;
    CardsListView = Backbone.View.extend({
        el: '#wrapper',

        collection: null,
        template  : _.template(ListTemp),
        
        initialize: function () {
            
            this.render();
        },
        
        events: {
            'click .btnEditCard'  : 'letsEditContentCard',
            'click #btnAddNewCard': 'letsCreateContentCard'
        },

        letsCreateContentCard: function (ev) {
            ev.stopPropagation();

            if (this.dialogView) {
                this.dialogView.undelegateEvents();
            }

            this.dialogView = new DialogView();
        },

        letsEditContentCard: function (ev) {
            ev.stopPropagation();
            
            var cardId = $(ev.target).closest('tr').attr('id');
            var cardModel = this.collection.get(cardId).toJSON();

            if (this.dialogView) {
                this.dialogView.undelegateEvents();
            }

            this.dialogView = new DialogView({model: cardModel});
        },
        
        render: function () {
            var collectionData = this.collection.toJSON();

            this.$el.html(this.template({coll: collectionData}));
            
            return this;
        }
        
    });
    
    return CardsListView;
    
});