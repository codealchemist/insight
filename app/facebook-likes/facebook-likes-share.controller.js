'use strict';

angular
  .module('facebookLikes')
  .controller('facebookLikesShareController', facebookLikesShareController);

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
    params.sharingStart();

    var fd = new FormData();
    var accessToken = $facebook.getAuthResponse().accessToken;
    fd.append('access_token', accessToken);
    fd.append('source', params.binaryData);
    fd.append('message', vm.message);

    $http.post('https://graph.facebook.com/me/photos', fd,
      {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      }
    )
    .then(onShared);

    function onShared() {
      vm.sharing = false;
      $uibModalInstance.close();
      Notification.success('Your likes insight was successfully shared :)');
      params.sharingDone();
    }
  }
}
