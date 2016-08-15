'use strict';

angular
  .module('menu')
  .directive('fiMenu', fiMenu);

//------------------------------------------------------------

function fiMenu() {
  var directive = {
    link: link,
    templateUrl: 'menu/menu.html',
    restrict: 'E',
    scope: {

    },
    controller: fiMenuController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {
    'ngInject';
  }
}

function fiMenuController($scope, $element, $attrs, $state, $facebook) {
  'ngInject';
  
  var vm = this;
  vm.currentStateName = $state.current.name;
  vm.isLoggedInToFacebook = false;

  // set logged in flag
  $facebook
    .getLoginStatus()
    .then(function(response) {
      if (response.status === 'connected') vm.isLoggedInToFacebook = true;
    });

  $scope.$on('fb.auth.logout', () => vm.isLoggedInToFacebook = false);
}
