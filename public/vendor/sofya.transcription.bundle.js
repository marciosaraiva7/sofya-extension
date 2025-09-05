(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SofyaTrancription"] = factory();
	else
		root["SofyaTrancription"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/dist/browser/axios.cjs":
/*!***************************************************!*\
  !*** ./node_modules/axios/dist/browser/axios.cjs ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*! Axios v1.11.0 Copyright (c) 2025 Matt Zabriskie and contributors */


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;
const {iterator, toStringTag} = Symbol;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};

/**
 * Determine if a value is an empty object (safely handles Buffers)
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an empty object, otherwise false
 */
const isEmptyObject = (val) => {
  // Early return for non-objects or Buffers to prevent RangeError
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }
  
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    // Fallback for any other objects that might cause RangeError with Object.keys()
    return false;
  }
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Buffer check
    if (isBuffer(obj)) {
      return;
    }

    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  if (isBuffer(obj)){
    return null;
  }

  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : __webpack_require__.g)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];

  const _iterator = generator.call(obj);

  let result;

  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      //Buffer check
      if (isBuffer(source)) {
        return source;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************


const isIterable = (thing) => thing != null && isFunction(thing[iterator]);


var utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (utils$1.isBoolean(value)) {
      return value.toString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

var platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  navigator: _navigator,
  origin: origin
});

var platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), {
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isObject(header) && utils$1.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils$1.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }

        obj[key = entry[0]] = (dest = obj[key]) ?
          (utils$1.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]]) : entry[1];
      }

      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  getSetCookie() {
    return this.get("set-cookie") || [];
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

var cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils$1.forEach(Object.keys({...config1, ...config2}), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

var resolveConfig = (config) => {
  const newConfig = mergeConfig({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

var composeSignals$1 = composeSignals;

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils$1.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$1.isBlob(body)) {
    return body.size;
  }

  if(utils$1.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils$1.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

var fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request, fetchOptions);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const VERSION = "1.11.0";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/***/ ((module) => {



var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./src/MediaElementAudioCapture.js":
/*!*****************************************!*\
  !*** ./src/MediaElementAudioCapture.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MediaElementAudioCapture: () => (/* binding */ MediaElementAudioCapture)
/* harmony export */ });
class MediaElementAudioCapture {
    constructor() {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(
        this.audioContext
      );
    }
  
    /**
       * Captures the audio stream from a media element and returns a MediaStream.
       * @param {HTMLMediaElement} mediaElement - The media element (video or audio) to capture audio from.
       * @returns The MediaStream with the captured audio.
       */
    captureAudio(mediaElement) {
      if (
        !(
          mediaElement instanceof HTMLVideoElement ||
          mediaElement instanceof HTMLAudioElement
        )
      ) {
        throw new Error(
          "The provided element is not a valid HTMLVideoElement or HTMLAudioElement"
        );
      }
  
      const mediaStream = mediaElement.srcObject;
      if (!mediaStream) {
        throw new Error("No media stream found on the provided media element");
      }
  
      const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(
        this.audioContext,
        { mediaStream }
      );
      mediaStreamAudioSourceNode.connect(this.mediaStreamAudioDestinationNode);
  
      mediaElement.onloadedmetadata = () => {
        const newMediaStream = mediaElement.srcObject;
        const newMediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(
          this.audioContext,
          { mediaStream: newMediaStream }
        );
        newMediaStreamAudioSourceNode.connect(
          this.mediaStreamAudioDestinationNode
        );
      };
  
      return this.mediaStreamAudioDestinationNode.stream;
    }
  }
  

/***/ }),

/***/ "./src/api/api.ts":
/*!************************!*\
  !*** ./src/api/api.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.authService = exports.authAPI = void 0;
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/dist/browser/axios.cjs"));
// export const authAPI = axios.create({
//   baseURL: 'https://tyhdym3zijlcj7yuhadwnvtlnm0cjtgm.lambda-url.us-east-1.on.aws',
// });
exports.authAPI = axios_1.default.create({
    baseURL: 'https://api.reasoner.alpha.sofya.ai/v1/sdk',
});
var authService = function (apiKey) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, exports.authAPI)("/providers", {
                        method: 'get',
                        headers: {
                            'x-api-key': apiKey,
                        },
                    })];
            case 1:
                data = (_b.sent()).data;
                return [2 /*return*/, data];
            case 2:
                _a = _b.sent();
                console.error("Unable to authenticate. Please check your api key");
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.authService = authService;


/***/ }),

/***/ "./src/libs/oci-aispeech-realtime-web/ai-speech-api-client.ts":
/*!********************************************************************!*\
  !*** ./src/libs/oci-aispeech-realtime-web/ai-speech-api-client.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


/* tslint:disable */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RealtimeParametersModelDomainEnum = exports.RealtimeParametersStabilizePartialResultsEnum = exports.RealtimeMessageOutEventEnum = void 0;
var RealtimeMessageOutEventEnum;
(function (RealtimeMessageOutEventEnum) {
    RealtimeMessageOutEventEnum["SEND_FINAL_RESULT"] = "SEND_FINAL_RESULT";
})(RealtimeMessageOutEventEnum || (exports.RealtimeMessageOutEventEnum = RealtimeMessageOutEventEnum = {}));
var RealtimeParametersStabilizePartialResultsEnum;
(function (RealtimeParametersStabilizePartialResultsEnum) {
    RealtimeParametersStabilizePartialResultsEnum["NONE"] = "NONE";
    RealtimeParametersStabilizePartialResultsEnum["LOW"] = "LOW";
    RealtimeParametersStabilizePartialResultsEnum["MEDIUM"] = "MEDIUM";
    RealtimeParametersStabilizePartialResultsEnum["HIGH"] = "HIGH";
})(RealtimeParametersStabilizePartialResultsEnum || (exports.RealtimeParametersStabilizePartialResultsEnum = RealtimeParametersStabilizePartialResultsEnum = {}));
var RealtimeParametersModelDomainEnum;
(function (RealtimeParametersModelDomainEnum) {
    RealtimeParametersModelDomainEnum["GENERIC"] = "GENERIC";
    RealtimeParametersModelDomainEnum["MEDICAL"] = "MEDICAL";
})(RealtimeParametersModelDomainEnum || (exports.RealtimeParametersModelDomainEnum = RealtimeParametersModelDomainEnum = {}));


/***/ }),

/***/ "./src/libs/oci-aispeech-realtime-web/ai-speech-realtime-web-client.ts":
/*!*****************************************************************************!*\
  !*** ./src/libs/oci-aispeech-realtime-web/ai-speech-realtime-web-client.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AIServiceSpeechRealtimeApi = exports.RealtimeWebSocketState = void 0;
//@ts-nocheck
var speech_audio_streamer_1 = __importDefault(__webpack_require__(/*! ./speech-audio-streamer */ "./src/libs/oci-aispeech-realtime-web/speech-audio-streamer.ts"));
var ai_speech_api_client_1 = __webpack_require__(/*! ./ai-speech-api-client */ "./src/libs/oci-aispeech-realtime-web/ai-speech-api-client.ts");
var RealtimeWebSocketState;
(function (RealtimeWebSocketState) {
    RealtimeWebSocketState[RealtimeWebSocketState["STOPPED"] = 0] = "STOPPED";
    RealtimeWebSocketState[RealtimeWebSocketState["RUNNING"] = 1] = "RUNNING";
    RealtimeWebSocketState[RealtimeWebSocketState["OPENING"] = 2] = "OPENING";
    RealtimeWebSocketState[RealtimeWebSocketState["AUTHENTICATING"] = 3] = "AUTHENTICATING";
    RealtimeWebSocketState[RealtimeWebSocketState["ERROR"] = 4] = "ERROR";
})(RealtimeWebSocketState || (exports.RealtimeWebSocketState = RealtimeWebSocketState = {}));
var AIServiceSpeechRealtimeApi = /** @class */ (function () {
    function AIServiceSpeechRealtimeApi(realtimeClientListener, token, compartmentId, mediaStream, realtimeEndpoint, realtimeParameters) {
        var _this = this;
        this.realtimeParameters = {
            isAckEnabled: false,
            shortPauseInMs: 0,
            longPauseInMs: 1000,
            stabilizePartialResults: ai_speech_api_client_1.RealtimeParametersStabilizePartialResultsEnum.MEDIUM,
            shouldIgnoreInvalidCustomizations: false,
            languageCode: "en-US",
            modelDomain: ai_speech_api_client_1.RealtimeParametersModelDomainEnum.GENERIC,
        };
        this.onWebsocketOpen = function (event) {
            _this.realtimeClientListener.onConnect(event);
            _this.setWebSocketState(RealtimeWebSocketState.AUTHENTICATING);
            try {
                if (_this.realtimeAuthPayload !== null)
                    _this.realtimeWebSocketClient.send(JSON.stringify(_this.realtimeAuthPayload));
                else {
                    _this.realtimeWebSocketClient.close();
                    _this.setWebSocketState(RealtimeWebSocketState.STOPPED);
                }
            }
            catch (error) {
                try {
                    _this.realtimeWebSocketClient.close();
                }
                catch (err) {
                    _this.onWebsocketError(err);
                }
                _this.setWebSocketState(RealtimeWebSocketState.STOPPED);
            }
        };
        this.onWebsocketClose = function (close) {
            _this.close();
            _this.setWebSocketState(RealtimeWebSocketState.STOPPED);
            _this.realtimeClientListener.onClose(close);
        };
        this.onWebsocketMessage = function (message) {
            if (message.data) {
                var data = JSON.parse(message.data.toString());
                var realtimeMessageEvent = data.event;
                if (realtimeMessageEvent === "ACKAUDIO") {
                    _this.realtimeClientListener.onAckAudio(data);
                }
                else if (realtimeMessageEvent === "CONNECT") {
                    //this.setWebSocketState(RealtimeWebSocketState.RUNNING);
                    _this.initAudio(_this.mediaStream);
                    // this.realtimeClientListener.onConnectMessage(data as any as RealtimeMessageConnect);
                }
                else if (realtimeMessageEvent === "RESULT") {
                    _this.realtimeClientListener.onResult(data);
                }
                else if (realtimeMessageEvent === "ERROR") {
                    var errorMessage = data.code + ": " + data.message;
                    _this.onWebsocketError(new Error(errorMessage));
                }
            }
        };
        this.onWebsocketError = function (error) {
            console.error(error);
            _this.setWebSocketState(RealtimeWebSocketState.ERROR);
            _this.realtimeClientListener.onError(error);
        };
        // private onWebsocketMessage = (message: MessageEvent) => {
        //   if (message.data) {
        //     this.onMessageCallback("MESSAGE", message);
        //   }
        // };
        // private initAudio = () => {
        //   try {
        //     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //       navigator.mediaDevices
        //         .getUserMedia({ audio: true })
        //         .then((stream) => {
        //           this.mediaStream = stream;
        //           this.audioStreamer = new AudioStreamer(this.mediaStream, {
        //             mimeType: "audio/wav",
        //             bitRate: 256000,
        //             sampleRate: 16000,
        //             bufferSize: 1024,
        //             callBack: (data: Blob) => {
        //               data.arrayBuffer().then((arrayBuffer) => {
        //                 if (this.realtimeWebSocketClient.readyState !== WebSocket.CLOSED && this.realtimeWebSocketClient.readyState !== WebSocket.CLOSING) {
        //                   setTimeout(() => this.realtimeWebSocketClient.send(arrayBuffer), 1);
        //                 }
        //               });
        //             },
        //           });
        //           if (this.audioStreamer.startRecording()) this.setWebSocketState(RealtimeWebSocketState.RUNNING);
        //           else this.setWebSocketState(RealtimeWebSocketState.ERROR);
        //         })
        //         .catch((err) => {
        //           this.onWebsocketError(err);
        //         });
        //     } else {
        //       throw new Error("getUserMedia not supported on your browser.");
        //     }
        //   } catch (err) {
        //     this.onWebsocketError(err);
        //     try {
        //       this.close();
        //     } catch (error) {
        //       this.onWebsocketError(error);
        //       this.close();
        //     }
        //     this.setWebSocketState(RealtimeWebSocketState.ERROR);
        //   }
        // };
        this.initAudio = function (stream) {
            try {
                _this.mediaStream = stream;
                _this.audioStreamer = new speech_audio_streamer_1.default(_this.mediaStream, {
                    mimeType: "audio/wav",
                    bitRate: 256000,
                    sampleRate: 16000,
                    bufferSize: 1024,
                    callBack: function (data) {
                        data.arrayBuffer().then(function (arrayBuffer) {
                            if (_this.realtimeWebSocketClient.readyState !== WebSocket.CLOSED && _this.realtimeWebSocketClient.readyState !== WebSocket.CLOSING) {
                                setTimeout(function () { return _this.realtimeWebSocketClient.send(arrayBuffer); }, 1);
                            }
                        });
                    },
                });
                if (_this.audioStreamer.startRecording())
                    _this.setWebSocketState(RealtimeWebSocketState.RUNNING);
                else
                    _this.setWebSocketState(RealtimeWebSocketState.ERROR);
            }
            catch (err) {
                _this.onWebsocketError(err);
                try {
                    _this.close();
                }
                catch (error) {
                    _this.onWebsocketError(error);
                    _this.close();
                }
                _this.setWebSocketState(RealtimeWebSocketState.ERROR);
            }
        };
        this.parseParameters = function (params) {
            var parameterString = "?";
            if (params.isAckEnabled !== undefined)
                parameterString += "isAckEnabled=" + params.isAckEnabled + "&";
            if (params.partialSilenceThresholdInMs !== undefined)
                parameterString += "partialSilenceThresholdInMs=" + params.partialSilenceThresholdInMs + "&";
            if (params.finalSilenceThresholdInMs !== undefined)
                parameterString += "finalSilenceThresholdInMs=" + params.finalSilenceThresholdInMs + "&";
            if (params.languageCode !== undefined)
                parameterString += "languageCode=" + params.languageCode + "&";
            if (params.modelDomain !== undefined)
                parameterString += "modelDomain=" + params.modelDomain + "&";
            if (params.stabilizePartialResults !== undefined)
                parameterString += "stabilizePartialResults=" + params.stabilizePartialResults + "&";
            if (params.shouldIgnoreInvalidCustomizations !== undefined)
                parameterString += "shouldIgnoreInvalidCustomizations=" + params.shouldIgnoreInvalidCustomizations + "&";
            if (params.customizations !== undefined && params.customizations.length > 0) {
                parameterString += "customizations=" + encodeURIComponent(JSON.stringify(params.customizations));
            }
            return parameterString;
        };
        this.createAuthenticationPayload = function (authType) {
            var payload = {
                authenticationType: authType,
                compartmentId: _this.compartmentId,
                token: _this.token,
            };
            _this.realtimeAuthPayload = payload;
        };
        this.connect = function () {
            try {
                _this.realtimeWebSocketClient = new WebSocket(_this.realtimeEndpoint + _this.parseParameters(_this.realtimeParameters));
                _this.realtimeWebSocketClient.onopen = function (open) { return _this.onWebsocketOpen(open); };
                _this.realtimeWebSocketClient.onmessage = function (message) { return _this.onWebsocketMessage(message); };
                _this.realtimeWebSocketClient.onclose = function (close) { return _this.onWebsocketClose(close); };
                _this.realtimeWebSocketClient.onerror = function (event) { return _this.onWebsocketError(new Error("".concat(event.type, ": ").concat(event.message))); };
                _this.setWebSocketState(RealtimeWebSocketState.OPENING);
                _this.createAuthenticationPayload("TOKEN");
            }
            catch (err) {
                _this.onWebsocketError(err);
                _this.close();
            }
        };
        this.close = function () {
            try {
                if (_this.audioStreamer) {
                    _this.audioStreamer.stopRecording(function () {
                        if (_this.mediaStream) {
                            _this.mediaStream.getTracks().forEach(function (track) { return track.stop(); });
                        }
                    });
                }
            }
            catch (err) {
                _this.onWebsocketError(err);
            }
            try {
                _this.realtimeWebSocketClient.close();
            }
            catch (err) {
                _this.onWebsocketError(err);
            }
        };
        this.pause = function () {
            try {
                if (_this.audioStreamer) {
                    _this.audioStreamer.pauseRecording();
                }
            }
            catch (err) {
                console.error("Unable to pause transcription", err);
            }
        };
        this.resume = function () {
            try {
                if (_this.audioStreamer) {
                    _this.audioStreamer.resumeRecording();
                }
            }
            catch (err) {
                console.error("Unable to resume transcription", err);
            }
        };
        this.getWebSocketState = function () {
            return _this.realtimeWebSocketState;
        };
        this.setWebSocketState = function (state) {
            _this.realtimeWebSocketState = state;
        };
        this.requestFinalResult = function () {
            var requestMessage = {
                event: ai_speech_api_client_1.RealtimeMessageOutEventEnum.SEND_FINAL_RESULT,
            };
            _this.realtimeWebSocketClient.send(JSON.stringify(requestMessage));
        };
        this.realtimeClientListener = realtimeClientListener;
        this.token = token;
        this.compartmentId = compartmentId;
        this.mediaStream = mediaStream;
        if (realtimeParameters)
            this.realtimeParameters = realtimeParameters;
        if (realtimeEndpoint)
            this.realtimeEndpoint = realtimeEndpoint;
    }
    return AIServiceSpeechRealtimeApi;
}());
exports.AIServiceSpeechRealtimeApi = AIServiceSpeechRealtimeApi;


/***/ }),

/***/ "./src/libs/oci-aispeech-realtime-web/index.ts":
/*!*****************************************************!*\
  !*** ./src/libs/oci-aispeech-realtime-web/index.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var AIServiceSpeechRealtimeClient = __importStar(__webpack_require__(/*! ./ai-speech-realtime-web-client */ "./src/libs/oci-aispeech-realtime-web/ai-speech-realtime-web-client.ts"));
__exportStar(__webpack_require__(/*! ./ai-speech-realtime-web-client */ "./src/libs/oci-aispeech-realtime-web/ai-speech-realtime-web-client.ts"), exports);
__exportStar(__webpack_require__(/*! ./ai-speech-api-client */ "./src/libs/oci-aispeech-realtime-web/ai-speech-api-client.ts"), exports);
exports["default"] = AIServiceSpeechRealtimeClient;


/***/ }),

/***/ "./src/libs/oci-aispeech-realtime-web/speech-audio-streamer.ts":
/*!*********************************************************************!*\
  !*** ./src/libs/oci-aispeech-realtime-web/speech-audio-streamer.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
//@ts-nocheck
var speech_audio_resampler_1 = __importDefault(__webpack_require__(/*! ../speech-audio-resampler */ "./src/libs/speech-audio-resampler/index.ts"));
var AudioStreamer = /** @class */ (function () {
    function AudioStreamer(mediaStream, config) {
        var _this = this;
        this.audioProcessStatus = false;
        this.onAudioDataAvailable = function (e) {
            if (_this.getState() === "PAUSED") {
                return;
            }
            if (!_this.isMediaStreamActive()) {
                _this.audioNode.disconnect();
                _this.setState("STOPPED");
            }
            if (_this.getState() !== "RECORDING") {
                if (_this.audioInput) {
                    _this.audioInput.disconnect();
                    _this.audioInput = {};
                }
                return;
            }
            if (!_this.audioProcessStatus)
                _this.audioProcessStatus = true;
            var bufferData = e.inputBuffer.getChannelData(0);
            var buffersCopy = new Float32Array(bufferData);
            _this.timeSlicedAudioBuffer.bufferArray.push(buffersCopy);
            _this.timeSlicedAudioBuffer.length += _this.config.bufferSize;
            if (_this.getState() !== "RECORDING" || typeof _this.config.callBack !== "function")
                return;
            if (_this.timeSlicedAudioBuffer.bufferArray.length) {
                _this.processAudioBuffers();
                _this.timeSlicedAudioBuffer = { bufferArray: [], length: 0 };
            }
        };
        this.callBack = function (buffer, view) {
            var blob = new Blob([view], {
                type: "audio/wav",
            });
            _this.config.callBack(blob);
        };
        this.processAudioBuffers = function () {
            var sampleRate = _this.audioContext.sampleRate;
            var targetSampleRate = _this.config.sampleRate;
            var audioBuffer = _this.timeSlicedAudioBuffer;
            var buffers = mergeBuffers(audioBuffer.bufferArray.slice(0), audioBuffer.length);
            if (sampleRate !== targetSampleRate)
                buffers = _this.audioResampler.resample(buffers);
            function mergeBuffers(bufferArray, bufferLength) {
                var result = new Float32Array(bufferLength);
                var offset = 0;
                var length = bufferArray.length;
                for (var i = 0; i < length; i++) {
                    var buffer_1 = bufferArray[i];
                    result.set(buffer_1, offset);
                    offset += buffer_1.length;
                }
                return result;
            }
            var interleavedLength = buffers.length;
            var resultingBufferLength = interleavedLength * 2;
            var buffer = new ArrayBuffer(resultingBufferLength);
            var view = new DataView(buffer);
            // data chunk length
            // write the PCM samples
            var lng = interleavedLength;
            var index = 0;
            var volume = 1;
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, buffers[i] * (0x7fff * volume), true);
                index += 2;
            }
            _this.callBack(buffer, view);
        };
        this.enableCompatibility = function () {
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
            window.URL = window.URL || window.webkitURL;
            window.MediaStream = window.MediaStream || window.webkitMediaStream;
        };
        this.setState = function (state) {
            _this.state = state;
        };
        this.initiateAudioWithSampleRate = function (sampleRate) {
            _this.audioContext = new window.AudioContext({ sampleRate: sampleRate });
            _this.audioInput = _this.audioContext.createMediaStreamSource(_this.mediaStream);
            _this.audioNode = _this.audioContext.createScriptProcessor(_this.config.bufferSize, 1, 1);
            _this.audioInput.connect(_this.audioNode);
            _this.audioNode.onaudioprocess = _this.onAudioDataAvailable;
            _this.audioNode.connect(_this.audioContext.createMediaStreamDestination());
            _this.audioResampler = new speech_audio_resampler_1.default(_this.audioContext.sampleRate, _this.config.sampleRate, true, true);
        };
        this.initiateAudio = function () {
            try {
                _this.config.bufferSize = _this.config.bufferSize || 1024;
                _this.initiateAudioWithSampleRate(16000);
            }
            catch (err) {
                try {
                    _this.config.bufferSize = 4096;
                    _this.initiateAudioWithSampleRate(48000);
                }
                catch (err) {
                    try {
                        _this.config.bufferSize = 4096;
                        _this.initiateAudioWithSampleRate(44100);
                    }
                    catch (err) {
                        console.log(err);
                        _this.reset();
                        return false;
                    }
                }
            }
            return true;
        };
        this.isMediaStreamActive = function () {
            if ("active" in _this.mediaStream) {
                if (!_this.mediaStream.active) {
                    // console.error("Please make sure MediaStream is active.");
                    return false;
                }
            }
            return true;
        };
        this.reset = function () {
            _this.setState("INACTIVE");
            _this.state = "INACTIVE";
            _this.blob = new Blob();
            _this.audioContext = {};
            if (_this.audioNode) {
                _this.audioNode.onaudioprocess = null;
                try {
                    _this.audioNode.disconnect();
                }
                catch (err) {
                    // console.error(err);
                }
                _this.audioNode = {};
            }
            if (_this.audioInput) {
                try {
                    _this.audioInput.disconnect();
                }
                catch (err) {
                    // console.error(err);
                }
                _this.audioInput = {};
            }
            _this.audioProcessStatus = false;
            _this.audioContext = {};
            _this.timeSlicedAudioBuffer = {
                length: 0,
                bufferArray: [],
            };
            _this.completeAudioBuffer = {
                length: 0,
                bufferArray: [],
            };
            _this.audioResampler = null;
        };
        this.getTracks = function (mediaStream) {
            if (!mediaStream || !mediaStream.getTracks) {
                return [];
            }
            return mediaStream.getTracks().filter(function (track) { return track.kind === "audio"; });
        };
        this.startRecording = function () {
            _this.reset();
            if (_this.isMediaStreamActive()) {
                _this.setState("RECORDING");
                return _this.initiateAudio();
            }
            else
                return false;
        };
        this.pauseRecording = function () {
            if (_this.state === "PAUSED")
                return;
            _this.setState("PAUSED");
        };
        this.resumeRecording = function () {
            _this.isMediaStreamActive();
            if (_this.state !== "PAUSED")
                return;
            _this.setState("RECORDING");
        };
        this.stopRecording = function (callback) {
            callback = callback || (function () { });
            if (_this.state === "PAUSED") {
                _this.resumeRecording();
                setTimeout(function () {
                    _this.stopRecording(callback);
                }, 1);
                return;
            }
            _this.setState("STOPPED");
            if (callback) {
                var url = void 0;
                try {
                    url = URL.createObjectURL(_this.blob);
                }
                catch (e) { }
                if (typeof callback.call === "function") {
                    callback.call(_this, url);
                }
                else {
                    callback(url);
                }
            }
            _this.reset();
        };
        this.destroy = function () {
            _this.reset();
            _this.mediaStream = {};
            _this.setState("DESTROYED");
        };
        this.getBlob = function () {
            if (!_this.blob)
                return new Blob();
            return _this.blob;
        };
        this.getURL = function () {
            if (!_this.blob)
                return;
            return URL.createObjectURL(_this.blob);
        };
        this.getState = function () {
            return _this.state;
        };
        this.config = config;
        this.mediaStream = mediaStream;
        this.state = "INACTIVE";
        this.enableCompatibility();
    }
    return AudioStreamer;
}());
exports["default"] = AudioStreamer;


/***/ }),

/***/ "./src/libs/speech-audio-resampler/SpeechAudioResampler.ts":
/*!*****************************************************************!*\
  !*** ./src/libs/speech-audio-resampler/SpeechAudioResampler.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var filters_1 = __webpack_require__(/*! ./filters */ "./src/libs/speech-audio-resampler/filters/index.ts");
var AudioResampler = /** @class */ (function () {
    /**
     * Initialize a AudioResampler instance so that configurations need not to be applied before every chunk.
     *
     * @param {SampleRate} oldSampleRate Input sample rate for the audio buffer
     * @param {SampleRate} newSampleRate Target sample rate for the audio buffer
     * @param {boolean} liveAudio Set whether the audio is live (multiple sequential chunks) or a single audio buffer.
     * @param {boolean} antiAlias Set whether to enable or disable Anti-aliasing filters. Recommended for downsampling, disabled by default for upsampling.
     * @returns {AudioResampler}
     */
    function AudioResampler(oldSampleRate, newSampleRate, liveAudio, antiAlias) {
        var _this = this;
        this.antiAlias = true;
        this.isFirstFrame = true;
        this.filterBuffer = new Float32Array();
        /**
         * Lanczos resampling
         * https://en.wikipedia.org/wiki/Lanczos_resampling
         *
         * @private
         * @param {number} a
         * @param {number} t
         * @returns {number}
         */
        this.lanczosWindow = function (a, t) {
            if (t === 0)
                return 1;
            if (t >= a || t <= -a)
                return 0;
            var p = Math.PI * t;
            return (a * Math.sin(p) * Math.sin(p / a)) / (p * p);
        };
        /**
         * Downsampling with Anti-Aliasing
         *
         * @private
         * @param {Float32Array} buffer
         * @returns {Float32Array}
         */
        this.antiAliasDownsample = function (buffer) {
            var filter = [];
            if (_this.decimationFactor === 3) {
                filter = filters_1.LP_3_TO_1_FIR;
            }
            else if (_this.decimationFactor === 2) {
                filter = filters_1.LP_2_TO_1_FIR;
            }
            else if (_this.decimationFactor === 2.75625) {
                filter = filters_1.LP_275_TO_100_FIR;
            }
            else {
                throw new Error(_this.oldSampleRate + " kHz is not an expected input sampling frequency for conversion into " + _this.newSampleRate + " kHz");
            }
            var nSamplesForNextFrame; //number of samples set aside for the next frame
            var nSamplesCurrentFrame; //number of samples taken for the current frame
            var workBuffer; //working buffer for the current chunk
            if (_this.isFirstFrame) {
                nSamplesForNextFrame = Math.floor(buffer.length % _this.decimationFactor); //number of samples saved for the next frame
                nSamplesCurrentFrame = buffer.length - nSamplesForNextFrame; //number of samples selected for the current frame
                if (nSamplesForNextFrame === 0) {
                    workBuffer = buffer;
                }
                else {
                    workBuffer = buffer.slice(0, nSamplesCurrentFrame);
                }
            }
            else {
                nSamplesForNextFrame = Math.floor((buffer.length + _this.filterBuffer.length - filter.length) % _this.decimationFactor); // Avoid temporal shift
                nSamplesCurrentFrame = buffer.length + _this.filterBuffer.length - filter.length - nSamplesForNextFrame;
                workBuffer = new Float32Array(_this.filterBuffer.length + nSamplesCurrentFrame);
                workBuffer.set(_this.filterBuffer);
                workBuffer.set(buffer.slice(0, nSamplesCurrentFrame), _this.filterBuffer.length);
            }
            // Apply filtering and decimation / interpolation
            var outBufferLength = Math.floor(nSamplesCurrentFrame / _this.decimationFactor);
            var outBuffer = new Float32Array(outBufferLength);
            // decimationFactor is an integer (3)
            if (_this.decimationFactor === 3 || _this.decimationFactor === 2) {
                for (var i = filter.length; i < workBuffer.length; i += _this.decimationFactor) {
                    // Low Pass filtering
                    var acc = 0;
                    for (var k = 0; k < filter.length; k++) {
                        acc += workBuffer[i - k] * filter[k];
                    }
                    // Handle clipping and short formatting
                    var formattedValue = Math.max(Math.min(acc, 1), -1);
                    // Decimation
                    outBuffer[(i - filter.length) / _this.decimationFactor] = formattedValue;
                }
            }
            else if (_this.decimationFactor === 2.75625) {
                // 44100 kHz : decimationFactor is not an integer (~2.75)
                // Low Pass filtering
                var LP_SIGNAL = [];
                for (var i = filter.length; i < workBuffer.length; i++) {
                    var acc = 0;
                    for (var k = 0; k < filter.length; k++) {
                        acc += workBuffer[i - k] * filter[k];
                    }
                    LP_SIGNAL[i - filter.length] = acc;
                }
                // Decimation / interpolation
                for (var n = 0; n < outBufferLength; n++) {
                    var a = 3; // Lanczos window type 3
                    var x = n * _this.decimationFactor;
                    var start = Math.floor(x) - a + 1;
                    var end = Math.floor(x) + a;
                    var acc = 0;
                    for (var i = start; i <= end; i++) {
                        var s = void 0;
                        if (i < 0)
                            s = LP_SIGNAL[0];
                        else if (i >= LP_SIGNAL.length)
                            s = LP_SIGNAL[LP_SIGNAL.length - 1];
                        else
                            s = LP_SIGNAL[i];
                        acc += s * _this.lanczosWindow(a, x - i);
                    }
                    // Handle clipping and short formatting
                    outBuffer[n] = Math.max(Math.min(acc, 1), -1);
                }
            }
            // Update filterBuffer with the last samples of current frame
            if (_this.isFirstFrame) {
                _this.filterBuffer = buffer.slice(nSamplesCurrentFrame - filter.length - _this.filterBuffer.length);
            }
            else {
                _this.filterBuffer = buffer.slice(nSamplesCurrentFrame - filter.length - (_this.filterBuffer.length - filter.length));
            }
            // First frame already handled
            _this.isFirstFrame = false; // will be re-initialized when listening is done (allowing next records)
            return outBuffer;
        };
        /**
         * Upsampling
         *
         * @private
         * @param {Float32Array} buffer
         * @returns {Float32Array}
         */
        this.upsample = function (buffer) {
            return buffer;
        };
        /**
         * Downsampling without Anti-Aliasing
         *
         * @private
         * @param {Float32Array} buffer
         * @returns {Float32Array}
         */
        this.downsample = function (buffer) {
            return buffer;
        };
        /**
         * Resampling with applied config.
         * Determines whether to downsample or upsample using `oldSampleRate` and `newSampleRate` values.
         * @public
         * @param {Float32Array} buffer
         * @returns {Float32Array}
         */
        this.resample = function (buffer) {
            if (_this.decimationFactor === 1) {
                return buffer;
            }
            else if (_this.decimationFactor > 1) {
                if (_this.antiAlias) {
                    return _this.antiAliasDownsample(buffer);
                }
                else {
                    return _this.downsample(buffer);
                }
            }
            else {
                return _this.upsample(buffer);
            }
        };
        /**
         * Encodes audio buffers as WAVE Format.
         *
         * @public
         * @param {Float32Array} buffer
         * @returns {DataView}
         */
        this.encodeAsWav = function (buffer) {
            return new DataView(new ArrayBuffer(buffer.length));
        };
        this.oldSampleRate = oldSampleRate;
        this.newSampleRate = newSampleRate;
        // @ts-ignore
        this.antiAlias = oldSampleRate > newSampleRate ? antiAlias : false;
        this.decimationFactor = oldSampleRate / newSampleRate;
        this.liveAudio = liveAudio;
    }
    return AudioResampler;
}());
exports["default"] = AudioResampler;


/***/ }),

/***/ "./src/libs/speech-audio-resampler/filters/LP_275_TO_100_FIR.ts":
/*!**********************************************************************!*\
  !*** ./src/libs/speech-audio-resampler/filters/LP_275_TO_100_FIR.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @author Stephane PEILLON
 * @description 2.75:1 Low Pass FIR for Downsampling Antialisaing.
 * Works for any 2.75x kHz to x kHz downsampling.
 * ( QMF FIR filter with cut-off frequency (@ -3 dB) at about 0.913 times target fs/2 - 198 taps )
 * @example Convert 44100 Hz to 16000 Hz, or 22050 Hz to 8000 Hz.
 **/
var filter = [
    -5.0442670678931389e-6, 5.7387402475946118e-6, 1.6111955556881562e-5, 1.0560179594562795e-5, -1.242816862904201e-5, -3.0844307043286112e-5, -1.8160396924882423e-5, 2.303124169528074e-5,
    5.2166127028948343e-5, 2.8060268867465088e-5, -3.8960852158706798e-5, -8.1742452780124758e-5, -4.0375430619853529e-5, 6.1937527629495596e-5, 0.00012143092661620545, 5.5083199655424166e-5,
    -9.4018915834788832e-5, -0.00017326981522755043, -7.1980690559262061e-5, 0.00013762742186917889, 0.00023946132645647525, 9.0640305456980252e-5, -0.00019557611633250834, -0.00032235115028269961,
    -0.00011036322783022617, 0.00027109356679312489, 0.00042440564349633953, 0.00013013140955365376, -0.00036784896615780913, -0.00054818864384810245, -0.00014855826094166272, 0.00048997989469673812,
    0.00069634056098547199, 0.00016383778624615643, -0.00064212634080516417, -0.00087156318803636578, -0.00017369118859371453, 0.00082947634944882101, 0.0010766146787146871, 0.00017530890385814463,
    -0.0010578310750603923, -0.001314320458073489, -0.00016528446487115559, 0.0013337004262191077, 0.0015876076783199174, 0.00013953430808441101, -0.0016644454627712116, -0.0018995735273800139,
    -9.3194220249958316e-5, 0.0020584911853959329, 0.0022536018141979036, 2.0477911370491685e-5, -0.0025256449668619525, -0.0026535487754524955, 8.5524983764739568e-5, 0.0030775744811722015,
    0.0031040297261920998, -0.00023314744969763122, -0.0037285298083316772, -0.0036108562301133918, 0.000432598472497653, 0.0044964472481822506, 0.004181705019767344, -0.00069666854662353778,
    -0.0054046664894787377, -0.0048271571073186699, 0.0010418556659416306, 0.0064846675196077869, 0.0055623536874255799, -0.0014902159613265254, -0.0077805739864079248, -0.0064097301786953595,
    0.0020725170108587278, 0.0093568705461191341, 0.0074037416266333166, -0.0028338600976495301, -0.011312323822665827, -0.0085995125961405242, 0.003844300507349054, 0.013806774337071994,
    0.01008985372973804, -0.0052204603128626383, -0.01711716324115331, -0.012041967497539271, 0.0071740462453576109, 0.021768247992024713, 0.01478690833035584, -0.010136389804721707,
    -0.028887356248960279, -0.019078400739739057, 0.015146805312378952, 0.041410446665863104, 0.027068163980255515, -0.025512027260482153, -0.070112183787435889, -0.048296784335034211,
    0.060413687016046512, 0.21199607414538668, 0.32135326524472613, 0.32135326524472613, 0.21199607414538668, 0.060413687016046526, -0.048296784335034218, -0.070112183787435889, -0.025512027260482153,
    0.027068163980255515, 0.041410446665863104, 0.015146805312378952, -0.019078400739739057, -0.028887356248960279, -0.010136389804721703, 0.01478690833035584, 0.021768247992024713,
    0.0071740462453576109, -0.012041967497539271, -0.01711716324115331, -0.0052204603128626391, 0.010089853729738038, 0.013806774337071994, 0.0038443005073490553, -0.0085995125961405242,
    -0.011312323822665827, -0.0028338600976495314, 0.0074037416266333174, 0.0093568705461191341, 0.002072517010858727, -0.0064097301786953586, -0.0077805739864079248, -0.001490215961326526,
    0.0055623536874255773, 0.0064846675196077869, 0.0010418556659416256, -0.0048271571073186734, -0.0054046664894787386, -0.00069666854662353778, 0.0041817050197673448, 0.0044964472481822514,
    0.00043259847249765327, -0.0036108562301133918, -0.0037285298083316772, -0.00023314744969763149, 0.0031040297261921003, 0.0030775744811722011, 8.5524983764738972e-5, -0.002653548775452496,
    -0.0025256449668619521, 2.0477911370491641e-5, 0.002253601814197904, 0.0020584911853959329, -9.3194220249959088e-5, -0.0018995735273800139, -0.0016644454627712118, 0.00013953430808441038,
    0.0015876076783199174, 0.0013337004262191077, -0.00016528446487115559, -0.0013143204580734896, -0.0010578310750603925, 0.00017530890385814333, 0.0010766146787146878, 0.00082947634944881949,
    -0.00017369118859371463, -0.00087156318803637001, -0.0006421263408051633, 0.00016383778624615698, 0.00069634056098547155, 0.00048997989469673812, -0.00014855826094166245, -0.00054818864384810267,
    -0.00036784896615780924, 0.00013013140955365368, 0.00042440564349633964, 0.00027109356679312505, -0.00011036322783022619, -0.00032235115028269961, -0.00019557611633250842, 9.0640305456980171e-5,
    0.00023946132645647525, 0.00013762742186917883, -7.1980690559262075e-5, -0.00017326981522755049, -9.4018915834788859e-5, 5.5083199655424159e-5, 0.00012143092661620549, 6.1937527629495569e-5,
    -4.0375430619853522e-5, -8.1742452780124772e-5, -3.8960852158706805e-5, 2.8060268867465078e-5, 5.2166127028948336e-5, 2.303124169528077e-5, -1.8160396924882423e-5, -3.0844307043286126e-5,
    -1.2428168629042018e-5, 1.0560179594562806e-5, 1.6111955556881568e-5, 5.738740247594605e-6, -5.044267067893138e-6,
];
exports["default"] = filter;


/***/ }),

/***/ "./src/libs/speech-audio-resampler/filters/LP_2_TO_1_FIR.ts":
/*!******************************************************************!*\
  !*** ./src/libs/speech-audio-resampler/filters/LP_2_TO_1_FIR.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @author Stephane PEILLON
 * @description 2:1 Low Pass FIR for Downsampling Antialisaing.
 * Works for any 2x kHz to x kHz downsampling.
 * ( QMF FIR filter with cut-off frequency (@ -3 dB) at about 0.913 times target fs/2 - 128 taps )
 * @example Convert 32000 Hz to 16000 Hz, or 16000 Hz to 8000 Hz.
 **/
var filter = [
    -4.2497474320931446e-5, -7.4899380368940064e-6, 7.6742370023673843e-5, 3.4929609727331352e-5, -0.00011563797014395689, -8.6553660540754455e-5, 0.00015184478547763608, 0.00016826370708125125,
    -0.00017424311236561275, -0.00028335581896626579, 0.00016815955692767501, 0.00043080807879821337, -0.00011622746430718262, -0.00060361219315132047, -5.6101936690677562e-8, 0.0007873944828494481,
    0.00019809370940726629, -0.00095958925100759639, -0.00049138031893823783, 0.0010894138428463342, 0.00088632889495014223, -0.001138846648149974, -0.0013790164186980251, 0.0010647281325622776,
    0.00195219893944009, -0.00082199669233181348, -0.0025729707223632135, 0.00036794621011579951, 0.0031914254555566296, 0.00033273506379434851, -0.0037406120201169818, -0.0013024973982912267,
    0.0041379633854360933, 0.0025454675048766995, -0.0042882192044508115, -0.004042454566838524, 0.0040876682989506846, 0.0057468497803723068, -0.0034293142232978977, -0.0075817221113049773,
    0.0022083174797798183, 0.0094381820586277431, -0.00032677652641944702, -0.011174703627880742, -0.0023034799297992859, 0.012616466409116048, 0.0057620583442284327, -0.01355266662463005,
    -0.010128382423834806, 0.01372752306307555, 0.015503551485214345, -0.012815606853800995, -0.022059747389798601, 0.010358642910203887, 0.030154159926803484, -0.0055992356418973193,
    -0.040622750590953209, -0.0030099457016888489, 0.05570473588286607, 0.019627560047111154, -0.083111246388938978, -0.061615708678044702, 0.17256774481826809, 0.42441063945275687, 0.42441063945275687,
    0.17256774481826809, -0.061615708678044709, -0.083111246388938964, 0.019627560047111157, 0.055704735882866077, -0.0030099457016888485, -0.040622750590953209, -0.0055992356418973193,
    0.030154159926803491, 0.010358642910203886, -0.022059747389798594, -0.012815606853800995, 0.015503551485214345, 0.013727523063075548, -0.010128382423834806, -0.013552666624630054,
    0.0057620583442284318, 0.012616466409116048, -0.0023034799297992859, -0.011174703627880743, -0.00032677652641944691, 0.0094381820586277431, 0.0022083174797798179, -0.0075817221113049782,
    -0.0034293142232978972, 0.0057468497803723076, 0.0040876682989506846, -0.0040424545668385249, -0.0042882192044508107, 0.0025454675048766995, 0.0041379633854360933, -0.0013024973982912289,
    -0.003740612020116984, 0.00033273506379434867, 0.0031914254555566296, 0.00036794621011579967, -0.0025729707223632143, -0.0008219966923318137, 0.0019521989394400898, 0.0010647281325622778,
    -0.0013790164186980251, -0.001138846648149974, 0.00088632889495014169, 0.0010894138428463348, -0.00049138031893823772, -0.00095958925100759628, 0.00019809370940726618, 0.0007873944828494481,
    -5.6101936690724797e-8, -0.00060361219315132057, -0.00011622746430718256, 0.00043080807879821337, 0.00016815955692767509, -0.00028335581896626552, -0.00017424311236561275, 0.00016826370708125147,
    0.00015184478547763608, -8.65536605407544e-5, -0.00011563797014395689, 3.4929609727331305e-5, 7.6742370023673924e-5, -7.4899380368939861e-6, -4.2497474320931744e-5,
];
exports["default"] = filter;


/***/ }),

/***/ "./src/libs/speech-audio-resampler/filters/LP_3_TO_1_FIR.ts":
/*!******************************************************************!*\
  !*** ./src/libs/speech-audio-resampler/filters/LP_3_TO_1_FIR.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @author Stephane PEILLON
 * @description 3:1 Low Pass FIR for Downsampling Antialisaing.
 * Works for any 3x kHz to x kHz downsampling.
 * ( QMF FIR filter with cut-off frequency (@ -3 dB) at about 0.913 times target fs/2 - 180 taps )
 * @example Convert 48000 Hz to 16000 Hz, or 96000 Hz to 32000 Hz.
 **/
var filter = [
    -2.5033838264794034e-5, -3.6451561137378568e-5, -1.1489993827892933e-5, 3.9324378887465603e-5, 6.9984193520672766e-5, 3.7556691270439976e-5, -4.7696645534530499e-5, -0.00011379935461751734,
    -8.4009576971176187e-5, 4.2088177776074692e-5, 0.00016391587447478332, 0.00015508372993570357, -1.253765788919669e-5, -0.00021258262011091092, -0.00025240598961751948, -5.1874329668708116e-5,
    0.00024792300097682143, 0.00037351534477673157, 0.00016157590781788105, -0.00025410852391986031, -0.00051048686533259301, -0.00032461046175409392, 0.00021219136947965464, 0.00064888778256045612,
    0.00054444169352930365, -0.0001016639071691704, -0.0007673001147209819, -0.00081767209129386914, -9.7269698241155101e-5, 0.00083761858525280384, 0.0011319450250252222, 0.00040081933397990521,
    -0.0008262743020160207, -0.0014643282305934196, -0.00081833650450470333, 0.00069644717721537768, 0.0017804679224891051, 0.0013489288090360295, -0.00041122152287042, -0.0020347535966250413,
    -0.0019782994815083733, -6.2477942460992689e-5, 0.0021716438099647051, 0.0026761621389245617, 0.00074944268608934995, -0.0021281777588728801, -0.003394541347147186, -0.0016615884301227524,
    0.001837545335885159, 0.0040671707022465458, 0.0027936171643976352, -0.001233420727213658, -0.0046100353145374761, -0.0041193191532029718, 0.00025459137646049936, 0.00492286494534436,
    0.0055888057003698156, 0.0011507624257558831, -0.004891042781491068, -0.0071267634777626675, -0.0030219790398189408, 0.0043868863131564196, 0.008631467181982988, 0.0053851392366346717,
    -0.0032684060793252661, -0.0099736612552352843, -0.0082562565027453159, 0.0013719935383757782, 0.010993210336541666, 0.011651337116264694, 0.0015082475865128093, -0.011488721952090169,
    -0.015609515327517686, -0.0056715044416709888, 0.011188303272599716, 0.020245190585021479, 0.011637590928971467, -0.009667754909210324, -0.025878090076785515, -0.020500381603699786,
    0.0060989081377006418, 0.033428666116203716, 0.035134870175731782, 0.0017197396227647229, -0.046085580848361105, -0.066230781503150371, -0.023349941728869696, 0.082922132071591242,
    0.21069217442624302, 0.29738297113974183, 0.29738297113974188, 0.21069217442624305, 0.082922132071591242, -0.023349941728869693, -0.066230781503150371, -0.046085580848361105, 0.0017197396227647225,
    0.035134870175731782, 0.033428666116203716, 0.0060989081377006409, -0.020500381603699783, -0.025878090076785508, -0.0096677549092103257, 0.011637590928971469, 0.020245190585021472,
    0.011188303272599716, -0.0056715044416709897, -0.015609515327517682, -0.011488721952090169, 0.0015082475865128089, 0.011651337116264699, 0.010993210336541666, 0.0013719935383757782,
    -0.0082562565027453141, -0.0099736612552352825, -0.0032684060793252657, 0.0053851392366346699, 0.008631467181982988, 0.0043868863131564188, -0.0030219790398189413, -0.0071267634777626675,
    -0.0048910427814910715, 0.0011507624257558842, 0.005588805700369813, 0.00492286494534436, 0.00025459137646049936, -0.0041193191532029726, -0.0046100353145374752, -0.0012334207272136583,
    0.0027936171643976361, 0.0040671707022465458, 0.0018375453358851592, -0.0016615884301227509, -0.0033945413471471847, -0.0021281777588728797, 0.00074944268608935049, 0.0026761621389245612,
    0.0021716438099647056, -6.2477942460992527e-5, -0.0019782994815083729, -0.0020347535966250404, -0.00041122152287042, 0.0013489288090360292, 0.0017804679224891048, 0.00069644717721537768,
    -0.00081833650450470257, -0.00146432823059342, -0.0008262743020160207, 0.0004008193339799063, 0.0011319450250252222, 0.00083761858525280373, -9.7269698241154938e-5, -0.00081767209129386936,
    -0.00076730011472097832, -0.00010166390716916983, 0.00054444169352930332, 0.00064888778256045622, 0.00021219136947965461, -0.00032461046175409424, -0.00051048686533259301, -0.00025410852391986036,
    0.0001615759078178811, 0.00037351534477673152, 0.00024792300097682137, -5.1874329668708082e-5, -0.00025240598961751942, -0.00021258262011091095, -1.253765788919669e-5, 0.0001550837299357036,
    0.00016391587447478329, 4.2088177776074685e-5, -8.4009576971176228e-5, -0.00011379935461751733, -4.7696645534530512e-5, 3.7556691270440023e-5, 6.9984193520672793e-5, 3.9324378887465603e-5,
    -1.1489993827892933e-5, -3.6451561137378561e-5, -2.503383826479402e-5,
];
exports["default"] = filter;


/***/ }),

/***/ "./src/libs/speech-audio-resampler/filters/index.ts":
/*!**********************************************************!*\
  !*** ./src/libs/speech-audio-resampler/filters/index.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LP_3_TO_1_FIR = exports.LP_2_TO_1_FIR = exports.LP_275_TO_100_FIR = void 0;
var LP_275_TO_100_FIR_1 = __webpack_require__(/*! ./LP_275_TO_100_FIR */ "./src/libs/speech-audio-resampler/filters/LP_275_TO_100_FIR.ts");
Object.defineProperty(exports, "LP_275_TO_100_FIR", ({ enumerable: true, get: function () { return __importDefault(LP_275_TO_100_FIR_1).default; } }));
var LP_2_TO_1_FIR_1 = __webpack_require__(/*! ./LP_2_TO_1_FIR */ "./src/libs/speech-audio-resampler/filters/LP_2_TO_1_FIR.ts");
Object.defineProperty(exports, "LP_2_TO_1_FIR", ({ enumerable: true, get: function () { return __importDefault(LP_2_TO_1_FIR_1).default; } }));
var LP_3_TO_1_FIR_1 = __webpack_require__(/*! ./LP_3_TO_1_FIR */ "./src/libs/speech-audio-resampler/filters/LP_3_TO_1_FIR.ts");
Object.defineProperty(exports, "LP_3_TO_1_FIR", ({ enumerable: true, get: function () { return __importDefault(LP_3_TO_1_FIR_1).default; } }));


/***/ }),

/***/ "./src/libs/speech-audio-resampler/index.ts":
/*!**************************************************!*\
  !*** ./src/libs/speech-audio-resampler/index.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var SpeechAudioResampler_1 = __importDefault(__webpack_require__(/*! ./SpeechAudioResampler */ "./src/libs/speech-audio-resampler/SpeechAudioResampler.ts"));
__exportStar(__webpack_require__(/*! ./SpeechAudioResampler */ "./src/libs/speech-audio-resampler/SpeechAudioResampler.ts"), exports);
exports["default"] = SpeechAudioResampler_1.default;


/***/ }),

/***/ "./src/services/transcription/SofyaTranscriber.ts":
/*!********************************************************!*\
  !*** ./src/services/transcription/SofyaTranscriber.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SofyaTranscriber = void 0;
var TranscriptionServiceFactory_1 = __webpack_require__(/*! ./TranscriptionServiceFactory */ "./src/services/transcription/TranscriptionServiceFactory.ts");
var api_1 = __webpack_require__(/*! ../../api/api */ "./src/api/api.ts");
var EventEmitter_1 = __importDefault(__webpack_require__(/*! ../../shared/EventEmitter */ "./src/shared/EventEmitter.ts"));
var SofyaTranscriber = /** @class */ (function (_super) {
    __extends(SofyaTranscriber, _super);
    function SofyaTranscriber(connection) {
        var _this = _super.call(this) || this;
        _this.transcriptionService = null;
        _this.initializeTranscriptionService(connection);
        return _this;
    }
    SofyaTranscriber.prototype.startTranscription = function (mediaStream) {
        if (!this.transcriptionService) {
            throw new Error("Transcription Service Not Ready. Try again.");
        }
        this.transcriptionService.startTranscription(mediaStream);
    };
    SofyaTranscriber.prototype.stopTranscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.transcriptionService) {
                            throw new Error("Transcription Service Not Ready. Try again.");
                        }
                        return [4 /*yield*/, this.transcriptionService.stopTranscription()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SofyaTranscriber.prototype.pauseTranscription = function () {
        if (!this.transcriptionService) {
            throw new Error("Transcription Service Not Ready. Try again.");
        }
        this.transcriptionService.pauseTranscription();
    };
    SofyaTranscriber.prototype.resumeTranscription = function () {
        if (!this.transcriptionService) {
            throw new Error("Transcription Service Not Ready. Try again.");
        }
        this.transcriptionService.resumeTranscription();
    };
    SofyaTranscriber.prototype.initializeTranscriptionService = function (connection) {
        return __awaiter(this, void 0, void 0, function () {
            var endpointConfig, _a, endpointError_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!("apiKey" in connection)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getProvider(connection.apiKey, connection.config)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!("endpoint" in connection)) return [3 /*break*/, 6];
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        endpointConfig = __assign(__assign({}, connection.config), { endpoint: { endpoint: connection.endpoint } });
                        _a = this;
                        return [4 /*yield*/, TranscriptionServiceFactory_1.TranscriptionServiceFactory.create(connection.provider, endpointConfig)];
                    case 4:
                        _a.transcriptionService = _b.sent();
                        this.addTranscriptionListeners();
                        this.emit("ready");
                        return [2 /*return*/];
                    case 5:
                        endpointError_1 = _b.sent();
                        console.warn("Failed to connect to endpoint: ", endpointError_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SofyaTranscriber.prototype.getProvider = function (apiKey, config) {
        return __awaiter(this, void 0, void 0, function () {
            var providersInfo, providers, _i, providers_1, providerInfo, provider, additional_info, connected, _a, _b, endpoint, endpointConfig, _c, endpointError_2, providerConfig, _d, providerError_1, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 14, , 15]);
                        return [4 /*yield*/, this.authenticate(apiKey)];
                    case 1:
                        providersInfo = _e.sent();
                        providers = providersInfo.providers;
                        _i = 0, providers_1 = providers;
                        _e.label = 2;
                    case 2:
                        if (!(_i < providers_1.length)) return [3 /*break*/, 13];
                        providerInfo = providers_1[_i];
                        provider = providerInfo.provider, additional_info = providerInfo.additional_info;
                        if (!(additional_info.endpoints && additional_info.endpoints.length > 0)) return [3 /*break*/, 9];
                        connected = false;
                        _a = 0, _b = additional_info.endpoints;
                        _e.label = 3;
                    case 3:
                        if (!(_a < _b.length)) return [3 /*break*/, 8];
                        endpoint = _b[_a];
                        _e.label = 4;
                    case 4:
                        _e.trys.push([4, 6, , 7]);
                        endpointConfig = __assign(__assign(__assign({}, config), additional_info), { endpoint: endpoint });
                        _c = this;
                        return [4 /*yield*/, TranscriptionServiceFactory_1.TranscriptionServiceFactory.create(provider, endpointConfig)];
                    case 5:
                        _c.transcriptionService =
                            _e.sent();
                        this.addTranscriptionListeners();
                        connected = true;
                        this.emit("ready");
                        return [2 /*return*/];
                    case 6:
                        endpointError_2 = _e.sent();
                        console.warn("Failed to connect to endpoint: ", endpointError_2);
                        return [3 /*break*/, 7];
                    case 7:
                        _a++;
                        return [3 /*break*/, 3];
                    case 8:
                        // If no endpoints succeed, move to the next provider
                        if (!connected) {
                            return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 12];
                    case 9:
                        _e.trys.push([9, 11, , 12]);
                        providerConfig = __assign(__assign({}, config), additional_info);
                        _d = this;
                        return [4 /*yield*/, TranscriptionServiceFactory_1.TranscriptionServiceFactory.create(provider, providerConfig)];
                    case 10:
                        _d.transcriptionService =
                            _e.sent();
                        this.addTranscriptionListeners();
                        this.emit("ready");
                        return [2 /*return*/];
                    case 11:
                        providerError_1 = _e.sent();
                        console.warn("Failed to initialize provider: ", providerError_1);
                        return [3 /*break*/, 12];
                    case 12:
                        _i++;
                        return [3 /*break*/, 2];
                    case 13: throw new Error("Failed to connect to any provider.");
                    case 14:
                        error_1 = _e.sent();
                        console.error("Error during initialization:", error_1);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    SofyaTranscriber.prototype.addTranscriptionListeners = function () {
        var _this = this;
        if (this.transcriptionService) {
            // @ts-ignore
            this.transcriptionService.on("recognizing", function (text) {
                _this.emit("recognizing", text);
            });
            // @ts-ignore
            this.transcriptionService.on("recognized", function (text) {
                _this.emit("recognized", text);
            });
            // @ts-ignore
            this.transcriptionService.on("recognized_diarization", function (diarization) {
                _this.emit("recognized_diarization", diarization);
            });
            // @ts-ignore
            this.transcriptionService.on("error", function (error) {
                _this.emit("error", error);
            });
            // @ts-ignore
            this.transcriptionService.on("stopped", function () {
                _this.emit("stopped");
            });
            // @ts-ignore
            this.transcriptionService.on("connected", function () {
                _this.emit("connected");
            });
        }
    };
    SofyaTranscriber.prototype.authenticate = function (apiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var authData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, api_1.authService)(apiKey)];
                    case 1:
                        authData = _b.sent();
                        if ((authData === null || authData === void 0 ? void 0 : authData.providers) && Array.isArray(authData.providers)) {
                            return [2 /*return*/, authData];
                        }
                        throw new Error("Invalid authentication data format.");
                    case 2:
                        _a = _b.sent();
                        throw new Error("Could not authenticate. Validate your apiKey");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SofyaTranscriber;
}(EventEmitter_1.default));
exports.SofyaTranscriber = SofyaTranscriber;


/***/ }),

/***/ "./src/services/transcription/TranscriptionServiceFactory.ts":
/*!*******************************************************************!*\
  !*** ./src/services/transcription/TranscriptionServiceFactory.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranscriptionServiceFactory = void 0;
var OracleTranscriptionAdapter_1 = __webpack_require__(/*! ./adapters/OracleTranscriptionAdapter */ "./src/services/transcription/adapters/OracleTranscriptionAdapter.ts");
var WhisperTranscriptionAdapter_1 = __webpack_require__(/*! ./adapters/WhisperTranscriptionAdapter */ "./src/services/transcription/adapters/WhisperTranscriptionAdapter.ts");
// import { WhisperVadTranscriptionAdapter } from "./adapters/WhisperVadTranscriptionAdapter";
var languageSelector = function (language) {
    switch (language) {
        case "pt-BR":
            return "portuguese";
        case "en-US":
            return "english";
        case "es-ES":
            return "spanish";
        default:
            return "multilingual";
    }
};
var TranscriptionServiceFactory = /** @class */ (function () {
    function TranscriptionServiceFactory() {
    }
    TranscriptionServiceFactory.create = function (provider, config) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, url, ws;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = provider;
                        switch (_a) {
                            case "sofya_compliance": return [3 /*break*/, 1];
                            case "oracle": return [3 /*break*/, 1];
                            case "sofya_as_service": return [3 /*break*/, 2];
                            case "stt_wvad": return [3 /*break*/, 2];
                            case "sofya_whisper_flow": return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [2 /*return*/, new OracleTranscriptionAdapter_1.OracleTranscriptionAdapter(config)];
                    case 2:
                        if (!config.endpoint.endpoint) return [3 /*break*/, 4];
                        url = new URL(config.endpoint.endpoint);
                        if (config.language) {
                            url.searchParams.set("transcription_language", languageSelector(config.language));
                        }
                        if (config.translation_lang) {
                            url.searchParams.set("translation_language", languageSelector(config.translation_lang));
                        }
                        return [4 /*yield*/, this.connectToWebSocket(url.toString())];
                    case 3:
                        ws = _b.sent();
                        // if (provider === "stt_wvad") {
                        return [2 /*return*/, new WhisperTranscriptionAdapter_1.WhisperTranscriptionAdapter(__assign(__assign({}, config), { ws: ws }))];
                    case 4: throw new Error("Endpoint missing for Whisper provider.");
                    case 5: throw new Error("Provider não suportado");
                }
            });
        });
    };
    TranscriptionServiceFactory.connectToWebSocket = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var ws = new WebSocket(endpoint);
                        ws.onopen = function () { return resolve(ws); };
                        ws.onerror = function (error) {
                            return reject(new Error("WebSocket connection failed: ".concat(endpoint)));
                        };
                    })];
            });
        });
    };
    return TranscriptionServiceFactory;
}());
exports.TranscriptionServiceFactory = TranscriptionServiceFactory;


/***/ }),

/***/ "./src/services/transcription/adapters/OracleTranscriptionAdapter.ts":
/*!***************************************************************************!*\
  !*** ./src/services/transcription/adapters/OracleTranscriptionAdapter.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OracleTranscriptionAdapter = void 0;
var oci_aispeech_realtime_web_1 = __webpack_require__(/*! ../../../libs/oci-aispeech-realtime-web */ "./src/libs/oci-aispeech-realtime-web/index.ts");
var oci_aispeech_realtime_web_2 = __webpack_require__(/*! ../../../libs/oci-aispeech-realtime-web */ "./src/libs/oci-aispeech-realtime-web/index.ts");
var oci_aispeech_realtime_web_3 = __webpack_require__(/*! ../../../libs/oci-aispeech-realtime-web */ "./src/libs/oci-aispeech-realtime-web/index.ts");
var EventEmitter_1 = __importDefault(__webpack_require__(/*! ../../../shared/EventEmitter */ "./src/shared/EventEmitter.ts"));
var OracleTranscriptionAdapter = /** @class */ (function (_super) {
    __extends(OracleTranscriptionAdapter, _super);
    function OracleTranscriptionAdapter(config) {
        var _this = _super.call(this) || this;
        _this.mediaStream = null;
        _this.recognizer = null;
        _this.token = config.token;
        _this.compartmentId = config.compartmentId;
        _this.region = config.region;
        _this.language = config.language;
        return _this;
    }
    OracleTranscriptionAdapter.prototype.startTranscription = function (mediaStream) {
        var _this = this;
        if (!mediaStream) {
            throw new Error("No mediaStream was received.");
        }
        this.mediaStream = mediaStream;
        var serviceRegion = this.region;
        var realtimeParameters = {
            languageCode: this.language,
            modelDomain: oci_aispeech_realtime_web_2.RealtimeParametersModelDomainEnum.GENERIC,
            stabilizePartialResults: oci_aispeech_realtime_web_3.RealtimeParametersStabilizePartialResultsEnum.NONE,
            partialSilenceThresholdInMs: 0,
            finalSilenceThresholdInMs: 1000,
            shouldIgnoreInvalidCustomizations: false,
            encoding: "audio/raw;rate=16000",
        };
        var realtimeEventListener = {
            onResult: function (resultMessage) {
                var transcription = resultMessage.transcriptions[0];
                if (transcription.isFinal) {
                    _this.emit("recognized", transcription.transcription);
                }
                else {
                    _this.emit("recognizing", transcription.transcription);
                }
            },
            onError: function (error) {
                _this.emit("error", error);
            },
            onClose: function () {
                _this.emit("stopped");
            },
            onConnect: function () {
                _this.emit("connected");
            },
        };
        this.recognizer = new oci_aispeech_realtime_web_1.AIServiceSpeechRealtimeApi(
        //@ts-ignore
        realtimeEventListener, this.token, this.compartmentId, this.mediaStream, "wss://realtime.aiservice.".concat(serviceRegion, ".oci.oraclecloud.com/ws/transcribe/stream"), realtimeParameters);
        this.recognizer.connect();
    };
    OracleTranscriptionAdapter.prototype.pauseTranscription = function () {
        var _a;
        (_a = this.recognizer) === null || _a === void 0 ? void 0 : _a.pause();
    };
    OracleTranscriptionAdapter.prototype.resumeTranscription = function () {
        var _a;
        (_a = this.recognizer) === null || _a === void 0 ? void 0 : _a.resume();
    };
    OracleTranscriptionAdapter.prototype.stopTranscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.recognizer) {
                    this.recognizer.close();
                    this.emit("stopped");
                }
                return [2 /*return*/];
            });
        });
    };
    return OracleTranscriptionAdapter;
}(EventEmitter_1.default));
exports.OracleTranscriptionAdapter = OracleTranscriptionAdapter;


/***/ }),

/***/ "./src/services/transcription/adapters/WhisperTranscriptionAdapter.ts":
/*!****************************************************************************!*\
  !*** ./src/services/transcription/adapters/WhisperTranscriptionAdapter.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WhisperTranscriptionAdapter = void 0;
var eventemitter3_1 = __importDefault(__webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js"));
var WhisperTranscriptionAdapter = /** @class */ (function (_super) {
    __extends(WhisperTranscriptionAdapter, _super);
    function WhisperTranscriptionAdapter(config) {
        var _this = _super.call(this) || this;
        _this.websocket = null;
        _this.audioContext = null;
        _this.mediaStream = null;
        _this.recordState = "PAUSED";
        _this.websocketState = WebSocket.CLOSED;
        _this.recordingNode = undefined;
        _this.postMessage = function (sampleData) {
            var _a;
            var outputSampleRate = 16000;
            var decreaseResultBuffer = _this.decreaseSampleRate(sampleData, 44100, outputSampleRate);
            var audioData = _this.convertFloat32ToInt16(decreaseResultBuffer);
            if (_this.websocket && ((_a = _this.websocket) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
                _this.websocket.send(audioData);
            }
        };
        _this.connectWebsocketHandler = function (ws) {
            var _a;
            if (_this.websocket && ((_a = _this.websocket) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
                _this.websocketState = WebSocket.OPEN;
                // this.sendAudioConfig(this.config?.language);
                _this.websocket.onclose = function (event) {
                    console.log("WebSocket connection closed", event);
                };
                _this.websocket.onmessage = function (event) {
                    var _a, _b, _c, _d, _e;
                    var transcript_data = JSON.parse(event.data);
                    if (!transcript_data.is_partial && ((_a = transcript_data === null || transcript_data === void 0 ? void 0 : transcript_data.data) === null || _a === void 0 ? void 0 : _a.text)) {
                        _this.emit("recognized", (_b = transcript_data === null || transcript_data === void 0 ? void 0 : transcript_data.data) === null || _b === void 0 ? void 0 : _b.text);
                        _this.tempPartialTranscription = undefined;
                    }
                    if (!transcript_data.is_partial && ((_c = transcript_data === null || transcript_data === void 0 ? void 0 : transcript_data.data) === null || _c === void 0 ? void 0 : _c.speakers)) {
                        _this.emit("recognized_diarization", (_d = transcript_data === null || transcript_data === void 0 ? void 0 : transcript_data.data) === null || _d === void 0 ? void 0 : _d.speakers);
                    }
                    if (transcript_data.is_partial && ((_e = transcript_data === null || transcript_data === void 0 ? void 0 : transcript_data.data) === null || _e === void 0 ? void 0 : _e.text)) {
                        _this.tempPartialTranscription = transcript_data.data.text;
                        _this.emit("recognizing", transcript_data.data.text);
                    }
                };
            }
        };
        _this.languageSelector = function (language) {
            switch (language) {
                case "pt-BR":
                    return "portuguese";
                case "en-US":
                    return "english";
                case "es-ES":
                    return "spanish";
                default:
                    return "multilingual";
            }
        };
        _this.sendAudioConfig = function (language) {
            var _a;
            if (language === void 0) { language = "multilingual"; }
            var processingArgs = {};
            var chunk_length_seconds = "3";
            var chunk_offset_seconds = "0.1";
            var selectedStrategy = "silence_at_end_of_chunk";
            if (selectedStrategy === "silence_at_end_of_chunk") {
                processingArgs = {
                    chunk_length_seconds: parseFloat(chunk_length_seconds),
                    chunk_offset_seconds: parseFloat(chunk_offset_seconds),
                };
            }
            var audioConfig = {
                type: "config",
                data: {
                    sampleRate: 44100,
                    channels: 1,
                    language: _this.languageSelector(language),
                    processing_strategy: selectedStrategy,
                    processing_args: processingArgs,
                },
            };
            if (_this.websocket && ((_a = _this.websocket) === null || _a === void 0 ? void 0 : _a.readyState) === WebSocket.OPEN) {
                _this.websocket.send(JSON.stringify(audioConfig));
            }
        };
        _this.config = config;
        _this.websocket = config.ws;
        _this.connectWebsocketHandler(config.ws);
        _this.audioContext = new AudioContext({ sampleRate: 44100 });
        return _this;
    }
    WhisperTranscriptionAdapter.prototype.startTranscription = function (mediaStream) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_1;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!navigator.mediaDevices.getUserMedia) {
                            throw new Error("getUserMedia not supported on your browser!");
                        }
                        this.mediaStream = mediaStream;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        this.input = (_b = this.audioContext) === null || _b === void 0 ? void 0 : _b.createMediaStreamSource(this.mediaStream);
                        _a = this;
                        return [4 /*yield*/, this.setupRecordingWorkletNode()];
                    case 2:
                        _a.recordingNode = _c.sent();
                        this.recordingNode.port.onmessage = function (event) {
                            if (_this.recordState !== "PAUSED") {
                                _this.postMessage(event.data);
                            }
                        };
                        if (this.input) {
                            this.input.connect(this.recordingNode);
                            this.recordState = "RECORDING";
                        }
                        else {
                            console.error("Unable to createMediaStreamSource");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        console.error("Erro no onmessage: ", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WhisperTranscriptionAdapter.prototype.setupRecordingWorkletNode = function () {
        return __awaiter(this, void 0, void 0, function () {
            var workletCode, blob, workletURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workletCode = "\n        class RealtimeAudioProcessor extends AudioWorkletProcessor {\n          constructor(options) {\n          super();\n        }\n\n        process(inputs, outputs, params) {\n          // ASR and VAD models typically require a mono audio.\n          this.port.postMessage(inputs[0][0]);\n          return true;\n          }\n        }\n\n        registerProcessor('realtime-audio-processor', RealtimeAudioProcessor);\n  ";
                        blob = new Blob([workletCode], { type: "application/javascript" });
                        workletURL = URL.createObjectURL(blob);
                        return [4 /*yield*/, this.audioContext.audioWorklet.addModule(workletURL)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new AudioWorkletNode(this.audioContext, "realtime-audio-processor")];
                }
            });
        });
    };
    WhisperTranscriptionAdapter.prototype.decreaseSampleRate = function (buffer, inputSampleRate, outputSampleRate) {
        if (inputSampleRate < outputSampleRate) {
            console.error("Sample rate too small.");
            return;
        }
        else if (inputSampleRate === outputSampleRate) {
            return;
        }
        var sampleRateRatio = inputSampleRate / outputSampleRate;
        var newLength = Math.ceil(buffer.length / sampleRateRatio);
        var result = new Float32Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
            var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            var accum = 0, count = 0;
            for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }
            result[offsetResult] = accum / count;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    };
    WhisperTranscriptionAdapter.prototype.convertFloat32ToInt16 = function (buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7fff;
        }
        return buf.buffer;
    };
    WhisperTranscriptionAdapter.prototype.pauseTranscription = function () {
        this.recordState = "PAUSED";
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(JSON.stringify({ action: "finish" }));
        }
        if (this.input) {
            this.input.disconnect();
        }
    };
    WhisperTranscriptionAdapter.prototype.resumeTranscription = function () {
        if (this.input && this.recordingNode) {
            this.input.connect(this.recordingNode);
        }
        this.recordState = "RECORDING";
    };
    WhisperTranscriptionAdapter.prototype.stopTranscription = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mediaStream) {
                            this.mediaStream.getTracks().forEach(function (track) { return track.stop(); });
                        }
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var resolved = false;
                                var timeout = setTimeout(function () {
                                    var _a;
                                    if (!resolved) {
                                        resolved = true;
                                        if ((_a = _this.tempPartialTranscription) === null || _a === void 0 ? void 0 : _a.length) {
                                            _this.emit("recognized", _this.tempPartialTranscription);
                                        }
                                        cleanup();
                                        resolve();
                                    }
                                }, 5000);
                                var cleanup = function () {
                                    clearTimeout(timeout);
                                    if (_this.websocket) {
                                        _this.websocket.removeEventListener("message", onMessage);
                                    }
                                };
                                var onMessage = function (event) {
                                    try {
                                        var data = JSON.parse(event.data);
                                        if (!data.is_partial) {
                                            if (!resolved) {
                                                resolved = true;
                                                cleanup();
                                                resolve();
                                            }
                                        }
                                    }
                                    catch (e) {
                                        console.error("264: ", e);
                                    }
                                };
                                if (_this.websocket) {
                                    _this.websocket.addEventListener("message", onMessage);
                                    // Send finish action
                                    if (_this.websocket.readyState === WebSocket.OPEN) {
                                        _this.websocketState = WebSocket.CLOSING;
                                        _this.websocket.send(JSON.stringify({ action: "finish" }));
                                    }
                                }
                                else {
                                    cleanup();
                                    resolve();
                                }
                            })];
                    case 1:
                        _a.sent();
                        if (!this.audioContext) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.audioContext.close()];
                    case 2:
                        _a.sent();
                        this.audioContext = null;
                        _a.label = 3;
                    case 3:
                        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                            this.websocket.close();
                            this.websocketState = WebSocket.CLOSED;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return WhisperTranscriptionAdapter;
}(eventemitter3_1.default));
exports.WhisperTranscriptionAdapter = WhisperTranscriptionAdapter;


/***/ }),

/***/ "./src/shared/EventEmitter.ts":
/*!************************************!*\
  !*** ./src/shared/EventEmitter.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    };
    EventEmitter.prototype.emit = function (event, data) {
        var eventListeners = this.events[event];
        if (eventListeners) {
            eventListeners.forEach(function (callback) { return callback(data); });
        }
    };
    return EventEmitter;
}());
exports["default"] = EventEmitter;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MediaElementAudioCapture: () => (/* reexport safe */ _MediaElementAudioCapture__WEBPACK_IMPORTED_MODULE_0__.MediaElementAudioCapture),
/* harmony export */   SofyaTranscriber: () => (/* reexport safe */ _services_transcription_SofyaTranscriber__WEBPACK_IMPORTED_MODULE_1__.SofyaTranscriber)
/* harmony export */ });
/* harmony import */ var _MediaElementAudioCapture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MediaElementAudioCapture */ "./src/MediaElementAudioCapture.js");
/* harmony import */ var _services_transcription_SofyaTranscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/transcription/SofyaTranscriber */ "./src/services/transcription/SofyaTranscriber.ts");
/* harmony import */ var _services_transcription_SofyaTranscriber__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_services_transcription_SofyaTranscriber__WEBPACK_IMPORTED_MODULE_1__);





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=bundle.js.map