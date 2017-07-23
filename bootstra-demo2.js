(function () {
  window.integrator.bootstrappers = window.integrator.bootstrappers || {};
  window.integrator.bootstrappers['demo2'] = function () {
    window.tools.platform.bootstrapModule(window.tools.AppModule).then(function (appModule) {
      window.appModule = appModule;
    });
  };
})();