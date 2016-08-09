'use strict';

angular
  .module('contact')
  .run(init);

//------------------------------------------------------------

function init(routingProvider) {
  var states = [
    {
      name: 'contact',
      url: '/contact',
      templateUrl: '/contact/contact.html'
    }
  ];

  routingProvider.addStates(states);
}
