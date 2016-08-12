'use strict';

angular
  .module('facebookFriends')
  .directive('facebookFriends', facebookFriends);

//------------------------------------------------------------

function facebookFriends() {
  var directive = {
    link: link,
    templateUrl: 'facebook-friends/facebook-friends.html',
    restrict: 'E',
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

function facebookFriendsController($scope, $element, $attrs, $interval, $facebook) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookFriends;
  vm.friends = {};
  vm.total = 0;

  $facebook
  	.cachedApi(`me?fields=friends`)
  	.then( setFriends );

	function setFriends(response) {
		vm.setFriends = response.friends;
    var total = response.friends.summary.total_count;
    graph(total);
	}

  function graph(total) {
    var intervalRef = $interval(increment, 5);

    function increment() {
      ++vm.total;
      if (vm.total >= total) $interval.cancel(intervalRef);
    }
  }
}
