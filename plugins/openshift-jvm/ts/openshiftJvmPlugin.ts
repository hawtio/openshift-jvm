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

  /*
  _module.config(["$locationProvider", "$routeProvider", "HawtioNavBuilderProvider",
    ($locationProvider, $routeProvider: ng.route.IRouteProvider, builder: HawtioMainNav.BuilderFactory) => {
  }]);
  */

  _module.run(["HawtioNav", (nav:HawtioMainNav.Registry) => {
    nav.on(HawtioMainNav.Actions.CHANGED, pluginName, (items) => {
      items.forEach((item) => {
        switch(item.id) {
          case 'jvm':
          case 'wiki':
            item.isValid = () => false;
        }
      });
    });
    log.debug("loaded");
  }]);


  hawtioPluginLoader.addModule(pluginName);
}
