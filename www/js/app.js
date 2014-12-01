// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// function myCustomOnNotificationHandler(eve)
// {
//     console.log(eve);
// }

window.onNotification=function(e){
    console.log(e);   
};

angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'aha.services', 'ngCordova'])
    .run(function($ionicPlatform, $rootScope, $cordovaPush) {
        $ionicPlatform.ready(function() {
            try {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }

                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }

                if (screen && screen.lockOrientation) {
                    screen.lockOrientation('portrait'); //세로 모드 강제 
                }
                $rootScope.deviceready = true;
                $rootScope.$broadcast("deviceready");
                var appid = "";

                var androidConfig = {};
                var id;
                // if (window.cordova && window.cordova.plugins.device &&window.cordova.platformId
                    // (window.cordova.platformId=="android"||device.platform == 'android' || device.platform == 'Android')) {
                if(navigator.userAgent.toLowerCase().indexOf("android")>-1){
                    id = "689218406627";
                    androidConfig.ecb="angular.element(document.querySelector('[ng-app]')).injector().get('$cordovaPush').onNotification";
                } else {
                    id = "com.einfomax.ahamobile";
                }
                androidConfig.senderID=id;
                console.log(androidConfig);

                //Push 왔을시
                $cordovaPush.onNotification=function(notification){
                    console.log(notification);
                    if(notification.event==="registered"){
                        $rootScope.$broadcast("pushNotificationReceived", {
                            event: notification.event,
                            regid: notification.regid
                        });
                    }
                };


                $cordovaPush.register(androidConfig).then(function(result) {
                    console.log(result);

                    if (device.platform == "iOS" || device.platform == "IOS") {

                        $rootScope.$broadcast("pushNotificationReceived", {
                            event: "registered",
                            regid: result
                        });
                    }

                }, function(err) {
                    console.log("$cordovaPush.register err");
                    console.error(err);
                });
            } catch (error) {
                console.error("androidConfig");
                console.error("error:" + error.message);
            }

        });
    })

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })
        .state('app.browse', {
            url: "/browse",
            views: {
                'menuContent': {
                    templateUrl: "templates/browse.html",
                    controller: 'BrowseCtrl'
                }
            }
        })
        .state('app.setting', {
            url: "/setting",
            views: {
                'menuContent': {
                    templateUrl: "templates/setting.html",
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "templates/home.html",
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.episodelist', {
            url: "/episodelist/:seriesid",
            views: {
                'menuContent': {
                    templateUrl: "templates/episodelist.html",
                    controller: 'EpisodeCtrl'
                }
            }
        })
        .state('app.recentlist', {
            url: "/recentlist",
            views: {
                'menuContent': {
                    templateUrl: "templates/recentlist.html",
                    controller: 'RecentCtrl'
                }
            }
        })
        .state('app.serieslist', {
            url: "/serieslist",
            views: {
                'menuContent': {
                    templateUrl: "templates/serieslist.html",
                    controller: 'SeriesCtrl'
                }
            }
        })
        .state('app.favoritelist', {
            url: "/favoritelist",
            views: {
                'menuContent': {
                    templateUrl: "templates/favoritelist.html",
                    controller: 'FavoriteCtrl'
                }
            }
        })
        .state('app.player', {
            url: "/player/:videoid",
            views: {
                'menuContent': {
                    templateUrl: "templates/youtube.html",
                    controller: 'PlaylistCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});

// function (e){
//     console.log(e);
// }