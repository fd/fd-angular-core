'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.State = State;
exports.mountAt = mountAt;

var _utils = require('./utils');

var _app = require('./app');

var _Controller = require('./Controller');

var DEFAULT_SUFFIX = 'Controller';

function State(opts) {
  if (typeof opts === 'function') {
    var constructor = opts;opts = null;
    return register(constructor);
  }

  opts = opts || {};

  return register;

  function register(constructor) {
    var _context;

    (0, _Controller.Controller)(constructor, { name: opts.controllerName });

    var prototype = constructor.prototype;

    if (prototype.activate) {
      State.onActivate(prototype, 'activate', { value: prototype.activate });
    }

    if (prototype.attach) {
      State.onAttach(prototype, 'attach', { value: prototype.attach });
    }

    if (prototype.detach) {
      State.onDetach(prototype, 'detach', { value: prototype.detach });
    }

    var callbacks = prototype.$$stateCallbacks || {};
    delete prototype['$$stateCallbacks'];

    var meta = registerLock(constructor);
    var superMeta = (0, _utils.superClass)(constructor).$$state;
    superMeta = superMeta || {};

    {
      var _opts = Object.create(superMeta.opts || {}, {});

      var keys = Object.keys(opts);
      for (var idx in keys) {
        var key = keys[idx];
        var val = opts[key];

        // Ignored keys
        if (key === 'name') continue;
        if (key === 'controllerName') continue;
        if (key === 'resolve') continue;
        if (key === 'children') continue;
        // if (key === '$onEnter') continue;
        // if (key === '$onExit') continue;

        _opts[key] = val;
      }

      {
        // inherit name
        _opts.name = opts.name;
      }

      {
        // inherit controllerName
        _opts.controllerName = opts.controllerName;
      }

      {
        // Inherit resolve
        var _resolve = {};
        Object.assign(_resolve, _opts.resolve || {});
        Object.assign(_resolve, opts.resolve || {});
        _opts.resolve = _resolve;
      }

      {
        // Inherit children
        _opts.children = opts.children || (_opts.children || []).concat([]);
      }

      opts = _opts;
    }

    applyDefaultName(opts, constructor);
    applyDefaultTemplate(opts);

    meta.opts = opts;
    meta.name = opts.name;

    var state = meta.state = Object.defineProperties({
      name: opts.name,
      template: opts.template,
      templateUrl: opts.templateUrl,
      controllerAs: opts.bindTo || opts.name,
      url: opts.url,
      abstract: opts.abstract,
      resolve: Object.assign({}, opts.resolve),
      childStates: opts.children

    }, {
      children: {
        get: function get() {
          return this.childStates.map(function (x) {
            return x.$$state.state;
          });
        },
        configurable: true,
        enumerable: true
      }
    });

    var controllerProvider = function controllerProvider(ctrl, $hooks, $scope) {
      try {
        if ($hooks.attach) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = $hooks.attach[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var hook = _step.value;
              hook.call(ctrl);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        $scope.$on('$destroy', function () {
          if ($hooks.detach) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = $hooks.detach[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var hook = _step2.value;
                hook.call(ctrl);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                  _iterator2['return']();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        });
      } catch (e) {
        console.error(e);
        throw e;
      }

      return ctrl;
    };

    controllerProvider = inject.call(controllerProvider, opts.name, '$hooks', '$scope');

    if (callbacks.onAttach) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = callbacks.onAttach[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var hook = _step3.value;

          controllerProvider = pushHook.call(controllerProvider, 'attach', hook);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    if (callbacks.onDetach) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = callbacks.onDetach[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var hook = _step4.value;

          controllerProvider = pushHook.call(controllerProvider, 'detach', hook);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }

    state.controller = controllerProvider;

    var ctrlR = function ctrlR($q, $controller, $constructorInject, $hooks) {
      var ctrl = undefined;
      var p = undefined;

      try {
        ctrl = $controller(constructor.$$controller.name, $constructorInject);
        p = $q.when(ctrl);
      } catch (e) {
        console.error(e);
        return $q.reject(e);
      }

      if ($hooks.activate) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          var _loop = function () {
            var hook = _step5.value;

            p = p.then(function (x) {
              return hook.call(ctrl);
            });
          };

          for (var _iterator5 = $hooks.activate[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
              _iterator5['return']();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        p = p.then(function (x) {
          return ctrl;
        });
      }

      return p;
    };

    ctrlR = (_context = inject.call(ctrlR, '$q', '$controller', '$constructorInject', '$hooks'), namedInjectionCollector).call(_context, '$constructorInject', constructor.$inject);

    if (callbacks.onActivate) {
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = callbacks.onActivate[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var hook = _step6.value;

          ctrlR = pushHook.call(ctrlR, 'activate', hook);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6['return']) {
            _iterator6['return']();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }

    state.resolve[opts.name] = ctrlR;
  }
}

State.onActivate = function onActivate(target, name, desc) {
  if (typeof desc.value !== 'function') {
    throw '@State.onActivate expects a function target';
  }

  if (!target.$$stateCallbacks) {
    target.$$stateCallbacks = {};
  }
  if (!target.$$stateCallbacks.onActivate) {
    target.$$stateCallbacks.onActivate = [];
  }

  target.$$stateCallbacks.onActivate.push(desc.value);
};

State.onAttach = function onAttach(target, name, desc) {
  if (typeof desc.value !== 'function') {
    throw '@State.onAttach expects a function target';
  }

  if (!target.$$stateCallbacks) {
    target.$$stateCallbacks = {};
  }
  if (!target.$$stateCallbacks.onAttach) {
    target.$$stateCallbacks.onAttach = [];
  }

  target.$$stateCallbacks.onAttach.push(desc.value);
};

State.onDetach = function onDetach(target, name, desc) {
  if (typeof desc.value !== 'function') {
    throw '@State.onDetach expects a function target';
  }

  if (!target.$$stateCallbacks) {
    target.$$stateCallbacks = {};
  }
  if (!target.$$stateCallbacks.onDetach) {
    target.$$stateCallbacks.onDetach = [];
  }

  target.$$stateCallbacks.onDetach.push(desc.value);
};

function mountAt(url) {
  var state = Object.create(this.$$state.state, {});
  state.url = url;

  var $$state = Object.create(this.$$state, {});
  $$state.state = state;

  var _this = Object.create(this, {});
  _this.$$state = $$state;

  return _this;
}

function registerLock(constructor) {
  var lock = constructor.$$state;

  if (lock && lock.constructor === constructor) {
    throw '@State() can only be used once!';
  }

  constructor.$$state = { constructor: constructor };
  return constructor.$$state;
}

function applyDefaultName(opts, constructor) {
  if (opts.name) return;

  var name = opts.name;
  name = (0, _utils.funcName)(constructor);
  name = name[0].toLowerCase() + name.substr(1, name.length - DEFAULT_SUFFIX.length - 1);
  opts.name = name;
}

function applyDefaultTemplate(opts) {
  var template = opts.template;
  var templateUrl = opts.templateUrl;
  var children = opts.children;

  if (template !== undefined || templateUrl !== undefined) {
    return;
  }

  if (children && children.length > 0) {
    opts.template = '<ui-view></ui-view>';
  }
}

function inject() {
  for (var _len = arguments.length, splat = Array(_len), _key = 0; _key < _len; _key++) {
    splat[_key] = arguments[_key];
  }

  if (splat.length === 1 && !splat[0]) {
    splat = [];
  }
  if (splat.length === 1 && splat[0].length > 0) {
    splat = splat[0];
  }

  this.$inject = splat;
  return this;
}

function injectionCollector(as) {
  for (var _len2 = arguments.length, splat = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    splat[_key2 - 1] = arguments[_key2];
  }

  if (splat.length === 1 && !splat[0]) {
    splat = [];
  }
  if (splat.length === 1 && splat[0].length > 0) {
    splat = splat[0];
  }

  var base = this;
  var inject = (base.$inject || []).concat([]);
  var injectLen = base.$inject.length;
  var splatIdxs = [];

  var idx = inject.indexOf(as);
  if (idx < 0) {
    return base;
  }

  while (idx >= 0) {
    splatIdxs.unshift(idx);
    inject.splice(idx, 1);
    injectLen--;
    idx = inject.indexOf(as);
  }

  inject = inject.concat(splat);
  collectInjections.$inject = inject;
  return collectInjections;

  function collectInjections() {
    var inject = Array.prototype.slice.call(arguments, 0, injectLen);
    var splat = Array.prototype.slice.call(arguments, injectLen);

    for (var _idx in splatIdxs) {
      inject.splice(splatIdxs[_idx], 0, splat);
    }

    return base.apply(this, inject);
  }
}

function namedInjectionCollector(as) {
  for (var _len3 = arguments.length, splat = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    splat[_key3 - 1] = arguments[_key3];
  }

  if (splat.length === 1 && !splat[0]) {
    splat = [];
  }
  if (splat.length === 1 && splat[0].length > 0) {
    splat = splat[0];
  }

  var base = this;
  var inject = (base.$inject || []).concat([]);
  var injectLen = base.$inject.length;
  var splatIdxs = [];

  var idx = inject.indexOf(as);
  if (idx < 0) {
    return base;
  }

  while (idx >= 0) {
    splatIdxs.unshift(idx);
    inject.splice(idx, 1);
    injectLen--;
    idx = inject.indexOf(as);
  }

  inject = inject.concat(splat);
  collectInjections.$inject = inject;
  return collectInjections;

  function collectInjections() {
    var inject = Array.prototype.slice.call(arguments, 0, injectLen);
    var splatVals = Array.prototype.slice.call(arguments, injectLen);

    var namedSplat = {};

    for (var _idx2 in splat) {
      namedSplat[splat[_idx2]] = splatVals[_idx2];
    }

    for (var _idx3 in splatIdxs) {
      inject.splice(splatIdxs[_idx3], 0, namedSplat);
    }

    return base.apply(this, inject);
  }
}

_app.app.constant('$hooks', { $fake: true });
var nextHookId = 0;
function pushHook(name, func) {
  if (!func) return this;

  var base = this;
  nextHookId++;
  var hookId = '_hook_' + name + '_' + nextHookId;
  var inject = base.$inject || [];
  var hooksIdx = inject.indexOf('$hooks');

  binder.$inject = [hookId].concat(inject);
  return injectionCollector.call(binder, hookId, func.$inject);

  function binder(vars) {
    for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      rest[_key4 - 1] = arguments[_key4];
    }

    var hooks = rest[hooksIdx];
    if (!hooks || hooks.$fake) {
      hooks = {};
      rest[hooksIdx] = hooks;
    }

    var chain = hooks[name];
    if (!chain) {
      chain = [];
      hooks[name] = chain;
    }

    chain.push(hook);
    return base.apply(this, rest);

    function hook() {
      return func.apply(this, vars);
    }
  }
}
//# sourceMappingURL=State.js.map