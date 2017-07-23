(function (window) {
  window.integrator.bootstrappers = window.integrator.bootstrappers || {};
  window.integrator.bootstrappers['demo1'] = function () {
    angular.element(function() {
      var tmpChild = document.querySelector('#tmp-container');
      app = angular.bootstrap(angular.element(tmpChild), ['demo1']);
      window.integrator.tearDown = function () {
        app.get('$rootScope').$destroy();
        angular.element(tmpChild).remove();
      };
    });
  };
}(window));
