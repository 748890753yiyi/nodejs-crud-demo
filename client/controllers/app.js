var GroupApp = angular.module('groupApp', []);

GroupApp.config(function($routeProvider, $locationProvider) {
  $routeProvider

  	.when('/', {controller: List, templateUrl: '/partials/ListGroups.html'})

    .when('/NewGroups', {controller: CreateController, templateUrl: '/partials/DetailsGroups.html'})

    .when('/EditGroups/:id', {controller: EditController, templateUrl: '/partials/DetailsGroups.html'})

    .when('/DeleteGroups/:id', {controller: DeleteController, templateUrl: '/partials/ListGroups.html'})

    .otherwise({redirectTo: '/'})
    
});

