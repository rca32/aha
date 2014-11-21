angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $timeout, $http, URL) {

    $scope.$on('pushNotificationReceived', function(event, notification) {
        console.log("pushNotificationReceived");
        if (notification && notification.event === "registered") {
            console.log(notification["regid"]);
            if (window.device) {
                window.device["regid"] = notification["regid"];
                $http.post(URL + "/registered", window.device);
            }
        } else {

        }

    });

    $scope.$on("deviceready", function(event, data) {
        if (window.device) {
            $http.post(URL + "/start", window.device);
        }


    });

})

.controller('HomeCtrl', function($scope, $http, URL, DEFAULTHOME, $ionicLoading,
    $ionicScrollDelegate, $ionicSlideBoxDelegate, $cordovaDeviceOrientation, $rootScope) {

    try {
        $scope.navTitle = '<img class="title-image" src="img/logo.png" />';
        $scope.home = DEFAULTHOME;
        $scope.datalist = $scope.home.series;
        $scope.URL = URL;
        $scope.gridheight = {
            "height": (window.innerHeight - 300) + "px"
        };

        var servererror = false;

        if ($rootScope.deviceready) {
            if (screen && screen.lockOrientation) {
                screen.lockOrientation('portrait'); //세로 모드 강제 
            }
        }

        init();

    } catch (error) {

        console.error("error:" + error.message);
    }


    $scope.series = function() {
        $scope.datalist = $scope.home.series;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.favorite = function() {
        $scope.datalist = $scope.home.favorite;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.imageurl = function(item) {
        if (servererror === true) {
            return '/img/localpreview1.jpg';
        }
        if (item.type === "series") {
            return URL + '/media/' + item.thumb;
        } else if (item.type === "video") {
            return "https://i.ytimg.com/vi/" + item.youtube + "/default.jpg";
        } else if (item.type === "seriesdefault") {
            return '/img/' + item.thumb;
        } else if (item.type === "videolocal") {
            return '/img/' + item.thumb;
        }
    };

    $scope.linkurl = function(item) {
        if (item.type === "series") {
            return "#/app/episodelist/" + item.id;
        } else if (item.type === "video") {
            return "#/app/player/" + item.id;
        }
    };


    function init() {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $http.get(URL + "/home").
        success(function(data, status, headers, config) {
            $ionicLoading.hide();
            $scope.home = data;
            $ionicSlideBoxDelegate.update();
            $scope.series();
        }).
        error(function(data, status, headers, config) {
            $ionicLoading.hide();

        });
    }



})
    .controller('EpisodeCtrl', function($scope, $http, URL, $rootScope, $stateParams, $timeout) {
        $scope.series = {
            title: "시리즈",
            data: []
        };
        $scope.URL = URL;

        function init() {
            $http.get(URL + "/seriesallvideo/" + $stateParams.seriesid).
            success(function(data, status, headers, config) {

                $scope.series = data;
            }).
            error(function(data, status, headers, config) {

            });
        }

        if ($rootScope.deviceready) {
            if (screen && screen.lockOrientation) {
                screen.lockOrientation('portrait'); //세로 모드 강제 
            }
        }

        init();
    })
    .controller('PlaylistCtrl', function($scope, $http, URL, $stateParams, $timeout, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate) {

        $scope.videoinfo = {};
        $scope.series = [];
        $scope.playerclass = "normal";
        $scope.opinion_items = [];
        $scope.option= {showfooter:true}; //하단 footer 보기

        //의견 보기 


        $scope.openOpinionModal = function() {
            $scope.newopinion = {
                videoid: $stateParams.videoid
            };
            $http.get(URL + "/opinion/" + $stateParams.videoid + "/0").
            success(function(data, status, headers, config) {
                if (_.isArray(data) && data.length == 2) {
                    $scope.opinion_items = data[0];
                    if ($scope.opinion_modal.isShown() === false) {
                        $scope.opinion_modal.show();
                    }
                }
            }).
            error(function(data, status, headers, config) {

            });

        };

        $scope.openOpinionWriteModal = function() {
            //의견 쓰기창 열기
            $scope.write_opinion_modal.show();
        };

        $scope.writeOpinion = function() {
            //의견 보기창 닫기
            $http.post(URL + "/writeopinion", $scope.newopinion)
                .success(function(data, status, headers, config) {
                    $scope.write_opinion_modal.hide();
                    $scope.openOpinionModal();
                }).
            error(function(data, status, headers, config) {
                $scope.write_opinion_modal.hide();
            });

        };
        $scope.deleteOpinion = function($event, item) {
            //의견삭제
            $scope.inputdata = {
                password: ""
            };
            $event.stopPropagation();
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="inputdata.password">',
                title: '삭제을 위해서 암호를 입력 하세요',
                subTitle: '댓글을 작성 할떄 입력한 암호.',
                scope: $scope,
                buttons: [{
                    text: '취소',
                    onTap: function(e) {
                        $scope.inputdata.password = "";
                    }
                }, {
                    text: '<b>확인</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.inputdata.password) {
                            e.preventDefault();
                        } else {
                            return $scope.inputdata.password;
                        }
                    }
                }, ]
            });
            myPopup.then(function(res) {
                if ($scope.inputdata.password) {
                    $http.get(URL + "/opiniondelete/" + item.idopinion + "/" + $scope.inputdata.password).
                    success(function(data, status, headers, config) {
                        var index = $scope.opinion_items.indexOf(item);
                        if (index > -1) {
                            $scope.opinion_items.splice(index, 1);
                        }
                    }).
                    error(function(data, status, headers, config) {
                        if (status === 401) {
                            $timeout(function() {
                                var alertPopup = $ionicPopup.alert({
                                    title: '오류(401)',
                                    template: data
                                });
                            }, 500);
                        }

                    });
                }
            });

        };

        $scope.showOpinion = function(item, index) {
            //의견수정

            var myPopup = $ionicPopup.show({
                template: item.comments,
                title: item.nickname,
                subTitle: item.date,
                scope: $scope,
                buttons: [{
                    text: '확인'
                }]
            });

        };

        function init() {

            //modal 창 model생성 
            $ionicModal.fromTemplateUrl('opinions.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.opinion_modal = modal;
            });

            $ionicModal.fromTemplateUrl('writeopinion.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.write_opinion_modal = modal;
            });

            $scope.screen = {
                playerHeight: window.innerHeight / 2,
                playerWidth: window.innerWidth
            };

            if (screen && screen.unlockOrientation) {
                //회전가능
                screen.unlockOrientation();
                window.onorientationchange = function() {
                    $timeout(function() {

                        switch (window.orientation) {
                            case 0:
                            case 180:
                                $scope.playerclass = "normal";
                                $scope.option.showfooter = true;
                                break;
                            case -90:
                            case 90:
                                $scope.$apply(function() {
                                    $scope.playerclass = "full";
                                    $scope.option.showfooter = false;
                                });


                                break;
                        }
                        $scope.$broadcast("youtuberesize", $scope.screen);
                    }, 500);
                };
            }
            $http.get(URL + "/video/" + $stateParams.videoid).
            success(function(data, status, headers, config) {
                if (_.isArray(data) && data.length > 1) {
                    if (_.isArray(data[0]) && data[0].length > 0) {
                        $scope.videoinfo = data[0][0];
                    }

                    if (_.isArray(data[1])) {

                        _.each(data[1], function(value, idx) {
                            if (idx % 3 === 0) {
                                $scope.series.push([]);
                            }

                            $scope.series[Math.floor(idx / 3)].push(value);
                        });

                        $ionicSlideBoxDelegate.update();
                    }

                }

            }).
            error(function(data, status, headers, config) {

            });
        }

        init();

        $scope.getItemHeight = function(item, index) {
            return 120;
        };
    });