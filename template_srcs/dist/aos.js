(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof exports === 'object')
        exports["AOS"] = factory();
    else
        root["AOS"] = factory();
})(this, function() {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/ // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/
            if (installedModules[moduleId])
                /******/
                return installedModules[moduleId].exports;
            /******/
            /******/ // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                exports: {},
                /******/
                id: moduleId,
                /******/
                loaded: false
                /******/
            };
            /******/
            /******/ // Execute the module function
            /******/
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ // Flag the module as loaded
            /******/
            module.loaded = true;
            /******/
            /******/ // Return the exports of the module
            /******/
            return module.exports;
            /******/
        }
        /******/
        /******/
        /******/ // expose the modules object (__webpack_modules__)
        /******/
        __webpack_require__.m = modules;
        /******/
        /******/ // expose the module cache
        /******/
        __webpack_require__.c = installedModules;
        /******/
        /******/ // __webpack_public_path__
        /******/
        __webpack_require__.p = "dist/";
        /******/
        /******/ // Load entry module and return exports
        /******/
        return __webpack_require__(0);
        /******/
    })
    /************************************************************************/
    /******/
    ([
        /* 0 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            var _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
                return target;
            };
            /**
             * *******************************************************
             * AOS (Animate on scroll) - wowjs alternative
             * made to animate elements on scroll in both directions
             * *******************************************************
             */

            // Modules & helpers


            var _aos = __webpack_require__(1);

            var _aos2 = _interopRequireDefault(_aos);

            var _lodash = __webpack_require__(5);

            var _lodash2 = _interopRequireDefault(_lodash);

            var _lodash3 = __webpack_require__(6);

            var _lodash4 = _interopRequireDefault(_lodash3);

            var _observer = __webpack_require__(7);

            var _observer2 = _interopRequireDefault(_observer);

            var _detector = __webpack_require__(8);

            var _detector2 = _interopRequireDefault(_detector);

            var _handleScroll = __webpack_require__(9);

            var _handleScroll2 = _interopRequireDefault(_handleScroll);

            var _prepare = __webpack_require__(10);

            var _prepare2 = _interopRequireDefault(_prepare);

            var _elements = __webpack_require__(13);

            var _elements2 = _interopRequireDefault(_elements);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            /**
             * Private variables
             */
            var $aosElements = [];
            var initialized = false;

            // Detect not supported browsers (<=IE9)
            // http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
            var browserNotSupported = document.all && !window.atob;

            /**
             * Default options
             */
            var options = {
                offset: 120,
                delay: 0,
                easing: 'ease',
                duration: 400,
                disable: false,
                once: false,
                startEvent: 'DOMContentLoaded'
            };

            /**
             * Refresh AOS
             */
            var refresh = function refresh() {
                var initialize = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

                // Allow refresh only when it was first initialized on startEvent
                if (initialize) initialized = true;

                if (initialized) {
                    // Extend elements objects in $aosElements with their positions
                    $aosElements = (0, _prepare2.default)($aosElements, options);
                    // Perform scroll event, to refresh view and show/hide elements
                    (0, _handleScroll2.default)($aosElements, options.once);

                    return $aosElements;
                }
            };

            /**
             * Hard refresh
             * create array with new elements and trigger refresh
             */
            var refreshHard = function refreshHard() {
                $aosElements = (0, _elements2.default)();
                refresh();
            };

            /**
             * Disable AOS
             * Remove all attributes to reset applied styles
             */
            var disable = function disable() {
                $aosElements.forEach(function(el, i) {
                    el.node.removeAttribute('data-aos');
                    el.node.removeAttribute('data-aos-easing');
                    el.node.removeAttribute('data-aos-duration');
                    el.node.removeAttribute('data-aos-delay');
                });
            };

            /**
             * Check if AOS should be disabled based on provided setting
             */
            var isDisabled = function isDisabled(optionDisable) {
                return optionDisable === true || optionDisable === 'mobile' && _detector2.default.mobile() || optionDisable === 'phone' && _detector2.default.phone() || optionDisable === 'tablet' && _detector2.default.tablet() || typeof optionDisable === 'function' && optionDisable() === true;
            };

            /**
             * Initializing AOS
             * - Create options merging defaults with user defined options
             * - Set attributes on <body> as global setting - css relies on it
             * - Attach preparing elements to options.startEvent,
             *   window resize and orientation change
             * - Attach function that handle scroll and everything connected to it
             *   to window scroll event and fire once document is ready to set initial state
             */
            var init = function init(settings) {
                options = _extends(options, settings);

                // Create initial array with elements -> to be fullfilled later with prepare()
                $aosElements = (0, _elements2.default)();

                /**
                 * Don't init plugin if option `disable` is set
                 * or when browser is not supported
                 */
                if (isDisabled(options.disable) || browserNotSupported) {
                    return disable();
                }

                /**
                 * Set global settings on body, based on options
                 * so CSS can use it
                 */
                document.querySelector('body').setAttribute('data-aos-easing', options.easing);
                document.querySelector('body').setAttribute('data-aos-duration', options.duration);
                document.querySelector('body').setAttribute('data-aos-delay', options.delay);

                /**
                 * Handle initializing
                 */
                if (options.startEvent === 'DOMContentLoaded' && ['complete', 'interactive'].indexOf(document.readyState) > -1) {
                    // Initialize AOS if default startEvent was already fired
                    refresh(true);
                } else if (options.startEvent === 'load') {
                    // If start event is 'Load' - attach listener to window
                    window.addEventListener(options.startEvent, function() {
                        refresh(true);
                    });
                } else {
                    // Listen to options.startEvent and initialize AOS
                    document.addEventListener(options.startEvent, function() {
                        refresh(true);
                    });
                }

                /**
                 * Refresh plugin on window resize or orientation change
                 */
                window.addEventListener('resize', (0, _lodash4.default)(refresh, 50, true));
                window.addEventListener('orientationchange', (0, _lodash4.default)(refresh, 50, true));

                /**
                 * Handle scroll event to animate elements on scroll
                 */
                window.addEventListener('scroll', (0, _lodash2.default)(function() {
                    (0, _handleScroll2.default)($aosElements, options.once);
                }, 99));

                /**
                 * Watch if nodes are removed
                 * If so refresh plugin
                 */
                document.addEventListener('DOMNodeRemoved', function(event) {
                    var el = event.target;
                    if (el && el.nodeType === 1 && el.hasAttribute && el.hasAttribute('data-aos')) {
                        (0, _lodash4.default)(refreshHard, 50, true);
                    }
                });

                /**
                 * Observe [aos] elements
                 * If something is loaded by AJAX
                 * it'll refresh plugin automatically
                 */
                (0, _observer2.default)('[data-aos]', refreshHard);

                return $aosElements;
            };

            /**
             * Export Public API
             */

            module.exports = {
                init: init,
                refresh: refresh,
                refreshHard: refreshHard
            };

            /***/
        },
        /* 1 */
        /***/
        function(module, exports) {

            // removed by extract-text-webpack-plugin

            /***/
        },
        /* 2 */
        ,
        /* 3 */
        ,
        /* 4 */
        ,
        /* 5 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            /**
             * lodash 4.0.1 (Custom Build) <https://lodash.com/>
             * Build: `lodash modularize exports="npm" -o ./`
             * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
             * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
             * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
             * Available under MIT license <https://lodash.com/license>
             */
            var debounce = __webpack_require__(6);

            /** Used as the `TypeError` message for "Functions" methods. */
            var FUNC_ERROR_TEXT = 'Expected a function';

            /**
             * Creates a throttled function that only invokes `func` at most once per
             * every `wait` milliseconds. The throttled function comes with a `cancel`
             * method to cancel delayed `func` invocations and a `flush` method to
             * immediately invoke them. Provide an options object to indicate whether
             * `func` should be invoked on the leading and/or trailing edge of the `wait`
             * timeout. The `func` is invoked with the last arguments provided to the
             * throttled function. Subsequent calls to the throttled function return the
             * result of the last `func` invocation.
             *
             * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
             * on the trailing edge of the timeout only if the throttled function is
             * invoked more than once during the `wait` timeout.
             *
             * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
             * for details over the differences between `_.throttle` and `_.debounce`.
             *
             * @static
             * @memberOf _
             * @category Function
             * @param {Function} func The function to throttle.
             * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
             * @param {Object} [options] The options object.
             * @param {boolean} [options.leading=true] Specify invoking on the leading
             *  edge of the timeout.
             * @param {boolean} [options.trailing=true] Specify invoking on the trailing
             *  edge of the timeout.
             * @returns {Function} Returns the new throttled function.
             * @example
             *
             * // Avoid excessively updating the position while scrolling.
             * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
             *
             * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
             * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
             * jQuery(element).on('click', throttled);
             *
             * // Cancel the trailing throttled invocation.
             * jQuery(window).on('popstate', throttled.cancel);
             */
            function throttle(func, wait, options) {
                var leading = true,
                    trailing = true;

                if (typeof func != 'function') {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                if (isObject(options)) {
                    leading = 'leading' in options ? !!options.leading : leading;
                    trailing = 'trailing' in options ? !!options.trailing : trailing;
                }
                return debounce(func, wait, {
                    'leading': leading,
                    'maxWait': wait,
                    'trailing': trailing
                });
            }

            /**
             * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
             * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an object, else `false`.
             * @example
             *
             * _.isObject({});
             * // => true
             *
             * _.isObject([1, 2, 3]);
             * // => true
             *
             * _.isObject(_.noop);
             * // => true
             *
             * _.isObject(null);
             * // => false
             */
            function isObject(value) {
                var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
                return !!value && (type == 'object' || type == 'function');
            }

            module.exports = throttle;

            /***/
        },
        /* 6 */
        /***/
        function(module, exports) {

            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
            };

            /**
             * lodash 4.0.6 (Custom Build) <https://lodash.com/>
             * Build: `lodash modularize exports="npm" -o ./`
             * Copyright jQuery Foundation and other contributors <https://jquery.org/>
             * Released under MIT license <https://lodash.com/license>
             * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
             * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
             */

            /** Used as the `TypeError` message for "Functions" methods. */
            var FUNC_ERROR_TEXT = 'Expected a function';

            /** Used as references for various `Number` constants. */
            var NAN = 0 / 0;

            /** `Object#toString` result references. */
            var funcTag = '[object Function]',
                genTag = '[object GeneratorFunction]',
                symbolTag = '[object Symbol]';

            /** Used to match leading and trailing whitespace. */
            var reTrim = /^\s+|\s+$/g;

            /** Used to detect bad signed hexadecimal string values. */
            var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

            /** Used to detect binary string values. */
            var reIsBinary = /^0b[01]+$/i;

            /** Used to detect octal string values. */
            var reIsOctal = /^0o[0-7]+$/i;

            /** Built-in method references without a dependency on `root`. */
            var freeParseInt = parseInt;

            /** Used for built-in method references. */
            var objectProto = Object.prototype;

            /**
             * Used to resolve the
             * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
             * of values.
             */
            var objectToString = objectProto.toString;

            /* Built-in method references for those with the same name as other `lodash` methods. */
            var nativeMax = Math.max,
                nativeMin = Math.min;

            /**
             * Gets the timestamp of the number of milliseconds that have elapsed since
             * the Unix epoch (1 January 1970 00:00:00 UTC).
             *
             * @static
             * @memberOf _
             * @since 2.4.0
             * @type {Function}
             * @category Date
             * @returns {number} Returns the timestamp.
             * @example
             *
             * _.defer(function(stamp) {
             *   console.log(_.now() - stamp);
             * }, _.now());
             * // => Logs the number of milliseconds it took for the deferred function to be invoked.
             */
            var now = Date.now;

            /**
             * Creates a debounced function that delays invoking `func` until after `wait`
             * milliseconds have elapsed since the last time the debounced function was
             * invoked. The debounced function comes with a `cancel` method to cancel
             * delayed `func` invocations and a `flush` method to immediately invoke them.
             * Provide an options object to indicate whether `func` should be invoked on
             * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
             * with the last arguments provided to the debounced function. Subsequent calls
             * to the debounced function return the result of the last `func` invocation.
             *
             * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
             * on the trailing edge of the timeout only if the debounced function is
             * invoked more than once during the `wait` timeout.
             *
             * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
             * for details over the differences between `_.debounce` and `_.throttle`.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Function
             * @param {Function} func The function to debounce.
             * @param {number} [wait=0] The number of milliseconds to delay.
             * @param {Object} [options={}] The options object.
             * @param {boolean} [options.leading=false]
             *  Specify invoking on the leading edge of the timeout.
             * @param {number} [options.maxWait]
             *  The maximum time `func` is allowed to be delayed before it's invoked.
             * @param {boolean} [options.trailing=true]
             *  Specify invoking on the trailing edge of the timeout.
             * @returns {Function} Returns the new debounced function.
             * @example
             *
             * // Avoid costly calculations while the window size is in flux.
             * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
             *
             * // Invoke `sendMail` when clicked, debouncing subsequent calls.
             * jQuery(element).on('click', _.debounce(sendMail, 300, {
             *   'leading': true,
             *   'trailing': false
             * }));
             *
             * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
             * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
             * var source = new EventSource('/stream');
             * jQuery(source).on('message', debounced);
             *
             * // Cancel the trailing debounced invocation.
             * jQuery(window).on('popstate', debounced.cancel);
             */
            function debounce(func, wait, options) {
                var lastArgs,
                    lastThis,
                    maxWait,
                    result,
                    timerId,
                    lastCallTime = 0,
                    lastInvokeTime = 0,
                    leading = false,
                    maxing = false,
                    trailing = true;

                if (typeof func != 'function') {
                    throw new TypeError(FUNC_ERROR_TEXT);
                }
                wait = toNumber(wait) || 0;
                if (isObject(options)) {
                    leading = !!options.leading;
                    maxing = 'maxWait' in options;
                    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
                    trailing = 'trailing' in options ? !!options.trailing : trailing;
                }

                function invokeFunc(time) {
                    var args = lastArgs,
                        thisArg = lastThis;

                    lastArgs = lastThis = undefined;
                    lastInvokeTime = time;
                    result = func.apply(thisArg, args);
                    return result;
                }

                function leadingEdge(time) {
                    // Reset any `maxWait` timer.
                    lastInvokeTime = time;
                    // Start the timer for the trailing edge.
                    timerId = setTimeout(timerExpired, wait);
                    // Invoke the leading edge.
                    return leading ? invokeFunc(time) : result;
                }

                function remainingWait(time) {
                    var timeSinceLastCall = time - lastCallTime,
                        timeSinceLastInvoke = time - lastInvokeTime,
                        result = wait - timeSinceLastCall;

                    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
                }

                function shouldInvoke(time) {
                    var timeSinceLastCall = time - lastCallTime,
                        timeSinceLastInvoke = time - lastInvokeTime;

                    // Either this is the first call, activity has stopped and we're at the
                    // trailing edge, the system time has gone backwards and we're treating
                    // it as the trailing edge, or we've hit the `maxWait` limit.
                    return !lastCallTime || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
                }

                function timerExpired() {
                    var time = now();
                    if (shouldInvoke(time)) {
                        return trailingEdge(time);
                    }
                    // Restart the timer.
                    timerId = setTimeout(timerExpired, remainingWait(time));
                }

                function trailingEdge(time) {
                    clearTimeout(timerId);
                    timerId = undefined;

                    // Only invoke if we have `lastArgs` which means `func` has been
                    // debounced at least once.
                    if (trailing && lastArgs) {
                        return invokeFunc(time);
                    }
                    lastArgs = lastThis = undefined;
                    return result;
                }

                function cancel() {
                    if (timerId !== undefined) {
                        clearTimeout(timerId);
                    }
                    lastCallTime = lastInvokeTime = 0;
                    lastArgs = lastThis = timerId = undefined;
                }

                function flush() {
                    return timerId === undefined ? result : trailingEdge(now());
                }

                function debounced() {
                    var time = now(),
                        isInvoking = shouldInvoke(time);

                    lastArgs = arguments;
                    lastThis = this;
                    lastCallTime = time;

                    if (isInvoking) {
                        if (timerId === undefined) {
                            return leadingEdge(lastCallTime);
                        }
                        if (maxing) {
                            // Handle invocations in a tight loop.
                            clearTimeout(timerId);
                            timerId = setTimeout(timerExpired, wait);
                            return invokeFunc(lastCallTime);
                        }
                    }
                    if (timerId === undefined) {
                        timerId = setTimeout(timerExpired, wait);
                    }
                    return result;
                }
                debounced.cancel = cancel;
                debounced.flush = flush;
                return debounced;
            }

            /**
             * Checks if `value` is classified as a `Function` object.
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified,
             *  else `false`.
             * @example
             *
             * _.isFunction(_);
             * // => true
             *
             * _.isFunction(/abc/);
             * // => false
             */
            function isFunction(value) {
                // The use of `Object#toString` avoids issues with the `typeof` operator
                // in Safari 8 which returns 'object' for typed array and weak map constructors,
                // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
                var tag = isObject(value) ? objectToString.call(value) : '';
                return tag == funcTag || tag == genTag;
            }

            /**
             * Checks if `value` is the
             * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
             * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
             *
             * @static
             * @memberOf _
             * @since 0.1.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is an object, else `false`.
             * @example
             *
             * _.isObject({});
             * // => true
             *
             * _.isObject([1, 2, 3]);
             * // => true
             *
             * _.isObject(_.noop);
             * // => true
             *
             * _.isObject(null);
             * // => false
             */
            function isObject(value) {
                var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
                return !!value && (type == 'object' || type == 'function');
            }

            /**
             * Checks if `value` is object-like. A value is object-like if it's not `null`
             * and has a `typeof` result of "object".
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
             * @example
             *
             * _.isObjectLike({});
             * // => true
             *
             * _.isObjectLike([1, 2, 3]);
             * // => true
             *
             * _.isObjectLike(_.noop);
             * // => false
             *
             * _.isObjectLike(null);
             * // => false
             */
            function isObjectLike(value) {
                return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
            }

            /**
             * Checks if `value` is classified as a `Symbol` primitive or object.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to check.
             * @returns {boolean} Returns `true` if `value` is correctly classified,
             *  else `false`.
             * @example
             *
             * _.isSymbol(Symbol.iterator);
             * // => true
             *
             * _.isSymbol('abc');
             * // => false
             */
            function isSymbol(value) {
                return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
            }

            /**
             * Converts `value` to a number.
             *
             * @static
             * @memberOf _
             * @since 4.0.0
             * @category Lang
             * @param {*} value The value to process.
             * @returns {number} Returns the number.
             * @example
             *
             * _.toNumber(3);
             * // => 3
             *
             * _.toNumber(Number.MIN_VALUE);
             * // => 5e-324
             *
             * _.toNumber(Infinity);
             * // => Infinity
             *
             * _.toNumber('3');
             * // => 3
             */
            function toNumber(value) {
                if (typeof value == 'number') {
                    return value;
                }
                if (isSymbol(value)) {
                    return NAN;
                }
                if (isObject(value)) {
                    var other = isFunction(value.valueOf) ? value.valueOf() : value;
                    value = isObject(other) ? other + '' : other;
                }
                if (typeof value != 'string') {
                    return value === 0 ? value : +value;
                }
                value = value.replace(reTrim, '');
                var isBinary = reIsBinary.test(value);
                return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
            }

            module.exports = debounce;

            /***/
        },
        /* 7 */
        /***/
        function(module, exports) {

            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            var doc = window.document;
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

            var listeners = [];
            var observer = void 0;

            function ready(selector, fn) {
                // Store the selector and callback to be monitored
                listeners.push({
                    selector: selector,
                    fn: fn
                });

                if (!observer && MutationObserver) {
                    // Watch for changes in the document
                    observer = new MutationObserver(check);
                    observer.observe(doc.documentElement, {
                        childList: true,
                        subtree: true,
                        removedNodes: true
                    });
                }
                // Check if the element is currently in the DOM
                check();
            }

            function check() {
                // Check the DOM for elements matching a stored selector
                for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
                    listener = listeners[i];
                    // Query for elements matching the specified selector
                    elements = doc.querySelectorAll(listener.selector);
                    for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                        element = elements[j];
                        // Make sure the callback isn't invoked with the
                        // same element more than once
                        if (!element.ready) {
                            element.ready = true;
                            // Invoke the callback with the element
                            listener.fn.call(element, element);
                        }
                    }
                }
            }

            exports.default = ready;

            /***/
        },
        /* 8 */
        /***/
        function(module, exports) {

            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _createClass = function() {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }
                return function(Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            /**
             * Device detector
             */

            var Detector = function() {
                function Detector() {
                    _classCallCheck(this, Detector);
                }

                _createClass(Detector, [{
                    key: "phone",
                    value: function phone() {
                        var check = false;
                        (function(a) {
                            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
                        })(navigator.userAgent || navigator.vendor || window.opera);
                        return check;
                    }
                }, {
                    key: "mobile",
                    value: function mobile() {
                        var check = false;
                        (function(a) {
                            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
                        })(navigator.userAgent || navigator.vendor || window.opera);
                        return check;
                    }
                }, {
                    key: "tablet",
                    value: function tablet() {
                        return this.mobile() && !this.phone();
                    }
                }]);

                return Detector;
            }();

            ;

            exports.default = new Detector();

            /***/
        },
        /* 9 */
        /***/
        function(module, exports) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            /**
             * Set or remove aos-animate class
             * @param {node} el         element
             * @param {int}  top        scrolled distance
             * @param {void} once
             */
            var setState = function setState(el, top, once) {
                var attrOnce = el.node.getAttribute('data-aos-once');

                if (top > el.position) {
                    el.node.classList.add('aos-animate');
                } else if (typeof attrOnce !== 'undefined') {
                    if (attrOnce === 'false' || !once && attrOnce !== 'true') {
                        el.node.classList.remove('aos-animate');
                    }
                }
            };

            /**
             * Scroll logic - add or remove 'aos-animate' class on scroll
             *
             * @param  {array} $elements         array of elements nodes
             * @param  {bool} once               plugin option
             * @return {void}
             */
            var handleScroll = function handleScroll($elements, once) {
                var scrollTop = window.pageYOffset;
                var windowHeight = window.innerHeight;
                /**
                 * Check all registered elements positions
                 * and animate them on scroll
                 */
                $elements.forEach(function(el, i) {
                    setState(el, windowHeight + scrollTop, once);
                });
            };

            exports.default = handleScroll;

            /***/
        },
        /* 10 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _calculateOffset = __webpack_require__(11);

            var _calculateOffset2 = _interopRequireDefault(_calculateOffset);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            var prepare = function prepare($elements, options) {
                $elements.forEach(function(el, i) {
                    el.node.classList.add('aos-init');
                    el.position = (0, _calculateOffset2.default)(el.node, options.offset);
                });
                return $elements;
            }; /* Clearing variables */

            exports.default = prepare;

            /***/
        },
        /* 11 */
        /***/
        function(module, exports, __webpack_require__) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _offset = __webpack_require__(12);

            var _offset2 = _interopRequireDefault(_offset);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            var calculateOffset = function calculateOffset(el, optionalOffset) {
                var elementOffsetTop = 0;
                var additionalOffset = 0;
                var windowHeight = window.innerHeight;
                var attrs = {
                    offset: el.getAttribute('data-aos-offset'),
                    anchor: el.getAttribute('data-aos-anchor'),
                    anchorPlacement: el.getAttribute('data-aos-anchor-placement')
                };

                if (attrs.offset && !isNaN(attrs.offset)) {
                    additionalOffset = parseInt(attrs.offset);
                }

                if (attrs.anchor && document.querySelectorAll(attrs.anchor)) {
                    el = document.querySelectorAll(attrs.anchor)[0];
                }

                elementOffsetTop = (0, _offset2.default)(el).top;

                switch (attrs.anchorPlacement) {
                    case 'top-bottom':
                        // Default offset
                        break;
                    case 'center-bottom':
                        elementOffsetTop += el.offsetHeight / 2;
                        break;
                    case 'bottom-bottom':
                        elementOffsetTop += el.offsetHeight;
                        break;
                    case 'top-center':
                        elementOffsetTop += windowHeight / 2;
                        break;
                    case 'bottom-center':
                        elementOffsetTop += windowHeight / 2 + el.offsetHeight;
                        break;
                    case 'center-center':
                        elementOffsetTop += windowHeight / 2 + el.offsetHeight / 2;
                        break;
                    case 'top-top':
                        elementOffsetTop += windowHeight;
                        break;
                    case 'bottom-top':
                        elementOffsetTop += el.offsetHeight + windowHeight;
                        break;
                    case 'center-top':
                        elementOffsetTop += el.offsetHeight / 2 + windowHeight;
                        break;
                }

                if (!attrs.anchorPlacement && !attrs.offset && !isNaN(optionalOffset)) {
                    additionalOffset = optionalOffset;
                }

                return elementOffsetTop + additionalOffset;
            };
            /**
             * Calculate offset
             * basing on element's settings like:
             * - anchor
             * - offset
             *
             * @param  {Node} el [Dom element]
             * @return {Integer} [Final offset that will be used to trigger animation in good position]
             */

            exports.default = calculateOffset;

            /***/
        },
        /* 12 */
        /***/
        function(module, exports) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            /**
             * Get offset of DOM element Helper
             * including these with translation
             *
             * @param  {Node} el [DOM element]
             * @return {Object} [top and left offset]
             */
            var offset = function offset(el) {
                var _x = 0;
                var _y = 0;

                while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                    _x += el.offsetLeft - (el.tagName != 'BODY' ? el.scrollLeft : 0);
                    _y += el.offsetTop - (el.tagName != 'BODY' ? el.scrollTop : 0);
                    el = el.offsetParent;
                }

                return {
                    top: _y,
                    left: _x
                };
            };

            exports.default = offset;

            /***/
        },
        /* 13 */
        /***/
        function(module, exports) {

            'use strict';

            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            /**
             * Generate initial array with elements as objects
             * This array will be extended later with elements attributes values
             * like 'position'
             */
            var createArrayWithElements = function createArrayWithElements(elements) {
                elements = elements || document.querySelectorAll('[data-aos]');
                var finalElements = [];

                [].forEach.call(elements, function(el, i) {
                    finalElements.push({
                        node: el
                    });
                });

                return finalElements;
            };

            exports.default = createArrayWithElements;

            /***/
        }
        /******/
    ])
});;


/** WEBPACK FOOTER **
 ** aos.js
 **/