'use strict';

angular
  .module('welcome')
  .run(init);

//------------------------------------------------------------

function init(routingProvider) {
  var states = [
    {
      name: 'welcome',
      url: '/welcome',
      templateUrl: '/welcome/welcome.html'
    }
  ];

  var otherwise = '/welcome';
  routingProvider.addStates(states, otherwise);
}
