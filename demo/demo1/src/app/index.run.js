(function() {
  'use strict';

  angular
    .module('demo1')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
