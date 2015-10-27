var App = angular.module('hashtagObserver', [
        'ngRoute',
        'ui.bootstrap',
        'ngResource',
        'ngAnimate',
        'btford.socket-io'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }]).filter('startFrom', function() {
        return function(data, start) {
            return data.slice(start);
        };
    });