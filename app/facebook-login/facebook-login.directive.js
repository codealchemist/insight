'use strict';

angular
  .module('facebookLogin')
  .directive('facebookLogin', facebookLogin);

//------------------------------------------------------------

function facebookLogin() {
  var directive = {
    link: link,
    restrict: 'A',
    scope: {},
    controller: facebookLoginController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {

  }
}

function facebookLoginController($scope, $element, $attrs, $facebook) {
  'ngInject';

  // hide by default
  hide();

  // show if not logged in
  $facebook
    .getLoginStatus()
    .then(function(response) {
      if (response.status === 'unknown') show();
    });

  // show on logout
  $scope.$on('fb.auth.logout', show);

  // hide on login
  $scope.$on('fb.auth.login', hide);

  // add click handler
  $element.bind('click', onClick);

  function onClick() {
    if (isDisabled()) return;
    disable();

    $facebook
      .login()
      .then(onLoginOk, onLoginError)
      .finally(() => enable());

    //------------------------------

    function onLoginOk(response) {
      console.log('onLoginOk:', response);
    }

    function onLoginError(response) {
      console.log('onLoginError:', response);
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
