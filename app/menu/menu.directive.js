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

  }
}

function fiMenuController($scope, $element, $attrs, $state, $facebook) {
  var vm = this;
  vm.currentStateName = $state.current.name;
  vm.isLoggedInToFacebook = false;

  $facebook
    .getLoginStatus()
    .then(function(response) {
      if (response.status !== 'unknown') vm.isLoggedInToFacebook = true;
    });

  $scope.$on('fb.auth.logout', () => vm.isLoggedInToFacebook = false);
}
