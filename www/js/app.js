// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// function myCustomOnNotificationHandler(eve)
// {
//     console.log(eve);
// }
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'aha.services','ngCordova'])
.run(function($ionicPlatform, $rootScope,$cordovaPush) {
    $ionicPlatform.ready(function() {
        console.log(device.platform);
        if (window.cordova  && window.cordova.plugins.Keyboard) {
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
        if ( device.platform == 'android' || device.platform == 'Android' )
        {
            id = "689218406627";
        }
        else
        {
            id = "com.einfomax.ahamobile";
        }
        try
        {
            console.log("----");
              var androidConfig = {
              "senderID":id
            };

            $cordovaPush.register(androidConfig).then(function(result) {
                console.log(device.platform);
                if ( device.platform == "iOS" || device.platform == "IOS")
                {
                    console.log(result);
                    $rootScope.$broadcast("pushNotificationReceived",{event:"registered",regid:result});
                }
                console.log("register");
            }, function(err) {
                console.log("$cordovaPush.register err");
                console.error(err);
            });
        }
        catch(error)
        {
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
                templateUrl: "templates/browse.html"
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