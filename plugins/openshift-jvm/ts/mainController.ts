/// <reference path="openshiftJvmPlugin.ts"/>
module OpenshiftJvm {

  _module.controller("OpenshiftJvm.MainController", ['$scope', 'ConnectOptions', ($scope, ConnectOptions) => {
    $scope.containerName = ConnectOptions.name;
    $scope.goBack = () => {
      log.debug("Connect options: ", ConnectOptions);
      window.location.href = ConnectOptions.returnTo;
    }
  }]);

}
