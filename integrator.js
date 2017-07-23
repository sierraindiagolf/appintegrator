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
    axios.get(app.dependencies.html, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
      .then(function(result) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(result.data, "text/html");
        var appContainer = document.querySelector('#appContainer');
        var child = document.createElement('div');
        child.setAttribute('id', 'tmp-container');
        child.innerHTML = doc.body.innerHTML;
        appContainer.appendChild(child);
        loadModules(app);
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
        $script(app.dependencies.bootstrap, function () {
          window.integrator.bootstrappers[app.id]();
        });
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

  window.integrator.initNavigo = function() {
    var root = null;
    var useHash = true; // Defaults to: false
    var hash = '#!'; // Defaults to: '#'
    var router = window.integratorRouter = new Navigo(root, useHash, hash);
    router.on({
      '/demo/': function () {
        integrator.loadPackages('/demo/integrator-package.json', 'demo1');
      },
      '/demo/:app': function (params) {
        integrator.loadPackages('/demo/integrator-package.json', params.app);
      }
    });
  };

  window.integrator.navigate = function (to) {
    if (integrator.tearDown) {
      integrator.tearDown();
    }
    if (appContainer.firstElementChild) {
      appContainer.firstElementChild.remove();
    }
    window.integratorRouter.navigate(to);
  };
}(window));