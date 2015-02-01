/**
 * Created by haha on 2015/1/31.
 */

var ImNaNaApp = angular.module('ImNaNaApp', []);
ImNaNaApp.factory('preLoadImageService', function($http) {
    var baseUrl = 'images/ImNaNa/';
    var runDownload = function(imageLoc) {
        return $http({
            method: 'GET',
            url: baseUrl + imageLoc
        });
    };
    return {
        image: function(imgUrl) {
            return runDownload(imgUrl);
        }
    };
});
ImNaNaApp.factory('generateUrlService', function($http){

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
ImNaNaApp.controller('LoadImageController', ['$scope', '$timeout', '$document', 'preLoadImageService', function($scope, $timeout, $document, preLoadImageService){
    $scope.imgModel = {};
    $scope.imgModel.scrollInRange = $document.scrollTop() < 350;
    $scope.imgModel.urls = [];
    $scope.imgModel.urls[0] = 'images/ImNaNa/4.jpg';
    $scope.imgModel.urls[1] = 'images/ImNaNa/4.jpg';
    $scope.imgModel.urls[2] = 'images/ImNaNa/4.jpg';
    $scope.imgModel.urls[3] = 'images/ImNaNa/4.jpg';
    $scope.imgModel.urls[4] = 'images/ImNaNa/4.jpg';
    $scope.imgModel.urls[5] = 'images/ImNaNa/4.jpg';
    $scope.imgModel.urls[6] = 'images/ImNaNa/4.jpg';

    $scope.loadingImage = function(idx){
        $timeout(function() {
            preLoadImageService.image(Math.floor(Math.random() * 200) + 1).success(function (data, status, header) {
                $scope.urls[idx] = url;
                if($scope.imgModel.scrollInRange) $scope.loadingImage(idx);
            }).error(function (reason) {
                if($scope.imgModel.scrollInRange) $scope.loadingImage(idx);
            });
        }, Math.floor(Math.random() * 3000) + 3000);
    };

    if($scope.imgModel.scrollInRange){
        for(var i = 0; i < $scope.imgModel.urls.length; ++i){
            $scope.loadingImage(i)
        }
    }
    //for(var i = 0; i < $scope.urls.length; ++i){
    //    var url = "fakename";
    //    $timeout.set(

    //    )
    //}
}]);

