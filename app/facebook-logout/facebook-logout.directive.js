'use strict';

angular
  .module('facebookLogout')
  .directive('facebookLogout', facebookLogout);

//------------------------------------------------------------

function facebookLogout() {
  var directive = {
    link: link,
    restrict: 'A',
    scope: {},
    controller: facebookLogoutController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {
    'ngInject';
  }
}

function facebookLogoutController($scope, $element, $attrs, $facebook) {
  'ngInject';

  // hide by default
  hide();

  // add click handler
  $element.bind('click', onClick);

  // show if logged in
  $facebook
    .getLoginStatus()
    .then(function(response) {
      if (response.status === 'connected') show();
    });

  // show on login
  $scope.$on('fb.auth.login', show);

  // hide on logout
  $scope.$on('fb.auth.logout', hide);

  function onClick() {
    if (isDisabled()) return console.log('facebook-logout disabled!');
    disable();

    $facebook
      .logout()
      .then(onLogoutOk, onLogoutError)
      .finally(() => enable());

    //------------------------------

    function onLogoutOk(response) {
      console.log('onLogoutOk:', response);
    }

    function onLogoutError(response) {
      console.log('onLogoutError:', response);
    }
  }

  function enable() {
    $element.attr('disabled', false);
  }

  function disable() {
    $element.attr('disabled', true);
  }

  function isDisabled() {
    return $element.attr('disabled');
  }

  function show() {
    $element.show();
  }

  function hide() {
    $element.hide();
  }
}
