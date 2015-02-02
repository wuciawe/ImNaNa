/**
 * Created by haha on 2015/1/31.
 */

var ImNaNaApp = angular.module('ImNaNaApp', ['ngAnimate']);
ImNaNaApp.factory('preLoadImageService', function($http) {
    var runDownload = function(imageLoc) {
        return $http({
            method: 'GET',
            url: imageLoc
        });
    };
    return {
        image: function(imgUrl) {
            return runDownload(imgUrl);
        }
    };
});
ImNaNaApp.factory('generateUrlService', function($http){
    var baseUrl = 'images/ImNaNa/';
    var urls = ['images/nanaavator.png'];
    $http.get('javascripts/c.json').success(function(data) {
        for(var i = 0; i < data.length; ++i){
            var ob = data[i];
            var cate = ob["cate"];
            var addrs = ob["addrs"];
            for(var j = 0; j < addrs.length; ++j){
                urls.push('images/ImNaNa/' + cate + "/" + addrs[j]);
            }
        }
    });
    return {
        randomUrl: function(){
            var idx = Math.floor(Math.random() * urls.length);
            return urls[idx];
        }
    }
});
ImNaNaApp.directive('scrollableDirective', ['$document', function ($document) {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attrs) {
            angular.element($document).on('scroll', function () {
                var last = scope.imgModel.scrollInRange;
                scope.imgModel.scrollInRange = elem.scrollTop() < 350;
                if(!last && scope.imgModel.scrollInRange){
                    for(var i = 0; i < scope.imgModel.urls.length; ++i){
                        scope.loadingImage(i)
                    }
                }
            });
        }
    };
}]);
ImNaNaApp.controller('LoadImageController', ['$scope', '$timeout', '$document', 'preLoadImageService', 'generateUrlService', function($scope, $timeout, $document, preLoadImageService, generateUrlService){
    $scope.imgModel = {};
    $scope.imgModel.scrollInRange = $document.scrollTop() < 350;
    $scope.imgModel.urls = [];
    for(var i = 0; i < 7; ++i){
        $scope.imgModel.urls[i] = generateUrlService.randomUrl();
    }

    $scope.loadingImage = function(idx){
        $timeout(function() {
            var url = generateUrlService.randomUrl();
            preLoadImageService.image(url).success(function (data, status, header) {
                $scope.imgModel.urls[idx] = url;
                if($scope.imgModel.scrollInRange) $scope.loadingImage(idx);
            }).error(function (reason) {
                if($scope.imgModel.scrollInRange) $scope.loadingImage(idx);
            });
        }, Math.floor(Math.random() * 6000) + 3000);
    };

    if($scope.imgModel.scrollInRange){
        for(var i = 0; i < $scope.imgModel.urls.length; ++i){
            $scope.loadingImage(i);
        }
    }
}]);

