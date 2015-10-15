/// Copyright 2014-2015 Red Hat, Inc. and/or its affiliates
/// and other contributors as indicated by the @author tags.
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///   http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.

/// <reference path="../../includes.ts"/>
/// <reference path="openshiftJvmGlobals.ts"/>
module OpenshiftJvm {

  export var _module = angular.module(pluginName, []);

  _module.run(["HawtioNav", "preferencesRegistry", (nav:HawtioMainNav.Registry, prefs) => {
    nav.on(HawtioMainNav.Actions.CHANGED, pluginName, (items) => {
      items.forEach((item) => {
        switch(item.id) {
          case 'jvm':
          case 'wiki':
            item.isValid = () => false;
        }
      });
    });
    prefs.addTab('About ' + version.name, UrlHelpers.join(templatePath, 'about.html'));
    log.info("started, version: ", version.version);
    log.info("commit ID: ", version.commitId);
  }]);

  _module.controller('Main.About', ($scope) => {
    $scope.info = version;
  });

  hawtioPluginLoader.registerPreBootstrapTask((next) => {
    $.ajax({
      url: 'version.json?rev=' + Date.now(), 
      success: (data) => {
        try {
          version = angular.fromJson(data);
        } catch (err) {
          version = {
            name: 'openshift-jvm',
            version: ''
          };
        }
        next();
      },
      error: (jqXHR, text, status) => {
        log.debug("Failed to fetch version: jqXHR: ", jqXHR, " text: ", text, " status: ", status);
        next();
      },
      dataType: "html"
    });
  });


  hawtioPluginLoader.addModule(pluginName);
}
