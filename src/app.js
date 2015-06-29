import $ from "jquery";
import angular from "angular";

// Base modules
import "angular-ui-router";
import "angular-ui-router.statehelper";

let appRootState = null;
let appDeps = ["ui.router", "ui.router.stateHelper"];
export var app = angular.module("app", appDeps);

app.config(["stateHelperProvider", function(stateHelperProvider) {
  if (appRootState) {
    stateHelperProvider.setNestedState(appRootState);
  }
}]);

export function includeModule(name) {
  appDeps.push(name);
}

export var ng = angular;
var beforeBootPromise = Promise.resolve(true);

export function beforeBoot(p) {
  beforeBootPromise = beforeBootPromise.then(() => Promise.resolve(p));
}

export function bootstrap(mainState, ...deps) {
  appRootState = (mainState && mainState.$$state && mainState.$$state.state) || undefined;
  for (let dep of deps) {
    includeModule(dep);
  }

  return beforeBootPromise.then(function() {
    return new Promise(function(resolve, reject){
      $(() => {
        try {
          angular.bootstrap(document, ["app"]);
          resolve();
        } catch(e) {
          reject(e);
        }
      });
    });
  });
}
