var OpenshiftJvm;
(function (OpenshiftJvm) {
    OpenshiftJvm.pluginName = "openshift-jvm";
    OpenshiftJvm.log = Logger.get(OpenshiftJvm.pluginName);
    OpenshiftJvm.templatePath = "plugins/openshift-jvm/html";
    OpenshiftJvm.version = {};
})(OpenshiftJvm || (OpenshiftJvm = {}));
var OpenshiftJvm;
(function (OpenshiftJvm) {
    OpenshiftJvm._module = angular.module(OpenshiftJvm.pluginName, []);
    OpenshiftJvm._module.run(["HawtioNav", "preferencesRegistry", function (nav, prefs) {
            nav.on(HawtioMainNav.Actions.CHANGED, OpenshiftJvm.pluginName, function (items) {
                items.forEach(function (item) {
                    switch (item.id) {
                        case 'jvm':
                        case 'wiki':
                            item.isValid = function () { return false; };
                    }
                });
            });
            prefs.addTab('About ' + OpenshiftJvm.version.name, UrlHelpers.join(OpenshiftJvm.templatePath, 'about.html'));
            OpenshiftJvm.log.info("started, version: ", OpenshiftJvm.version.version);
            OpenshiftJvm.log.info("commit ID: ", OpenshiftJvm.version.commitId);
        }]);
    OpenshiftJvm._module.controller('Main.About', ["$scope", function ($scope) {
        $scope.info = OpenshiftJvm.version;
    }]);
    hawtioPluginLoader.registerPreBootstrapTask(function (next) {
        $.ajax({
            url: 'version.json?rev=' + Date.now(),
            success: function (data) {
                try {
                    OpenshiftJvm.version = angular.fromJson(data);
                }
                catch (err) {
                    OpenshiftJvm.version = {
                        name: 'openshift-jvm',
                        version: ''
                    };
                }
                next();
            },
            error: function (jqXHR, text, status) {
                OpenshiftJvm.log.debug("Failed to fetch version: jqXHR: ", jqXHR, " text: ", text, " status: ", status);
                next();
            },
            dataType: "html"
        });
    });
    hawtioPluginLoader.addModule(OpenshiftJvm.pluginName);
})(OpenshiftJvm || (OpenshiftJvm = {}));
var OpenshiftJvm;
(function (OpenshiftJvm) {
    OpenshiftJvm._module.controller("OpenshiftJvm.MainController", ['$scope', 'ConnectOptions', function ($scope, ConnectOptions) {
            $scope.containerName = ConnectOptions.name || "Untitled Container";
            if (ConnectOptions.returnTo) {
                $scope.goBack = function () {
                    OpenshiftJvm.log.debug("Connect options: ", ConnectOptions);
                    window.location.href = ConnectOptions.returnTo;
                };
            }
        }]);
})(OpenshiftJvm || (OpenshiftJvm = {}));

angular.module('openshift-jvm-templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('plugins/openshift-jvm/html/about.html','<div ng-controller="Main.About">\n  <p>Version: {{info.version}}</p>\n  <p>Commit ID: {{info.commitId}}</p>\n  <table class="table table-striped">\n    <thead>\n      <tr>\n        <th>\n          Name\n        </th>\n        <th>\n          Version\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr ng-repeat="(key, info) in info.packages">\n        <td>{{key}}</td>\n        <td>{{info.version || \'--\'}}</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n');}]); hawtioPluginLoader.addModule("openshift-jvm-templates");