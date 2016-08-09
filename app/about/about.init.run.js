'use strict';

angular
  .module('about')
  .run(init);

//------------------------------------------------------------

function init(routingProvider) {
  var states = [
    {
      name: 'about',
      url: '/about',
      templateUrl: '/about/about.html'
    }
  ];

  routingProvider.addStates(states);
}
