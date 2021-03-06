'use strict';

angular
  .module('facebookLikes')
  .service('facebookLikesByUsername', facebookLikesByUsername);

//------------------------------------------------------------

function facebookLikesByUsername($http, graph) {
  'ngInject';

  var vm = {};
  vm.limit = 10; // top N categories
  vm.likes = {};
  vm.next;
  vm.getMore = getMore;
  vm.share;
  vm.moduleName = 'By User';

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
    // count likes per username
    var usernames = {};
    data.map(function(like) {
      if (!like.username) return; // skip likes where username is not available
      if (usernames[like.username]) {
        ++usernames[like.username];
      } else {
        usernames[like.username] = 1;
      }
    });

    var graphData = [];
    angular.forEach(usernames, function(count, key) {
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
