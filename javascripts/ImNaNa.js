/**
 * Created by haha on 2015/1/31.
 */

var ImNaNaApp = angular.module('ImNaNaApp', ['ngAnimate', 'infinite-scroll']);
ImNaNaApp.factory('preLoadImageService', ['$http', function($http) {
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
}]);
ImNaNaApp.factory('generateUrlService', ['$http', '$q', function($http){
    var baseUrl = 'images/ImNaNa/';
    var urls = [];
    //$http.get('javascripts/c.json').success(function(data) {
    //    for(var i = 0; i < data.length; ++i){
    //        var ob = data[i];
    //        var cate = ob["cate"];
    //        var addrs = ob["addrs"];
    //        for(var j = 0; j < addrs.length; ++j){
    //            urls.push(baseUrl + cate + "/" + addrs[j]);
    //        }
    //    }
    //
    //});
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status < 400) {
            var data = JSON.parse(xmlhttp.responseText);
            for(var i = 0; i < data.length; ++i){
                var ob = data[i];
                var cate = ob["cate"];
                var addrs = ob["addrs"];
                for(var j = 0; j < addrs.length; ++j){
                    urls.push(baseUrl + cate + "/" + addrs[j]);
                }
            }
        } else{//} if (xmlhttp.status == 400) { // or really anything in the 4 series
                                            // Handle error gracefully
        }
    };
    // Setup connection
    xmlhttp.open('GET', 'javascripts/c.json', false);
    // Make the request
    xmlhttp.send();

    return {
        randomUrl: function(){
            var idx = Math.floor(Math.random() * urls.length);
            return urls[idx];
        },
        getUrl: function(idx){
            if(idx < urls.length)
                return urls[idx];
            return 'error';
        }
    }
}]);
ImNaNaApp.factory('infLoadService', ['preLoadImageService', 'generateUrlService', function(preLoadImageService, generateUrlService){
    var infload = {
        items: [],
        busy: false,
        disabled: false,
        currentSize: 0
    };

    infload.nextPage = function() {
        if (infload.busy) return;
        infload.busy = true;

        var step = 5;
        var tempUrls = [];

        var fn = function(idx){
            var cUrl = generateUrlService.getUrl(infload.currentSize + idx);
            if(cUrl != 'error'){
                preLoadImageService.image(cUrl).success(function (data, status, header) {
                    tempUrls.push(cUrl);
                    if(idx < (step - 1)) fn(idx + 1);
                    else {
                        for(var i = 0; i < tempUrls.length; ++i){
                            infload.items.push(tempUrls[i]);
                        }
                        infload.currentSize += step;
                        infload.busy = false;
                    }
                }).error(function (reason) {
                    //console.log(reason);
                });
            }else{
                for(var i = 0; i < tempUrls.length; ++i){
                    infload.items.push(tempUrls[i]);
                }
                infload.currentSize += step;
                infload.busy = false;
                infload.disabled = true;
            }
        };

        fn(0);
    };

    return {
        infload: infload
    };
}]);
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
ImNaNaApp.directive('mcDirective', ['$animate', function($animate){
    return {
        restrict: 'A',
        replace: false,
        link: function(scope, elem, attrs){
            scope.imgModel.fns[attrs['id'][2]] = function(url){
                scope.imgModel.urls[attrs['id'][2]] = url;
                $animate.addClass(elem, 'fadeout').then(function(){
                    $animate.removeClass(elem, 'fadeout');
                });
            };
        }
    }
}]);
ImNaNaApp.controller('LoadImageController', ['$scope', '$timeout', '$document', 'preLoadImageService', 'generateUrlService', 'infLoadService', function($scope, $timeout, $document, preLoadImageService, generateUrlService, infLoadService){
    $scope.imgModel = {};
    $scope.imgModel.scrollInRange = $document.scrollTop() < 350;
    $scope.imgModel.urls = [];
    $scope.imgModel.fns = [];
    for(var i = 0; i < 7; ++i){
        $scope.imgModel.urls[i] = generateUrlService.randomUrl();
    }

    $scope.loadingImage = function(idx){
        $timeout(function() {
            var url = generateUrlService.randomUrl();

            preLoadImageService.image(url).success(function (data, status, header) {
                $scope.imgModel.fns[idx](url);
                if($scope.imgModel.scrollInRange) $scope.loadingImage(idx);
            }).error(function (reason) {
                console.log(reason);
                if($scope.imgModel.scrollInRange) $scope.loadingImage(idx);
            });
        }, Math.floor(Math.random() * 6500) + 3500);
    };

    if($scope.imgModel.scrollInRange){
        for(var i = 0; i < $scope.imgModel.urls.length; ++i){
            $scope.loadingImage(i);
        }
    }

    $scope.infload = infLoadService.infload;
    $scope.infload.nextPage();
}]);

