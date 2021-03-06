(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.FdAngularCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Component = Component;

var _utils = require("./utils");

var _app = require("./app");

var _Controller = require("./Controller");

var DEFAULT_SUFFIX = "Controller";

/**
Declare an angular Component directive.

@function Component

@param {Object} [opts]
@param {String} [opts.name]
@param {String} [opts.restrict="EA"]
@param {Boolean} [opts.restrict="false"]
@param {Boolean} [opts.transclude="EA"]
@param {Object} [opts.scope={}]
@param {String} [opts.template]
@param {String} [opts.templateUrl]

@example
[@]Component({
	scope: { "attr": "=" }
})
class MyComponentController {}

*/

function Component(opts) {
	if (typeof opts === "function") {
		var _constructor = opts;opts = null;
		return register(_constructor);
	}

	opts = opts || {};
	var _opts = opts;
	var _opts$restrict = _opts.restrict;
	var restrict = _opts$restrict === undefined ? "EA" : _opts$restrict;
	var _opts$replace = _opts.replace;
	var replace = _opts$replace === undefined ? false : _opts$replace;
	var _opts$transclude = _opts.transclude;
	var transclude = _opts$transclude === undefined ? false : _opts$transclude;
	var _opts$scope = _opts.scope;
	var scope = _opts$scope === undefined ? {} : _opts$scope;
	var template = _opts.template;
	var templateUrl = _opts.templateUrl;

	return register;

	function register(constructor) {
		(0, _Controller.Controller)(constructor);
		var meta = (0, _utils.funcMeta)(constructor);

		var name = meta.name;
		name = name[0].toLowerCase() + name.substr(1, name.length - DEFAULT_SUFFIX.length - 1);

		if (!template && !templateUrl && template !== false) {
			var tmplName = (0, _utils.dashCase)(name);
			templateUrl = "./components/" + tmplName + "/" + tmplName + ".html";
		}

		if (template === false) {
			template = undefined;
			templateUrl = undefined;
		}

		_app.app.directive(name, function () {
			return {
				restrict: restrict,
				scope: scope,
				bindToController: true,
				controller: meta.controller.name,
				controllerAs: name,
				template: template,
				templateUrl: templateUrl,
				replace: replace,
				transclude: transclude
			};
		});
	}
}

},{"./Controller":2,"./app":7,"./utils":10}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Controller = Controller;

var _utils = require("./utils");

var _app = require("./app");

/**
@function Controller
@param {String} [name] - The name of the controller.

@example
[@]Controller()
class MyController {}

*/

function Controller(name, options) {
	if (typeof name === "function") {
		var _constructor = name;name = null;
		return register(_constructor, options);
	}

	return register;
	function register(constructor, opts) {
		registerLock(constructor);
		var meta = (0, _utils.funcMeta)(constructor);

		name = name || opts && opts.name || meta.name;
		meta.controller.name = name;

		_app.app.controller(name, constructor);
	}
}

function registerLock(constructor) {
	var meta = (0, _utils.funcMeta)(constructor);
	var lock = meta.controller;

	if (lock) {
		throw "@Controller() can only be used once!";
	}

	meta.controller = {};
}

},{"./app":7,"./utils":10}],3:[function(require,module,exports){

/**
@function Inject
@param {...String} deps - Names of values to inject.

@example
[@]Inject('$scope')
class MyController {
	constructor($scope) {
		// ...
	}
}

*/
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Inject = Inject;

function Inject() {
	for (var _len = arguments.length, deps = Array(_len), _key = 0; _key < _len; _key++) {
		deps[_key] = arguments[_key];
	}

	return function (target, name, desc) {
		var isMethod = desc && typeof desc.value === "function";

		if (isMethod) {
			desc.value.$inject = deps;
			return desc;
		}

		target.$inject = deps;
		return target;
	};
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Service = Service;

var _utils = require("./utils");

var _app = require("./app");

/**
@function Service
@public
@param {String} [name]

@example
[@]Service()
class MyService {}

*/

function Service(name) {
	if (typeof name === "function") {
		var _constructor = name;name = null;
		return register(_constructor);
	}
	return register;

	function register(constructor) {
		registerLock(constructor);
		var meta = (0, _utils.funcMeta)(constructor);

		name = name || meta.name;
		meta.service.name = name;

		_app.app.service(name, constructor);
	}
}

function registerLock(constructor) {
	var meta = (0, _utils.funcMeta)(constructor);
	var lock = meta.service;

	if (lock) {
		throw "@Service() can only be used once!";
	}

	meta.service = {};
}

},{"./app":7,"./utils":10}],5:[function(require,module,exports){
/* */
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.State = State;
exports.mountAt = mountAt;
exports.buildUiRouterState = buildUiRouterState;
exports.flattenUiRouterStates = flattenUiRouterStates;

var _utils = require("./utils");

var _Controller = require("./Controller");

var DEFAULT_SUFFIX = "Controller";

/**
@function State
@param {Object}   opts - The options
@param {string}   [opts.name] - The name of the state.
@param {string}   [opts.hidden] - Hide this state from the state path.
@param {string}   [opts.bindTo] - Bind the controller to the provided name.
@param {string}   [opts.url] - The url of the state.
@param {Boolean}  [opts.abstract] - True for abstract states.
@param {string}   [opts.template] - An angular template.
@param {string}   [opts.templateUrl] - A URL to an angular template.
@param {State[]}  [opts.children] - List of child states.
@param {string}   [opts.controllerName] - The name of the controller as seen by angular.
@param {Object}   [opts.resolve] - Any required resolved.
@param {Object}   [opts.data] - Data to associate with this state.
@param {Object}   [opts.views] - State views
@param {string[]} [opts.aliases] - Aliases for the current state.

@example
[@]State({
	url: "/",
	template: `<h1>Hello World</h1>`,
})
class HelloWorld {
}
*/

function State(opts) {
	if (typeof opts === "function") {
		var _constructor = opts;opts = null;
		return register(_constructor);
	}

	opts = opts || {};

	return register;

	function register(constructor) {
		registerLock(constructor);
		(0, _Controller.Controller)(constructor, { name: opts.controllerName });

		var meta = stateMeta(constructor);
		var superMeta = stateMeta(meta.superClass) || { state: {} };

		var prototype = constructor.prototype;
		if (prototype.activate) {
			meta.state.callbacks.onActivate.push(prototype.activate);
		}
		if (prototype.attach) {
			meta.state.callbacks.onAttach.push(prototype.attach);
		}
		if (prototype.detach) {
			meta.state.callbacks.onDetach.push(prototype.detach);
		}

		if (superMeta.state.callbacks) {
			meta.state.callbacks.onActivate = superMeta.state.callbacks.onActivate.concat(meta.state.callbacks.onActivate);
			meta.state.callbacks.onAttach = superMeta.state.callbacks.onAttach.concat(meta.state.callbacks.onAttach);
			meta.state.callbacks.onDetach = superMeta.state.callbacks.onDetach.concat(meta.state.callbacks.onDetach);
		}

		if (opts.children === false) {
			meta.state.children = null;
		} else if (opts.children) {
			meta.state.children = opts.children;
		} else if (superMeta.state.children) {
			meta.state.children = superMeta.state.children;
		}
		if (!meta.state.children) {
			meta.state.children = [];
		}

		if (opts.name) {
			meta.state.name = opts.name;
		} else {
			var _name = meta.name;
			_name = _name[0].toLowerCase() + _name.substr(1, _name.length - DEFAULT_SUFFIX.length - 1);
			meta.state.name = _name;
		}

		meta.state.bindTo = opts.bindTo;
		meta.state.aliases = (opts.aliases || []).concat(superMeta.state.aliases || []);

		var views = {};
		if (superMeta.state.views) {
			Object.assign(views, superMeta.state.views);
		}
		if (opts.views) {
			Object.assign(views, opts.views);
		}
		if (opts.template === false) {
			views[''] = undefined;
		} else if (opts.template !== undefined) {
			views[''] = { template: opts.template, bindTo: opts.bindTo || meta.state.name };
		} else if (opts.templateUrl) {
			views[''] = { templateUrl: opts.templateUrl, bindTo: opts.bindTo || meta.state.name };
		}
		meta.state.views = views;

		if (opts.url !== false) {
			if (opts.url !== undefined) {
				meta.state.url = opts.url;
			} else if (superMeta.state.url !== undefined) {
				meta.state.url = superMeta.state.url;
			}
		}

		if (opts.abstract === undefined) {
			meta.state.abstract = superMeta.state.abstract;
		} else if (opts.abstract === true) {
			meta.state.abstract = true;
		} else if (opts.abstract === false) {
			meta.state.abstract = false;
		}

		if (opts.hidden === undefined) {
			meta.state.hidden = superMeta.state.hidden;
		} else if (opts.hidden === true) {
			meta.state.hidden = true;
		} else if (opts.hidden === false) {
			meta.state.hidden = false;
		}

		meta.state.resolve = {};
		if (opts.resolve !== false) {
			Object.assign(meta.state.resolve, superMeta.state.resolve);
			if (opts.resolve) {
				Object.assign(meta.state.resolve, opts.resolve);
			}
		}

		meta.state.data = {};
		if (opts.data !== false) {
			Object.assign(meta.state.data, superMeta.state.data);
			if (opts.data) {
				Object.assign(meta.state.data, opts.data);
			}
		}
	}
}

function stateMeta(constructor) {
	if (!constructor) {
		return null;
	}

	var meta = (0, _utils.funcMeta)(constructor);

	if (meta.state) {
		return meta;
	}

	meta.state = {
		callbacks: {
			onActivate: [],
			onAttach: [],
			onDetach: []
		}
	};

	return meta;
}

function registerLock(constructor) {
	var meta = stateMeta(constructor);

	if (meta.state.registered) {
		throw "@State() can only be used once!";
	}

	meta.state.registered = true;
}

State.onActivate = function onActivate(target, name, desc) {
	if (typeof desc.value !== "function") {
		throw "@State.onActivate expects a function target";
	}

	var meta = stateMeta(target.constructor);
	meta.state.callbacks.onActivate.push(desc.value);
};

State.onAttach = function onAttach(target, name, desc) {
	if (typeof desc.value !== "function") {
		throw "@State.onAttach expects a function target";
	}

	var meta = stateMeta(target.constructor);
	meta.state.callbacks.onAttach.push(desc.value);
};

State.onDetach = function onDetach(target, name, desc) {
	if (typeof desc.value !== "function") {
		throw "@State.onDetach expects a function target";
	}

	var meta = stateMeta(target.constructor);
	meta.state.callbacks.onDetach.push(desc.value);
};

/**
@function mountAt
@param {String} url
@param {Object} [opts]
@param {String} [opts.name]

@example
SomeState::mountAt("/some/url")
*/

function mountAt(url) {
	var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	var name = opts.name;

	return {
		state: this,
		url: url,
		name: name,
		buildUiRouterState: builder
	};

	function builder(options) {
		var state = buildUiRouterState(this.state, options);

		if (this.url !== undefined) {
			state.url = url;
		}

		if (this.name !== undefined) {
			state.name = name;
		}

		return state;
	}
}

function buildUiRouterState(obj, options) {
	if (!obj) {
		return null;
	}

	if (obj.buildUiRouterState) {
		var _state = obj.buildUiRouterState(options);
		return _state;
	}

	var meta = (0, _utils.funcMeta)(obj);
	if (!meta.state) {
		throw Error("provided object is not a state");
	}

	var children = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = meta.state.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var child = _step.value;

			children.push(buildUiRouterState(child, options));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator["return"]) {
				_iterator["return"]();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var views = {};
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = Object.keys(meta.state.views)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var key = _step2.value;

			var view = meta.state.views[key];
			if (!view) {
				continue;
			}

			views[key] = {
				template: view.template,
				templateUrl: view.templateUrl,
				controllerAs: view.bindTo || meta.state.bindTo || meta.state.name,
				controller: controllerAttacher
			};
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
				_iterator2["return"]();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	if (meta.state.views[''] === undefined) {
		if (children.length > 0) {
			views[''] = {
				template: '<ui-view></ui-view>',
				controllerAs: meta.state.bindTo || meta.state.name,
				controller: controllerAttacher
			};
		} else {
			views[''] = {
				template: '',
				controllerAs: meta.state.bindTo || meta.state.name,
				controller: controllerAttacher
			};
		}
	}

	var resolve = {};
	Object.assign(resolve, meta.state.resolve);
	controllerProvider.$inject = ['$q', '$controller', '$locals', '$injector'].concat(Object.keys(resolve));
	controllerAttacher.$inject = [meta.state.name, '$locals', '$injector', '$scope'].concat(Object.keys(resolve));
	resolve[meta.state.name] = controllerProvider;
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = (meta.state.aliases || [])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var alias = _step3.value;

			if (!resolve[alias]) {
				resolve[alias] = [meta.state.name, function (mod) {
					return mod;
				}];
			}
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
				_iterator3["return"]();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	resolve.$viewCounter = function () {
		return { attached: 0, count: Object.keys(views).length };
	};

	controllerProvider.$inject = controllerProvider.$inject.concat(meta.top.$inject || []);
	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = meta.state.callbacks.onActivate[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var clb = _step4.value;

			controllerProvider.$inject = controllerProvider.$inject.concat(clb.$inject || []);
		}
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
				_iterator4["return"]();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}

	var state = {
		name: meta.state.name,
		url: meta.state.url,
		hiddenState: meta.state.hidden,
		abstract: meta.state.abstract,
		children: children,
		resolve: resolve,
		views: views,
		data: meta.state.data
	};

	return state;

	function controllerProvider($q, $controller, $locals, $injector) {
		return $q(function (ok, err) {
			try {
				var _iteratorNormalCompletion5;

				var _didIteratorError5;

				var _iteratorError5;

				var _iterator5, _step5;

				(function () {
					var ctrl = $controller(meta.controller.name, $locals);
					var p = $q.when(ctrl);

					_iteratorNormalCompletion5 = true;
					_didIteratorError5 = false;
					_iteratorError5 = undefined;

					try {
						var _loop = function () {
							var clb = _step5.value;

							p = p.then(function () {
								return $injector.invoke(clb, ctrl, $locals);
							});
						};

						for (_iterator5 = meta.state.callbacks.onActivate[Symbol.iterator](); !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
							_loop();
						}
					} catch (err) {
						_didIteratorError5 = true;
						_iteratorError5 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
								_iterator5["return"]();
							}
						} finally {
							if (_didIteratorError5) {
								throw _iteratorError5;
							}
						}
					}

					p = p.then(function () {
						return ctrl;
					});
					ok(p);
				})();
			} catch (e) {
				err(e);
			}
		})["catch"](function (err) {
			console.error("Error:", err);
			return $q.reject(err);
		});
	}

	function controllerAttacher(ctrl, $locals, $injector, $scope) {
		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;

		try {
			for (var _iterator6 = meta.state.callbacks.onAttach[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var clb = _step6.value;

				$injector.invoke(clb, ctrl, $locals);
			}
		} catch (err) {
			_didIteratorError6 = true;
			_iteratorError6 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
					_iterator6["return"]();
				}
			} finally {
				if (_didIteratorError6) {
					throw _iteratorError6;
				}
			}
		}

		$scope.$on("$destroy", function () {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;

			try {
				for (var _iterator7 = meta.state.callbacks.onDetach[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var clb = _step7.value;

					$injector.invoke(clb, ctrl, $locals);
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
						_iterator7["return"]();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}
		});

		return ctrl;
	}
}

function flattenUiRouterStates(state) {
	var acc = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

	acc.push(state);

	if (state.children) {
		var prefix = state.name;
		if (state.hiddenState) {
			if (state.parent) {
				prefix = state.parent.name;
			} else {
				prefix = null;
			}
		}

		var _iteratorNormalCompletion8 = true;
		var _didIteratorError8 = false;
		var _iteratorError8 = undefined;

		try {
			for (var _iterator8 = state.children[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
				var child = _step8.value;

				if (child) {
					child.parent = state;

					if (prefix && !child.absoluteName) {
						child.name = prefix + "." + child.name;
					}

					flattenUiRouterStates(child, acc);
				} else {
					console.warn("nil child for " + state.name);
				}
			}
		} catch (err) {
			_didIteratorError8 = true;
			_iteratorError8 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion8 && _iterator8["return"]) {
					_iterator8["return"]();
				}
			} finally {
				if (_didIteratorError8) {
					throw _iteratorError8;
				}
			}
		}
	}

	return acc;
}

},{"./Controller":2,"./utils":10}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

exports.Redirect = Redirect;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _State = require('./State');

var _Inject = require('./Inject');

var redirectId = 0;

function Redirect(stateName, stateParams) {
	redirectId++;

	var func = undefined;
	if (typeof stateName === 'function') {
		func = stateName;
		stateName = null;
		stateParams = null;
	}

	var Redirector = (function () {
		function Redirector() {
			_classCallCheck(this, _Redirector);
		}

		_createDecoratedClass(Redirector, [{
			key: 'attach',
			decorators: [(0, _Inject.Inject)('$state', '$injector', '$locals', '$q')],
			value: function attach($state, $injector, $locals, $q) {
				if (func) {
					$q.when($injector.invoke(func, this, $locals)).then(function (x) {
						if (x === false) {
							return;
						}
						var name = x.name;
						var params = x.params;

						$state.go(name, params);
					});
				} else {
					$state.go(stateName, stateParams);
				}
			}
		}]);

		var _Redirector = Redirector;
		Redirector = (0, _State.State)({
			url: '',
			template: '',
			name: 'redirect_' + redirectId
		})(Redirector) || Redirector;
		return Redirector;
	})();

	return Redirector;
}

},{"./Inject":3,"./State":5}],7:[function(require,module,exports){
/* */
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.includeModule = includeModule;
exports.beforeBoot = beforeBoot;
exports.bootstrap = bootstrap;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _injector = require('./injector');

var _mrUtil = require('mr-util');

// Base modules

require('angular-ui-router');

var _State = require('./State');

/**
@var {ngModule} app
*/
var appRootState = null;
var appDeps = ['ui.router'];
var app = _angular2['default'].module('app', appDeps);

exports.app = app;
app.run(['$injector', function ($injector) {
	(0, _injector.extendInjector)($injector);
}]);

app.config(['$stateProvider', function ($stateProvider) {
	if (!document.querySelector('[ui-view], ui-view')) {
		_mrUtil.console.warn('No root ui-view found!');
	}

	if (appRootState) {
		var state = (0, _State.buildUiRouterState)(appRootState);
		var states = (0, _State.flattenUiRouterStates)(state);
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = states[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var s = _step.value;

				$stateProvider.state(s);
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
}]);

/**
@function includeModule
@param {String} name - name of the module to include.
*/

function includeModule(name) {
	appDeps.push(name);
}

/**
@var {angular} ng
*/
var ng = _angular2['default'];
exports.ng = ng;
var beforeBootPromiseGo = undefined;
var beforeBootPromise = new Promise(function (resolve) {
	beforeBootPromiseGo = resolve;
});

/**
@function beforeBoot
@param {Promise} p - includes a Promise before the app is booted.
*/

function beforeBoot(func) {
	beforeBootPromise = beforeBootPromise.then(function () {
		return func();
	});
}

/**
@function bootstrap
@param {State} mainState
@param {...Sgtring} deps
@return {Promise}
*/

function bootstrap(mainState) {
	appRootState = mainState;
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _len = arguments.length, deps = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			deps[_key - 1] = arguments[_key];
		}

		for (var _iterator2 = deps[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var dep = _step2.value;

			includeModule(dep);
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

	beforeBootPromiseGo();
	return beforeBootPromise.then(function () {
		return new Promise(function (resolve, reject) {
			(0, _jquery2['default'])(function () {
				try {
					var injector = _angular2['default'].bootstrap(document, ['app']);
					(0, _injector.extendInjector)(injector);
					resolve();
				} catch (e) {
					reject(e);
				}
			});
		});
	});
}

},{"./State":5,"./injector":9,"angular":undefined,"angular-ui-router":undefined,"jquery":undefined,"mr-util":undefined}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _app = require("./app");

Object.defineProperty(exports, "app", {
  enumerable: true,
  get: function get() {
    return _app.app;
  }
});
Object.defineProperty(exports, "ng", {
  enumerable: true,
  get: function get() {
    return _app.ng;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function get() {
    return _app.bootstrap;
  }
});
Object.defineProperty(exports, "includeModule", {
  enumerable: true,
  get: function get() {
    return _app.includeModule;
  }
});
Object.defineProperty(exports, "beforeBoot", {
  enumerable: true,
  get: function get() {
    return _app.beforeBoot;
  }
});

var _Inject = require("./Inject");

Object.defineProperty(exports, "Inject", {
  enumerable: true,
  get: function get() {
    return _Inject.Inject;
  }
});

var _Service = require("./Service");

Object.defineProperty(exports, "Service", {
  enumerable: true,
  get: function get() {
    return _Service.Service;
  }
});

var _Controller = require("./Controller");

Object.defineProperty(exports, "Controller", {
  enumerable: true,
  get: function get() {
    return _Controller.Controller;
  }
});

var _Component = require("./Component");

Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _Component.Component;
  }
});

var _State = require("./State");

Object.defineProperty(exports, "State", {
  enumerable: true,
  get: function get() {
    return _State.State;
  }
});
Object.defineProperty(exports, "mountAt", {
  enumerable: true,
  get: function get() {
    return _State.mountAt;
  }
});
Object.defineProperty(exports, "buildUiRouterState", {
  enumerable: true,
  get: function get() {
    return _State.buildUiRouterState;
  }
});

var _utils = require('./utils');

Object.defineProperty(exports, "Metadata", {
  enumerable: true,
  get: function get() {
    return _utils.funcMeta;
  }
});

var _StateRedirect = require('./StateRedirect');

Object.defineProperty(exports, "Redirect", {
  enumerable: true,
  get: function get() {
    return _StateRedirect.Redirect;
  }
});

},{"./Component":1,"./Controller":2,"./Inject":3,"./Service":4,"./State":5,"./StateRedirect":6,"./app":7,"./utils":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.extendInjector = extendInjector;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _angular = require("angular");

var _angular2 = _interopRequireDefault(_angular);

var originalInjector = _angular2['default'].injector;
_angular2['default'].injector = function createInjector() {
	var i = originalInjector.apply(this, arguments);
	extendInjector(i);
	return i;
};

function extendInjector($injector) {
	if (typeof $injector === 'undefined') {
		console.warn('Called extendInjector without an $injector. This might be because you have the Batarang browser extension running.');
		return;
	}

	var originalInvoke = $injector.invoke;
	$injector.invoke = function invoke(fn, self, locals, serviceName) {
		if (typeof locals === 'string') {
			serviceName = locals;
			locals = null;
		}

		if (!locals) {
			locals = {};
		}
		locals.$locals = locals;

		return originalInvoke.call(this, fn, self, locals, serviceName);
	};

	var originalInstantiate = $injector.instantiate;
	$injector.instantiate = function instantiate(Type, locals, serviceName) {
		if (typeof locals === 'string') {
			serviceName = locals;
			locals = null;
		}

		if (!locals) {
			locals = {};
		}
		locals.$locals = locals;

		return originalInstantiate.call(this, Type, locals, serviceName);
	};
}

},{"angular":undefined}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.dashCase = dashCase;
exports.funcName = funcName;
exports.superClass = superClass;
exports.funcMeta = funcMeta;
exports.wrapFunc = wrapFunc;

var _app = require('./app');

function dashCase(str) {
	return str.replace(/([A-Z])/g, function ($1) {
		return "-" + $1.toLowerCase();
	});
}

function funcName(func) {
	return funcMeta(func).name;
}

function superClass(func) {
	return funcMeta(func).superClass;
}

/**
@function Metadata
@param {Function} func
@returns {Object} The function metadata.
*/

function funcMeta(func) {
	if (!func) {
		return null;
	}

	if (func.$meta !== undefined) {
		if (testEqualConstructor(func.$meta.top)) {
			return func.$meta;
		}
		if (testEqualConstructor(func.$meta.base)) {
			return func.$meta;
		}
		if (func.$meta.wrappers.findIndex(testEqualConstructor) >= 0) {
			return func.$meta;
		}
	}

	var meta = {
		controller: null,
		service: null,
		state: null,
		wrappers: [],
		base: func,
		top: func,
		name: getName(),
		superClass: getSuperClass(),
		wrap: wrapFunc
	};

	func.$meta = meta;

	return meta;

	function testEqualConstructor(other) {
		return func === other || func.prototype && func.prototype.constructor === other;
	}

	function getName() {
		var name = func && func.name || null;
		if (name === null) {
			name = func.toString().match(/^function\s*([^\s(]+)/)[1];
		}
		return name;
	}

	function getSuperClass() {
		if (!func) {
			return null;
		}
		if (!func.prototype) {
			return null;
		}
		if (!Object.getPrototypeOf(func.prototype)) {
			return null;
		}
		var s = Object.getPrototypeOf(func.prototype).constructor || null;
		if (s === Object) {
			s = null;
		}
		return s;
	}
}

function wrapFunc(wrapperFunc) {
	var func = this.top;

	this.top = wrapperFunc;
	if (!this.wrappers) {
		this.wrappers = [wrapperFunc];
	} else {
		this.wrappers.unshift(wrapperFunc);
	}

	wrapperFunc.$meta = this;
	wrapperFunc.prototype = func.prototype;

	// inherit $inject
	if (func.$inject) {
		wrapperFunc.$inject = func.$inject.slice();
	}

	if (this.controller) {
		// re-register controller
		_app.app.controller(this.controller.name, this.top);
	}

	if (this.service) {
		// re-register service
		_app.app.service(this.service.name, this.top);
	}

	return wrapperFunc;
}

},{"./app":7}]},{},[8])(8)
});
//# sourceMappingURL=fd-angular-core.js.map
