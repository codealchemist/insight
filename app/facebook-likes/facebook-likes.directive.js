'use strict';

angular
  .module('facebookLikes')
  .directive('facebookLikes', facebookLikes);

//------------------------------------------------------------

function facebookLikes($timeout) {
  'ngInject';

  var directive = {
    link: link,
    templateUrl: 'facebook-likes/facebook-likes.html',
    restrict: 'E',
    scope: {
      'module': '@',
      'id': '@'
    },
    controller: facebookLikesController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {
    'ngInject';
  }
}

function facebookLikesController($scope, $element, $attrs, $facebook, $http, $uibModal, graph, facebookLikesByCategory, facebookLikesByPopularity) {
  'ngInject';

  var activeModuleName = $scope.module;
  var el = $element.find('.facebook-likes-graph')[0];
  var vm = this;
  vm.init = init;
  vm.limit = 10; // top N categories
  vm.likes = {};
  vm.next;
  vm.getMore;
  vm.share;
  vm.graphId = 'facebook-likes-' + $scope.id;

  var svg;
  var fieldsArray = [
    'created_time',
    'written_by',
    'username',
    'category',
    'context',
    'engagement',
    'location'
  ];
  var fields = fieldsArray.join(',');

  // set available facebook-like modules
  var modules = {
    byCategory: facebookLikesByCategory,
    byPopularity: facebookLikesByPopularity
  };

  // set active module
  var activeModule = modules[activeModuleName];
  vm.module = activeModule;
  angular.merge(vm, activeModule.vm);

  // initialize
  init();

  function init() {
    svg = graph.createSvg(el);

    // bind getMore to active module
    // refresh likes when active module gets more data
    vm.getMore = () => {
      activeModule.vm.getMore(svg)
        .then( () => vm.likes = activeModule.vm.likes );
    };

    // query facebook and handle response
    $facebook
      .cachedApi(`me?fields=likes{${fields}}`)
      .then(setLikes)
      .then(setNext)
      .then( (response) => activeModule.draw(svg, activeModule.getGraphData(activeModule.vm.likes)) )
      .then( (response) => setEvents(svg, activeModule.getGraphData(activeModule.vm.likes)) )
      .then(setSharingMethod);
  }

  //------------------------------

  function setLikes(response) {
    activeModule.vm.likes = response.likes.data;
    vm.likes = activeModule.vm.likes;
    return response;
  }

  function setNext(response) {
    activeModule.vm.next = response.likes.paging.next;
    vm.next = activeModule.vm.next;
    return response;
  }

  function setSharingMethod() {
    vm.share = share;

    function share() {
      var svg = $(el).find('svg')[0];
      graph.createPng(svg, onCreatePngOk);

      function onCreatePngOk(binaryData, urlData) {
        // window.open(urlData, 'Insight Image');

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'facebook-likes/facebook-likes-share.modal.html',
          controller: 'facebookLikesShareController',
          controllerAs: 'vm',
          // size: size,
          resolve: {
            params: {
              binaryData: binaryData,
              urlData: urlData,
              sharingStart: () => vm.sharing = true,
              sharingDone: () => vm.sharing = false
            }
          }
        });
      }
    }
  }

  function setEvents(svg, data) {
    // set events
    var timeoutRef;
    $(window).resize(function() {
      // use timeout to avoid redrawing too many times while
      // the resize event fires
      clearTimeout(timeoutRef);
      timeoutRef = setTimeout(function() {
        svg.selectAll('g').remove();
        activeModule.draw(svg, data);
      }, 100);
    });

    return {svg, data};
  }
}
