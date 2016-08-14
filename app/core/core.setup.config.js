'use strict';

angular
  .module('core')
  .config(setupCore);

//------------------------------------------------------------

function setupCore($facebookProvider, configProvider) {
  'ngInject';
  var config = configProvider.$get();

  // set Facebook app id and permissions
  $facebookProvider.setAppId(config.facebookAppId);
  $facebookProvider.setPermissions('email,user_likes,user_friends,publish_actions,user_photos');
  $facebookProvider.setCustomInit({
    // channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html',
    xfbml      : true
  });
}
