'use strict';

angular
  .module('about')
  .run(initAbout);

//------------------------------------------------------------

function initAbout(routingProvider) {
  'ngInject';

  var states = [
    {
      name: 'about',
      url: '/about',
      templateUrl: 'about/about.html'
    }
  ];

  routingProvider.addStates(states);
}
