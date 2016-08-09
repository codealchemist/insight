'use strict';

angular
  .module('header')
  .directive('fiHeader', fiHeader);

//------------------------------------------------------------

function fiHeader() {
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

  }
}
