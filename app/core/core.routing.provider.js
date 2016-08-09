'use strict';

angular
  .module('core')
  .provider('routingProvider', routingProvider);

//------------------------------------------------------------

function routingProvider($stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  /* jshint validthis:true */
  this.$get = routingService;
  // $locationProvider.html5Mode(true).hashPrefix('!');

  function routingService() {
    var service = {
      addStates: addStates
    };

    return service;

    //----------------------------

    function addStates(states, otherwise) {
      states.forEach(function(state) {
        $stateProvider.state(state);
      });

      if (otherwise) {
        $urlRouterProvider.otherwise(otherwise);
      }
    }
  }
}
