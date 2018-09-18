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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBsdWdpbnMvb3BlbnNoaWZ0LWp2bS90cy9vcGVuc2hpZnRKdm1HbG9iYWxzLnRzIiwicGx1Z2lucy9vcGVuc2hpZnQtanZtL3RzL29wZW5zaGlmdEp2bVBsdWdpbi50cyIsInBsdWdpbnMvb3BlbnNoaWZ0LWp2bS90cy9tYWluQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFnQkEsSUFBTyxZQUFZLENBS2xCO0FBTEQsV0FBTyxZQUFZO0lBQ04sdUJBQVUsR0FBRyxlQUFlLENBQUM7SUFDN0IsZ0JBQUcsR0FBbUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFBLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLHlCQUFZLEdBQUcsNEJBQTRCLENBQUM7SUFDNUMsb0JBQU8sR0FBTyxFQUFFLENBQUM7QUFDOUIsQ0FBQyxFQUxNLFlBQVksS0FBWixZQUFZLFFBS2xCO0FDSkQsSUFBTyxZQUFZLENBK0NsQjtBQS9DRCxXQUFPLFlBQVk7SUFFTixvQkFBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBQSxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFcEQsYUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLHFCQUFxQixFQUFFLFVBQUMsR0FBMEIsRUFBRSxLQUFLO1lBQ2pGLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsYUFBQSxVQUFVLEVBQUUsVUFBQyxLQUFLO2dCQUN0RCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtvQkFDakIsUUFBTyxJQUFJLENBQUMsRUFBRSxFQUFFO3dCQUNkLEtBQUssS0FBSyxDQUFDO3dCQUNYLEtBQUssTUFBTTs0QkFDVCxJQUFJLENBQUMsT0FBTyxHQUFHLGNBQU0sT0FBQSxLQUFLLEVBQUwsQ0FBSyxDQUFDO3FCQUM5QjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsYUFBQSxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBQSxZQUFZLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNuRixhQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsYUFBQSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDaEQsYUFBQSxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxhQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRUosYUFBQSxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQU07UUFDdEMsTUFBTSxDQUFDLElBQUksR0FBRyxhQUFBLE9BQU8sQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUVILGtCQUFrQixDQUFDLHdCQUF3QixDQUFDLFVBQUMsSUFBSTtRQUMvQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ0wsR0FBRyxFQUFFLG1CQUFtQixHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDckMsT0FBTyxFQUFFLFVBQUMsSUFBSTtnQkFDWixJQUFJO29CQUNGLGFBQUEsT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2xDO2dCQUFDLE9BQU8sR0FBRyxFQUFFO29CQUNaLGFBQUEsT0FBTyxHQUFHO3dCQUNSLElBQUksRUFBRSxlQUFlO3dCQUNyQixPQUFPLEVBQUUsRUFBRTtxQkFDWixDQUFDO2lCQUNIO2dCQUNELElBQUksRUFBRSxDQUFDO1lBQ1QsQ0FBQztZQUNELEtBQUssRUFBRSxVQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTTtnQkFDekIsYUFBQSxHQUFHLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDM0YsSUFBSSxFQUFFLENBQUM7WUFDVCxDQUFDO1lBQ0QsUUFBUSxFQUFFLE1BQU07U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFHSCxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsYUFBQSxVQUFVLENBQUMsQ0FBQztBQUMzQyxDQUFDLEVBL0NNLFlBQVksS0FBWixZQUFZLFFBK0NsQjtBQ2hERCxJQUFPLFlBQVksQ0FZbEI7QUFaRCxXQUFPLFlBQVk7SUFFakIsYUFBQSxPQUFPLENBQUMsVUFBVSxDQUFDLDZCQUE2QixFQUFFLENBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLFVBQUMsTUFBTSxFQUFFLGNBQWM7WUFDcEcsTUFBTSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsSUFBSSxJQUFJLG9CQUFvQixDQUFDO1lBQ25FLElBQUksY0FBYyxDQUFDLFFBQVEsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLE1BQU0sR0FBRztvQkFDZCxhQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUM7Z0JBQ2pELENBQUMsQ0FBQzthQUNIO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUVOLENBQUMsRUFaTSxZQUFZLEtBQVosWUFBWSxRQVlsQiIsImZpbGUiOiJjb21waWxlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyBDb3B5cmlnaHQgMjAxNC0yMDE1IFJlZCBIYXQsIEluYy4gYW5kL29yIGl0cyBhZmZpbGlhdGVzXG4vLy8gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyBhcyBpbmRpY2F0ZWQgYnkgdGhlIEBhdXRob3IgdGFncy5cbi8vL1xuLy8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy8vXG4vLy8gICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vL1xuLy8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vaW5jbHVkZXMudHNcIi8+XG5tb2R1bGUgT3BlbnNoaWZ0SnZtIHtcbiAgZXhwb3J0IHZhciBwbHVnaW5OYW1lID0gXCJvcGVuc2hpZnQtanZtXCI7XG4gIGV4cG9ydCB2YXIgbG9nOiBMb2dnaW5nLkxvZ2dlciA9IExvZ2dlci5nZXQocGx1Z2luTmFtZSk7XG4gIGV4cG9ydCB2YXIgdGVtcGxhdGVQYXRoID0gXCJwbHVnaW5zL29wZW5zaGlmdC1qdm0vaHRtbFwiO1xuICBleHBvcnQgdmFyIHZlcnNpb246YW55ID0ge307XG59XG4iLCIvLy8gQ29weXJpZ2h0IDIwMTQtMjAxNSBSZWQgSGF0LCBJbmMuIGFuZC9vciBpdHMgYWZmaWxpYXRlc1xuLy8vIGFuZCBvdGhlciBjb250cmlidXRvcnMgYXMgaW5kaWNhdGVkIGJ5IHRoZSBAYXV0aG9yIHRhZ3MuXG4vLy9cbi8vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vL1xuLy8vICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vLy9cbi8vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL2luY2x1ZGVzLnRzXCIvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9wZW5zaGlmdEp2bUdsb2JhbHMudHNcIi8+XG5tb2R1bGUgT3BlbnNoaWZ0SnZtIHtcblxuICBleHBvcnQgdmFyIF9tb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShwbHVnaW5OYW1lLCBbXSk7XG5cbiAgX21vZHVsZS5ydW4oW1wiSGF3dGlvTmF2XCIsIFwicHJlZmVyZW5jZXNSZWdpc3RyeVwiLCAobmF2Okhhd3Rpb01haW5OYXYuUmVnaXN0cnksIHByZWZzKSA9PiB7XG4gICAgbmF2Lm9uKEhhd3Rpb01haW5OYXYuQWN0aW9ucy5DSEFOR0VELCBwbHVnaW5OYW1lLCAoaXRlbXMpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgc3dpdGNoKGl0ZW0uaWQpIHtcbiAgICAgICAgICBjYXNlICdqdm0nOlxuICAgICAgICAgIGNhc2UgJ3dpa2knOlxuICAgICAgICAgICAgaXRlbS5pc1ZhbGlkID0gKCkgPT4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIHByZWZzLmFkZFRhYignQWJvdXQgJyArIHZlcnNpb24ubmFtZSwgVXJsSGVscGVycy5qb2luKHRlbXBsYXRlUGF0aCwgJ2Fib3V0Lmh0bWwnKSk7XG4gICAgbG9nLmluZm8oXCJzdGFydGVkLCB2ZXJzaW9uOiBcIiwgdmVyc2lvbi52ZXJzaW9uKTtcbiAgICBsb2cuaW5mbyhcImNvbW1pdCBJRDogXCIsIHZlcnNpb24uY29tbWl0SWQpO1xuICB9XSk7XG5cbiAgX21vZHVsZS5jb250cm9sbGVyKCdNYWluLkFib3V0JywgKCRzY29wZSkgPT4ge1xuICAgICRzY29wZS5pbmZvID0gdmVyc2lvbjtcbiAgfSk7XG5cbiAgaGF3dGlvUGx1Z2luTG9hZGVyLnJlZ2lzdGVyUHJlQm9vdHN0cmFwVGFzaygobmV4dCkgPT4ge1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6ICd2ZXJzaW9uLmpzb24/cmV2PScgKyBEYXRlLm5vdygpLCBcbiAgICAgIHN1Y2Nlc3M6IChkYXRhKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmVyc2lvbiA9IGFuZ3VsYXIuZnJvbUpzb24oZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHZlcnNpb24gPSB7XG4gICAgICAgICAgICBuYW1lOiAnb3BlbnNoaWZ0LWp2bScsXG4gICAgICAgICAgICB2ZXJzaW9uOiAnJ1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiAoanFYSFIsIHRleHQsIHN0YXR1cykgPT4ge1xuICAgICAgICBsb2cuZGVidWcoXCJGYWlsZWQgdG8gZmV0Y2ggdmVyc2lvbjoganFYSFI6IFwiLCBqcVhIUiwgXCIgdGV4dDogXCIsIHRleHQsIFwiIHN0YXR1czogXCIsIHN0YXR1cyk7XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0sXG4gICAgICBkYXRhVHlwZTogXCJodG1sXCJcbiAgICB9KTtcbiAgfSk7XG5cblxuICBoYXd0aW9QbHVnaW5Mb2FkZXIuYWRkTW9kdWxlKHBsdWdpbk5hbWUpO1xufVxuIiwiLy8vIENvcHlyaWdodCAyMDE0LTIwMTUgUmVkIEhhdCwgSW5jLiBhbmQvb3IgaXRzIGFmZmlsaWF0ZXNcbi8vLyBhbmQgb3RoZXIgY29udHJpYnV0b3JzIGFzIGluZGljYXRlZCBieSB0aGUgQGF1dGhvciB0YWdzLlxuLy8vXG4vLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vLy9cbi8vLyAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy8vXG4vLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvcGVuc2hpZnRKdm1QbHVnaW4udHNcIi8+XG5tb2R1bGUgT3BlbnNoaWZ0SnZtIHtcblxuICBfbW9kdWxlLmNvbnRyb2xsZXIoXCJPcGVuc2hpZnRKdm0uTWFpbkNvbnRyb2xsZXJcIiwgWyckc2NvcGUnLCAnQ29ubmVjdE9wdGlvbnMnLCAoJHNjb3BlLCBDb25uZWN0T3B0aW9ucykgPT4ge1xuICAgICRzY29wZS5jb250YWluZXJOYW1lID0gQ29ubmVjdE9wdGlvbnMubmFtZSB8fCBcIlVudGl0bGVkIENvbnRhaW5lclwiO1xuICAgIGlmIChDb25uZWN0T3B0aW9ucy5yZXR1cm5Ubykge1xuICAgICAgJHNjb3BlLmdvQmFjayA9ICgpID0+IHtcbiAgICAgICAgbG9nLmRlYnVnKFwiQ29ubmVjdCBvcHRpb25zOiBcIiwgQ29ubmVjdE9wdGlvbnMpO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IENvbm5lY3RPcHRpb25zLnJldHVyblRvO1xuICAgICAgfTtcbiAgICB9XG4gIH1dKTtcblxufVxuIl19

angular.module('openshift-jvm-templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('plugins/openshift-jvm/html/about.html','<div ng-controller="Main.About">\n  <p>Version: {{info.version}}</p>\n  <p>Commit ID: {{info.commitId}}</p>\n  <table class="table table-striped">\n    <thead>\n      <tr>\n        <th>\n          Name\n        </th>\n        <th>\n          Version\n        </th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr ng-repeat="(key, info) in info.packages">\n        <td>{{key}}</td>\n        <td>{{info.version || \'--\'}}</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n');}]); hawtioPluginLoader.addModule("openshift-jvm-templates");