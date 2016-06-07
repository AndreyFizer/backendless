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
        this.favoritedTrendingStyles = args.favoritedTrendingStyles || '';

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
        this.retailer = args.retailer || '';
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
        this.cc = args.cc || '';
        this.logo = args.logo || '';
        this.user = args.user || '';
        this.cards = args.cards || '';
        this.hasUser = args.hasUser || '';
        this.website = args.website || '';
        this.coverImage = args.coverImage || '';
        this.favorited = args.favorited || '';
        this.following = args.following || '';
        this.UserString = args.userString || '';
        this.retailerId = args.retailerId || '';
        this.shoppingTip = args.shoppingTip || '';
        this.notification = args.notification || '';
        this.retailerLogo = args.retailerLogo || '';
        this.retailerName = args.retailerName || '';
        this.shoppingTips = args.shoppingTips || '';
        this.retailerDarkLogo = args.retailerDarkLogo || '';
        this.retailerCoverPhoto = args.retailerCoverPhoto || '';
        this.retailerDescription = args.retailerDescription || '';
        this.shopStyleRetailerID = args.shopStyleRetailerID || '';
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

