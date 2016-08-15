'use strict';

angular
  .module('config')
  .provider('config', configProvider);

//------------------------------------------------------------

function configProvider() {
  /* jshint validthis:true */
  this.$get = getService;

  //------------------------------

  function getService() {
    var environments = [
      {
        name: 'development',
        domains: ['localhost', '0.0.0.0', '127.0.0.1', 'insight.dev'],
        config: {
          facebookAppId: '1624901197822863'
        }
      },
      {
        name: 'staging',
        domains: ['appinsight.herokuapp.com'],
        config: {
          facebookAppId: '1624901197822863'
        }
      }
    ];

    // iterate environments and return the config for current one
    var hostname = location.hostname;
    var currentConfig;
    environments.some(function(env) {
      if (env.domains.indexOf(hostname) !== -1) {
        currentConfig = env.config;
        return true;
      }
    });

    if (!currentConfig) throw new Error('[ CONFIG-PROVIDER ]--> HOSTNAME NOT FOUND: ' + hostname);

    return currentConfig;
  }
}