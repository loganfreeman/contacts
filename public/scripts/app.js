( function() {
    'use strict';

    angular.module( 'angularContactsListApp', [
        'ngRoute',
        'ngGrid',
        'oitozero.ngSweetAlert',
        'ui.bootstrap'
    ] )
        .config( function($routeProvider) {
            $routeProvider
                .when( '/', {
                    templateUrl: 'scripts/main/views/main.html',
                    controller: 'MainCtrl'
                } )
                .otherwise( {
                    redirectTo: '/'
                } );
        } );

}());