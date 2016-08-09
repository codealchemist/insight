'use strict';

angular
  .module('core')
  .config(setup);

//------------------------------------------------------------

function setup($facebookProvider, configProvider) {
  var config = configProvider.$get();

  // set Facebook app id and permissions
  $facebookProvider.setAppId(config.facebookAppId);
  $facebookProvider.setPermissions("email,user_likes");
}
