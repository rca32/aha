angular.module('starter.directives', [])

.directive('youtube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div class="video-container"><iframe src="{{url}}" allowfullscreen></iframe></div>',
    link: function (scope) {
        scope.$watch('code', function (newVal,oldval) {
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
    });