'use strict';

angular
  .module('facebookDevices')
  .directive('facebookDevices', facebookDevices);

//------------------------------------------------------------

function facebookDevices($timeout) {
  'ngInject';

  var directive = {
    link: link,
    templateUrl: 'facebook-devices/facebook-devices.html',
    restrict: 'E',
    scope: {
      'module': '@'
    },
    controller: facebookDevicesController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {
    'ngInject';
  }
}

function facebookDevicesController($scope, $element, $attrs, $facebook) {
  'ngInject';

  var vm = this;
  vm.devices = {};

  var fieldsArray = [
    'devices'
  ];
  var fields = fieldsArray.join(',');

  // initialize
  init();

  function init() {
    // query facebook and handle response
    $facebook
      .cachedApi(`me?fields=${fields}`)
      .then(setDevices);
  }

  //------------------------------

  function setDevices(response) {
    vm.devices = response.devices;

    var details = '';
    vm.devices.map((device, i) => {
      details += `${i+1} - ${device.hardware} running ${device.os}\n`;
    });
    vm.details = details;

    return response;
  }
}
