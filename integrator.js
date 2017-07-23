(function(window) {
  var integrator = window.integrator = window.integrator || {};

  integrator.appData = {};

  integrator.loadPackages = function (packagesUrl, applicationId) {
    axios.get(packagesUrl).then(function (result) {
      onLoadPackages(result, applicationId);
    })
  };

  function onLoadPackages(result, applicationId) {
    integrator.appData = result.data;
    bootstrapApplication(applicationId);
  }

  function bootstrapApplication(applicationId) {
    var app = integrator.appData.applications[applicationId];
    loadStyles(app);
    loadModules(app);
    setBaseHref(app);
    loadHtml(app);
  }

  function setBaseHref(app) {
    if (app.dependencies.baseHref) {
      var baseHrefElement = document.querySelector('base[href]');
      baseHrefElement.setAttribute('href', app.dependencies.baseHref);
    }
  }

  function loadHtml(app) {
    axios.get(app.dependencies.html)
      .then(function(result) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(result.data, "text/html");
        var appContainer = document.querySelector('#appContainer');
        appContainer.innerHTML = doc.body.innerHTML;
      });
  }

  function loadStyles(app) {
    var styles = app.dependencies.styles;
    styles.forEach(function(style) {
      var el = document.createElement('link');
      el.setAttribute('rel', 'stylesheet');
      el.setAttribute('href', style);
      document.head.appendChild(el);
    });
  }

  function loadModules(app) {
    var dependencyKeys = Object.keys(app.dependencies.scripts);

    $script.ready(dependencyKeys, function () {
      if (app.dependencies.bootstrap) {
        $script(app.dependencies.bootstrap);
      }
    });

    dependencyKeys.forEach(function(dependency) {
      loadModule(dependency, app);
    });
  }

  function loadModule(moduleName, app) {
    var module = app.dependencies.scripts[moduleName];
    if (module.dependencies.length) {
      $script.ready(module.dependencies, function () {
        $script(module.scripts, moduleName);
      });
    } else {
      $script(module.scripts, moduleName);
    }
  }
}(window));