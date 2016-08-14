'use strict';

angular
    .module('core')
    .run(initCore);

//------------------------------------------------------------

function initCore($rootScope, config) {
  'ngInject';

  // Load the facebook SDK asynchronously
  var facebookAppId = config.facebookAppId;
  (function(){
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = '//connect.facebook.net/en_US/sdk.js';
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }());
}
