'use strict';

angular
  .module('footer')
  .directive('appFooter', appFooter);

//------------------------------------------------------------

function appFooter() {
  var directive = {
    link: link,
    templateUrl: 'footer/footer.html',
    restrict: 'E',
    scope: {

    }
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs) {

  }
}
