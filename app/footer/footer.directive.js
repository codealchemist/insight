'use strict';

angular
  .module('footer')
  .directive('fiFooter', fiFooter);

//------------------------------------------------------------

function fiFooter() {
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
