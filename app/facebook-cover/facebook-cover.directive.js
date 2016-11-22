'use strict';

angular
  .module('facebookCover')
  .directive('facebookCover', facebookCover);

//------------------------------------------------------------

function facebookCover($timeout) {
  'ngInject';

  var directive = {
    link: link,
    templateUrl: 'facebook-cover/facebook-cover.html',
    restrict: 'E',
    scope: {
      'module': '@'
    },
    controller: facebookCoverController,
    controllerAs: 'vm',
    transclude: true
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {
    'ngInject';
  }
}

function facebookCoverController($scope, $element, $attrs, $facebook) {
  'ngInject';

  var vm = this;
  vm.coverUrl = '';
  vm.openCover = openCover;

  var fieldsArray = [
    'cover'
  ];
  var fields = fieldsArray.join(',');

  // initialize
  init();

  function init() {
    // query facebook and handle response
    $facebook
      .cachedApi(`me?fields=${fields}`)
      .then(setCover);
  }

  function setCover(response) {
    vm.coverUrl = response.cover.source;
  }

  function openCover() {
    window.open(vm.coverUrl)
  }
}
