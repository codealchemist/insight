'use strict';

angular
  .module('contact')
  .run(initContact);

//------------------------------------------------------------

function initContact(routingProvider) {
  'ngInject';
  
  var states = [
    {
      name: 'contact',
      url: '/contact',
      templateUrl: 'contact/contact.html'
    }
  ];

  routingProvider.addStates(states);
}
