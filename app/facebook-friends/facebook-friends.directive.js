'use strict';

angular
  .module('facebookFriends')
  .directive('facebookFriends', facebookFriends);

//------------------------------------------------------------

function facebookFriends() {
  var directive = {
    link: link,
    templateUrl: 'facebook-friends/facebook-friends.html',
    restrict: 'A',
    scope: {
			
    },
    controller: facebookFriendsController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {

  }
}

function facebookFriendsController($scope, $element, $attrs, $facebook) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookFriends;
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

  $facebook
  	.api('me?fields=' + fields)
  	.then( setMe );

	function setMe(response) {
		console.log('ME:', response);
		vm.me = response;
	}
}
