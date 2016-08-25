'use strict';

angular
  .module('facebookMostLiked')
  .directive('facebookMostLiked', facebookMostLiked);

//------------------------------------------------------------

function facebookMostLiked($timeout) {
  'ngInject';

  var directive = {
    link: link,
    templateUrl: 'facebook-most-liked/facebook-most-liked.html',
    restrict: 'E',
    scope: {
      'module': '@'
    },
    controller: facebookMostLikedController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {
    'ngInject';
  }
}

function facebookMostLikedController($scope, $element, $attrs, $facebook, $http) {
  'ngInject';

  var activeModuleName = $scope.module;
  var el = $element.find('.facebook-likes-graph')[0];
  var vm = this;
  vm.likes = {};
  vm.next;
  vm.getMore = getMore;

  var fieldsArray = [
    'created_time',
    'written_by',
    'username',
    'category',
    'context',
    'engagement',
    'location',
    'about'
  ];
  var fields = fieldsArray.join(',');

  // initialize
  init();

  function init() {
    // query facebook and handle response
    $facebook
      .cachedApi(`me?fields=likes{${fields}}`)
      .then(setLikes)
      .then(setNext)
      .then(setMostLiked);
  }

  //------------------------------

  function setLikes(response) {
    vm.likes = response.likes.data;
    return response;
  }

  function setNext(response) {
    vm.next = response.likes.paging.next;
    return response;
  }

  function setMostLiked() {
    var mostLiked;
    vm.likes.map((like) => {
      if (!mostLiked) return mostLiked = like;
      if (like.engagement > mostLiked.engagement) {
        mostLiked = like;
      }
    });

    mostLiked.engagement.countString = Humanize.intword(mostLiked.engagement.count, null, 0);
    vm.mostLiked = mostLiked;
  }

  function getMore() {
    if (vm.next) {
      return $http
        .get(vm.next)
        .then(getMoreOk);
    }

    function getMoreOk(response) {
      if (response.data && response.data.data && response.data.data.length) {
        vm.likes = vm.likes.concat(response.data.data);
        vm.next = response.data.paging.next;
        setMostLiked();
      }
    }
  }
}
