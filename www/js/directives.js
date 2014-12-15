angular.module('starter.directives', [])
    .directive('youtube', function($sce) {
        return {
            restrict: 'EA',
            scope: {
                code: '='
            },
            replace: true,
            template: '<div class="video-container"><iframe src="{{url}}" allowfullscreen></iframe></div>',
            link: function(scope) {
                scope.$watch('code', function(newVal, oldval) {
                    if (newVal) {
                        scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                    }
                });
            }
        };
    })
    .directive('ngCache', function() {

        return {
            restrict: 'A',
            link: function(scope, el, attrs) {

                attrs.$observe('ngSrc', function(src) {

                    ImgCache.isCached(src, function(path, success) {
                        if (success) {
                            ImgCache.useCachedFile(el);
                        } else {
                            ImgCache.cacheFile(src, function() {
                                ImgCache.useCachedFile(el);
                            });
                        }
                    });

                });
            }
        };
    })
    .directive('autoheightmain', function($window, $timeout) {

        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                var resize = function() {
                    var windowHeight = $window.iennerHeight;
                    var elWidth = el[0].clientWidth;
                    elWidth = elWidth * 374 / 720;
                    var elHeight = parseInt(elWidth);
                    //상단 Height가 고정일떄..
                    //el.css("height", windowHeight - elHeight + "px");
                    el.css("height", elHeight + "px");
                };
                resize();
                $timeout(function() {
                    resize();
                }, 1000);
            }
        };
    })
    .directive('autoheightepisode', function($window, $timeout) {

        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                var resize = function() {
                    var windowHeight = $window.iennerHeight;
                    var elWidth = el[0].clientWidth;
                    elWidth = elWidth * 248 / 720;
                    var elHeight = parseInt(elWidth + 1);
                    //상단 Height가 고정일떄..
                    //el.css("height", windowHeight - elHeight + "px");
                    el.css("max-height", elHeight + "px");
                };
                resize();
                $timeout(function() {
                    resize();
                }, 1000);
            }
        };
    })
    .directive('autoheight', function($window, $timeout) {

        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                var resize = function() {
                    var windowHeight = $window.innerHeight;
                    var elWidth = el[0].clientWidth;
                    elWidth = elWidth * 9 / 16;
                    var elHeight = el[0].offsetTop + elWidth + 45;
                    //상단 Height가 고정일떄..
                    //el.css("height", windowHeight - elHeight + "px");
                    el.css("height", windowHeight - el[0].offsetTop - 45 + "px");
                };
                resize();
                $timeout(function() {
                    resize();
                }, 1000);
            }
        };
    });