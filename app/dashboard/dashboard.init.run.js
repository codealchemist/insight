'use strict';

angular
  .module('dashboard')
  .run(initDashboard);

//------------------------------------------------------------

function initDashboard(routingProvider, $rootScope, $state, $facebook) {
  'ngInject';
  
  var states = [
    {
      name: 'dashboard',
      url: '/dashboard',
      templateUrl: 'dashboard/dashboard.html',
      onEnter: onEnter
    }
  ];

  routingProvider.addStates(states);

  //------------------------------
  
  // open route when logged in to facebook
  $rootScope.$on('fb.auth.login', open);

  function open() {
    $state.go('dashboard');
  }

  //------------------------------
  
  // open welcome route if not logged in and still in dashboard route
  function onEnter() {
    $facebook
      .getLoginStatus()
      .finally()
      .then(onFacebookResponse);

    function onFacebookResponse(response) {
      if (!response.status || response.status === 'unknown') {
        $state.go('welcome');
      }
    }
  }
}
