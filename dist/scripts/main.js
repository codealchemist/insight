'use strict';

routingProvider.$inject = ["$stateProvider", "$locationProvider", "$urlRouterProvider"];
initCore.$inject = ["$rootScope", "config"];
setupCore.$inject = ["$facebookProvider", "configProvider"];
fiMenuController.$inject = ["$scope", "$element", "$attrs", "$state", "$facebook"];
initWelcome.$inject = ["routingProvider", "$rootScope", "$state", "$facebook"];
initAbout.$inject = ["routingProvider"];
initContact.$inject = ["routingProvider"];
facebookLoginController.$inject = ["$scope", "$element", "$attrs", "$facebook"];
facebookLogoutController.$inject = ["$scope", "$element", "$attrs", "$facebook"];
facebookMeController.$inject = ["$scope", "$element", "$attrs", "$facebook"];
facebookFriendsController.$inject = ["$scope", "$element", "$attrs", "$interval", "$facebook"];
facebookLikesController.$inject = ["$scope", "$element", "$attrs", "$facebook", "$http", "$uibModal"];
facebookLikesShareController.$inject = ["$uibModal", "$facebook", "$http", "$uibModalInstance", "Notification", "params"];
initDashboard.$inject = ["routingProvider", "$rootScope", "$state", "$facebook"];
angular.module('app', ['config', 'core', 'menu', 'header', 'footer', 'welcome', 'about', 'contact', 'facebookLogin', 'facebookLogout', 'facebookMe', 'facebookFriends', 'facebookLikes', 'dashboard']);

'use strict';

angular.module('config', []);

'use strict';

angular.module('config').provider('config', configProvider);

//------------------------------------------------------------

function configProvider() {
  /* jshint validthis:true */
  this.$get = getService;

  //------------------------------

  function getService() {
    var environments = [{
      name: 'development',
      domains: ['localhost', '0.0.0.0', '127.0.0.1', 'insight.dev'],
      config: {
        facebookAppId: '1624901197822863'
      }
    }, {
      name: 'staging',
      domains: ['TODO'],
      config: {
        facebookAppId: 'TODO'
      }
    }];

    // iterate environments and return the config for current one
    var hostname = location.hostname;
    var currentConfig;
    environments.some(function (env) {
      if (env.domains.indexOf(hostname) !== -1) {
        currentConfig = env.config;
        return true;
      }
    });

    return currentConfig;
  }
}

'use strict';

angular.module('core', ['ui.router', 'ngAnimate', 'ngTouch', 'ui.bootstrap', 'ui-notification', 'ngFacebook']);

'use strict';

angular.module('core').provider('routingProvider', routingProvider);

//------------------------------------------------------------

function routingProvider($stateProvider, $locationProvider, $urlRouterProvider) {
  'ngInject';

  /* jshint validthis:true */

  this.$get = routingService;
  // $locationProvider.html5Mode(true).hashPrefix('!');

  function routingService() {
    var service = {
      addStates: addStates
    };

    return service;

    //----------------------------

    function addStates(states, otherwise) {
      states.forEach(function (state) {
        $stateProvider.state(state);
      });

      if (otherwise) {
        $urlRouterProvider.otherwise(otherwise);
      }
    }
  }
}

'use strict';

angular.module('core').run(initCore);

//------------------------------------------------------------

function initCore($rootScope, config) {
  'ngInject';

  // Load the facebook SDK asynchronously

  var facebookAppId = config.facebookAppId;
  (function () {
    (function (d, s, id) {
      var js,
          fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  })();
}

'use strict';

angular.module('core').config(setupCore);

//------------------------------------------------------------

function setupCore($facebookProvider, configProvider) {
  'ngInject';

  var config = configProvider.$get();

  // set Facebook app id and permissions
  $facebookProvider.setAppId(config.facebookAppId);
  $facebookProvider.setPermissions('email,user_likes,user_friends,publish_actions,user_photos');
  $facebookProvider.setCustomInit({
    // channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html',
    xfbml: true
  });
}

'use strict';

angular.module('menu', []);

'use strict';

angular.module('menu').directive('fiMenu', fiMenu);

//------------------------------------------------------------

function fiMenu() {
  var directive = {
    link: link,
    templateUrl: 'menu/menu.html',
    restrict: 'E',
    scope: {},
    controller: fiMenuController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {}
}

function fiMenuController($scope, $element, $attrs, $state, $facebook) {
  'ngInject';

  var vm = this;
  vm.currentStateName = $state.current.name;
  vm.isLoggedInToFacebook = false;

  $facebook.getLoginStatus().then(function (response) {
    if (response.status !== 'unknown') vm.isLoggedInToFacebook = true;
  });

  $scope.$on('fb.auth.logout', function () {
    return vm.isLoggedInToFacebook = false;
  });
}

'use strict';

angular.module('header', []);

'use strict';

angular.module('header').directive('appHeader', appHeader);

//------------------------------------------------------------

function appHeader() {
  var directive = {
    link: link,
    templateUrl: 'header/header.html',
    restrict: 'E',
    scope: {}
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs) {}
}

'use strict';

angular.module('footer', []);

'use strict';

angular.module('footer').directive('appFooter', appFooter);

//------------------------------------------------------------

function appFooter() {
  var directive = {
    link: link,
    templateUrl: 'footer/footer.html',
    restrict: 'E',
    scope: {}
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs) {}
}

'use strict';

angular.module('welcome', []);

'use strict';

angular.module('welcome').run(initWelcome);

//------------------------------------------------------------

function initWelcome(routingProvider, $rootScope, $state, $facebook) {
  'ngInject';

  var states = [{
    name: 'welcome',
    url: '/welcome',
    templateUrl: 'welcome/welcome.html'
  }];

  var otherwise = '/welcome';
  routingProvider.addStates(states, otherwise);

  //------------------------------

  // open route when logged out from facebook
  $rootScope.$on('fb.auth.logout', open);

  function open() {
    $state.go('welcome');
  }
}

'use strict';

angular.module('about', []);

'use strict';

angular.module('about').run(initAbout);

//------------------------------------------------------------

function initAbout(routingProvider) {
  'ngInject';

  var states = [{
    name: 'about',
    url: '/about',
    templateUrl: 'about/about.html'
  }];

  routingProvider.addStates(states);
}

'use strict';

angular.module('contact', []);

'use strict';

angular.module('contact').run(initContact);

//------------------------------------------------------------

function initContact(routingProvider) {
  'ngInject';

  var states = [{
    name: 'contact',
    url: '/contact',
    templateUrl: 'contact/contact.html'
  }];

  routingProvider.addStates(states);
}

'use strict';

angular.module('facebookLogin', []);

'use strict';

angular.module('facebookLogin').directive('facebookLogin', facebookLogin);

//------------------------------------------------------------

function facebookLogin() {
  var directive = {
    link: link,
    restrict: 'A',
    scope: {},
    controller: facebookLoginController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {}
}

function facebookLoginController($scope, $element, $attrs, $facebook) {
  'ngInject';

  // hide by default

  hide();

  // show if not logged in
  $facebook.getLoginStatus().then(function (response) {
    if (response.status === 'unknown') show();
  });

  // show on logout
  $scope.$on('fb.auth.logout', show);

  // hide on login
  $scope.$on('fb.auth.login', hide);

  // add click handler
  $element.bind('click', onClick);

  function onClick() {
    if (isDisabled()) return;
    disable();

    $facebook.login().then(onLoginOk, onLoginError).finally(function () {
      return enable();
    });

    //------------------------------

    function onLoginOk(response) {}

    function onLoginError(response) {}
  }

  function enable() {
    $element.attr('disabled', false);
  }

  function disable() {
    $element.attr('disabled', true);
  }

  function isDisabled() {
    return $element.attr('disabled');
  }

  function show() {
    $element.show();
  }

  function hide() {
    $element.hide();
  }
}

'use strict';

angular.module('facebookLogout', []);

'use strict';

angular.module('facebookLogout').directive('facebookLogout', facebookLogout);

//------------------------------------------------------------

function facebookLogout() {
  var directive = {
    link: link,
    restrict: 'A',
    scope: {},
    controller: facebookLogoutController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {}
}

function facebookLogoutController($scope, $element, $attrs, $facebook) {
  'ngInject';

  // hide by default

  hide();

  // add click handler
  $element.bind('click', onClick);

  // show if logged in
  $facebook.getLoginStatus().then(function (response) {
    if (response.status !== 'unknown') show();
  });

  // show on login
  $scope.$on('fb.auth.login', show);

  // hide on logout
  $scope.$on('fb.auth.logout', hide);

  function onClick() {
    if (isDisabled()) return console.log('facebook-logout disabled!');
    disable();

    $facebook.logout().then(onLogoutOk, onLogoutError).finally(function () {
      return enable();
    });

    //------------------------------

    function onLogoutOk(response) {
      console.log('onLogoutOk:', response);
    }

    function onLogoutError(response) {
      console.log('onLogoutError:', response);
    }
  }

  function enable() {
    $element.attr('disabled', false);
  }

  function disable() {
    $element.attr('disabled', true);
  }

  function isDisabled() {
    return $element.attr('disabled');
  }

  function show() {
    $element.show();
  }

  function hide() {
    $element.hide();
  }
}

'use strict';

angular.module('facebookMe', []);

'use strict';

angular.module('facebookMe').directive('facebookMe', facebookMe);

//------------------------------------------------------------

function facebookMe() {
  var directive = {
    link: link,
    templateUrl: 'facebook-me/facebook-me.html',
    restrict: 'A',
    scope: {},
    controller: facebookMeController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {}
}

function facebookMeController($scope, $element, $attrs, $facebook) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookMe;
  vm.me = {};

  var fieldsArray = ['id', 'name', 'first_name', 'gender', 'cover', 'email', 'languages', 'link', 'quotes', 'sports'];
  var fields = fieldsArray.join(',');

  $facebook.cachedApi('me?fields=' + fields).then(setMe);

  function setMe(response) {
    console.log('ME:', response);
    vm.me = response;
  }
}

'use strict';

angular.module('facebookFriends', []);

'use strict';

angular.module('facebookFriends').directive('facebookFriends', facebookFriends);

//------------------------------------------------------------

function facebookFriends() {
  var directive = {
    link: link,
    templateUrl: 'facebook-friends/facebook-friends.html',
    restrict: 'E',
    scope: {},
    controller: facebookFriendsController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {}
}

function facebookFriendsController($scope, $element, $attrs, $interval, $facebook) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookFriends;
  vm.friends = {};
  vm.total = 0;

  $facebook.cachedApi('me?fields=friends').then(setFriends);

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

'use strict';

angular.module('facebookLikes', []);

'use strict';

angular.module('facebookLikes').directive('facebookLikes', facebookLikes);

//------------------------------------------------------------

function facebookLikes() {
  var directive = {
    link: link,
    templateUrl: 'facebook-likes/facebook-likes.html',
    restrict: 'E',
    scope: {},
    controller: facebookLikesController,
    controllerAs: 'vm'
  };

  return directive;

  //------------------------------

  function link(scope, el, attrs, vm) {}
}

function facebookLikesController($scope, $element, $attrs, $facebook, $http, $uibModal) {
  'ngInject';

  var vm = this;
  vm.property = $attrs.facebookLikes;
  vm.limit = 10; // top N categories
  vm.likes = {};
  vm.next;
  vm.getMore = getMore;
  vm.share;

  var graphId = 'facebook-likes-graph';
  var svg = createSvg(graphId);
  var fieldsArray = ['created_time', 'written_by', 'username', 'category', 'context', 'engagement', 'location'];
  var fields = fieldsArray.join(',');

  $facebook.cachedApi('me?fields=likes{' + fields + '}').then(setLikes).then(setNext).then(function (response) {
    return graph(svg, vm.likes);
  }).then(function (response) {
    return setEvents(svg, vm.likes);
  }).then(setSharingMethod);

  //------------------------------

  function setLikes(response) {
    vm.likes = response.likes.data;
    return response;
  }

  function setNext(response) {
    vm.next = response.likes.paging.next;
    return response;
  }

  vm.test = function () {
    console.log('TEST');
  };

  function setSharingMethod() {
    vm.share = function () {
      createPng(graphId, onCreatePngOk);

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
              urlData: urlData
            }
          }
        });
        return;

        vm.sharing = true;
      }
    };
  }

  function getMore() {
    if (vm.next) {
      $http.get(vm.next).then(getMoreOk);
    }

    function getMoreOk(response) {
      if (response.data && response.data.data && response.data.data.length) {
        vm.likes = vm.likes.concat(response.data.data);
        vm.next = response.data.paging.next;
        graph(svg, vm.likes);
      }
    }
  }

  function createSvg(id) {
    var svg = d3.select('#' + id).append('svg').attr('id', 'svg-' + id).attr('style', 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif').append('g');

    return svg;
  }

  function setEvents(svg, data) {
    // set events
    var timeoutRef;
    $(window).resize(function () {
      // use timeout to avoid redrawing too many times while
      // the resize event fires
      clearTimeout(timeoutRef);
      timeoutRef = setTimeout(function () {
        svg.selectAll('g').remove();
        graph(svg, data);
      }, 100);
    });

    return { svg: svg, data: data };
  }

  function graph(svg, data) {
    svg.append('g').attr('class', 'slices');
    svg.append('g').attr('class', 'labels');
    svg.append('g').attr('class', 'lines');

    var width = getWidth();
    var height = getHeight();
    setContainerHeight(height);

    svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    function getRadius(percentage) {
      percentage = percentage || 1;

      var radius = Math.min(width * percentage, height * percentage) / 2;
      return radius;
    }

    var graphData = getGraphData(data);
    setDataOnGraph(svg, graphData, getRadius);
  } // end graph

  function setDataOnGraph(svg, data, getRadius) {
    // set graph components
    var key = function key(d) {
      return d.data.label;
    };
    var color = getColor(data);

    var pie = d3.layout.pie().sort(null).value(function (d) {
      return d.value;
    });

    var arc = d3.svg.arc().outerRadius(getRadius() * 0.8).innerRadius(getRadius() * 0.4);

    var outerArc = d3.svg.arc().innerRadius(getRadius() * 0.9).outerRadius(getRadius() * 0.9);

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    // compose graph
    var components = { svg: svg, data: data, pie: pie, color: color, arc: arc, outerArc: outerArc, getRadius: getRadius, midAngle: midAngle, key: key };
    setSlices(components);
    setLabels(components);
    setLines(components);
  };

  function setSlices(_ref) {
    var svg = _ref.svg;
    var data = _ref.data;
    var pie = _ref.pie;
    var color = _ref.color;
    var arc = _ref.arc;
    var key = _ref.key;

    var slice = svg.select('.slices').selectAll('path.slice').data(pie(data), key);

    slice.enter().insert('path').style('fill', function (d) {
      return color(d.data.label);
    }).attr('class', 'slice').attr('id', function (d) {
      return 'slice-' + d.data.id;
    }).on('mouseover', function (d) {
      // highlight slice
      d3.select(this).classed('highlight', true);

      // highlight text
      d3.select('#text-' + d.data.id).classed('highlight', true);

      // highlight line
      d3.select('#line-' + d.data.id).classed('highlight', true);
    }).on('mouseout', function (d) {
      // remove slice highlighting
      d3.select(this).classed('highlight', false);

      // remove text highlighting
      d3.select('#text-' + d.data.id).classed('highlight', false);

      // remove line highlighting
      d3.select('#line-' + d.data.id).classed('highlight', false);
    });

    slice.transition().duration(1000).attrTween('d', function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        return arc(interpolate(t));
      };
    });

    slice.exit().remove();
  }

  function setLabels(_ref2) {
    var svg = _ref2.svg;
    var data = _ref2.data;
    var pie = _ref2.pie;
    var outerArc = _ref2.outerArc;
    var getRadius = _ref2.getRadius;
    var midAngle = _ref2.midAngle;
    var key = _ref2.key;

    var text = svg.select('.labels').selectAll('text').data(pie(data), key);

    text.enter().append('text').attr('dy', '.35em').text(function (d) {
      return d.data.label;
    }).attr('id', function (d) {
      return 'text-' + d.data.id;
    }).on('mouseover', function (d) {
      // highlight text
      d3.select(this).classed('highlight', true);

      // highlight slice
      d3.select('#slice-' + d.data.id).classed('highlight', true);

      // highlight line
      d3.select('#line-' + d.data.id).classed('highlight', true);
    }).on('mouseout', function (d) {
      // remove text highlighting
      d3.select(this).classed('highlight', false);

      // remove slice highlighting
      d3.select('#slice-' + d.data.id).classed('highlight', false);

      // remove line highlighting
      d3.select('#line-' + d.data.id).classed('highlight', false);
    });

    text.transition().duration(1000).attrTween('transform', function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = getRadius() * (midAngle(d2) < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      };
    }).styleTween('text-anchor', function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? 'start' : 'end';
      };
    });

    text.exit().remove();
  }

  function setLines(_ref3) {
    var svg = _ref3.svg;
    var data = _ref3.data;
    var pie = _ref3.pie;
    var arc = _ref3.arc;
    var outerArc = _ref3.outerArc;
    var getRadius = _ref3.getRadius;
    var midAngle = _ref3.midAngle;
    var key = _ref3.key;

    var polyline = svg.select('.lines').selectAll('polyline').data(pie(data), key);

    polyline.enter().append('polyline').attr('id', function (d) {
      return 'line-' + d.data.id;
    }).attr('style', 'opacity: .3; stroke: black; stroke-width: 2px; fill: none;').on('mouseover', function (d) {
      // highlight line
      d3.select(this).classed('highlight', true);

      // highlight text
      d3.select('#text-' + d.data.id).classed('highlight', true);

      // highlight slice
      d3.select('#slice-' + d.data.id).classed('highlight', true);
    }).on('mouseout', function (d) {
      // remove line highlighting
      d3.select(this).classed('highlight', false);

      // remove text highlighting
      d3.select('#text-' + d.data.id).classed('highlight', false);

      // remove slice highlighting
      d3.select('#slice-' + d.data.id).classed('highlight', false);
    });

    polyline.transition().duration(1000).attrTween('points', function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = getRadius() * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };
    });

    polyline.exit().remove();
  }

  function getWidth() {
    var width = $('#facebook-likes-graph').width() - 40;
    return width;
  }

  function getHeight() {
    var width = getWidth();
    var height = width / 2;
    return height;
  }

  function setContainerHeight(height) {
    $('#facebook-likes-graph').height(height);
  }

  function getColor() {
    var scale = d3.scale.ordinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    return scale;
  }

  function getGraphData(data) {
    // count categories for each like
    var categories = {};
    data.map(function (like) {
      if (categories[like.category]) {
        ++categories[like.category];
      } else {
        categories[like.category] = 1;
      }
    });

    var graphData = [];
    angular.forEach(categories, function (count, key) {
      var graphItem = {
        id: graphData.length, // use array index as id
        label: key + ' (' + count + ')',
        value: count
      };
      graphData.push(graphItem);
    });

    // sort by value, ascendent
    graphData.sort(function (a, b) {
      return a.value - b.value;
    });

    // keep highest only
    graphData = graphData.slice(-vm.limit);

    return graphData;
  }
}

function createPng(id, callback) {
  var doctype = '<?xml version="1.0" standalone="no"?>' + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  // serialize our SVG XML to a string
  var svg = d3.select('#svg-' + id);
  var source = new XMLSerializer().serializeToString(svg.node());

  // create a file blob of our SVG
  var blob = new Blob([doctype + source], { type: 'image/svg+xml;charset=utf-8' });

  // create url
  var url = window.URL.createObjectURL(blob);

  // put the svg into an image tag so that the Canvas element can read it in
  var img = d3.select('body').append('img').node();

  // get svg dimensions
  var width = svg.style('width').replace('px', '');
  var height = svg.style('height').replace('px', '');

  img.onload = function () {
    // now that the image has loaded, put the image into a canvas element
    var canvas = d3.select('body').append('canvas').node();
    canvas.width = width;
    canvas.height = height;
    canvas.style = 'display:none';
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var canvasUrl = canvas.toDataURL('image/png');
    // var img2 = d3.select('body').append('img').node();

    // this is now the base64 encoded version of our PNG! you could optionally
    // redirect the user to download the PNG by sending them to the url with
    // `window.location.href= canvasUrl`.
    // img2.src = canvasUrl;

    var binary = dataURItoBlob(canvasUrl);
    callback(binary, canvasUrl);
  };

  // start loading the image
  img.style = 'display:none';
  img.src = url;
}

// Convert a data URI to blob
function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: 'image/png'
  });
}

'use strict';

angular.module('facebookLikes').controller('facebookLikesShareController', facebookLikesShareController);

function facebookLikesShareController($uibModal, $facebook, $http, $uibModalInstance, Notification, params) {
  'ngInject';

  var vm = this;
  vm.sharing = false;
  vm.message = 'My top 10 likes by category.'; // default message
  vm.binaryData = params.binaryData;
  vm.urlData = params.urlData;
  vm.share = share;

  function share() {
    vm.sharing = true;

    var fd = new FormData();
    var accessToken = $facebook.getAuthResponse().accessToken;
    fd.append('access_token', accessToken);
    fd.append('source', params.binaryData);
    fd.append('message', vm.message);

    $http.post('https://graph.facebook.com/me/photos', fd, {
      transformRequest: angular.identity,
      headers: { 'Content-Type': undefined }
    }).then(onShared);

    function onShared() {
      vm.sharing = false;
      $uibModalInstance.close();
      Notification.success('Your likes insight was successfully shared :)');
    }
  }
}
'use strict';

angular.module('dashboard', []);

'use strict';

angular.module('dashboard').run(initDashboard);

//------------------------------------------------------------

function initDashboard(routingProvider, $rootScope, $state, $facebook) {
  'ngInject';

  var states = [{
    name: 'dashboard',
    url: '/dashboard',
    templateUrl: 'dashboard/dashboard.html',
    onEnter: onEnter
  }];

  routingProvider.addStates(states);

  //------------------------------

  // open route when logged in to facebook
  $rootScope.$on('fb.auth.login', open);

  function open() {
    $state.go('dashboard');
  }

  //------------------------------

  // open welcome route if not logged in and still in dashboard route
  function onEnter() {
    $facebook.getLoginStatus().finally().then(onFacebookResponse);

    function onFacebookResponse(response) {
      if (!response.status || response.status === 'unknown') {
        $state.go('welcome');
      }
    }
  }
}
'use strict';

angular.module('app').run(['$templateCache', function ($templateCache) {
  $templateCache.put('contact/contact.html', '<app-header></app-header>\n\n<div class="jumbotron">\n  <h1>Contact</h1>\n  <p class="lead">Please, let me know about your experience using <b>Insight</b> :)</p>\n</div>\n\n<div class="row marketing">\n  <div class="col-lg-6">\n\n    <form name="contactForm">\n      <div class="form-group">\n        <h4>It\'s always nice to meet you!</h4>\n        <p>Did you enjoy using Insight?</p>\n        <p>What other insights would you like to get?</p>\n        <p>How would you make Insight better?</p>\n        <p>Did you find a bug?</p>\n        <p>If you just want to share the love that\'s also cool!</p>\n        <a class="btn btn-primary" href="mailto:b3rt.js@gmail.com" target="_blank">Write me an email</a>\n      </div>\n\n      <!-- <div class="form-group">\n        <h4>Here you can write anything you want to share</h4>\n        <textarea\n          class="form-control"\n          rows="10"\n          placeholder="Do you like Facebook Insight? Is it easy to use? How would you make it better?"\n        ></textarea>\n      </div>\n\n      <button class="btn btn-primary">Send</button> -->\n    </form>\n  </div>\n</div>\n\n<app-footer></app-footer>\n');
  $templateCache.put('about/about.html', '<app-header></app-header>\n\n<div class="jumbotron">\n  <h1>About</h1>\n  <p class="lead">Insight was developed by <b>Alberto Miranda</b>.</p>\n</div>\n\n<div class="row marketing">\n  <div class="col-lg-6">\n    <h4>Alberto Miranda</h4>\n    <p>Long time web developer and technology enthusiast.</p>\n    <p>\n      Want to know more about me? Visit my\n      <a href="http://linkedin.com/in/albertomiranda" target="_blank">LinkedIn profile</a>.\n    </p>\n  </div>\n</div>\n\n<app-footer></app-footer>\n');
  $templateCache.put('facebook-friends/facebook-friends.html', '<div class="facebook-insight facebook-friends jumbotron inline-block">\n\t<h4>Total Friends</h4>\n\t<h1>{{vm.total}}</h1>\n</div>');
  $templateCache.put('dashboard/dashboard.html', '<app-header></app-header>\n\n<div class="jumbotron">\n  <h1>Dashboard</h1>\n  <p class="lead">Your one stop place for Facebook insight ;)</p>\n</div>\n\n<div class="row marketing">\n  <div class="col-lg-12">\n  \t<h2 class="animated bounceInLeft">\n  \t\tHi <span facebook-me="first_name"></span>!\n\t\t</h2>\n\t\t<h4>Let\'s review your Facebook world and find some cool stuff ;)</h4>\n\n\t\t<!-- dashboard data visualizations go here -->\n    <div class="dashboard-container">\n    \t<facebook-friends></facebook-friends>\n    \t<facebook-likes></facebook-likes>\n    </div>\n  </div>\n</div>\n\n<app-footer></app-footer>\n');
  $templateCache.put('facebook-likes/facebook-likes-share.modal.html', '<div class="row-fluid">\n\t<div class="col-md-12">\n\t\t<h1>Share with your friends</h1>\n\t\t<h4>It was cool to discover which categories you like the most right?</h4>\n\t\t<h4>Your friends will be surprised too!</h4>\n\n\t\t<p>Is there anything you want to say?</p>\n\t\t<textarea \n\t\t\tclass="form-control"\n\t\t\trows="5"\n\t\t\tng-model="vm.message"\n\t\t\tplaceholder="This message will be shown along with the image below."\n\t\t></textarea>\n\n\t\t<img class="full-width" ng-src="{{vm.urlData}}"></img>\n\n\t\t<div class="form-group text-right">\n\t\t\t<button\n\t\t\t\ttype="button"\n\t\t\t\tclass="btn btn-default"\n\t\t\t\tng-click="$close()"\n\t\t\t>\n\t\t\t\tCancel\n\t\t\t</button>\n\n\t\t\t<button \n\t\t\t\ttype="button"\n\t\t\t\tclass="btn btn-primary"\n\t\t\t\tng-class="{\'disabled\': vm.sharing}"\n\t\t\t\tng-click="vm.share()"\n\t\t\t\tng-disabled="vm.sharing"\n\t\t\t>\n\t\t\t\t<span ng-if="!vm.sharing">Share!</span>\n\t\t\t\t<span ng-if="vm.sharing">Sharing...</span>\n\t\t\t</button>\n\t\t</div>\n\t</div>\n</div>\n');
  $templateCache.put('facebook-likes/facebook-likes.html', '<div class="facebook-insight facebook-likes jumbotron align-bottom">\n\t<h4>\n\t\tYour Likes By Category\n\t\t<i \n\t\t\tclass="glyphicon glyphicon-btn glyphicon-plus"\n\t\t\tng-class="{\'disabled\': !vm.next}"\n\t\t\ttitle="Load more likes"\n\t\t\tng-click="vm.getMore()"\n\t\t\tng-disabled="!vm.next"\n\t\t>\n\t\t</i>\n\t</h4>\n\t<em>Last {{vm.likes.length}}</em>\n\t<div id="facebook-likes-graph" class="facebook-likes-graph"></div>\n\t<em>Top {{vm.limit}}</em>\n\n\t<br>\n\t<i \n\t\tclass="glyphicon glyphicon-btn glyphicon-share"\n\t\tng-class="{\'glyphicon-refresh spinning\': vm.sharing}"\n\t\ttitle="Show this to your friends!"\n\t\tng-click="vm.share()"\n\t\tng-disabled="vm.sharing"\n\t>\n\t</i>\t\n</div>');
  $templateCache.put('menu/menu.html', '<ul class="nav nav-pills pull-right">\n  <li ng-class="{\'active\': vm.currentStateName == \'welcome\'}">\n    <a href="#">Home</a>\n  </li>\n\n  <li ng-if="vm.isLoggedInToFacebook" ng-class="{\'active\': vm.currentStateName == \'dashboard\'}">\n    <a href="#/dashboard">Dashboard</a>\n  </li>\n\n  <li ng-class="{\'active\': vm.currentStateName == \'about\'}">\n    <a href="#/about">About</a>\n  </li>\n\n  <li ng-class="{\'active\': vm.currentStateName == \'contact\'}">\n    <a href="#/contact">Contact</a>\n  </li>\n\n  <li facebook-logout>\n    <a href="#">Logout</a>\n  </li>\n</ul>\n');
  $templateCache.put('facebook-me/facebook-me.html', '<span class="facebook-me">{{vm.me[vm.property] ||\xA0\'\'}}</span>');
  $templateCache.put('footer/footer.html', '<div class="footer">\n  <p>♥ from Buenos Aires</p>\n  <div\n    class="fb-like"\n    data-share="true"\n    data-width="450"\n    data-show-faces="true">\n  </div>\n</div>\n');
  $templateCache.put('header/header.html', '<div class="header">\n  <fi-menu></fi-menu>\n  <h3 class="text-muted">Insight</h3>\n</div>\n');
  $templateCache.put('welcome/welcome.html', '<app-header></app-header>\n\n<div class="jumbotron">\n  <h1>Welcome to Insight!</h1>\n  <p class="lead">We will help you better understand your Facebook world and habits.</p>\n  <p>\n    <a\n      facebook-login\n      class="btn btn-lg btn-success"\n      href="#"\n    >\n      Let\'s Start\n    </a>\n  </p>\n</div>\n\n<div class="row marketing">\n  <div class="col-lg-6">\n    <h4>What\'s Insight?</h4>\n    <p>\n      It\'s a web application that gives you information about your Facebook account.\n    </p>\n\n    <h4>Is it safe to use?</h4>\n    <p>\n      Absolutely! It doesn\'t store or share any information on its own.<br>\n    </p>\n\n    <h4>What information will it show me?</h4>\n    <p>\n      It will show some totals and nice graphics related to your Facebook account state and usage.\n    </p>\n\n    <h4>Why is this useful?</h4>\n    <p>\n      Because it will let you learn more about how you use Facebook.<br>\n      And the best thing is you\'ll see all this by taking just a quick look at\n      some really nice graphics.\n    </p>\n\n    <!-- <h4>Are your kids on Facebook?</h4>\n    <p>\n      Then Insight will be extra useful for you. It will let you know how your kid\n      socialize at a glance.\n    </p> -->\n  </div>\n</div>\n\n<app-footer></app-footer>\n');
}]);