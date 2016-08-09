'use strict';

angular
  .module('welcome')
  .run(init);

//------------------------------------------------------------

function init(routingProvider, $rootScope, $state, $facebook) {
  var states = [
    {
      name: 'welcome',
      url: '/welcome',
      templateUrl: '/welcome/welcome.html'
    }
  ];

  var otherwise = '/welcome';
  routingProvider.addStates(states, otherwise);

  //------------------------------
  
  // open route when logged out from facebook
  $rootScope.$on('fb.auth.logout', open);

  function open() {
    $state.go('welcome');
  }
}
