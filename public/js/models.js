/**
 * Created by andrey on 26.05.2016.
 */

"use strict";

define(function () {
    function Users(a) {
        var args = a || {};

        this.___class = 'Users';
        this.name = args.name || '';
        this.email = args.email || '';
        this.gender = args.gender || '';
        this.lastName = args.lastName || '';
        this.password = args.password || '';
        this.firstName = args.firstName || '';
        this.deviceToken = args.deviceToken || '';
        this.favoritedProducts = args.favoritedProducts || '';
        this.favoritedTrendingStyles = args.favoritedTrendingStyles || '';  //TODO define type

        // relations props
        this.productsInCart = args.productsInCart || [];
        this.notificationsOn = args.notificationsOn || [];
        this.followedRetailers = args.followedRetailers || [];
        this.favoritedContentCards = args.favoritedContentCards || [];
    }

    function Cart(a) {
        var args = a || {};

        this.___class = 'Cart';
        this.size = args.size || '';
        this.color = args.color || '';
        this.productID = args.productID || '';
    }

    function FeedContentCard(a) {
        var args = a || {};

        this.___class = 'FeedContentCard';
        this.gender = args.gender || '';
        this.retailer = args.retailer || ''; //TODO define type
        this.videoURL = args.videoURL || '';
        this.altImages = args.altImages || '';
        this.mainImage = args.mainImage || '';
        this.offerTitle = args.offerTitle || '';
        this.offerDescription = args.offerDescription || '';
        this.featuredProductId = args.featuredProductId || '';
    }

    function StyleItem(a) {
        var args = a || {};

        this.___class = 'StyleItem';
        this.gender = args.gender || '';
        this.styleTitle = args.styleTitle || '';
        this.imageString = args.imageString || '';
        this.styleDescription = args.styleDescription || '';
        this.feuredProductIDs = args.feuredProductIDs || '';
    }

    function RetailerPage(a) {
        var args = a || {};

        this.___class = 'RetailerPage';
        this.cc = args.cc || '';  // TODO define type
        this.logo = args.logo || ''; // TODO define type
        this.user = args.user || ''; // TODO define type
        this.cards = args.cards || ''; // TODO define type
        this.hasUser = args.hasUser || ''; // TODO define type
        this.website = args.website || ''; // TODO define type
        this.coverImage = args.coverImage || ''; // TODO define type
        this.favorited = args.favorited || ''; // TODO define type
        this.following = args.following || ''; // TODO define type
        this.UserString = args.userString || ''; // TODO define type
        this.retailerId = args.retailerId || '';
        this.shoppingTip = args.shoppingTip || ''; // TODO define type
        this.notification = args.notification || ''; // TODO define type
        this.retailerLogo = args.retailerLogo || '';
        this.retailerName = args.retailerName || '';
        this.shoppingTips = args.shoppingTips || '';
        this.retailerDarkLogo = args.retailerDarkLogo || '';
        this.retailerCoverPhoto = args.retailerCoverPhoto || '';
        this.retailerDescription = args.retailerDescription || '';
        this.shopStyleRetailerID = args.shopStyleRetailerID || ''; // TODO define type
        this.maleFeaturedProductIDs = args.maleFeaturedProductIDs || '';
        this.femaleFeaturedProductIDs = args.femaleFeaturedProductIDs || '';

        // relations props
        this.contentCards = args.contentCards || [];
        this.trendingStyles = args.trendingStyles || [];
    }
    
    return {
        User    : Users,
        Cart    : Cart,
        Feed    : FeedContentCard,
        Style   : StyleItem,
        Retailer: RetailerPage
    }
});

