'use strict';

angular
  .module('header')
  .directive('appHeader', appHeader);

//------------------------------------------------------------

function appHeader() {
  var directive = {
    link: link,
    templateUrl: 'header/header.html',
    restrict: 'E',
    scope: {

    }
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs) {
    'ngInject';
  }
}
