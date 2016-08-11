'use strict';

angular
  .module('facebookMe')
  .directive('facebookMe', facebookMe);

//------------------------------------------------------------

function facebookMe() {
  var directive = {
    link: link,
    templateUrl: 'facebook-me/facebook-me.html',
    restrict: 'A',
    scope: {
			
    },
    controller: facebookMeController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {

  }
}

function facebookMeController($scope, $element, $attrs, $facebook) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookMe;
  vm.me = {};

  var fieldsArray = [
    'id',
    'name',
    'first_name',
    'gender',
    'cover',
    'email',
    'languages',
    'link',
    'quotes',
    'sports'
  ];
  var fields = fieldsArray.join(',');

  // TODO: add caching layer

  $facebook
  	.cachedApi('me?fields=' + fields)
  	.then( setMe );

	function setMe(response) {
		console.log('ME:', response);
		vm.me = response;
	}
}
