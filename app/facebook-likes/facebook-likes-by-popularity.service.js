'use strict';

angular
  .module('facebookLikes')
  .service('facebookLikesByPopularity', facebookLikesByPopularity);

//------------------------------------------------------------

function facebookLikesByPopularity($http, graph) {
  'ngInject';

  var vm = {};
  vm.limit = 10; // top N categories
  vm.likes = {};
  vm.next;
  vm.getMore = getMore;
  vm.share;
  vm.moduleName = 'By Popularity';

  var service = {
    vm,
    draw: graph.donut,
    getGraphData
  };
  return service;

  //------------------------------

  function getMore(svg) {
    if (vm.next) {
      return $http
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
