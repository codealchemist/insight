'use strict';

angular
  .module('facebookLikes')
  .directive('facebookLikes', facebookLikes);

//------------------------------------------------------------

function facebookLikes() {
  var directive = {
    link: link,
    templateUrl: 'facebook-likes/facebook-likes.html',
    restrict: 'E',
    scope: {
      
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

function facebookLikesController($scope, $element, $attrs, $facebook, $http, $uibModal, graph) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookLikes;
  vm.limit = 10; // top N categories
  vm.likes = {};
  vm.next;
  vm.getMore = getMore;
  vm.share;

  var graphId = 'facebook-likes-graph';
  var svg = graph.createSvg(graphId);
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

  $facebook
    .cachedApi(`me?fields=likes{${fields}}`)
    .then(setLikes)
    .then(setNext)
    .then( (response) => graph.donut(svg, getGraphData(vm.likes)))
    .then( (response) => setEvents(svg, getGraphData(vm.likes)))
    .then(setSharingMethod);

  //------------------------------

  function setLikes(response) {
    vm.likes = response.likes.data;
    return response;
  }

  function setNext(response) {
    vm.next = response.likes.paging.next;
    return response;
  }

  function setSharingMethod() {
    vm.share = share;

    function share() {
      graph.createPng(graphId, onCreatePngOk);

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

  function getMore() {
    if (vm.next) {
      $http
        .get(vm.next)
        .then(getMoreOk);
    }

    function getMoreOk(response) {
      if (response.data && response.data.data && response.data.data.length) {
        vm.likes = vm.likes.concat(response.data.data);
        vm.next = response.data.paging.next;
        graph.donut(svg, getGraphData(vm.likes));
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
        graph.donut(svg, data);
      }, 100);
    });

    return {svg, data};
  }

  function getGraphData (data){
    // count categories for each like
    var categories = {};
    data.map(function(like) {
      if (categories[like.category]) {
        ++categories[like.category];
      } else {
        categories[like.category] = 1;
      }
    });

    var graphData = [];
    angular.forEach(categories, function(count, key) {
      var graphItem = {
        id: graphData.length, // use array index as id
        label: `${key} (${count})`,
        value: count
      };
      graphData.push(graphItem);
    });

    // sort by value, ascendent
    graphData.sort( (a, b) => a.value - b.value);

    // keep highest only
    graphData = graphData.slice(-vm.limit);

    return graphData;
  }
}
