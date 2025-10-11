
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.8.4";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = parse3;
    exports.serialize = serialize;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parse3(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = str.indexOf("=", index);
        if (eqIdx === -1)
          break;
        const colonIdx = str.indexOf(";", index);
        const endIdx = colonIdx === -1 ? len : colonIdx;
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const keyStartIdx = startIndex(str, index, eqIdx);
        const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
        const key = str.slice(keyStartIdx, keyEndIdx);
        if (obj[key] === void 0) {
          let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
          let valEndIdx = endIndex(str, endIdx, valStartIdx);
          const value = dec(str.slice(valStartIdx, valEndIdx));
          obj[key] = value;
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function startIndex(str, index, max) {
      do {
        const code = str.charCodeAt(index);
        if (code !== 32 && code !== 9)
          return index;
      } while (++index < max);
      return max;
    }
    function endIndex(str, index, min) {
      while (index > min) {
        const code = str.charCodeAt(--index);
        if (code !== 32 && code !== 9)
          return index + 1;
      }
      return min;
    }
    function serialize(name, val, options) {
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`argument name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${val}`);
      }
      let str = name + "=" + value;
      if (!options)
        return str;
      if (options.maxAge !== void 0) {
        if (!Number.isInteger(options.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
        }
        str += "; Max-Age=" + options.maxAge;
      }
      if (options.domain) {
        if (!domainValueRegExp.test(options.domain)) {
          throw new TypeError(`option domain is invalid: ${options.domain}`);
        }
        str += "; Domain=" + options.domain;
      }
      if (options.path) {
        if (!pathValueRegExp.test(options.path)) {
          throw new TypeError(`option path is invalid: ${options.path}`);
        }
        str += "; Path=" + options.path;
      }
      if (options.expires) {
        if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${options.expires}`);
        }
        str += "; Expires=" + options.expires.toUTCString();
      }
      if (options.httpOnly) {
        str += "; HttpOnly";
      }
      if (options.secure) {
        str += "; Secure";
      }
      if (options.partitioned) {
        str += "; Partitioned";
      }
      if (options.priority) {
        const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${options.priority}`);
        }
      }
      if (options.sameSite) {
        const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
        }
      }
      return str;
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/logger.js
var init_logger2 = __esm({
  "node_modules/@opennextjs/aws/dist/logger.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger2();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge-runtime-webpack.js
var require_edge_runtime_webpack = __commonJS({
  ".next/server/edge-runtime-webpack.js"() {
    "use strict";
    (() => {
      "use strict";
      var e = {}, r = {};
      function t(o) {
        var n = r[o];
        if (void 0 !== n) return n.exports;
        var i = r[o] = { exports: {} }, l = true;
        try {
          e[o].call(i.exports, i, i.exports, t), l = false;
        } finally {
          l && delete r[o];
        }
        return i.exports;
      }
      t.m = e, t.amdO = {}, (() => {
        var e2 = [];
        t.O = (r2, o, n, i) => {
          if (o) {
            i = i || 0;
            for (var l = e2.length; l > 0 && e2[l - 1][2] > i; l--) e2[l] = e2[l - 1];
            e2[l] = [o, n, i];
            return;
          }
          for (var a = 1 / 0, l = 0; l < e2.length; l++) {
            for (var [o, n, i] = e2[l], u = true, f = 0; f < o.length; f++) a >= i && Object.keys(t.O).every((e3) => t.O[e3](o[f])) ? o.splice(f--, 1) : (u = false, i < a && (a = i));
            if (u) {
              e2.splice(l--, 1);
              var s = n();
              void 0 !== s && (r2 = s);
            }
          }
          return r2;
        };
      })(), t.n = (e2) => {
        var r2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return t.d(r2, { a: r2 }), r2;
      }, t.d = (e2, r2) => {
        for (var o in r2) t.o(r2, o) && !t.o(e2, o) && Object.defineProperty(e2, o, { enumerable: true, get: r2[o] });
      }, t.e = () => Promise.resolve(), t.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
          return this || Function("return this")();
        } catch (e2) {
          if ("object" == typeof window) return window;
        }
      }(), t.o = (e2, r2) => Object.prototype.hasOwnProperty.call(e2, r2), t.r = (e2) => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, (() => {
        var e2 = { 993: 0 };
        t.O.j = (r3) => 0 === e2[r3];
        var r2 = (r3, o2) => {
          var n, i, [l, a, u] = o2, f = 0;
          if (l.some((r4) => 0 !== e2[r4])) {
            for (n in a) t.o(a, n) && (t.m[n] = a[n]);
            if (u) var s = u(t);
          }
          for (r3 && r3(o2); f < l.length; f++) i = l[f], t.o(e2, i) && e2[i] && e2[i][0](), e2[i] = 0;
          return t.O(s);
        }, o = self.webpackChunk_N_E = self.webpackChunk_N_E || [];
        o.forEach(r2.bind(null, 0)), o.push = r2.bind(null, o.push.bind(o));
      })();
    })();
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/middleware.js
var require_middleware = __commonJS({
  ".next/server/middleware.js"() {
    "use strict";
    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[826], { 2067: (e) => {
      "use strict";
      e.exports = (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports));
    }, 6195: (e) => {
      "use strict";
      e.exports = (init_node_buffer(), __toCommonJS(node_buffer_exports));
    }, 3410: (e, t, r) => {
      "use strict";
      let i;
      r.r(t), r.d(t, { default: () => eq });
      var n, s, a, o, l, u, c, h, d, p, f, g, b = {};
      async function v() {
        let e2 = "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && (await _ENTRIES.middleware_instrumentation).register;
        if (e2) try {
          await e2();
        } catch (e3) {
          throw e3.message = `An error occurred while loading instrumentation hook: ${e3.message}`, e3;
        }
      }
      r.r(b), r.d(b, { config: () => eM, middleware: () => e$ });
      let w = null;
      function m() {
        return w || (w = v()), w;
      }
      function y(e2) {
        return `The edge runtime does not support Node.js '${e2}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== r.g.process && (process.env = r.g.process.env, r.g.process = process), Object.defineProperty(globalThis, "__import_unsupported", { value: function(e2) {
        let t2 = new Proxy(function() {
        }, { get(t3, r2) {
          if ("then" === r2) return {};
          throw Error(y(e2));
        }, construct() {
          throw Error(y(e2));
        }, apply(r2, i2, n2) {
          if ("function" == typeof n2[0]) return n2[0](t2);
          throw Error(y(e2));
        } });
        return new Proxy({}, { get: () => t2 });
      }, enumerable: false, configurable: false }), m();
      class _ extends Error {
        constructor({ page: e2 }) {
          super(`The middleware "${e2}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class S extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class k extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let O = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", api: "api", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", appMetadataRoute: "app-metadata-route", appRouteHandler: "app-route-handler" };
      function E(e2) {
        var t2, r2, i2, n2, s2, a2 = [], o2 = 0;
        function l2() {
          for (; o2 < e2.length && /\s/.test(e2.charAt(o2)); ) o2 += 1;
          return o2 < e2.length;
        }
        for (; o2 < e2.length; ) {
          for (t2 = o2, s2 = false; l2(); ) if ("," === (r2 = e2.charAt(o2))) {
            for (i2 = o2, o2 += 1, l2(), n2 = o2; o2 < e2.length && "=" !== (r2 = e2.charAt(o2)) && ";" !== r2 && "," !== r2; ) o2 += 1;
            o2 < e2.length && "=" === e2.charAt(o2) ? (s2 = true, o2 = n2, a2.push(e2.substring(t2, i2)), t2 = o2) : o2 = i2 + 1;
          } else o2 += 1;
          (!s2 || o2 >= e2.length) && a2.push(e2.substring(t2, e2.length));
        }
        return a2;
      }
      function T(e2) {
        let t2 = {}, r2 = [];
        if (e2) for (let [i2, n2] of e2.entries()) "set-cookie" === i2.toLowerCase() ? (r2.push(...E(n2)), t2[i2] = 1 === r2.length ? r2[0] : r2) : t2[i2] = n2;
        return t2;
      }
      function x(e2) {
        try {
          return String(new URL(String(e2)));
        } catch (t2) {
          throw Error(`URL is malformed "${String(e2)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t2 });
        }
      }
      ({ ...O, GROUP: { serverOnly: [O.reactServerComponents, O.actionBrowser, O.appMetadataRoute, O.appRouteHandler, O.instrument], clientOnly: [O.serverSideRendering, O.appPagesBrowser], nonClientServerTarget: [O.middleware, O.api], app: [O.reactServerComponents, O.actionBrowser, O.appMetadataRoute, O.appRouteHandler, O.serverSideRendering, O.appPagesBrowser, O.shared, O.instrument] } });
      let C = Symbol("response"), P = Symbol("passThrough"), I = Symbol("waitUntil");
      class R {
        constructor(e2) {
          this[I] = [], this[P] = false;
        }
        respondWith(e2) {
          this[C] || (this[C] = Promise.resolve(e2));
        }
        passThroughOnException() {
          this[P] = true;
        }
        waitUntil(e2) {
          this[I].push(e2);
        }
      }
      class A extends R {
        constructor(e2) {
          super(e2.request), this.sourcePage = e2.page;
        }
        get request() {
          throw new _({ page: this.sourcePage });
        }
        respondWith() {
          throw new _({ page: this.sourcePage });
        }
      }
      function j(e2) {
        return e2.replace(/\/$/, "") || "/";
      }
      function N(e2) {
        let t2 = e2.indexOf("#"), r2 = e2.indexOf("?"), i2 = r2 > -1 && (t2 < 0 || r2 < t2);
        return i2 || t2 > -1 ? { pathname: e2.substring(0, i2 ? r2 : t2), query: i2 ? e2.substring(r2, t2 > -1 ? t2 : void 0) : "", hash: t2 > -1 ? e2.slice(t2) : "" } : { pathname: e2, query: "", hash: "" };
      }
      function L(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: i2, hash: n2 } = N(e2);
        return "" + t2 + r2 + i2 + n2;
      }
      function $(e2, t2) {
        if (!e2.startsWith("/") || !t2) return e2;
        let { pathname: r2, query: i2, hash: n2 } = N(e2);
        return "" + r2 + t2 + i2 + n2;
      }
      function M(e2, t2) {
        if ("string" != typeof e2) return false;
        let { pathname: r2 } = N(e2);
        return r2 === t2 || r2.startsWith(t2 + "/");
      }
      function U(e2, t2) {
        let r2;
        let i2 = e2.split("/");
        return (t2 || []).some((t3) => !!i2[1] && i2[1].toLowerCase() === t3.toLowerCase() && (r2 = t3, i2.splice(1, 1), e2 = i2.join("/") || "/", true)), { pathname: e2, detectedLocale: r2 };
      }
      let D = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function B(e2, t2) {
        return new URL(String(e2).replace(D, "localhost"), t2 && String(t2).replace(D, "localhost"));
      }
      let q = Symbol("NextURLInternal");
      class V {
        constructor(e2, t2, r2) {
          let i2, n2;
          "object" == typeof t2 && "pathname" in t2 || "string" == typeof t2 ? (i2 = t2, n2 = r2 || {}) : n2 = r2 || t2 || {}, this[q] = { url: B(e2, i2 ?? n2.base), options: n2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e2, t2, r2, i2, n2;
          let s2 = function(e3, t3) {
            var r3, i3;
            let { basePath: n3, i18n: s3, trailingSlash: a3 } = null != (r3 = t3.nextConfig) ? r3 : {}, o3 = { pathname: e3, trailingSlash: "/" !== e3 ? e3.endsWith("/") : a3 };
            n3 && M(o3.pathname, n3) && (o3.pathname = function(e4, t4) {
              if (!M(e4, t4)) return e4;
              let r4 = e4.slice(t4.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(o3.pathname, n3), o3.basePath = n3);
            let l2 = o3.pathname;
            if (o3.pathname.startsWith("/_next/data/") && o3.pathname.endsWith(".json")) {
              let e4 = o3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/"), r4 = e4[0];
              o3.buildId = r4, l2 = "index" !== e4[1] ? "/" + e4.slice(1).join("/") : "/", true === t3.parseData && (o3.pathname = l2);
            }
            if (s3) {
              let e4 = t3.i18nProvider ? t3.i18nProvider.analyze(o3.pathname) : U(o3.pathname, s3.locales);
              o3.locale = e4.detectedLocale, o3.pathname = null != (i3 = e4.pathname) ? i3 : o3.pathname, !e4.detectedLocale && o3.buildId && (e4 = t3.i18nProvider ? t3.i18nProvider.analyze(l2) : U(l2, s3.locales)).detectedLocale && (o3.locale = e4.detectedLocale);
            }
            return o3;
          }(this[q].url.pathname, { nextConfig: this[q].options.nextConfig, parseData: true, i18nProvider: this[q].options.i18nProvider }), a2 = function(e3, t3) {
            let r3;
            if ((null == t3 ? void 0 : t3.host) && !Array.isArray(t3.host)) r3 = t3.host.toString().split(":", 1)[0];
            else {
              if (!e3.hostname) return;
              r3 = e3.hostname;
            }
            return r3.toLowerCase();
          }(this[q].url, this[q].options.headers);
          this[q].domainLocale = this[q].options.i18nProvider ? this[q].options.i18nProvider.detectDomainLocale(a2) : function(e3, t3, r3) {
            if (e3) for (let s3 of (r3 && (r3 = r3.toLowerCase()), e3)) {
              var i3, n3;
              if (t3 === (null == (i3 = s3.domain) ? void 0 : i3.split(":", 1)[0].toLowerCase()) || r3 === s3.defaultLocale.toLowerCase() || (null == (n3 = s3.locales) ? void 0 : n3.some((e4) => e4.toLowerCase() === r3))) return s3;
            }
          }(null == (t2 = this[q].options.nextConfig) ? void 0 : null == (e2 = t2.i18n) ? void 0 : e2.domains, a2);
          let o2 = (null == (r2 = this[q].domainLocale) ? void 0 : r2.defaultLocale) || (null == (n2 = this[q].options.nextConfig) ? void 0 : null == (i2 = n2.i18n) ? void 0 : i2.defaultLocale);
          this[q].url.pathname = s2.pathname, this[q].defaultLocale = o2, this[q].basePath = s2.basePath ?? "", this[q].buildId = s2.buildId, this[q].locale = s2.locale ?? o2, this[q].trailingSlash = s2.trailingSlash;
        }
        formatPathname() {
          var e2;
          let t2;
          return t2 = function(e3, t3, r2, i2) {
            if (!t3 || t3 === r2) return e3;
            let n2 = e3.toLowerCase();
            return !i2 && (M(n2, "/api") || M(n2, "/" + t3.toLowerCase())) ? e3 : L(e3, "/" + t3);
          }((e2 = { basePath: this[q].basePath, buildId: this[q].buildId, defaultLocale: this[q].options.forceLocale ? void 0 : this[q].defaultLocale, locale: this[q].locale, pathname: this[q].url.pathname, trailingSlash: this[q].trailingSlash }).pathname, e2.locale, e2.buildId ? void 0 : e2.defaultLocale, e2.ignorePrefix), (e2.buildId || !e2.trailingSlash) && (t2 = j(t2)), e2.buildId && (t2 = $(L(t2, "/_next/data/" + e2.buildId), "/" === e2.pathname ? "index.json" : ".json")), t2 = L(t2, e2.basePath), !e2.buildId && e2.trailingSlash ? t2.endsWith("/") ? t2 : $(t2, "/") : j(t2);
        }
        formatSearch() {
          return this[q].url.search;
        }
        get buildId() {
          return this[q].buildId;
        }
        set buildId(e2) {
          this[q].buildId = e2;
        }
        get locale() {
          return this[q].locale ?? "";
        }
        set locale(e2) {
          var t2, r2;
          if (!this[q].locale || !(null == (r2 = this[q].options.nextConfig) ? void 0 : null == (t2 = r2.i18n) ? void 0 : t2.locales.includes(e2))) throw TypeError(`The NextURL configuration includes no locale "${e2}"`);
          this[q].locale = e2;
        }
        get defaultLocale() {
          return this[q].defaultLocale;
        }
        get domainLocale() {
          return this[q].domainLocale;
        }
        get searchParams() {
          return this[q].url.searchParams;
        }
        get host() {
          return this[q].url.host;
        }
        set host(e2) {
          this[q].url.host = e2;
        }
        get hostname() {
          return this[q].url.hostname;
        }
        set hostname(e2) {
          this[q].url.hostname = e2;
        }
        get port() {
          return this[q].url.port;
        }
        set port(e2) {
          this[q].url.port = e2;
        }
        get protocol() {
          return this[q].url.protocol;
        }
        set protocol(e2) {
          this[q].url.protocol = e2;
        }
        get href() {
          let e2 = this.formatPathname(), t2 = this.formatSearch();
          return `${this.protocol}//${this.host}${e2}${t2}${this.hash}`;
        }
        set href(e2) {
          this[q].url = B(e2), this.analyze();
        }
        get origin() {
          return this[q].url.origin;
        }
        get pathname() {
          return this[q].url.pathname;
        }
        set pathname(e2) {
          this[q].url.pathname = e2;
        }
        get hash() {
          return this[q].url.hash;
        }
        set hash(e2) {
          this[q].url.hash = e2;
        }
        get search() {
          return this[q].url.search;
        }
        set search(e2) {
          this[q].url.search = e2;
        }
        get password() {
          return this[q].url.password;
        }
        set password(e2) {
          this[q].url.password = e2;
        }
        get username() {
          return this[q].url.username;
        }
        set username(e2) {
          this[q].url.username = e2;
        }
        get basePath() {
          return this[q].basePath;
        }
        set basePath(e2) {
          this[q].basePath = e2.startsWith("/") ? e2 : `/${e2}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new V(String(this), this[q].options);
        }
      }
      var H = r(5945);
      let F = Symbol("internal request");
      class z extends Request {
        constructor(e2, t2 = {}) {
          let r2 = "string" != typeof e2 && "url" in e2 ? e2.url : String(e2);
          x(r2), e2 instanceof Request ? super(e2, t2) : super(r2, t2);
          let i2 = new V(r2, { headers: T(this.headers), nextConfig: t2.nextConfig });
          this[F] = { cookies: new H.RequestCookies(this.headers), geo: t2.geo || {}, ip: t2.ip, nextUrl: i2, url: i2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, geo: this.geo, ip: this.ip, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[F].cookies;
        }
        get geo() {
          return this[F].geo;
        }
        get ip() {
          return this[F].ip;
        }
        get nextUrl() {
          return this[F].nextUrl;
        }
        get page() {
          throw new S();
        }
        get ua() {
          throw new k();
        }
        get url() {
          return this[F].url;
        }
      }
      class K {
        static get(e2, t2, r2) {
          let i2 = Reflect.get(e2, t2, r2);
          return "function" == typeof i2 ? i2.bind(e2) : i2;
        }
        static set(e2, t2, r2, i2) {
          return Reflect.set(e2, t2, r2, i2);
        }
        static has(e2, t2) {
          return Reflect.has(e2, t2);
        }
        static deleteProperty(e2, t2) {
          return Reflect.deleteProperty(e2, t2);
        }
      }
      let W = Symbol("internal response"), J = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function G(e2, t2) {
        var r2;
        if (null == e2 ? void 0 : null == (r2 = e2.request) ? void 0 : r2.headers) {
          if (!(e2.request.headers instanceof Headers)) throw Error("request.headers must be an instance of Headers");
          let r3 = [];
          for (let [i2, n2] of e2.request.headers) t2.set("x-middleware-request-" + i2, n2), r3.push(i2);
          t2.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class X extends Response {
        constructor(e2, t2 = {}) {
          super(e2, t2);
          let r2 = this.headers, i2 = new Proxy(new H.ResponseCookies(r2), { get(e3, i3, n2) {
            switch (i3) {
              case "delete":
              case "set":
                return (...n3) => {
                  let s2 = Reflect.apply(e3[i3], e3, n3), a2 = new Headers(r2);
                  return s2 instanceof H.ResponseCookies && r2.set("x-middleware-set-cookie", s2.getAll().map((e4) => (0, H.stringifyCookie)(e4)).join(",")), G(t2, a2), s2;
                };
              default:
                return K.get(e3, i3, n2);
            }
          } });
          this[W] = { cookies: i2, url: t2.url ? new V(t2.url, { headers: T(r2), nextConfig: t2.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[W].cookies;
        }
        static json(e2, t2) {
          let r2 = Response.json(e2, t2);
          return new X(r2.body, r2);
        }
        static redirect(e2, t2) {
          let r2 = "number" == typeof t2 ? t2 : (null == t2 ? void 0 : t2.status) ?? 307;
          if (!J.has(r2)) throw RangeError('Failed to execute "redirect" on "response": Invalid status code');
          let i2 = "object" == typeof t2 ? t2 : {}, n2 = new Headers(null == i2 ? void 0 : i2.headers);
          return n2.set("Location", x(e2)), new X(null, { ...i2, headers: n2, status: r2 });
        }
        static rewrite(e2, t2) {
          let r2 = new Headers(null == t2 ? void 0 : t2.headers);
          return r2.set("x-middleware-rewrite", x(e2)), G(t2, r2), new X(null, { ...t2, headers: r2 });
        }
        static next(e2) {
          let t2 = new Headers(null == e2 ? void 0 : e2.headers);
          return t2.set("x-middleware-next", "1"), G(e2, t2), new X(null, { ...e2, headers: t2 });
        }
      }
      function Y(e2, t2) {
        let r2 = "string" == typeof t2 ? new URL(t2) : t2, i2 = new URL(e2, t2), n2 = r2.protocol + "//" + r2.host;
        return i2.protocol + "//" + i2.host === n2 ? i2.toString().replace(n2, "") : i2.toString();
      }
      let Z = [["RSC"], ["Next-Router-State-Tree"], ["Next-Router-Prefetch"]], Q = ["__nextFallback", "__nextLocale", "__nextInferredLocaleFromDefault", "__nextDefaultLocale", "__nextIsNotFound", "_rsc"], ee = ["__nextDataReq"];
      class et extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new et();
        }
      }
      class er extends Headers {
        constructor(e2) {
          super(), this.headers = new Proxy(e2, { get(t2, r2, i2) {
            if ("symbol" == typeof r2) return K.get(t2, r2, i2);
            let n2 = r2.toLowerCase(), s2 = Object.keys(e2).find((e3) => e3.toLowerCase() === n2);
            if (void 0 !== s2) return K.get(t2, s2, i2);
          }, set(t2, r2, i2, n2) {
            if ("symbol" == typeof r2) return K.set(t2, r2, i2, n2);
            let s2 = r2.toLowerCase(), a2 = Object.keys(e2).find((e3) => e3.toLowerCase() === s2);
            return K.set(t2, a2 ?? r2, i2, n2);
          }, has(t2, r2) {
            if ("symbol" == typeof r2) return K.has(t2, r2);
            let i2 = r2.toLowerCase(), n2 = Object.keys(e2).find((e3) => e3.toLowerCase() === i2);
            return void 0 !== n2 && K.has(t2, n2);
          }, deleteProperty(t2, r2) {
            if ("symbol" == typeof r2) return K.deleteProperty(t2, r2);
            let i2 = r2.toLowerCase(), n2 = Object.keys(e2).find((e3) => e3.toLowerCase() === i2);
            return void 0 === n2 || K.deleteProperty(t2, n2);
          } });
        }
        static seal(e2) {
          return new Proxy(e2, { get(e3, t2, r2) {
            switch (t2) {
              case "append":
              case "delete":
              case "set":
                return et.callable;
              default:
                return K.get(e3, t2, r2);
            }
          } });
        }
        merge(e2) {
          return Array.isArray(e2) ? e2.join(", ") : e2;
        }
        static from(e2) {
          return e2 instanceof Headers ? e2 : new er(e2);
        }
        append(e2, t2) {
          let r2 = this.headers[e2];
          "string" == typeof r2 ? this.headers[e2] = [r2, t2] : Array.isArray(r2) ? r2.push(t2) : this.headers[e2] = t2;
        }
        delete(e2) {
          delete this.headers[e2];
        }
        get(e2) {
          let t2 = this.headers[e2];
          return void 0 !== t2 ? this.merge(t2) : null;
        }
        has(e2) {
          return void 0 !== this.headers[e2];
        }
        set(e2, t2) {
          this.headers[e2] = t2;
        }
        forEach(e2, t2) {
          for (let [r2, i2] of this.entries()) e2.call(t2, i2, r2, this);
        }
        *entries() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = e2.toLowerCase(), r2 = this.get(t2);
            yield [t2, r2];
          }
        }
        *keys() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = e2.toLowerCase();
            yield t2;
          }
        }
        *values() {
          for (let e2 of Object.keys(this.headers)) {
            let t2 = this.get(e2);
            yield t2;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      var ei = r(5558);
      class en extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options");
        }
        static callable() {
          throw new en();
        }
      }
      class es {
        static seal(e2) {
          return new Proxy(e2, { get(e3, t2, r2) {
            switch (t2) {
              case "clear":
              case "delete":
              case "set":
                return en.callable;
              default:
                return K.get(e3, t2, r2);
            }
          } });
        }
      }
      let ea = Symbol.for("next.mutated.cookies");
      class eo {
        static wrap(e2, t2) {
          let r2 = new H.ResponseCookies(new Headers());
          for (let t3 of e2.getAll()) r2.set(t3);
          let i2 = [], n2 = /* @__PURE__ */ new Set(), s2 = () => {
            let e3 = ei.A.getStore();
            if (e3 && (e3.pathWasRevalidated = true), i2 = r2.getAll().filter((e4) => n2.has(e4.name)), t2) {
              let e4 = [];
              for (let t3 of i2) {
                let r3 = new H.ResponseCookies(new Headers());
                r3.set(t3), e4.push(r3.toString());
              }
              t2(e4);
            }
          };
          return new Proxy(r2, { get(e3, t3, r3) {
            switch (t3) {
              case ea:
                return i2;
              case "delete":
                return function(...t4) {
                  n2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    e3.delete(...t4);
                  } finally {
                    s2();
                  }
                };
              case "set":
                return function(...t4) {
                  n2.add("string" == typeof t4[0] ? t4[0] : t4[0].name);
                  try {
                    return e3.set(...t4);
                  } finally {
                    s2();
                  }
                };
              default:
                return K.get(e3, t3, r3);
            }
          } });
        }
      }
      !function(e2) {
        e2.handleRequest = "BaseServer.handleRequest", e2.run = "BaseServer.run", e2.pipe = "BaseServer.pipe", e2.getStaticHTML = "BaseServer.getStaticHTML", e2.render = "BaseServer.render", e2.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e2.renderToResponse = "BaseServer.renderToResponse", e2.renderToHTML = "BaseServer.renderToHTML", e2.renderError = "BaseServer.renderError", e2.renderErrorToResponse = "BaseServer.renderErrorToResponse", e2.renderErrorToHTML = "BaseServer.renderErrorToHTML", e2.render404 = "BaseServer.render404";
      }(n || (n = {})), function(e2) {
        e2.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e2.loadComponents = "LoadComponents.loadComponents";
      }(s || (s = {})), function(e2) {
        e2.getRequestHandler = "NextServer.getRequestHandler", e2.getServer = "NextServer.getServer", e2.getServerRequestHandler = "NextServer.getServerRequestHandler", e2.createServer = "createServer.createServer";
      }(a || (a = {})), function(e2) {
        e2.compression = "NextNodeServer.compression", e2.getBuildId = "NextNodeServer.getBuildId", e2.createComponentTree = "NextNodeServer.createComponentTree", e2.clientComponentLoading = "NextNodeServer.clientComponentLoading", e2.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e2.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e2.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e2.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e2.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e2.sendRenderResult = "NextNodeServer.sendRenderResult", e2.proxyRequest = "NextNodeServer.proxyRequest", e2.runApi = "NextNodeServer.runApi", e2.render = "NextNodeServer.render", e2.renderHTML = "NextNodeServer.renderHTML", e2.imageOptimizer = "NextNodeServer.imageOptimizer", e2.getPagePath = "NextNodeServer.getPagePath", e2.getRoutesManifest = "NextNodeServer.getRoutesManifest", e2.findPageComponents = "NextNodeServer.findPageComponents", e2.getFontManifest = "NextNodeServer.getFontManifest", e2.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e2.getRequestHandler = "NextNodeServer.getRequestHandler", e2.renderToHTML = "NextNodeServer.renderToHTML", e2.renderError = "NextNodeServer.renderError", e2.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e2.render404 = "NextNodeServer.render404", e2.startResponse = "NextNodeServer.startResponse", e2.route = "route", e2.onProxyReq = "onProxyReq", e2.apiResolver = "apiResolver", e2.internalFetch = "internalFetch";
      }(o || (o = {})), (l || (l = {})).startServer = "startServer.startServer", function(e2) {
        e2.getServerSideProps = "Render.getServerSideProps", e2.getStaticProps = "Render.getStaticProps", e2.renderToString = "Render.renderToString", e2.renderDocument = "Render.renderDocument", e2.createBodyResult = "Render.createBodyResult";
      }(u || (u = {})), function(e2) {
        e2.renderToString = "AppRender.renderToString", e2.renderToReadableStream = "AppRender.renderToReadableStream", e2.getBodyResult = "AppRender.getBodyResult", e2.fetch = "AppRender.fetch";
      }(c || (c = {})), (h || (h = {})).executeRoute = "Router.executeRoute", (d || (d = {})).runHandler = "Node.runHandler", (p || (p = {})).runHandler = "AppRouteRouteHandlers.runHandler", function(e2) {
        e2.generateMetadata = "ResolveMetadata.generateMetadata", e2.generateViewport = "ResolveMetadata.generateViewport";
      }(f || (f = {})), (g || (g = {})).execute = "Middleware.execute";
      let el = ["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"], eu = ["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"], { context: ec, propagation: eh, trace: ed, SpanStatusCode: ep, SpanKind: ef, ROOT_CONTEXT: eg } = i = r(8439), eb = (e2) => null !== e2 && "object" == typeof e2 && "function" == typeof e2.then, ev = (e2, t2) => {
        (null == t2 ? void 0 : t2.bubble) === true ? e2.setAttribute("next.bubble", true) : (t2 && e2.recordException(t2), e2.setStatus({ code: ep.ERROR, message: null == t2 ? void 0 : t2.message })), e2.end();
      }, ew = /* @__PURE__ */ new Map(), em = i.createContextKey("next.rootSpanId"), ey = 0, e_ = () => ey++;
      class eS {
        getTracerInstance() {
          return ed.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return ec;
        }
        getActiveScopeSpan() {
          return ed.getSpan(null == ec ? void 0 : ec.active());
        }
        withPropagatedContext(e2, t2, r2) {
          let i2 = ec.active();
          if (ed.getSpanContext(i2)) return t2();
          let n2 = eh.extract(i2, e2, r2);
          return ec.with(n2, t2);
        }
        trace(...e2) {
          var t2;
          let [r2, i2, n2] = e2, { fn: s2, options: a2 } = "function" == typeof i2 ? { fn: i2, options: {} } : { fn: n2, options: { ...i2 } }, o2 = a2.spanName ?? r2;
          if (!el.includes(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || a2.hideSpan) return s2();
          let l2 = this.getSpanContext((null == a2 ? void 0 : a2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t2 = ed.getSpanContext(l2)) ? void 0 : t2.isRemote) && (u2 = true) : (l2 = (null == ec ? void 0 : ec.active()) ?? eg, u2 = true);
          let c2 = e_();
          return a2.attributes = { "next.span_name": o2, "next.span_type": r2, ...a2.attributes }, ec.with(l2.setValue(em, c2), () => this.getTracerInstance().startActiveSpan(o2, a2, (e3) => {
            let t3 = "performance" in globalThis ? globalThis.performance.now() : void 0, i3 = () => {
              ew.delete(c2), t3 && process.env.NEXT_OTEL_PERFORMANCE_PREFIX && eu.includes(r2 || "") && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e4) => "-" + e4.toLowerCase())}`, { start: t3, end: performance.now() });
            };
            u2 && ew.set(c2, new Map(Object.entries(a2.attributes ?? {})));
            try {
              if (s2.length > 1) return s2(e3, (t5) => ev(e3, t5));
              let t4 = s2(e3);
              if (eb(t4)) return t4.then((t5) => (e3.end(), t5)).catch((t5) => {
                throw ev(e3, t5), t5;
              }).finally(i3);
              return e3.end(), i3(), t4;
            } catch (t4) {
              throw ev(e3, t4), i3(), t4;
            }
          }));
        }
        wrap(...e2) {
          let t2 = this, [r2, i2, n2] = 3 === e2.length ? e2 : [e2[0], {}, e2[1]];
          return el.includes(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e3 = i2;
            "function" == typeof e3 && "function" == typeof n2 && (e3 = e3.apply(this, arguments));
            let s2 = arguments.length - 1, a2 = arguments[s2];
            if ("function" != typeof a2) return t2.trace(r2, e3, () => n2.apply(this, arguments));
            {
              let i3 = t2.getContext().bind(ec.active(), a2);
              return t2.trace(r2, e3, (e4, t3) => (arguments[s2] = function(e5) {
                return null == t3 || t3(e5), i3.apply(this, arguments);
              }, n2.apply(this, arguments)));
            }
          } : n2;
        }
        startSpan(...e2) {
          let [t2, r2] = e2, i2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t2, r2, i2);
        }
        getSpanContext(e2) {
          return e2 ? ed.setSpan(ec.active(), e2) : void 0;
        }
        getRootSpanAttributes() {
          let e2 = ec.active().getValue(em);
          return ew.get(e2);
        }
      }
      let ek = (() => {
        let e2 = new eS();
        return () => e2;
      })(), eO = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(eO);
      class eE {
        constructor(e2, t2, r2, i2) {
          var n2;
          let s2 = e2 && function(e3, t3) {
            let r3 = er.from(e3.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t3.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t2, e2).isOnDemandRevalidate, a2 = null == (n2 = r2.get(eO)) ? void 0 : n2.value;
          this.isEnabled = !!(!s2 && a2 && e2 && a2 === e2.previewModeId), this._previewModeId = null == e2 ? void 0 : e2.previewModeId, this._mutableCookies = i2;
        }
        enable() {
          if (!this._previewModeId) throw Error("Invariant: previewProps missing previewModeId this should never happen");
          this._mutableCookies.set({ name: eO, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" });
        }
        disable() {
          this._mutableCookies.set({ name: eO, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) });
        }
      }
      function eT(e2, t2) {
        if ("x-middleware-set-cookie" in e2.headers && "string" == typeof e2.headers["x-middleware-set-cookie"]) {
          let r2 = e2.headers["x-middleware-set-cookie"], i2 = new Headers();
          for (let e3 of E(r2)) i2.append("set-cookie", e3);
          for (let e3 of new H.ResponseCookies(i2).getAll()) t2.set(e3);
        }
      }
      let ex = { wrap(e2, { req: t2, res: r2, renderOpts: i2 }, n2) {
        let s2;
        function a2(e3) {
          r2 && r2.setHeader("Set-Cookie", e3);
        }
        i2 && "previewProps" in i2 && (s2 = i2.previewProps);
        let o2 = {}, l2 = { get headers() {
          return o2.headers || (o2.headers = function(e3) {
            let t3 = er.from(e3);
            for (let e4 of Z) t3.delete(e4.toString().toLowerCase());
            return er.seal(t3);
          }(t2.headers)), o2.headers;
        }, get cookies() {
          if (!o2.cookies) {
            let e3 = new H.RequestCookies(er.from(t2.headers));
            eT(t2, e3), o2.cookies = es.seal(e3);
          }
          return o2.cookies;
        }, get mutableCookies() {
          if (!o2.mutableCookies) {
            let e3 = function(e4, t3) {
              let r3 = new H.RequestCookies(er.from(e4));
              return eo.wrap(r3, t3);
            }(t2.headers, (null == i2 ? void 0 : i2.onUpdateCookies) || (r2 ? a2 : void 0));
            eT(t2, e3), o2.mutableCookies = e3;
          }
          return o2.mutableCookies;
        }, get draftMode() {
          return o2.draftMode || (o2.draftMode = new eE(s2, t2, this.cookies, this.mutableCookies)), o2.draftMode;
        }, reactLoadableManifest: (null == i2 ? void 0 : i2.reactLoadableManifest) || {}, assetPrefix: (null == i2 ? void 0 : i2.assetPrefix) || "" };
        return e2.run(l2, n2, l2);
      } };
      var eC = r(5303);
      function eP() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID, previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      class eI extends z {
        constructor(e2) {
          super(e2.input, e2.init), this.sourcePage = e2.page;
        }
        get request() {
          throw new _({ page: this.sourcePage });
        }
        respondWith() {
          throw new _({ page: this.sourcePage });
        }
        waitUntil() {
          throw new _({ page: this.sourcePage });
        }
      }
      let eR = { keys: (e2) => Array.from(e2.keys()), get: (e2, t2) => e2.get(t2) ?? void 0 }, eA = (e2, t2) => ek().withPropagatedContext(e2.headers, t2, eR), ej = false;
      async function eN(e2) {
        let t2, i2;
        !function() {
          if (!ej && (ej = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: e3, wrapRequestHandler: t3 } = r(4177);
            e3(), eA = t3(eA);
          }
        }(), await m();
        let n2 = void 0 !== self.__BUILD_MANIFEST;
        e2.request.url = e2.request.url.replace(/\.rsc($|\?)/, "$1");
        let s2 = new V(e2.request.url, { headers: e2.request.headers, nextConfig: e2.request.nextConfig });
        for (let e3 of [...s2.searchParams.keys()]) {
          let t3 = s2.searchParams.getAll(e3);
          !function(e4, t4) {
            for (let r2 of ["nxtP", "nxtI"]) e4 !== r2 && e4.startsWith(r2) && t4(e4.substring(r2.length));
          }(e3, (r2) => {
            for (let e4 of (s2.searchParams.delete(r2), t3)) s2.searchParams.append(r2, e4);
            s2.searchParams.delete(e3);
          });
        }
        let a2 = s2.buildId;
        s2.buildId = "";
        let o2 = e2.request.headers["x-nextjs-data"];
        o2 && "/index" === s2.pathname && (s2.pathname = "/");
        let l2 = function(e3) {
          let t3 = new Headers();
          for (let [r2, i3] of Object.entries(e3)) for (let e4 of Array.isArray(i3) ? i3 : [i3]) void 0 !== e4 && ("number" == typeof e4 && (e4 = e4.toString()), t3.append(r2, e4));
          return t3;
        }(e2.request.headers), u2 = /* @__PURE__ */ new Map();
        if (!n2) for (let e3 of Z) {
          let t3 = e3.toString().toLowerCase();
          l2.get(t3) && (u2.set(t3, l2.get(t3)), l2.delete(t3));
        }
        let c2 = new eI({ page: e2.page, input: function(e3, t3) {
          let r2 = "string" == typeof e3, i3 = r2 ? new URL(e3) : e3;
          for (let e4 of Q) i3.searchParams.delete(e4);
          if (t3) for (let e4 of ee) i3.searchParams.delete(e4);
          return r2 ? i3.toString() : i3;
        }(s2, true).toString(), init: { body: e2.request.body, geo: e2.request.geo, headers: l2, ip: e2.request.ip, method: e2.request.method, nextConfig: e2.request.nextConfig, signal: e2.request.signal } });
        o2 && Object.defineProperty(c2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && e2.IncrementalCache && (globalThis.__incrementalCache = new e2.IncrementalCache({ appDir: true, fetchCache: true, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: e2.request.headers, requestProtocol: "https", getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: eP() }) }));
        let h2 = new A({ request: c2, page: e2.page });
        if ((t2 = await eA(c2, () => "/middleware" === e2.page || "/src/middleware" === e2.page ? ek().trace(g.execute, { spanName: `middleware ${c2.method} ${c2.nextUrl.pathname}`, attributes: { "http.target": c2.nextUrl.pathname, "http.method": c2.method } }, () => ex.wrap(eC.F, { req: c2, renderOpts: { onUpdateCookies: (e3) => {
          i2 = e3;
        }, previewProps: eP() } }, () => e2.handler(c2, h2))) : e2.handler(c2, h2))) && !(t2 instanceof Response)) throw TypeError("Expected an instance of Response to be returned");
        t2 && i2 && t2.headers.set("set-cookie", i2);
        let d2 = null == t2 ? void 0 : t2.headers.get("x-middleware-rewrite");
        if (t2 && d2 && !n2) {
          let r2 = new V(d2, { forceLocale: true, headers: e2.request.headers, nextConfig: e2.request.nextConfig });
          r2.host === c2.nextUrl.host && (r2.buildId = a2 || r2.buildId, t2.headers.set("x-middleware-rewrite", String(r2)));
          let i3 = Y(String(r2), String(s2));
          o2 && t2.headers.set("x-nextjs-rewrite", i3);
        }
        let p2 = null == t2 ? void 0 : t2.headers.get("Location");
        if (t2 && p2 && !n2) {
          let r2 = new V(p2, { forceLocale: false, headers: e2.request.headers, nextConfig: e2.request.nextConfig });
          t2 = new Response(t2.body, t2), r2.host === c2.nextUrl.host && (r2.buildId = a2 || r2.buildId, t2.headers.set("Location", String(r2))), o2 && (t2.headers.delete("Location"), t2.headers.set("x-nextjs-redirect", Y(String(r2), String(s2))));
        }
        let f2 = t2 || X.next(), b2 = f2.headers.get("x-middleware-override-headers"), v2 = [];
        if (b2) {
          for (let [e3, t3] of u2) f2.headers.set(`x-middleware-request-${e3}`, t3), v2.push(e3);
          v2.length > 0 && f2.headers.set("x-middleware-override-headers", b2 + "," + v2.join(","));
        }
        return { response: f2, waitUntil: Promise.all(h2[I]), fetchMetrics: c2.fetchMetrics };
      }
      var eL = r(6261);
      async function e$(e2) {
        let t2 = X.next(), r2 = (0, eL.createMiddlewareClient)({ req: e2, res: t2 }), { data: { user: i2 } } = await r2.auth.getUser();
        if (["/dashboard", "/transactions", "/recurring", "/accounts", "/budgets", "/insights", "/portfolio", "/settings"].some((t3) => e2.nextUrl.pathname.startsWith(t3)) && !i2) {
          let t3 = e2.nextUrl.clone();
          return t3.pathname = "/login", t3.searchParams.set("redirectedFrom", e2.nextUrl.pathname), X.redirect(t3);
        }
        return i2 && ("/login" === e2.nextUrl.pathname || "/signup" === e2.nextUrl.pathname || "/" === e2.nextUrl.pathname) ? X.redirect(new URL("/dashboard", e2.url)) : t2;
      }
      r(340), "undefined" == typeof URLPattern || URLPattern;
      let eM = { matcher: ["/((?!_next/static|_next/image|favicon.ico|api/public).*)"] }, eU = { ...b }, eD = eU.middleware || eU.default, eB = "/middleware";
      if ("function" != typeof eD) throw Error(`The Middleware "${eB}" must export a \`middleware\` or a \`default\` function`);
      function eq(e2) {
        return eN({ ...e2, page: eB, handler: eD });
      }
    }, 6261: (e, t, r) => {
      "use strict";
      var i, n = Object.defineProperty, s = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, o = Object.prototype.hasOwnProperty, l = {};
      ((e2, t2) => {
        for (var r2 in t2) n(e2, r2, { get: t2[r2], enumerable: true });
      })(l, { createBrowserSupabaseClient: () => x, createClientComponentClient: () => c, createMiddlewareClient: () => m, createMiddlewareSupabaseClient: () => P, createPagesBrowserClient: () => h, createPagesServerClient: () => g, createRouteHandlerClient: () => E, createServerActionClient: () => T, createServerComponentClient: () => S, createServerSupabaseClient: () => C }), e.exports = ((e2, t2, r2, i2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of a(t2)) o.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(i2 = s(t2, l2)) || i2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), l);
      var u = r(2870);
      function c({ supabaseUrl: e2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: t2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: r2, cookieOptions: n2, isSingleton: s2 = true } = {}) {
        if (!e2 || !t2) throw Error("either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!");
        let a2 = () => {
          var i2;
          return (0, u.createSupabaseClient)(e2, t2, { ...r2, global: { ...null == r2 ? void 0 : r2.global, headers: { ...null == (i2 = null == r2 ? void 0 : r2.global) ? void 0 : i2.headers, "X-Client-Info": "@supabase/auth-helpers-nextjs@0.10.0" } }, auth: { storage: new u.BrowserCookieAuthStorageAdapter(n2) } });
        };
        if (s2) {
          let e3 = i ?? a2();
          return "undefined" == typeof window ? e3 : (i || (i = e3), i);
        }
        return a2();
      }
      var h = c, d = r(2870), p = r(8426), f = class extends d.CookieAuthStorageAdapter {
        constructor(e2, t2) {
          super(t2), this.context = e2;
        }
        getCookie(e2) {
          var t2, r2, i2;
          return (0, p.splitCookiesString)((null == (r2 = null == (t2 = this.context.res) ? void 0 : t2.getHeader("set-cookie")) ? void 0 : r2.toString()) ?? "").map((t3) => (0, d.parseCookies)(t3)[e2]).find((e3) => !!e3) ?? (null == (i2 = this.context.req) ? void 0 : i2.cookies[e2]);
        }
        setCookie(e2, t2) {
          this._setCookie(e2, t2);
        }
        deleteCookie(e2) {
          this._setCookie(e2, "", { maxAge: 0 });
        }
        _setCookie(e2, t2, r2) {
          var i2;
          let n2 = (0, p.splitCookiesString)((null == (i2 = this.context.res.getHeader("set-cookie")) ? void 0 : i2.toString()) ?? "").filter((t3) => !(e2 in (0, d.parseCookies)(t3))), s2 = (0, d.serializeCookie)(e2, t2, { ...this.cookieOptions, ...r2, httpOnly: false });
          this.context.res.setHeader("set-cookie", [...n2, s2]);
        }
      };
      function g(e2, { supabaseUrl: t2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: r2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: i2, cookieOptions: n2 } = {}) {
        var s2;
        if (!t2 || !r2) throw Error("either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!");
        return (0, d.createSupabaseClient)(t2, r2, { ...i2, global: { ...null == i2 ? void 0 : i2.global, headers: { ...null == (s2 = null == i2 ? void 0 : i2.global) ? void 0 : s2.headers, "X-Client-Info": "@supabase/auth-helpers-nextjs@0.10.0" } }, auth: { storage: new f(e2, n2) } });
      }
      var b = r(2870), v = r(8426), w = class extends b.CookieAuthStorageAdapter {
        constructor(e2, t2) {
          super(t2), this.context = e2;
        }
        getCookie(e2) {
          var t2;
          return (0, v.splitCookiesString)((null == (t2 = this.context.res.headers.get("set-cookie")) ? void 0 : t2.toString()) ?? "").map((t3) => (0, b.parseCookies)(t3)[e2]).find((e3) => !!e3) || (0, b.parseCookies)(this.context.req.headers.get("cookie") ?? "")[e2];
        }
        setCookie(e2, t2) {
          this._setCookie(e2, t2);
        }
        deleteCookie(e2) {
          this._setCookie(e2, "", { maxAge: 0 });
        }
        _setCookie(e2, t2, r2) {
          let i2 = (0, b.serializeCookie)(e2, t2, { ...this.cookieOptions, ...r2, httpOnly: false });
          this.context.res.headers && this.context.res.headers.append("set-cookie", i2);
        }
      };
      function m(e2, { supabaseUrl: t2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: r2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: i2, cookieOptions: n2 } = {}) {
        var s2;
        if (!t2 || !r2) throw Error("either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!");
        return (0, b.createSupabaseClient)(t2, r2, { ...i2, global: { ...null == i2 ? void 0 : i2.global, headers: { ...null == (s2 = null == i2 ? void 0 : i2.global) ? void 0 : s2.headers, "X-Client-Info": "@supabase/auth-helpers-nextjs@0.10.0" } }, auth: { storage: new w(e2, n2) } });
      }
      var y = r(2870), _ = class extends y.CookieAuthStorageAdapter {
        constructor(e2, t2) {
          super(t2), this.context = e2, this.isServer = true;
        }
        getCookie(e2) {
          var t2;
          return null == (t2 = this.context.cookies().get(e2)) ? void 0 : t2.value;
        }
        setCookie(e2, t2) {
        }
        deleteCookie(e2) {
        }
      };
      function S(e2, { supabaseUrl: t2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: r2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: i2, cookieOptions: n2 } = {}) {
        var s2;
        if (!t2 || !r2) throw Error("either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!");
        return (0, y.createSupabaseClient)(t2, r2, { ...i2, global: { ...null == i2 ? void 0 : i2.global, headers: { ...null == (s2 = null == i2 ? void 0 : i2.global) ? void 0 : s2.headers, "X-Client-Info": "@supabase/auth-helpers-nextjs@0.10.0" } }, auth: { storage: new _(e2, n2) } });
      }
      var k = r(2870), O = class extends k.CookieAuthStorageAdapter {
        constructor(e2, t2) {
          super(t2), this.context = e2;
        }
        getCookie(e2) {
          var t2;
          return null == (t2 = this.context.cookies().get(e2)) ? void 0 : t2.value;
        }
        setCookie(e2, t2) {
          this.context.cookies().set(e2, t2, this.cookieOptions);
        }
        deleteCookie(e2) {
          this.context.cookies().set(e2, "", { ...this.cookieOptions, maxAge: 0 });
        }
      };
      function E(e2, { supabaseUrl: t2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: r2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: i2, cookieOptions: n2 } = {}) {
        var s2;
        if (!t2 || !r2) throw Error("either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!");
        return (0, k.createSupabaseClient)(t2, r2, { ...i2, global: { ...null == i2 ? void 0 : i2.global, headers: { ...null == (s2 = null == i2 ? void 0 : i2.global) ? void 0 : s2.headers, "X-Client-Info": "@supabase/auth-helpers-nextjs@0.10.0" } }, auth: { storage: new O(e2, n2) } });
      }
      var T = E;
      function x({ supabaseUrl: e2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: t2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: r2, cookieOptions: i2 } = {}) {
        return console.warn("Please utilize the `createPagesBrowserClient` function instead of the deprecated `createBrowserSupabaseClient` function. Learn more: https://supabase.com/docs/guides/auth/auth-helpers/nextjs-pages"), h({ supabaseUrl: e2, supabaseKey: t2, options: r2, cookieOptions: i2 });
      }
      function C(e2, { supabaseUrl: t2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: r2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: i2, cookieOptions: n2 } = {}) {
        return console.warn("Please utilize the `createPagesServerClient` function instead of the deprecated `createServerSupabaseClient` function. Learn more: https://supabase.com/docs/guides/auth/auth-helpers/nextjs-pages"), g(e2, { supabaseUrl: t2, supabaseKey: r2, options: i2, cookieOptions: n2 });
      }
      function P(e2, { supabaseUrl: t2 = "https://ubrxneqwxygpsjlewxrs.supabase.co", supabaseKey: r2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicnhuZXF3eHlncHNqbGV3eHJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzAzODYsImV4cCI6MjA3NTM0NjM4Nn0.V6TY4ws-bBoHPKKNvycUousvpDWAN76gaHroPjV2yRc", options: i2, cookieOptions: n2 } = {}) {
        return console.warn("Please utilize the `createMiddlewareClient` function instead of the deprecated `createMiddlewareSupabaseClient` function. Learn more: https://supabase.com/docs/guides/auth/auth-helpers/nextjs#middleware"), m(e2, { supabaseUrl: t2, supabaseKey: r2, options: i2, cookieOptions: n2 });
      }
    }, 8254: (e, t, r) => {
      "use strict";
      r.r(t), r.d(t, { Headers: () => a, Request: () => o, Response: () => l, default: () => s, fetch: () => n });
      var i = function() {
        if ("undefined" != typeof self) return self;
        if ("undefined" != typeof window) return window;
        if (void 0 !== r.g) return r.g;
        throw Error("unable to locate global object");
      }();
      let n = i.fetch, s = i.fetch.bind(i), a = i.Headers, o = i.Request, l = i.Response;
    }, 8022: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let n = i(r(8254)), s = i(r(8335));
      class a {
        constructor(e2) {
          var t2, r2;
          this.shouldThrowOnError = false, this.method = e2.method, this.url = e2.url, this.headers = new Headers(e2.headers), this.schema = e2.schema, this.body = e2.body, this.shouldThrowOnError = null !== (t2 = e2.shouldThrowOnError) && void 0 !== t2 && t2, this.signal = e2.signal, this.isMaybeSingle = null !== (r2 = e2.isMaybeSingle) && void 0 !== r2 && r2, e2.fetch ? this.fetch = e2.fetch : "undefined" == typeof fetch ? this.fetch = n.default : this.fetch = fetch;
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        setHeader(e2, t2) {
          return this.headers = new Headers(this.headers), this.headers.set(e2, t2), this;
        }
        then(e2, t2) {
          void 0 === this.schema || (["GET", "HEAD"].includes(this.method) ? this.headers.set("Accept-Profile", this.schema) : this.headers.set("Content-Profile", this.schema)), "GET" !== this.method && "HEAD" !== this.method && this.headers.set("Content-Type", "application/json");
          let r2 = (0, this.fetch)(this.url.toString(), { method: this.method, headers: this.headers, body: JSON.stringify(this.body), signal: this.signal }).then(async (e3) => {
            var t3, r3, i2, n2;
            let a2 = null, o = null, l = null, u = e3.status, c = e3.statusText;
            if (e3.ok) {
              if ("HEAD" !== this.method) {
                let r4 = await e3.text();
                "" === r4 || (o = "text/csv" === this.headers.get("Accept") ? r4 : this.headers.get("Accept") && (null === (t3 = this.headers.get("Accept")) || void 0 === t3 ? void 0 : t3.includes("application/vnd.pgrst.plan+text")) ? r4 : JSON.parse(r4));
              }
              let n3 = null === (r3 = this.headers.get("Prefer")) || void 0 === r3 ? void 0 : r3.match(/count=(exact|planned|estimated)/), s2 = null === (i2 = e3.headers.get("content-range")) || void 0 === i2 ? void 0 : i2.split("/");
              n3 && s2 && s2.length > 1 && (l = parseInt(s2[1])), this.isMaybeSingle && "GET" === this.method && Array.isArray(o) && (o.length > 1 ? (a2 = { code: "PGRST116", details: `Results contain ${o.length} rows, application/vnd.pgrst.object+json requires 1 row`, hint: null, message: "JSON object requested, multiple (or no) rows returned" }, o = null, l = null, u = 406, c = "Not Acceptable") : o = 1 === o.length ? o[0] : null);
            } else {
              let t4 = await e3.text();
              try {
                a2 = JSON.parse(t4), Array.isArray(a2) && 404 === e3.status && (o = [], a2 = null, u = 200, c = "OK");
              } catch (r4) {
                404 === e3.status && "" === t4 ? (u = 204, c = "No Content") : a2 = { message: t4 };
              }
              if (a2 && this.isMaybeSingle && (null === (n2 = null == a2 ? void 0 : a2.details) || void 0 === n2 ? void 0 : n2.includes("0 rows")) && (a2 = null, u = 200, c = "OK"), a2 && this.shouldThrowOnError) throw new s.default(a2);
            }
            return { error: a2, data: o, count: l, status: u, statusText: c };
          });
          return this.shouldThrowOnError || (r2 = r2.catch((e3) => {
            var t3, r3, i2;
            return { error: { message: `${null !== (t3 = null == e3 ? void 0 : e3.name) && void 0 !== t3 ? t3 : "FetchError"}: ${null == e3 ? void 0 : e3.message}`, details: `${null !== (r3 = null == e3 ? void 0 : e3.stack) && void 0 !== r3 ? r3 : ""}`, hint: "", code: `${null !== (i2 = null == e3 ? void 0 : e3.code) && void 0 !== i2 ? i2 : ""}` }, data: null, count: null, status: 0, statusText: "" };
          })), r2.then(e2, t2);
        }
        returns() {
          return this;
        }
        overrideTypes() {
          return this;
        }
      }
      t.default = a;
    }, 8191: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let n = i(r(3210)), s = i(r(7401));
      class a {
        constructor(e2, { headers: t2 = {}, schema: r2, fetch: i2 } = {}) {
          this.url = e2, this.headers = new Headers(t2), this.schemaName = r2, this.fetch = i2;
        }
        from(e2) {
          let t2 = new URL(`${this.url}/${e2}`);
          return new n.default(t2, { headers: new Headers(this.headers), schema: this.schemaName, fetch: this.fetch });
        }
        schema(e2) {
          return new a(this.url, { headers: this.headers, schema: e2, fetch: this.fetch });
        }
        rpc(e2, t2 = {}, { head: r2 = false, get: i2 = false, count: n2 } = {}) {
          var a2;
          let o, l;
          let u = new URL(`${this.url}/rpc/${e2}`);
          r2 || i2 ? (o = r2 ? "HEAD" : "GET", Object.entries(t2).filter(([e3, t3]) => void 0 !== t3).map(([e3, t3]) => [e3, Array.isArray(t3) ? `{${t3.join(",")}}` : `${t3}`]).forEach(([e3, t3]) => {
            u.searchParams.append(e3, t3);
          })) : (o = "POST", l = t2);
          let c = new Headers(this.headers);
          return n2 && c.set("Prefer", `count=${n2}`), new s.default({ method: o, url: u, headers: c, schema: this.schemaName, body: l, fetch: null !== (a2 = this.fetch) && void 0 !== a2 ? a2 : fetch });
        }
      }
      t.default = a;
    }, 8335: (e, t) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      class r extends Error {
        constructor(e2) {
          super(e2.message), this.name = "PostgrestError", this.details = e2.details, this.hint = e2.hint, this.code = e2.code;
        }
      }
      t.default = r;
    }, 7401: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let n = i(r(6251));
      class s extends n.default {
        eq(e2, t2) {
          return this.url.searchParams.append(e2, `eq.${t2}`), this;
        }
        neq(e2, t2) {
          return this.url.searchParams.append(e2, `neq.${t2}`), this;
        }
        gt(e2, t2) {
          return this.url.searchParams.append(e2, `gt.${t2}`), this;
        }
        gte(e2, t2) {
          return this.url.searchParams.append(e2, `gte.${t2}`), this;
        }
        lt(e2, t2) {
          return this.url.searchParams.append(e2, `lt.${t2}`), this;
        }
        lte(e2, t2) {
          return this.url.searchParams.append(e2, `lte.${t2}`), this;
        }
        like(e2, t2) {
          return this.url.searchParams.append(e2, `like.${t2}`), this;
        }
        likeAllOf(e2, t2) {
          return this.url.searchParams.append(e2, `like(all).{${t2.join(",")}}`), this;
        }
        likeAnyOf(e2, t2) {
          return this.url.searchParams.append(e2, `like(any).{${t2.join(",")}}`), this;
        }
        ilike(e2, t2) {
          return this.url.searchParams.append(e2, `ilike.${t2}`), this;
        }
        ilikeAllOf(e2, t2) {
          return this.url.searchParams.append(e2, `ilike(all).{${t2.join(",")}}`), this;
        }
        ilikeAnyOf(e2, t2) {
          return this.url.searchParams.append(e2, `ilike(any).{${t2.join(",")}}`), this;
        }
        is(e2, t2) {
          return this.url.searchParams.append(e2, `is.${t2}`), this;
        }
        in(e2, t2) {
          let r2 = Array.from(new Set(t2)).map((e3) => "string" == typeof e3 && RegExp("[,()]").test(e3) ? `"${e3}"` : `${e3}`).join(",");
          return this.url.searchParams.append(e2, `in.(${r2})`), this;
        }
        contains(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `cs.${t2}`) : Array.isArray(t2) ? this.url.searchParams.append(e2, `cs.{${t2.join(",")}}`) : this.url.searchParams.append(e2, `cs.${JSON.stringify(t2)}`), this;
        }
        containedBy(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `cd.${t2}`) : Array.isArray(t2) ? this.url.searchParams.append(e2, `cd.{${t2.join(",")}}`) : this.url.searchParams.append(e2, `cd.${JSON.stringify(t2)}`), this;
        }
        rangeGt(e2, t2) {
          return this.url.searchParams.append(e2, `sr.${t2}`), this;
        }
        rangeGte(e2, t2) {
          return this.url.searchParams.append(e2, `nxl.${t2}`), this;
        }
        rangeLt(e2, t2) {
          return this.url.searchParams.append(e2, `sl.${t2}`), this;
        }
        rangeLte(e2, t2) {
          return this.url.searchParams.append(e2, `nxr.${t2}`), this;
        }
        rangeAdjacent(e2, t2) {
          return this.url.searchParams.append(e2, `adj.${t2}`), this;
        }
        overlaps(e2, t2) {
          return "string" == typeof t2 ? this.url.searchParams.append(e2, `ov.${t2}`) : this.url.searchParams.append(e2, `ov.{${t2.join(",")}}`), this;
        }
        textSearch(e2, t2, { config: r2, type: i2 } = {}) {
          let n2 = "";
          "plain" === i2 ? n2 = "pl" : "phrase" === i2 ? n2 = "ph" : "websearch" === i2 && (n2 = "w");
          let s2 = void 0 === r2 ? "" : `(${r2})`;
          return this.url.searchParams.append(e2, `${n2}fts${s2}.${t2}`), this;
        }
        match(e2) {
          return Object.entries(e2).forEach(([e3, t2]) => {
            this.url.searchParams.append(e3, `eq.${t2}`);
          }), this;
        }
        not(e2, t2, r2) {
          return this.url.searchParams.append(e2, `not.${t2}.${r2}`), this;
        }
        or(e2, { foreignTable: t2, referencedTable: r2 = t2 } = {}) {
          let i2 = r2 ? `${r2}.or` : "or";
          return this.url.searchParams.append(i2, `(${e2})`), this;
        }
        filter(e2, t2, r2) {
          return this.url.searchParams.append(e2, `${t2}.${r2}`), this;
        }
      }
      t.default = s;
    }, 3210: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let n = i(r(7401));
      class s {
        constructor(e2, { headers: t2 = {}, schema: r2, fetch: i2 }) {
          this.url = e2, this.headers = new Headers(t2), this.schema = r2, this.fetch = i2;
        }
        select(e2, t2) {
          let { head: r2 = false, count: i2 } = null != t2 ? t2 : {}, s2 = false, a = (null != e2 ? e2 : "*").split("").map((e3) => /\s/.test(e3) && !s2 ? "" : ('"' === e3 && (s2 = !s2), e3)).join("");
          return this.url.searchParams.set("select", a), i2 && this.headers.append("Prefer", `count=${i2}`), new n.default({ method: r2 ? "HEAD" : "GET", url: this.url, headers: this.headers, schema: this.schema, fetch: this.fetch });
        }
        insert(e2, { count: t2, defaultToNull: r2 = true } = {}) {
          var i2;
          if (t2 && this.headers.append("Prefer", `count=${t2}`), r2 || this.headers.append("Prefer", "missing=default"), Array.isArray(e2)) {
            let t3 = e2.reduce((e3, t4) => e3.concat(Object.keys(t4)), []);
            if (t3.length > 0) {
              let e3 = [...new Set(t3)].map((e4) => `"${e4}"`);
              this.url.searchParams.set("columns", e3.join(","));
            }
          }
          return new n.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null !== (i2 = this.fetch) && void 0 !== i2 ? i2 : fetch });
        }
        upsert(e2, { onConflict: t2, ignoreDuplicates: r2 = false, count: i2, defaultToNull: s2 = true } = {}) {
          var a;
          if (this.headers.append("Prefer", `resolution=${r2 ? "ignore" : "merge"}-duplicates`), void 0 !== t2 && this.url.searchParams.set("on_conflict", t2), i2 && this.headers.append("Prefer", `count=${i2}`), s2 || this.headers.append("Prefer", "missing=default"), Array.isArray(e2)) {
            let t3 = e2.reduce((e3, t4) => e3.concat(Object.keys(t4)), []);
            if (t3.length > 0) {
              let e3 = [...new Set(t3)].map((e4) => `"${e4}"`);
              this.url.searchParams.set("columns", e3.join(","));
            }
          }
          return new n.default({ method: "POST", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null !== (a = this.fetch) && void 0 !== a ? a : fetch });
        }
        update(e2, { count: t2 } = {}) {
          var r2;
          return t2 && this.headers.append("Prefer", `count=${t2}`), new n.default({ method: "PATCH", url: this.url, headers: this.headers, schema: this.schema, body: e2, fetch: null !== (r2 = this.fetch) && void 0 !== r2 ? r2 : fetch });
        }
        delete({ count: e2 } = {}) {
          var t2;
          return e2 && this.headers.append("Prefer", `count=${e2}`), new n.default({ method: "DELETE", url: this.url, headers: this.headers, schema: this.schema, fetch: null !== (t2 = this.fetch) && void 0 !== t2 ? t2 : fetch });
        }
      }
      t.default = s;
    }, 6251: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true });
      let n = i(r(8022));
      class s extends n.default {
        select(e2) {
          let t2 = false, r2 = (null != e2 ? e2 : "*").split("").map((e3) => /\s/.test(e3) && !t2 ? "" : ('"' === e3 && (t2 = !t2), e3)).join("");
          return this.url.searchParams.set("select", r2), this.headers.append("Prefer", "return=representation"), this;
        }
        order(e2, { ascending: t2 = true, nullsFirst: r2, foreignTable: i2, referencedTable: n2 = i2 } = {}) {
          let s2 = n2 ? `${n2}.order` : "order", a = this.url.searchParams.get(s2);
          return this.url.searchParams.set(s2, `${a ? `${a},` : ""}${e2}.${t2 ? "asc" : "desc"}${void 0 === r2 ? "" : r2 ? ".nullsfirst" : ".nullslast"}`), this;
        }
        limit(e2, { foreignTable: t2, referencedTable: r2 = t2 } = {}) {
          let i2 = void 0 === r2 ? "limit" : `${r2}.limit`;
          return this.url.searchParams.set(i2, `${e2}`), this;
        }
        range(e2, t2, { foreignTable: r2, referencedTable: i2 = r2 } = {}) {
          let n2 = void 0 === i2 ? "offset" : `${i2}.offset`, s2 = void 0 === i2 ? "limit" : `${i2}.limit`;
          return this.url.searchParams.set(n2, `${e2}`), this.url.searchParams.set(s2, `${t2 - e2 + 1}`), this;
        }
        abortSignal(e2) {
          return this.signal = e2, this;
        }
        single() {
          return this.headers.set("Accept", "application/vnd.pgrst.object+json"), this;
        }
        maybeSingle() {
          return "GET" === this.method ? this.headers.set("Accept", "application/json") : this.headers.set("Accept", "application/vnd.pgrst.object+json"), this.isMaybeSingle = true, this;
        }
        csv() {
          return this.headers.set("Accept", "text/csv"), this;
        }
        geojson() {
          return this.headers.set("Accept", "application/geo+json"), this;
        }
        explain({ analyze: e2 = false, verbose: t2 = false, settings: r2 = false, buffers: i2 = false, wal: n2 = false, format: s2 = "text" } = {}) {
          var a;
          let o = [e2 ? "analyze" : null, t2 ? "verbose" : null, r2 ? "settings" : null, i2 ? "buffers" : null, n2 ? "wal" : null].filter(Boolean).join("|"), l = null !== (a = this.headers.get("Accept")) && void 0 !== a ? a : "application/json";
          return this.headers.set("Accept", `application/vnd.pgrst.plan+${s2}; for="${l}"; options=${o};`), this;
        }
        rollback() {
          return this.headers.append("Prefer", "tx=rollback"), this;
        }
        returns() {
          return this;
        }
        maxAffected(e2) {
          return this.headers.append("Prefer", "handling=strict"), this.headers.append("Prefer", `max-affected=${e2}`), this;
        }
      }
      t.default = s;
    }, 6690: function(e, t, r) {
      "use strict";
      var i = this && this.__importDefault || function(e2) {
        return e2 && e2.__esModule ? e2 : { default: e2 };
      };
      Object.defineProperty(t, "__esModule", { value: true }), t.PostgrestError = t.PostgrestBuilder = t.PostgrestTransformBuilder = t.PostgrestFilterBuilder = t.PostgrestQueryBuilder = t.PostgrestClient = void 0;
      let n = i(r(8191));
      t.PostgrestClient = n.default;
      let s = i(r(3210));
      t.PostgrestQueryBuilder = s.default;
      let a = i(r(7401));
      t.PostgrestFilterBuilder = a.default;
      let o = i(r(6251));
      t.PostgrestTransformBuilder = o.default;
      let l = i(r(8022));
      t.PostgrestBuilder = l.default;
      let u = i(r(8335));
      t.PostgrestError = u.default, t.default = { PostgrestClient: n.default, PostgrestQueryBuilder: s.default, PostgrestFilterBuilder: a.default, PostgrestTransformBuilder: o.default, PostgrestBuilder: l.default, PostgrestError: u.default };
    }, 5945: (e) => {
      "use strict";
      var t = Object.defineProperty, r = Object.getOwnPropertyDescriptor, i = Object.getOwnPropertyNames, n = Object.prototype.hasOwnProperty, s = {};
      function a(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), i2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? i2 : `${i2}; ${r2.join("; ")}`;
      }
      function o(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [i2, n2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(i2, decodeURIComponent(null != n2 ? n2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function l(e2) {
        var t2, r2;
        if (!e2) return;
        let [[i2, n2], ...s2] = o(e2), { domain: a2, expires: l2, httponly: h2, maxage: d2, path: p, samesite: f, secure: g, partitioned: b, priority: v } = Object.fromEntries(s2.map(([e3, t3]) => [e3.toLowerCase(), t3]));
        return function(e3) {
          let t3 = {};
          for (let r3 in e3) e3[r3] && (t3[r3] = e3[r3]);
          return t3;
        }({ name: i2, value: decodeURIComponent(n2), domain: a2, ...l2 && { expires: new Date(l2) }, ...h2 && { httpOnly: true }, ..."string" == typeof d2 && { maxAge: Number(d2) }, path: p, ...f && { sameSite: u.includes(t2 = (t2 = f).toLowerCase()) ? t2 : void 0 }, ...g && { secure: true }, ...v && { priority: c.includes(r2 = (r2 = v).toLowerCase()) ? r2 : void 0 }, ...b && { partitioned: true } });
      }
      ((e2, r2) => {
        for (var i2 in r2) t(e2, i2, { get: r2[i2], enumerable: true });
      })(s, { RequestCookies: () => h, ResponseCookies: () => d, parseCookie: () => o, parseSetCookie: () => l, stringifyCookie: () => a }), e.exports = ((e2, s2, a2, o2) => {
        if (s2 && "object" == typeof s2 || "function" == typeof s2) for (let l2 of i(s2)) n.call(e2, l2) || l2 === a2 || t(e2, l2, { get: () => s2[l2], enumerable: !(o2 = r(s2, l2)) || o2.enumerable });
        return e2;
      })(t({}, "__esModule", { value: true }), s);
      var u = ["strict", "lax", "none"], c = ["low", "medium", "high"], h = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of o(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let i2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === i2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, i2 = this._parsed;
          return i2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(i2).map(([e3, t3]) => a(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => a(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, d = class {
        constructor(e2) {
          var t2, r2, i2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let n2 = null != (i2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? i2 : [];
          for (let e3 of Array.isArray(n2) ? n2 : function(e4) {
            if (!e4) return [];
            var t3, r3, i3, n3, s2, a2 = [], o2 = 0;
            function l2() {
              for (; o2 < e4.length && /\s/.test(e4.charAt(o2)); ) o2 += 1;
              return o2 < e4.length;
            }
            for (; o2 < e4.length; ) {
              for (t3 = o2, s2 = false; l2(); ) if ("," === (r3 = e4.charAt(o2))) {
                for (i3 = o2, o2 += 1, l2(), n3 = o2; o2 < e4.length && "=" !== (r3 = e4.charAt(o2)) && ";" !== r3 && "," !== r3; ) o2 += 1;
                o2 < e4.length && "=" === e4.charAt(o2) ? (s2 = true, o2 = n3, a2.push(e4.substring(t3, i3)), t3 = o2) : o2 = i3 + 1;
              } else o2 += 1;
              (!s2 || o2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(n2)) {
            let t3 = l(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let i2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === i2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, i2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, n2 = this._parsed;
          return n2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...i2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = a(r3);
              t3.append("set-cookie", e4);
            }
          }(n2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2, i2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0].path, e2[0].domain];
          return this.set({ name: t2, path: r2, domain: i2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(a).join("; ");
        }
      };
    }, 8439: (e, t, r) => {
      (() => {
        "use strict";
        var t2 = { 491: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ContextAPI = void 0;
          let i2 = r2(223), n2 = r2(172), s2 = r2(930), a = "context", o = new i2.NoopContextManager();
          class l {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new l()), this._instance;
            }
            setGlobalContextManager(e3) {
              return (0, n2.registerGlobal)(a, e3, s2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e3, t4, r3, ...i3) {
              return this._getContextManager().with(e3, t4, r3, ...i3);
            }
            bind(e3, t4) {
              return this._getContextManager().bind(e3, t4);
            }
            _getContextManager() {
              return (0, n2.getGlobal)(a) || o;
            }
            disable() {
              this._getContextManager().disable(), (0, n2.unregisterGlobal)(a, s2.DiagAPI.instance());
            }
          }
          t3.ContextAPI = l;
        }, 930: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagAPI = void 0;
          let i2 = r2(56), n2 = r2(912), s2 = r2(957), a = r2(172);
          class o {
            constructor() {
              function e3(e4) {
                return function(...t5) {
                  let r3 = (0, a.getGlobal)("diag");
                  if (r3) return r3[e4](...t5);
                };
              }
              let t4 = this;
              t4.setLogger = (e4, r3 = { logLevel: s2.DiagLogLevel.INFO }) => {
                var i3, o2, l;
                if (e4 === t4) {
                  let e5 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t4.error(null !== (i3 = e5.stack) && void 0 !== i3 ? i3 : e5.message), false;
                }
                "number" == typeof r3 && (r3 = { logLevel: r3 });
                let u = (0, a.getGlobal)("diag"), c = (0, n2.createLogLevelDiagLogger)(null !== (o2 = r3.logLevel) && void 0 !== o2 ? o2 : s2.DiagLogLevel.INFO, e4);
                if (u && !r3.suppressOverrideMessage) {
                  let e5 = null !== (l = Error().stack) && void 0 !== l ? l : "<failed to generate stacktrace>";
                  u.warn(`Current logger will be overwritten from ${e5}`), c.warn(`Current logger will overwrite one already registered from ${e5}`);
                }
                return (0, a.registerGlobal)("diag", c, t4, true);
              }, t4.disable = () => {
                (0, a.unregisterGlobal)("diag", t4);
              }, t4.createComponentLogger = (e4) => new i2.DiagComponentLogger(e4), t4.verbose = e3("verbose"), t4.debug = e3("debug"), t4.info = e3("info"), t4.warn = e3("warn"), t4.error = e3("error");
            }
            static instance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
          }
          t3.DiagAPI = o;
        }, 653: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.MetricsAPI = void 0;
          let i2 = r2(660), n2 = r2(172), s2 = r2(930), a = "metrics";
          class o {
            constructor() {
            }
            static getInstance() {
              return this._instance || (this._instance = new o()), this._instance;
            }
            setGlobalMeterProvider(e3) {
              return (0, n2.registerGlobal)(a, e3, s2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, n2.getGlobal)(a) || i2.NOOP_METER_PROVIDER;
            }
            getMeter(e3, t4, r3) {
              return this.getMeterProvider().getMeter(e3, t4, r3);
            }
            disable() {
              (0, n2.unregisterGlobal)(a, s2.DiagAPI.instance());
            }
          }
          t3.MetricsAPI = o;
        }, 181: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.PropagationAPI = void 0;
          let i2 = r2(172), n2 = r2(874), s2 = r2(194), a = r2(277), o = r2(369), l = r2(930), u = "propagation", c = new n2.NoopTextMapPropagator();
          class h {
            constructor() {
              this.createBaggage = o.createBaggage, this.getBaggage = a.getBaggage, this.getActiveBaggage = a.getActiveBaggage, this.setBaggage = a.setBaggage, this.deleteBaggage = a.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new h()), this._instance;
            }
            setGlobalPropagator(e3) {
              return (0, i2.registerGlobal)(u, e3, l.DiagAPI.instance());
            }
            inject(e3, t4, r3 = s2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e3, t4, r3);
            }
            extract(e3, t4, r3 = s2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e3, t4, r3);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, i2.unregisterGlobal)(u, l.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, i2.getGlobal)(u) || c;
            }
          }
          t3.PropagationAPI = h;
        }, 997: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceAPI = void 0;
          let i2 = r2(172), n2 = r2(846), s2 = r2(139), a = r2(607), o = r2(930), l = "trace";
          class u {
            constructor() {
              this._proxyTracerProvider = new n2.ProxyTracerProvider(), this.wrapSpanContext = s2.wrapSpanContext, this.isSpanContextValid = s2.isSpanContextValid, this.deleteSpan = a.deleteSpan, this.getSpan = a.getSpan, this.getActiveSpan = a.getActiveSpan, this.getSpanContext = a.getSpanContext, this.setSpan = a.setSpan, this.setSpanContext = a.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new u()), this._instance;
            }
            setGlobalTracerProvider(e3) {
              let t4 = (0, i2.registerGlobal)(l, this._proxyTracerProvider, o.DiagAPI.instance());
              return t4 && this._proxyTracerProvider.setDelegate(e3), t4;
            }
            getTracerProvider() {
              return (0, i2.getGlobal)(l) || this._proxyTracerProvider;
            }
            getTracer(e3, t4) {
              return this.getTracerProvider().getTracer(e3, t4);
            }
            disable() {
              (0, i2.unregisterGlobal)(l, o.DiagAPI.instance()), this._proxyTracerProvider = new n2.ProxyTracerProvider();
            }
          }
          t3.TraceAPI = u;
        }, 277: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.deleteBaggage = t3.setBaggage = t3.getActiveBaggage = t3.getBaggage = void 0;
          let i2 = r2(491), n2 = (0, r2(780).createContextKey)("OpenTelemetry Baggage Key");
          function s2(e3) {
            return e3.getValue(n2) || void 0;
          }
          t3.getBaggage = s2, t3.getActiveBaggage = function() {
            return s2(i2.ContextAPI.getInstance().active());
          }, t3.setBaggage = function(e3, t4) {
            return e3.setValue(n2, t4);
          }, t3.deleteBaggage = function(e3) {
            return e3.deleteValue(n2);
          };
        }, 993: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.BaggageImpl = void 0;
          class r2 {
            constructor(e3) {
              this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
            }
            getEntry(e3) {
              let t4 = this._entries.get(e3);
              if (t4) return Object.assign({}, t4);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e3, t4]) => [e3, t4]);
            }
            setEntry(e3, t4) {
              let i2 = new r2(this._entries);
              return i2._entries.set(e3, t4), i2;
            }
            removeEntry(e3) {
              let t4 = new r2(this._entries);
              return t4._entries.delete(e3), t4;
            }
            removeEntries(...e3) {
              let t4 = new r2(this._entries);
              for (let r3 of e3) t4._entries.delete(r3);
              return t4;
            }
            clear() {
              return new r2();
            }
          }
          t3.BaggageImpl = r2;
        }, 830: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataSymbol = void 0, t3.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 369: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.baggageEntryMetadataFromString = t3.createBaggage = void 0;
          let i2 = r2(930), n2 = r2(993), s2 = r2(830), a = i2.DiagAPI.instance();
          t3.createBaggage = function(e3 = {}) {
            return new n2.BaggageImpl(new Map(Object.entries(e3)));
          }, t3.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (a.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: s2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 67: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.context = void 0;
          let i2 = r2(491);
          t3.context = i2.ContextAPI.getInstance();
        }, 223: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopContextManager = void 0;
          let i2 = r2(780);
          class n2 {
            active() {
              return i2.ROOT_CONTEXT;
            }
            with(e3, t4, r3, ...i3) {
              return t4.call(r3, ...i3);
            }
            bind(e3, t4) {
              return t4;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          }
          t3.NoopContextManager = n2;
        }, 780: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ROOT_CONTEXT = t3.createContextKey = void 0, t3.createContextKey = function(e3) {
            return Symbol.for(e3);
          };
          class r2 {
            constructor(e3) {
              let t4 = this;
              t4._currentContext = e3 ? new Map(e3) : /* @__PURE__ */ new Map(), t4.getValue = (e4) => t4._currentContext.get(e4), t4.setValue = (e4, i2) => {
                let n2 = new r2(t4._currentContext);
                return n2._currentContext.set(e4, i2), n2;
              }, t4.deleteValue = (e4) => {
                let i2 = new r2(t4._currentContext);
                return i2._currentContext.delete(e4), i2;
              };
            }
          }
          t3.ROOT_CONTEXT = new r2();
        }, 506: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.diag = void 0;
          let i2 = r2(930);
          t3.diag = i2.DiagAPI.instance();
        }, 56: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagComponentLogger = void 0;
          let i2 = r2(172);
          class n2 {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return s2("debug", this._namespace, e3);
            }
            error(...e3) {
              return s2("error", this._namespace, e3);
            }
            info(...e3) {
              return s2("info", this._namespace, e3);
            }
            warn(...e3) {
              return s2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return s2("verbose", this._namespace, e3);
            }
          }
          function s2(e3, t4, r3) {
            let n3 = (0, i2.getGlobal)("diag");
            if (n3) return r3.unshift(t4), n3[e3](...r3);
          }
          t3.DiagComponentLogger = n2;
        }, 972: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagConsoleLogger = void 0;
          let r2 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          class i2 {
            constructor() {
              for (let e3 = 0; e3 < r2.length; e3++) this[r2[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t4) {
                  if (console) {
                    let r3 = console[e4];
                    if ("function" != typeof r3 && (r3 = console.log), "function" == typeof r3) return r3.apply(console, t4);
                  }
                };
              }(r2[e3].c);
            }
          }
          t3.DiagConsoleLogger = i2;
        }, 912: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createLogLevelDiagLogger = void 0;
          let i2 = r2(957);
          t3.createLogLevelDiagLogger = function(e3, t4) {
            function r3(r4, i3) {
              let n2 = t4[r4];
              return "function" == typeof n2 && e3 >= i3 ? n2.bind(t4) : function() {
              };
            }
            return e3 < i2.DiagLogLevel.NONE ? e3 = i2.DiagLogLevel.NONE : e3 > i2.DiagLogLevel.ALL && (e3 = i2.DiagLogLevel.ALL), t4 = t4 || {}, { error: r3("error", i2.DiagLogLevel.ERROR), warn: r3("warn", i2.DiagLogLevel.WARN), info: r3("info", i2.DiagLogLevel.INFO), debug: r3("debug", i2.DiagLogLevel.DEBUG), verbose: r3("verbose", i2.DiagLogLevel.VERBOSE) };
          };
        }, 957: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.DiagLogLevel = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.ERROR = 30] = "ERROR", e3[e3.WARN = 50] = "WARN", e3[e3.INFO = 60] = "INFO", e3[e3.DEBUG = 70] = "DEBUG", e3[e3.VERBOSE = 80] = "VERBOSE", e3[e3.ALL = 9999] = "ALL";
          }(t3.DiagLogLevel || (t3.DiagLogLevel = {}));
        }, 172: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.unregisterGlobal = t3.getGlobal = t3.registerGlobal = void 0;
          let i2 = r2(200), n2 = r2(521), s2 = r2(130), a = n2.VERSION.split(".")[0], o = Symbol.for(`opentelemetry.js.api.${a}`), l = i2._globalThis;
          t3.registerGlobal = function(e3, t4, r3, i3 = false) {
            var s3;
            let a2 = l[o] = null !== (s3 = l[o]) && void 0 !== s3 ? s3 : { version: n2.VERSION };
            if (!i3 && a2[e3]) {
              let t5 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r3.error(t5.stack || t5.message), false;
            }
            if (a2.version !== n2.VERSION) {
              let t5 = Error(`@opentelemetry/api: Registration of version v${a2.version} for ${e3} does not match previously registered API v${n2.VERSION}`);
              return r3.error(t5.stack || t5.message), false;
            }
            return a2[e3] = t4, r3.debug(`@opentelemetry/api: Registered a global for ${e3} v${n2.VERSION}.`), true;
          }, t3.getGlobal = function(e3) {
            var t4, r3;
            let i3 = null === (t4 = l[o]) || void 0 === t4 ? void 0 : t4.version;
            if (i3 && (0, s2.isCompatible)(i3)) return null === (r3 = l[o]) || void 0 === r3 ? void 0 : r3[e3];
          }, t3.unregisterGlobal = function(e3, t4) {
            t4.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${n2.VERSION}.`);
            let r3 = l[o];
            r3 && delete r3[e3];
          };
        }, 130: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.isCompatible = t3._makeCompatibilityCheck = void 0;
          let i2 = r2(521), n2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function s2(e3) {
            let t4 = /* @__PURE__ */ new Set([e3]), r3 = /* @__PURE__ */ new Set(), i3 = e3.match(n2);
            if (!i3) return () => false;
            let s3 = { major: +i3[1], minor: +i3[2], patch: +i3[3], prerelease: i3[4] };
            if (null != s3.prerelease) return function(t5) {
              return t5 === e3;
            };
            function a(e4) {
              return r3.add(e4), false;
            }
            return function(e4) {
              if (t4.has(e4)) return true;
              if (r3.has(e4)) return false;
              let i4 = e4.match(n2);
              if (!i4) return a(e4);
              let o = { major: +i4[1], minor: +i4[2], patch: +i4[3], prerelease: i4[4] };
              return null != o.prerelease || s3.major !== o.major ? a(e4) : 0 === s3.major ? s3.minor === o.minor && s3.patch <= o.patch ? (t4.add(e4), true) : a(e4) : s3.minor <= o.minor ? (t4.add(e4), true) : a(e4);
            };
          }
          t3._makeCompatibilityCheck = s2, t3.isCompatible = s2(i2.VERSION);
        }, 886: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.metrics = void 0;
          let i2 = r2(653);
          t3.metrics = i2.MetricsAPI.getInstance();
        }, 901: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ValueType = void 0, function(e3) {
            e3[e3.INT = 0] = "INT", e3[e3.DOUBLE = 1] = "DOUBLE";
          }(t3.ValueType || (t3.ValueType = {}));
        }, 102: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createNoopMeter = t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t3.NOOP_OBSERVABLE_GAUGE_METRIC = t3.NOOP_OBSERVABLE_COUNTER_METRIC = t3.NOOP_UP_DOWN_COUNTER_METRIC = t3.NOOP_HISTOGRAM_METRIC = t3.NOOP_COUNTER_METRIC = t3.NOOP_METER = t3.NoopObservableUpDownCounterMetric = t3.NoopObservableGaugeMetric = t3.NoopObservableCounterMetric = t3.NoopObservableMetric = t3.NoopHistogramMetric = t3.NoopUpDownCounterMetric = t3.NoopCounterMetric = t3.NoopMetric = t3.NoopMeter = void 0;
          class r2 {
            constructor() {
            }
            createHistogram(e3, r3) {
              return t3.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r3) {
              return t3.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r3) {
              return t3.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r3) {
              return t3.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r3) {
              return t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t4) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t3.NoopMeter = r2;
          class i2 {
          }
          t3.NoopMetric = i2;
          class n2 extends i2 {
            add(e3, t4) {
            }
          }
          t3.NoopCounterMetric = n2;
          class s2 extends i2 {
            add(e3, t4) {
            }
          }
          t3.NoopUpDownCounterMetric = s2;
          class a extends i2 {
            record(e3, t4) {
            }
          }
          t3.NoopHistogramMetric = a;
          class o {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t3.NoopObservableMetric = o;
          class l extends o {
          }
          t3.NoopObservableCounterMetric = l;
          class u extends o {
          }
          t3.NoopObservableGaugeMetric = u;
          class c extends o {
          }
          t3.NoopObservableUpDownCounterMetric = c, t3.NOOP_METER = new r2(), t3.NOOP_COUNTER_METRIC = new n2(), t3.NOOP_HISTOGRAM_METRIC = new a(), t3.NOOP_UP_DOWN_COUNTER_METRIC = new s2(), t3.NOOP_OBSERVABLE_COUNTER_METRIC = new l(), t3.NOOP_OBSERVABLE_GAUGE_METRIC = new u(), t3.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new c(), t3.createNoopMeter = function() {
            return t3.NOOP_METER;
          };
        }, 660: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NOOP_METER_PROVIDER = t3.NoopMeterProvider = void 0;
          let i2 = r2(102);
          class n2 {
            getMeter(e3, t4, r3) {
              return i2.NOOP_METER;
            }
          }
          t3.NoopMeterProvider = n2, t3.NOOP_METER_PROVIDER = new n2();
        }, 200: function(e2, t3, r2) {
          var i2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), Object.defineProperty(e3, i3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), e3[i3] = t4[r3];
          }), n2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || i2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), n2(r2(46), t3);
        }, 651: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3._globalThis = void 0, t3._globalThis = "object" == typeof globalThis ? globalThis : r.g;
        }, 46: function(e2, t3, r2) {
          var i2 = this && this.__createBinding || (Object.create ? function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), Object.defineProperty(e3, i3, { enumerable: true, get: function() {
              return t4[r3];
            } });
          } : function(e3, t4, r3, i3) {
            void 0 === i3 && (i3 = r3), e3[i3] = t4[r3];
          }), n2 = this && this.__exportStar || function(e3, t4) {
            for (var r3 in e3) "default" === r3 || Object.prototype.hasOwnProperty.call(t4, r3) || i2(t4, e3, r3);
          };
          Object.defineProperty(t3, "__esModule", { value: true }), n2(r2(651), t3);
        }, 939: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.propagation = void 0;
          let i2 = r2(181);
          t3.propagation = i2.PropagationAPI.getInstance();
        }, 874: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTextMapPropagator = void 0;
          class r2 {
            inject(e3, t4) {
            }
            extract(e3, t4) {
              return e3;
            }
            fields() {
              return [];
            }
          }
          t3.NoopTextMapPropagator = r2;
        }, 194: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.defaultTextMapSetter = t3.defaultTextMapGetter = void 0, t3.defaultTextMapGetter = { get(e3, t4) {
            if (null != e3) return e3[t4];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t3.defaultTextMapSetter = { set(e3, t4, r2) {
            null != e3 && (e3[t4] = r2);
          } };
        }, 845: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.trace = void 0;
          let i2 = r2(997);
          t3.trace = i2.TraceAPI.getInstance();
        }, 403: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NonRecordingSpan = void 0;
          let i2 = r2(476);
          class n2 {
            constructor(e3 = i2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t4) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t4) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t4) {
            }
          }
          t3.NonRecordingSpan = n2;
        }, 614: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracer = void 0;
          let i2 = r2(491), n2 = r2(607), s2 = r2(403), a = r2(139), o = i2.ContextAPI.getInstance();
          class l {
            startSpan(e3, t4, r3 = o.active()) {
              if (null == t4 ? void 0 : t4.root) return new s2.NonRecordingSpan();
              let i3 = r3 && (0, n2.getSpanContext)(r3);
              return "object" == typeof i3 && "string" == typeof i3.spanId && "string" == typeof i3.traceId && "number" == typeof i3.traceFlags && (0, a.isSpanContextValid)(i3) ? new s2.NonRecordingSpan(i3) : new s2.NonRecordingSpan();
            }
            startActiveSpan(e3, t4, r3, i3) {
              let s3, a2, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t4 : 3 == arguments.length ? (s3 = t4, l2 = r3) : (s3 = t4, a2 = r3, l2 = i3);
              let u = null != a2 ? a2 : o.active(), c = this.startSpan(e3, s3, u), h = (0, n2.setSpan)(u, c);
              return o.with(h, l2, void 0, c);
            }
          }
          t3.NoopTracer = l;
        }, 124: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.NoopTracerProvider = void 0;
          let i2 = r2(614);
          class n2 {
            getTracer(e3, t4, r3) {
              return new i2.NoopTracer();
            }
          }
          t3.NoopTracerProvider = n2;
        }, 125: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracer = void 0;
          let i2 = new (r2(614)).NoopTracer();
          class n2 {
            constructor(e3, t4, r3, i3) {
              this._provider = e3, this.name = t4, this.version = r3, this.options = i3;
            }
            startSpan(e3, t4, r3) {
              return this._getTracer().startSpan(e3, t4, r3);
            }
            startActiveSpan(e3, t4, r3, i3) {
              let n3 = this._getTracer();
              return Reflect.apply(n3.startActiveSpan, n3, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : i2;
            }
          }
          t3.ProxyTracer = n2;
        }, 846: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.ProxyTracerProvider = void 0;
          let i2 = r2(125), n2 = new (r2(124)).NoopTracerProvider();
          class s2 {
            getTracer(e3, t4, r3) {
              var n3;
              return null !== (n3 = this.getDelegateTracer(e3, t4, r3)) && void 0 !== n3 ? n3 : new i2.ProxyTracer(this, e3, t4, r3);
            }
            getDelegate() {
              var e3;
              return null !== (e3 = this._delegate) && void 0 !== e3 ? e3 : n2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t4, r3) {
              var i3;
              return null === (i3 = this._delegate) || void 0 === i3 ? void 0 : i3.getTracer(e3, t4, r3);
            }
          }
          t3.ProxyTracerProvider = s2;
        }, 996: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SamplingDecision = void 0, function(e3) {
            e3[e3.NOT_RECORD = 0] = "NOT_RECORD", e3[e3.RECORD = 1] = "RECORD", e3[e3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
          }(t3.SamplingDecision || (t3.SamplingDecision = {}));
        }, 607: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.getSpanContext = t3.setSpanContext = t3.deleteSpan = t3.setSpan = t3.getActiveSpan = t3.getSpan = void 0;
          let i2 = r2(780), n2 = r2(403), s2 = r2(491), a = (0, i2.createContextKey)("OpenTelemetry Context Key SPAN");
          function o(e3) {
            return e3.getValue(a) || void 0;
          }
          function l(e3, t4) {
            return e3.setValue(a, t4);
          }
          t3.getSpan = o, t3.getActiveSpan = function() {
            return o(s2.ContextAPI.getInstance().active());
          }, t3.setSpan = l, t3.deleteSpan = function(e3) {
            return e3.deleteValue(a);
          }, t3.setSpanContext = function(e3, t4) {
            return l(e3, new n2.NonRecordingSpan(t4));
          }, t3.getSpanContext = function(e3) {
            var t4;
            return null === (t4 = o(e3)) || void 0 === t4 ? void 0 : t4.spanContext();
          };
        }, 325: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceStateImpl = void 0;
          let i2 = r2(564);
          class n2 {
            constructor(e3) {
              this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
            }
            set(e3, t4) {
              let r3 = this._clone();
              return r3._internalState.has(e3) && r3._internalState.delete(e3), r3._internalState.set(e3, t4), r3;
            }
            unset(e3) {
              let t4 = this._clone();
              return t4._internalState.delete(e3), t4;
            }
            get(e3) {
              return this._internalState.get(e3);
            }
            serialize() {
              return this._keys().reduce((e3, t4) => (e3.push(t4 + "=" + this.get(t4)), e3), []).join(",");
            }
            _parse(e3) {
              !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce((e4, t4) => {
                let r3 = t4.trim(), n3 = r3.indexOf("=");
                if (-1 !== n3) {
                  let s2 = r3.slice(0, n3), a = r3.slice(n3 + 1, t4.length);
                  (0, i2.validateKey)(s2) && (0, i2.validateValue)(a) && e4.set(s2, a);
                }
                return e4;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let e3 = new n2();
              return e3._internalState = new Map(this._internalState), e3;
            }
          }
          t3.TraceStateImpl = n2;
        }, 564: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.validateValue = t3.validateKey = void 0;
          let r2 = "[_0-9a-z-*/]", i2 = `[a-z]${r2}{0,255}`, n2 = `[a-z0-9]${r2}{0,240}@[a-z]${r2}{0,13}`, s2 = RegExp(`^(?:${i2}|${n2})$`), a = /^[ -~]{0,255}[!-~]$/, o = /,|=/;
          t3.validateKey = function(e3) {
            return s2.test(e3);
          }, t3.validateValue = function(e3) {
            return a.test(e3) && !o.test(e3);
          };
        }, 98: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.createTraceState = void 0;
          let i2 = r2(325);
          t3.createTraceState = function(e3) {
            return new i2.TraceStateImpl(e3);
          };
        }, 476: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.INVALID_SPAN_CONTEXT = t3.INVALID_TRACEID = t3.INVALID_SPANID = void 0;
          let i2 = r2(475);
          t3.INVALID_SPANID = "0000000000000000", t3.INVALID_TRACEID = "00000000000000000000000000000000", t3.INVALID_SPAN_CONTEXT = { traceId: t3.INVALID_TRACEID, spanId: t3.INVALID_SPANID, traceFlags: i2.TraceFlags.NONE };
        }, 357: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanKind = void 0, function(e3) {
            e3[e3.INTERNAL = 0] = "INTERNAL", e3[e3.SERVER = 1] = "SERVER", e3[e3.CLIENT = 2] = "CLIENT", e3[e3.PRODUCER = 3] = "PRODUCER", e3[e3.CONSUMER = 4] = "CONSUMER";
          }(t3.SpanKind || (t3.SpanKind = {}));
        }, 139: (e2, t3, r2) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.wrapSpanContext = t3.isSpanContextValid = t3.isValidSpanId = t3.isValidTraceId = void 0;
          let i2 = r2(476), n2 = r2(403), s2 = /^([0-9a-f]{32})$/i, a = /^[0-9a-f]{16}$/i;
          function o(e3) {
            return s2.test(e3) && e3 !== i2.INVALID_TRACEID;
          }
          function l(e3) {
            return a.test(e3) && e3 !== i2.INVALID_SPANID;
          }
          t3.isValidTraceId = o, t3.isValidSpanId = l, t3.isSpanContextValid = function(e3) {
            return o(e3.traceId) && l(e3.spanId);
          }, t3.wrapSpanContext = function(e3) {
            return new n2.NonRecordingSpan(e3);
          };
        }, 847: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.SpanStatusCode = void 0, function(e3) {
            e3[e3.UNSET = 0] = "UNSET", e3[e3.OK = 1] = "OK", e3[e3.ERROR = 2] = "ERROR";
          }(t3.SpanStatusCode || (t3.SpanStatusCode = {}));
        }, 475: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.TraceFlags = void 0, function(e3) {
            e3[e3.NONE = 0] = "NONE", e3[e3.SAMPLED = 1] = "SAMPLED";
          }(t3.TraceFlags || (t3.TraceFlags = {}));
        }, 521: (e2, t3) => {
          Object.defineProperty(t3, "__esModule", { value: true }), t3.VERSION = void 0, t3.VERSION = "1.6.0";
        } }, i = {};
        function n(e2) {
          var r2 = i[e2];
          if (void 0 !== r2) return r2.exports;
          var s2 = i[e2] = { exports: {} }, a = true;
          try {
            t2[e2].call(s2.exports, s2, s2.exports, n), a = false;
          } finally {
            a && delete i[e2];
          }
          return s2.exports;
        }
        n.ab = "//";
        var s = {};
        (() => {
          Object.defineProperty(s, "__esModule", { value: true }), s.trace = s.propagation = s.metrics = s.diag = s.context = s.INVALID_SPAN_CONTEXT = s.INVALID_TRACEID = s.INVALID_SPANID = s.isValidSpanId = s.isValidTraceId = s.isSpanContextValid = s.createTraceState = s.TraceFlags = s.SpanStatusCode = s.SpanKind = s.SamplingDecision = s.ProxyTracerProvider = s.ProxyTracer = s.defaultTextMapSetter = s.defaultTextMapGetter = s.ValueType = s.createNoopMeter = s.DiagLogLevel = s.DiagConsoleLogger = s.ROOT_CONTEXT = s.createContextKey = s.baggageEntryMetadataFromString = void 0;
          var e2 = n(369);
          Object.defineProperty(s, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
            return e2.baggageEntryMetadataFromString;
          } });
          var t3 = n(780);
          Object.defineProperty(s, "createContextKey", { enumerable: true, get: function() {
            return t3.createContextKey;
          } }), Object.defineProperty(s, "ROOT_CONTEXT", { enumerable: true, get: function() {
            return t3.ROOT_CONTEXT;
          } });
          var r2 = n(972);
          Object.defineProperty(s, "DiagConsoleLogger", { enumerable: true, get: function() {
            return r2.DiagConsoleLogger;
          } });
          var i2 = n(957);
          Object.defineProperty(s, "DiagLogLevel", { enumerable: true, get: function() {
            return i2.DiagLogLevel;
          } });
          var a = n(102);
          Object.defineProperty(s, "createNoopMeter", { enumerable: true, get: function() {
            return a.createNoopMeter;
          } });
          var o = n(901);
          Object.defineProperty(s, "ValueType", { enumerable: true, get: function() {
            return o.ValueType;
          } });
          var l = n(194);
          Object.defineProperty(s, "defaultTextMapGetter", { enumerable: true, get: function() {
            return l.defaultTextMapGetter;
          } }), Object.defineProperty(s, "defaultTextMapSetter", { enumerable: true, get: function() {
            return l.defaultTextMapSetter;
          } });
          var u = n(125);
          Object.defineProperty(s, "ProxyTracer", { enumerable: true, get: function() {
            return u.ProxyTracer;
          } });
          var c = n(846);
          Object.defineProperty(s, "ProxyTracerProvider", { enumerable: true, get: function() {
            return c.ProxyTracerProvider;
          } });
          var h = n(996);
          Object.defineProperty(s, "SamplingDecision", { enumerable: true, get: function() {
            return h.SamplingDecision;
          } });
          var d = n(357);
          Object.defineProperty(s, "SpanKind", { enumerable: true, get: function() {
            return d.SpanKind;
          } });
          var p = n(847);
          Object.defineProperty(s, "SpanStatusCode", { enumerable: true, get: function() {
            return p.SpanStatusCode;
          } });
          var f = n(475);
          Object.defineProperty(s, "TraceFlags", { enumerable: true, get: function() {
            return f.TraceFlags;
          } });
          var g = n(98);
          Object.defineProperty(s, "createTraceState", { enumerable: true, get: function() {
            return g.createTraceState;
          } });
          var b = n(139);
          Object.defineProperty(s, "isSpanContextValid", { enumerable: true, get: function() {
            return b.isSpanContextValid;
          } }), Object.defineProperty(s, "isValidTraceId", { enumerable: true, get: function() {
            return b.isValidTraceId;
          } }), Object.defineProperty(s, "isValidSpanId", { enumerable: true, get: function() {
            return b.isValidSpanId;
          } });
          var v = n(476);
          Object.defineProperty(s, "INVALID_SPANID", { enumerable: true, get: function() {
            return v.INVALID_SPANID;
          } }), Object.defineProperty(s, "INVALID_TRACEID", { enumerable: true, get: function() {
            return v.INVALID_TRACEID;
          } }), Object.defineProperty(s, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
            return v.INVALID_SPAN_CONTEXT;
          } });
          let w = n(67);
          Object.defineProperty(s, "context", { enumerable: true, get: function() {
            return w.context;
          } });
          let m = n(506);
          Object.defineProperty(s, "diag", { enumerable: true, get: function() {
            return m.diag;
          } });
          let y = n(886);
          Object.defineProperty(s, "metrics", { enumerable: true, get: function() {
            return y.metrics;
          } });
          let _ = n(939);
          Object.defineProperty(s, "propagation", { enumerable: true, get: function() {
            return _.propagation;
          } });
          let S = n(845);
          Object.defineProperty(s, "trace", { enumerable: true, get: function() {
            return S.trace;
          } }), s.default = { context: w.context, diag: m.diag, metrics: y.metrics, propagation: _.propagation, trace: S.trace };
        })(), e.exports = s;
      })();
    }, 1133: (e) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "//");
        var t = {};
        (() => {
          t.parse = function(t2, r2) {
            if ("string" != typeof t2) throw TypeError("argument str must be a string");
            for (var n2 = {}, s = t2.split(i), a = (r2 || {}).decode || e2, o = 0; o < s.length; o++) {
              var l = s[o], u = l.indexOf("=");
              if (!(u < 0)) {
                var c = l.substr(0, u).trim(), h = l.substr(++u, l.length).trim();
                '"' == h[0] && (h = h.slice(1, -1)), void 0 == n2[c] && (n2[c] = function(e3, t3) {
                  try {
                    return t3(e3);
                  } catch (t4) {
                    return e3;
                  }
                }(h, a));
              }
            }
            return n2;
          }, t.serialize = function(e3, t2, i2) {
            var s = i2 || {}, a = s.encode || r;
            if ("function" != typeof a) throw TypeError("option encode is invalid");
            if (!n.test(e3)) throw TypeError("argument name is invalid");
            var o = a(t2);
            if (o && !n.test(o)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + o;
            if (null != s.maxAge) {
              var u = s.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (s.domain) {
              if (!n.test(s.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + s.domain;
            }
            if (s.path) {
              if (!n.test(s.path)) throw TypeError("option path is invalid");
              l += "; Path=" + s.path;
            }
            if (s.expires) {
              if ("function" != typeof s.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + s.expires.toUTCString();
            }
            if (s.httpOnly && (l += "; HttpOnly"), s.secure && (l += "; Secure"), s.sameSite) switch ("string" == typeof s.sameSite ? s.sameSite.toLowerCase() : s.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var e2 = decodeURIComponent, r = encodeURIComponent, i = /; */, n = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), e.exports = t;
      })();
    }, 340: (e, t, r) => {
      var i;
      (() => {
        var n = { 226: function(n2, s2) {
          !function(a2, o2) {
            "use strict";
            var l = "function", u = "undefined", c = "object", h = "string", d = "major", p = "model", f = "name", g = "type", b = "vendor", v = "version", w = "architecture", m = "console", y = "mobile", _ = "tablet", S = "smarttv", k = "wearable", O = "embedded", E = "Amazon", T = "Apple", x = "ASUS", C = "BlackBerry", P = "Browser", I = "Chrome", R = "Firefox", A = "Google", j = "Huawei", N = "Microsoft", L = "Motorola", $ = "Opera", M = "Samsung", U = "Sharp", D = "Sony", B = "Xiaomi", q = "Zebra", V = "Facebook", H = "Chromium OS", F = "Mac OS", z = function(e2, t2) {
              var r2 = {};
              for (var i2 in e2) t2[i2] && t2[i2].length % 2 == 0 ? r2[i2] = t2[i2].concat(e2[i2]) : r2[i2] = e2[i2];
              return r2;
            }, K = function(e2) {
              for (var t2 = {}, r2 = 0; r2 < e2.length; r2++) t2[e2[r2].toUpperCase()] = e2[r2];
              return t2;
            }, W = function(e2, t2) {
              return typeof e2 === h && -1 !== J(t2).indexOf(J(e2));
            }, J = function(e2) {
              return e2.toLowerCase();
            }, G = function(e2, t2) {
              if (typeof e2 === h) return e2 = e2.replace(/^\s\s*/, ""), typeof t2 === u ? e2 : e2.substring(0, 350);
            }, X = function(e2, t2) {
              for (var r2, i2, n3, s3, a3, u2, h2 = 0; h2 < t2.length && !a3; ) {
                var d2 = t2[h2], p2 = t2[h2 + 1];
                for (r2 = i2 = 0; r2 < d2.length && !a3 && d2[r2]; ) if (a3 = d2[r2++].exec(e2)) for (n3 = 0; n3 < p2.length; n3++) u2 = a3[++i2], typeof (s3 = p2[n3]) === c && s3.length > 0 ? 2 === s3.length ? typeof s3[1] == l ? this[s3[0]] = s3[1].call(this, u2) : this[s3[0]] = s3[1] : 3 === s3.length ? typeof s3[1] !== l || s3[1].exec && s3[1].test ? this[s3[0]] = u2 ? u2.replace(s3[1], s3[2]) : void 0 : this[s3[0]] = u2 ? s3[1].call(this, u2, s3[2]) : void 0 : 4 === s3.length && (this[s3[0]] = u2 ? s3[3].call(this, u2.replace(s3[1], s3[2])) : void 0) : this[s3] = u2 || o2;
                h2 += 2;
              }
            }, Y = function(e2, t2) {
              for (var r2 in t2) if (typeof t2[r2] === c && t2[r2].length > 0) {
                for (var i2 = 0; i2 < t2[r2].length; i2++) if (W(t2[r2][i2], e2)) return "?" === r2 ? o2 : r2;
              } else if (W(t2[r2], e2)) return "?" === r2 ? o2 : r2;
              return e2;
            }, Z = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, Q = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [v, [f, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [v, [f, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [f, v], [/opios[\/ ]+([\w\.]+)/i], [v, [f, $ + " Mini"]], [/\bopr\/([\w\.]+)/i], [v, [f, $]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [f, v], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [v, [f, "UC" + P]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [v, [f, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [v, [f, "WeChat"]], [/konqueror\/([\w\.]+)/i], [v, [f, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [v, [f, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [v, [f, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[f, /(.+)/, "$1 Secure " + P], v], [/\bfocus\/([\w\.]+)/i], [v, [f, R + " Focus"]], [/\bopt\/([\w\.]+)/i], [v, [f, $ + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [v, [f, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [v, [f, "Dolphin"]], [/coast\/([\w\.]+)/i], [v, [f, $ + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [v, [f, "MIUI " + P]], [/fxios\/([-\w\.]+)/i], [v, [f, R]], [/\bqihu|(qi?ho?o?|360)browser/i], [[f, "360 " + P]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[f, /(.+)/, "$1 " + P], v], [/(comodo_dragon)\/([\w\.]+)/i], [[f, /_/g, " "], v], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [f, v], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [f], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[f, V], v], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [f, v], [/\bgsa\/([\w\.]+) .*safari\//i], [v, [f, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [v, [f, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [v, [f, I + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[f, I + " WebView"], v], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [v, [f, "Android " + P]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [f, v], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [v, [f, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [v, f], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [f, [v, Y, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [f, v], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[f, "Netscape"], v], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [v, [f, R + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [f, v], [/(cobalt)\/([\w\.]+)/i], [f, [v, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[w, "amd64"]], [/(ia32(?=;))/i], [[w, J]], [/((?:i[346]|x)86)[;\)]/i], [[w, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[w, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[w, "armhf"]], [/windows (ce|mobile); ppc;/i], [[w, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[w, /ower/, "", J]], [/(sun4\w)[;\)]/i], [[w, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[w, J]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [p, [b, M], [g, _]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [p, [b, M], [g, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [p, [b, T], [g, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [p, [b, T], [g, _]], [/(macintosh);/i], [p, [b, T]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [p, [b, U], [g, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [p, [b, j], [g, _]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [p, [b, j], [g, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[p, /_/g, " "], [b, B], [g, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[p, /_/g, " "], [b, B], [g, _]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [p, [b, "OPPO"], [g, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [p, [b, "Vivo"], [g, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [p, [b, "Realme"], [g, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [p, [b, L], [g, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [p, [b, L], [g, _]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [p, [b, "LG"], [g, _]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [p, [b, "LG"], [g, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [p, [b, "Lenovo"], [g, _]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[p, /_/g, " "], [b, "Nokia"], [g, y]], [/(pixel c)\b/i], [p, [b, A], [g, _]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [p, [b, A], [g, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [p, [b, D], [g, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[p, "Xperia Tablet"], [b, D], [g, _]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [p, [b, "OnePlus"], [g, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [p, [b, E], [g, _]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[p, /(.+)/g, "Fire Phone $1"], [b, E], [g, y]], [/(playbook);[-\w\),; ]+(rim)/i], [p, b, [g, _]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [p, [b, C], [g, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [p, [b, x], [g, _]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [p, [b, x], [g, y]], [/(nexus 9)/i], [p, [b, "HTC"], [g, _]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [b, [p, /_/g, " "], [g, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [p, [b, "Acer"], [g, _]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [p, [b, "Meizu"], [g, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [b, p, [g, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [b, p, [g, _]], [/(surface duo)/i], [p, [b, N], [g, _]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [p, [b, "Fairphone"], [g, y]], [/(u304aa)/i], [p, [b, "AT&T"], [g, y]], [/\bsie-(\w*)/i], [p, [b, "Siemens"], [g, y]], [/\b(rct\w+) b/i], [p, [b, "RCA"], [g, _]], [/\b(venue[\d ]{2,7}) b/i], [p, [b, "Dell"], [g, _]], [/\b(q(?:mv|ta)\w+) b/i], [p, [b, "Verizon"], [g, _]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [p, [b, "Barnes & Noble"], [g, _]], [/\b(tm\d{3}\w+) b/i], [p, [b, "NuVision"], [g, _]], [/\b(k88) b/i], [p, [b, "ZTE"], [g, _]], [/\b(nx\d{3}j) b/i], [p, [b, "ZTE"], [g, y]], [/\b(gen\d{3}) b.+49h/i], [p, [b, "Swiss"], [g, y]], [/\b(zur\d{3}) b/i], [p, [b, "Swiss"], [g, _]], [/\b((zeki)?tb.*\b) b/i], [p, [b, "Zeki"], [g, _]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[b, "Dragon Touch"], p, [g, _]], [/\b(ns-?\w{0,9}) b/i], [p, [b, "Insignia"], [g, _]], [/\b((nxa|next)-?\w{0,9}) b/i], [p, [b, "NextBook"], [g, _]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[b, "Voice"], p, [g, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[b, "LvTel"], p, [g, y]], [/\b(ph-1) /i], [p, [b, "Essential"], [g, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [p, [b, "Envizen"], [g, _]], [/\b(trio[-\w\. ]+) b/i], [p, [b, "MachSpeed"], [g, _]], [/\btu_(1491) b/i], [p, [b, "Rotor"], [g, _]], [/(shield[\w ]+) b/i], [p, [b, "Nvidia"], [g, _]], [/(sprint) (\w+)/i], [b, p, [g, y]], [/(kin\.[onetw]{3})/i], [[p, /\./g, " "], [b, N], [g, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [p, [b, q], [g, _]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [p, [b, q], [g, y]], [/smart-tv.+(samsung)/i], [b, [g, S]], [/hbbtv.+maple;(\d+)/i], [[p, /^/, "SmartTV"], [b, M], [g, S]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[b, "LG"], [g, S]], [/(apple) ?tv/i], [b, [p, T + " TV"], [g, S]], [/crkey/i], [[p, I + "cast"], [b, A], [g, S]], [/droid.+aft(\w)( bui|\))/i], [p, [b, E], [g, S]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [p, [b, U], [g, S]], [/(bravia[\w ]+)( bui|\))/i], [p, [b, D], [g, S]], [/(mitv-\w{5}) bui/i], [p, [b, B], [g, S]], [/Hbbtv.*(technisat) (.*);/i], [b, p, [g, S]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[b, G], [p, G], [g, S]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[g, S]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [b, p, [g, m]], [/droid.+; (shield) bui/i], [p, [b, "Nvidia"], [g, m]], [/(playstation [345portablevi]+)/i], [p, [b, D], [g, m]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [p, [b, N], [g, m]], [/((pebble))app/i], [b, p, [g, k]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [p, [b, T], [g, k]], [/droid.+; (glass) \d/i], [p, [b, A], [g, k]], [/droid.+; (wt63?0{2,3})\)/i], [p, [b, q], [g, k]], [/(quest( 2| pro)?)/i], [p, [b, V], [g, k]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [b, [g, O]], [/(aeobc)\b/i], [p, [b, E], [g, O]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [p, [g, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [p, [g, _]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[g, _]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[g, y]], [/(android[-\w\. ]{0,9});.+buil/i], [p, [b, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [v, [f, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [v, [f, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [f, v], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [v, f]], os: [[/microsoft (windows) (vista|xp)/i], [f, v], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [f, [v, Y, Z]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[f, "Windows"], [v, Y, Z]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[v, /_/g, "."], [f, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[f, F], [v, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [v, f], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [f, v], [/\(bb(10);/i], [v, [f, C]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [v, [f, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [v, [f, R + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [v, [f, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [v, [f, "watchOS"]], [/crkey\/([\d\.]+)/i], [v, [f, I + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[f, H], v], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [f, v], [/(sunos) ?([\w\.\d]*)/i], [[f, "Solaris"], v], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [f, v]] }, ee = function(e2, t2) {
              if (typeof e2 === c && (t2 = e2, e2 = o2), !(this instanceof ee)) return new ee(e2, t2).getResult();
              var r2 = typeof a2 !== u && a2.navigator ? a2.navigator : o2, i2 = e2 || (r2 && r2.userAgent ? r2.userAgent : ""), n3 = r2 && r2.userAgentData ? r2.userAgentData : o2, s3 = t2 ? z(Q, t2) : Q, m2 = r2 && r2.userAgent == i2;
              return this.getBrowser = function() {
                var e3, t3 = {};
                return t3[f] = o2, t3[v] = o2, X.call(t3, i2, s3.browser), t3[d] = typeof (e3 = t3[v]) === h ? e3.replace(/[^\d\.]/g, "").split(".")[0] : o2, m2 && r2 && r2.brave && typeof r2.brave.isBrave == l && (t3[f] = "Brave"), t3;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[w] = o2, X.call(e3, i2, s3.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[b] = o2, e3[p] = o2, e3[g] = o2, X.call(e3, i2, s3.device), m2 && !e3[g] && n3 && n3.mobile && (e3[g] = y), m2 && "Macintosh" == e3[p] && r2 && typeof r2.standalone !== u && r2.maxTouchPoints && r2.maxTouchPoints > 2 && (e3[p] = "iPad", e3[g] = _), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[f] = o2, e3[v] = o2, X.call(e3, i2, s3.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[f] = o2, e3[v] = o2, X.call(e3, i2, s3.os), m2 && !e3[f] && n3 && "Unknown" != n3.platform && (e3[f] = n3.platform.replace(/chrome os/i, H).replace(/macos/i, F)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return i2;
              }, this.setUA = function(e3) {
                return i2 = typeof e3 === h && e3.length > 350 ? G(e3, 350) : e3, this;
              }, this.setUA(i2), this;
            };
            ee.VERSION = "1.0.35", ee.BROWSER = K([f, v, d]), ee.CPU = K([w]), ee.DEVICE = K([p, b, g, m, y, S, _, k, O]), ee.ENGINE = ee.OS = K([f, v]), typeof s2 !== u ? (n2.exports && (s2 = n2.exports = ee), s2.UAParser = ee) : r.amdO ? void 0 !== (i = function() {
              return ee;
            }.call(t, r, t, e)) && (e.exports = i) : typeof a2 !== u && (a2.UAParser = ee);
            var et = typeof a2 !== u && (a2.jQuery || a2.Zepto);
            if (et && !et.ua) {
              var er = new ee();
              et.ua = er.getResult(), et.ua.get = function() {
                return er.getUA();
              }, et.ua.set = function(e2) {
                er.setUA(e2);
                var t2 = er.getResult();
                for (var r2 in t2) et.ua[r2] = t2[r2];
              };
            }
          }("object" == typeof window ? window : this);
        } }, s = {};
        function a(e2) {
          var t2 = s[e2];
          if (void 0 !== t2) return t2.exports;
          var r2 = s[e2] = { exports: {} }, i2 = true;
          try {
            n[e2].call(r2.exports, r2, r2.exports, a), i2 = false;
          } finally {
            i2 && delete s[e2];
          }
          return r2.exports;
        }
        a.ab = "//";
        var o = a(226);
        e.exports = o;
      })();
    }, 8488: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { getTestReqInfo: function() {
        return a;
      }, withRequest: function() {
        return s;
      } });
      let i = new (r(2067)).AsyncLocalStorage();
      function n(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (r2) return { url: t2.url(e2), proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function s(e2, t2, r2) {
        let s2 = n(e2, t2);
        return s2 ? i.run(s2, r2) : r2();
      }
      function a(e2, t2) {
        return i.getStore() || (e2 && t2 ? n(e2, t2) : void 0);
      }
    }, 375: (e, t, r) => {
      "use strict";
      var i = r(6195).Buffer;
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { handleFetch: function() {
        return o;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return s;
      } });
      let n = r(8488), s = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function a(e2, t2) {
        let { url: r2, method: n2, headers: s2, body: a2, cache: o2, credentials: l2, integrity: u, mode: c, redirect: h, referrer: d, referrerPolicy: p } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: n2, headers: [...Array.from(s2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? i.from(await t2.arrayBuffer()).toString("base64") : null, cache: o2, credentials: l2, integrity: u, mode: c, redirect: h, referrer: d, referrerPolicy: p } };
      }
      async function o(e2, t2) {
        let r2 = (0, n.getTestReqInfo)(t2, s);
        if (!r2) return e2(t2);
        let { testData: o2, proxyPort: l2 } = r2, u = await a(o2, t2), c = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!c.ok) throw Error(`Proxy request failed: ${c.status}`);
        let h = await c.json(), { api: d } = h;
        switch (d) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Error(`Proxy request aborted [${t2.method} ${t2.url}]`);
        }
        return function(e3) {
          let { status: t3, headers: r3, body: n2 } = e3.response;
          return new Response(n2 ? i.from(n2, "base64") : null, { status: t3, headers: new Headers(r3) });
        }(h);
      }
      function l(e2) {
        return r.g.fetch = function(t2, r2) {
          var i2;
          return (null == r2 ? void 0 : null == (i2 = r2.next) ? void 0 : i2.internal) ? e2(t2, r2) : o(e2, new Request(t2, r2));
        }, () => {
          r.g.fetch = e2;
        };
      }
    }, 4177: (e, t, r) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true }), function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(t, { interceptTestApis: function() {
        return s;
      }, wrapRequestHandler: function() {
        return a;
      } });
      let i = r(8488), n = r(375);
      function s() {
        return (0, n.interceptFetch)(r.g.fetch);
      }
      function a(e2) {
        return (t2, r2) => (0, i.withRequest)(t2, n.reader, () => e2(t2, r2));
      }
    }, 8426: (e) => {
      "use strict";
      var t = { decodeValues: true, map: false, silent: false };
      function r(e2) {
        return "string" == typeof e2 && !!e2.trim();
      }
      function i(e2, i2) {
        var n2, s, a, o, l = e2.split(";").filter(r), u = (n2 = l.shift(), s = "", a = "", (o = n2.split("=")).length > 1 ? (s = o.shift(), a = o.join("=")) : a = n2, { name: s, value: a }), c = u.name, h = u.value;
        i2 = i2 ? Object.assign({}, t, i2) : t;
        try {
          h = i2.decodeValues ? decodeURIComponent(h) : h;
        } catch (e3) {
          console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + h + "'. Set options.decodeValues to false to disable this feature.", e3);
        }
        var d = { name: c, value: h };
        return l.forEach(function(e3) {
          var t2 = e3.split("="), r2 = t2.shift().trimLeft().toLowerCase(), i3 = t2.join("=");
          "expires" === r2 ? d.expires = new Date(i3) : "max-age" === r2 ? d.maxAge = parseInt(i3, 10) : "secure" === r2 ? d.secure = true : "httponly" === r2 ? d.httpOnly = true : "samesite" === r2 ? d.sameSite = i3 : "partitioned" === r2 ? d.partitioned = true : d[r2] = i3;
        }), d;
      }
      function n(e2, n2) {
        if (n2 = n2 ? Object.assign({}, t, n2) : t, !e2) return n2.map ? {} : [];
        if (e2.headers) {
          if ("function" == typeof e2.headers.getSetCookie) e2 = e2.headers.getSetCookie();
          else if (e2.headers["set-cookie"]) e2 = e2.headers["set-cookie"];
          else {
            var s = e2.headers[Object.keys(e2.headers).find(function(e3) {
              return "set-cookie" === e3.toLowerCase();
            })];
            s || !e2.headers.cookie || n2.silent || console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."), e2 = s;
          }
        }
        return (Array.isArray(e2) || (e2 = [e2]), n2.map) ? e2.filter(r).reduce(function(e3, t2) {
          var r2 = i(t2, n2);
          return e3[r2.name] = r2, e3;
        }, {}) : e2.filter(r).map(function(e3) {
          return i(e3, n2);
        });
      }
      e.exports = n, e.exports.parse = n, e.exports.parseString = i, e.exports.splitCookiesString = function(e2) {
        if (Array.isArray(e2)) return e2;
        if ("string" != typeof e2) return [];
        var t2, r2, i2, n2, s, a = [], o = 0;
        function l() {
          for (; o < e2.length && /\s/.test(e2.charAt(o)); ) o += 1;
          return o < e2.length;
        }
        for (; o < e2.length; ) {
          for (t2 = o, s = false; l(); ) if ("," === (r2 = e2.charAt(o))) {
            for (i2 = o, o += 1, l(), n2 = o; o < e2.length && "=" !== (r2 = e2.charAt(o)) && ";" !== r2 && "," !== r2; ) o += 1;
            o < e2.length && "=" === e2.charAt(o) ? (s = true, o = n2, a.push(e2.substring(t2, i2)), t2 = o) : o = i2 + 1;
          } else o += 1;
          (!s || o >= e2.length) && a.push(e2.substring(t2, e2.length));
        }
        return a;
      };
    }, 5228: (e, t, r) => {
      "use strict";
      r.d(t, { P: () => a });
      let i = Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available");
      class n {
        disable() {
          throw i;
        }
        getStore() {
        }
        run() {
          throw i;
        }
        exit() {
          throw i;
        }
        enterWith() {
          throw i;
        }
      }
      let s = globalThis.AsyncLocalStorage;
      function a() {
        return s ? new s() : new n();
      }
    }, 5303: (e, t, r) => {
      "use strict";
      r.d(t, { F: () => i });
      let i = (0, r(5228).P)();
    }, 5558: (e, t, r) => {
      "use strict";
      r.d(t, { A: () => i });
      let i = (0, r(5228).P)();
    }, 2870: (e, t, r) => {
      "use strict";
      let i, n;
      r.r(t), r.d(t, { BrowserCookieAuthStorageAdapter: () => rf, CookieAuthStorageAdapter: () => rp, DEFAULT_COOKIE_OPTIONS: () => rh, createSupabaseClient: () => rg, isBrowser: () => rc, parseCookies: () => rb, parseSupabaseCookie: () => rl, serializeCookie: () => rv, stringifySupabaseSession: () => ru }), new TextEncoder();
      let s = new TextDecoder(), a = (e10) => {
        let t10 = atob(e10), r2 = new Uint8Array(t10.length);
        for (let e11 = 0; e11 < t10.length; e11++) r2[e11] = t10.charCodeAt(e11);
        return r2;
      }, o = (e10) => {
        let t10 = e10;
        t10 instanceof Uint8Array && (t10 = s.decode(t10)), t10 = t10.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
        try {
          return a(t10);
        } catch (e11) {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      }, l = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = (...e11) => Promise.resolve().then(r.bind(r, 8254)).then(({ default: t11 }) => t11(...e11)) : t10 = fetch, (...e11) => t10(...e11);
      };
      class u extends Error {
        constructor(e10, t10 = "FunctionsError", r2) {
          super(e10), this.name = t10, this.context = r2;
        }
      }
      class c extends u {
        constructor(e10) {
          super("Failed to send a request to the Edge Function", "FunctionsFetchError", e10);
        }
      }
      class h extends u {
        constructor(e10) {
          super("Relay Error invoking the Edge Function", "FunctionsRelayError", e10);
        }
      }
      class d extends u {
        constructor(e10) {
          super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e10);
        }
      }
      !function(e10) {
        e10.Any = "any", e10.ApNortheast1 = "ap-northeast-1", e10.ApNortheast2 = "ap-northeast-2", e10.ApSouth1 = "ap-south-1", e10.ApSoutheast1 = "ap-southeast-1", e10.ApSoutheast2 = "ap-southeast-2", e10.CaCentral1 = "ca-central-1", e10.EuCentral1 = "eu-central-1", e10.EuWest1 = "eu-west-1", e10.EuWest2 = "eu-west-2", e10.EuWest3 = "eu-west-3", e10.SaEast1 = "sa-east-1", e10.UsEast1 = "us-east-1", e10.UsWest1 = "us-west-1", e10.UsWest2 = "us-west-2";
      }(G || (G = {}));
      class p {
        constructor(e10, { headers: t10 = {}, customFetch: r2, region: i2 = G.Any } = {}) {
          this.url = e10, this.headers = t10, this.region = i2, this.fetch = l(r2);
        }
        setAuth(e10) {
          this.headers.Authorization = `Bearer ${e10}`;
        }
        invoke(e10) {
          var t10, r2, i2, n2;
          return t10 = this, r2 = arguments, i2 = void 0, n2 = function* (e11, t11 = {}) {
            var r3;
            try {
              let i3;
              let { headers: n3, method: s2, body: a2, signal: o2 } = t11, l2 = {}, { region: u2 } = t11;
              u2 || (u2 = this.region);
              let p2 = new URL(`${this.url}/${e11}`);
              u2 && "any" !== u2 && (l2["x-region"] = u2, p2.searchParams.set("forceFunctionRegion", u2)), a2 && (n3 && !Object.prototype.hasOwnProperty.call(n3, "Content-Type") || !n3) && ("undefined" != typeof Blob && a2 instanceof Blob || a2 instanceof ArrayBuffer ? (l2["Content-Type"] = "application/octet-stream", i3 = a2) : "string" == typeof a2 ? (l2["Content-Type"] = "text/plain", i3 = a2) : "undefined" != typeof FormData && a2 instanceof FormData ? i3 = a2 : (l2["Content-Type"] = "application/json", i3 = JSON.stringify(a2)));
              let f2 = yield this.fetch(p2.toString(), { method: s2 || "POST", headers: Object.assign(Object.assign(Object.assign({}, l2), this.headers), n3), body: i3, signal: o2 }).catch((e12) => {
                if ("AbortError" === e12.name) throw e12;
                throw new c(e12);
              }), g2 = f2.headers.get("x-relay-error");
              if (g2 && "true" === g2) throw new h(f2);
              if (!f2.ok) throw new d(f2);
              let b2 = (null !== (r3 = f2.headers.get("Content-Type")) && void 0 !== r3 ? r3 : "text/plain").split(";")[0].trim();
              return { data: "application/json" === b2 ? yield f2.json() : "application/octet-stream" === b2 ? yield f2.blob() : "text/event-stream" === b2 ? f2 : "multipart/form-data" === b2 ? yield f2.formData() : yield f2.text(), error: null, response: f2 };
            } catch (e12) {
              if (e12 instanceof Error && "AbortError" === e12.name) return { data: null, error: new c(e12) };
              return { data: null, error: e12, response: e12 instanceof d || e12 instanceof h ? e12.context : void 0 };
            }
          }, new (i2 || (i2 = Promise))(function(e11, s2) {
            function a2(e12) {
              try {
                l2(n2.next(e12));
              } catch (e13) {
                s2(e13);
              }
            }
            function o2(e12) {
              try {
                l2(n2.throw(e12));
              } catch (e13) {
                s2(e13);
              }
            }
            function l2(t11) {
              var r3;
              t11.done ? e11(t11.value) : ((r3 = t11.value) instanceof i2 ? r3 : new i2(function(e12) {
                e12(r3);
              })).then(a2, o2);
            }
            l2((n2 = n2.apply(t10, r2 || [])).next());
          });
        }
      }
      let { PostgrestClient: f, PostgrestQueryBuilder: g, PostgrestFilterBuilder: b, PostgrestTransformBuilder: v, PostgrestBuilder: w, PostgrestError: m } = r(6690);
      class y {
        static detectEnvironment() {
          var e10;
          if ("undefined" != typeof WebSocket) return { type: "native", constructor: WebSocket };
          if ("undefined" != typeof globalThis && void 0 !== globalThis.WebSocket) return { type: "native", constructor: globalThis.WebSocket };
          if (void 0 !== r.g && void 0 !== r.g.WebSocket) return { type: "native", constructor: r.g.WebSocket };
          if ("undefined" != typeof globalThis && void 0 !== globalThis.WebSocketPair && void 0 === globalThis.WebSocket) return { type: "cloudflare", error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.", workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime." };
          if ("undefined" != typeof globalThis && globalThis.EdgeRuntime || "undefined" != typeof navigator && (null === (e10 = navigator.userAgent) || void 0 === e10 ? void 0 : e10.includes("Vercel-Edge"))) return { type: "unsupported", error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.", workaround: "Use serverless functions or a different deployment target for WebSocket functionality." };
          if ("undefined" != typeof process) {
            let e11 = process.versions;
            if (e11 && e11.node) {
              let t10 = parseInt(e11.node.replace(/^v/, "").split(".")[0]);
              return t10 >= 22 ? void 0 !== globalThis.WebSocket ? { type: "native", constructor: globalThis.WebSocket } : { type: "unsupported", error: `Node.js ${t10} detected but native WebSocket not found.`, workaround: "Provide a WebSocket implementation via the transport option." } : { type: "unsupported", error: `Node.js ${t10} detected without native WebSocket support.`, workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })' };
            }
          }
          return { type: "unsupported", error: "Unknown JavaScript runtime without WebSocket support.", workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation." };
        }
        static getWebSocketConstructor() {
          let e10 = this.detectEnvironment();
          if (e10.constructor) return e10.constructor;
          let t10 = e10.error || "WebSocket not supported in this environment.";
          throw e10.workaround && (t10 += `

Suggested solution: ${e10.workaround}`), Error(t10);
        }
        static createWebSocket(e10, t10) {
          return new (this.getWebSocketConstructor())(e10, t10);
        }
        static isWebSocketSupported() {
          try {
            let e10 = this.detectEnvironment();
            return "native" === e10.type || "ws" === e10.type;
          } catch (e10) {
            return false;
          }
        }
      }
      !function(e10) {
        e10[e10.connecting = 0] = "connecting", e10[e10.open = 1] = "open", e10[e10.closing = 2] = "closing", e10[e10.closed = 3] = "closed";
      }(X || (X = {})), function(e10) {
        e10.closed = "closed", e10.errored = "errored", e10.joined = "joined", e10.joining = "joining", e10.leaving = "leaving";
      }(Y || (Y = {})), function(e10) {
        e10.close = "phx_close", e10.error = "phx_error", e10.join = "phx_join", e10.reply = "phx_reply", e10.leave = "phx_leave", e10.access_token = "access_token";
      }(Z || (Z = {})), (Q || (Q = {})).websocket = "websocket", function(e10) {
        e10.Connecting = "connecting", e10.Open = "open", e10.Closing = "closing", e10.Closed = "closed";
      }(ee || (ee = {}));
      class _ {
        constructor() {
          this.HEADER_LENGTH = 1;
        }
        decode(e10, t10) {
          return e10.constructor === ArrayBuffer ? t10(this._binaryDecode(e10)) : "string" == typeof e10 ? t10(JSON.parse(e10)) : t10({});
        }
        _binaryDecode(e10) {
          let t10 = new DataView(e10), r2 = new TextDecoder();
          return this._decodeBroadcast(e10, t10, r2);
        }
        _decodeBroadcast(e10, t10, r2) {
          let i2 = t10.getUint8(1), n2 = t10.getUint8(2), s2 = this.HEADER_LENGTH + 2, a2 = r2.decode(e10.slice(s2, s2 + i2));
          s2 += i2;
          let o2 = r2.decode(e10.slice(s2, s2 + n2));
          return s2 += n2, { ref: null, topic: a2, event: o2, payload: JSON.parse(r2.decode(e10.slice(s2, e10.byteLength))) };
        }
      }
      class S {
        constructor(e10, t10) {
          this.callback = e10, this.timerCalc = t10, this.timer = void 0, this.tries = 0, this.callback = e10, this.timerCalc = t10;
        }
        reset() {
          this.tries = 0, clearTimeout(this.timer), this.timer = void 0;
        }
        scheduleTimeout() {
          clearTimeout(this.timer), this.timer = setTimeout(() => {
            this.tries = this.tries + 1, this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      }
      !function(e10) {
        e10.abstime = "abstime", e10.bool = "bool", e10.date = "date", e10.daterange = "daterange", e10.float4 = "float4", e10.float8 = "float8", e10.int2 = "int2", e10.int4 = "int4", e10.int4range = "int4range", e10.int8 = "int8", e10.int8range = "int8range", e10.json = "json", e10.jsonb = "jsonb", e10.money = "money", e10.numeric = "numeric", e10.oid = "oid", e10.reltime = "reltime", e10.text = "text", e10.time = "time", e10.timestamp = "timestamp", e10.timestamptz = "timestamptz", e10.timetz = "timetz", e10.tsrange = "tsrange", e10.tstzrange = "tstzrange";
      }(et || (et = {}));
      let k = (e10, t10, r2 = {}) => {
        var i2;
        let n2 = null !== (i2 = r2.skipTypes) && void 0 !== i2 ? i2 : [];
        return t10 ? Object.keys(t10).reduce((r3, i3) => (r3[i3] = O(i3, e10, t10, n2), r3), {}) : {};
      }, O = (e10, t10, r2, i2) => {
        let n2 = t10.find((t11) => t11.name === e10), s2 = null == n2 ? void 0 : n2.type, a2 = r2[e10];
        return s2 && !i2.includes(s2) ? E(s2, a2) : T(a2);
      }, E = (e10, t10) => {
        if ("_" === e10.charAt(0)) return I(t10, e10.slice(1, e10.length));
        switch (e10) {
          case et.bool:
            return x(t10);
          case et.float4:
          case et.float8:
          case et.int2:
          case et.int4:
          case et.int8:
          case et.numeric:
          case et.oid:
            return C(t10);
          case et.json:
          case et.jsonb:
            return P(t10);
          case et.timestamp:
            return R(t10);
          case et.abstime:
          case et.date:
          case et.daterange:
          case et.int4range:
          case et.int8range:
          case et.money:
          case et.reltime:
          case et.text:
          case et.time:
          case et.timestamptz:
          case et.timetz:
          case et.tsrange:
          case et.tstzrange:
          default:
            return T(t10);
        }
      }, T = (e10) => e10, x = (e10) => {
        switch (e10) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return e10;
        }
      }, C = (e10) => {
        if ("string" == typeof e10) {
          let t10 = parseFloat(e10);
          if (!Number.isNaN(t10)) return t10;
        }
        return e10;
      }, P = (e10) => {
        if ("string" == typeof e10) try {
          return JSON.parse(e10);
        } catch (e11) {
          console.log(`JSON parse error: ${e11}`);
        }
        return e10;
      }, I = (e10, t10) => {
        if ("string" != typeof e10) return e10;
        let r2 = e10.length - 1, i2 = e10[r2];
        if ("{" === e10[0] && "}" === i2) {
          let i3;
          let n2 = e10.slice(1, r2);
          try {
            i3 = JSON.parse("[" + n2 + "]");
          } catch (e11) {
            i3 = n2 ? n2.split(",") : [];
          }
          return i3.map((e11) => E(t10, e11));
        }
        return e10;
      }, R = (e10) => "string" == typeof e10 ? e10.replace(" ", "T") : e10, A = (e10) => {
        let t10 = e10;
        return (t10 = (t10 = t10.replace(/^ws/i, "http")).replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "")).replace(/\/+$/, "") + "/api/broadcast";
      };
      class j {
        constructor(e10, t10, r2 = {}, i2 = 1e4) {
          this.channel = e10, this.event = t10, this.payload = r2, this.timeout = i2, this.sent = false, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null;
        }
        resend(e10) {
          this.timeout = e10, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = false, this.send();
        }
        send() {
          this._hasReceived("timeout") || (this.startTimeout(), this.sent = true, this.channel.socket.push({ topic: this.channel.topic, event: this.event, payload: this.payload, ref: this.ref, join_ref: this.channel._joinRef() }));
        }
        updatePayload(e10) {
          this.payload = Object.assign(Object.assign({}, this.payload), e10);
        }
        receive(e10, t10) {
          var r2;
          return this._hasReceived(e10) && t10(null === (r2 = this.receivedResp) || void 0 === r2 ? void 0 : r2.response), this.recHooks.push({ status: e10, callback: t10 }), this;
        }
        startTimeout() {
          this.timeoutTimer || (this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref), this.channel._on(this.refEvent, {}, (e10) => {
            this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = e10, this._matchReceive(e10);
          }), this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout));
        }
        trigger(e10, t10) {
          this.refEvent && this.channel._trigger(this.refEvent, { status: e10, response: t10 });
        }
        destroy() {
          this._cancelRefEvent(), this._cancelTimeout();
        }
        _cancelRefEvent() {
          this.refEvent && this.channel._off(this.refEvent, {});
        }
        _cancelTimeout() {
          clearTimeout(this.timeoutTimer), this.timeoutTimer = void 0;
        }
        _matchReceive({ status: e10, response: t10 }) {
          this.recHooks.filter((t11) => t11.status === e10).forEach((e11) => e11.callback(t10));
        }
        _hasReceived(e10) {
          return this.receivedResp && this.receivedResp.status === e10;
        }
      }
      !function(e10) {
        e10.SYNC = "sync", e10.JOIN = "join", e10.LEAVE = "leave";
      }(er || (er = {}));
      class N {
        constructor(e10, t10) {
          this.channel = e10, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.enabled = false, this.caller = { onJoin: () => {
          }, onLeave: () => {
          }, onSync: () => {
          } };
          let r2 = (null == t10 ? void 0 : t10.events) || { state: "presence_state", diff: "presence_diff" };
          this.channel._on(r2.state, {}, (e11) => {
            let { onJoin: t11, onLeave: r3, onSync: i2 } = this.caller;
            this.joinRef = this.channel._joinRef(), this.state = N.syncState(this.state, e11, t11, r3), this.pendingDiffs.forEach((e12) => {
              this.state = N.syncDiff(this.state, e12, t11, r3);
            }), this.pendingDiffs = [], i2();
          }), this.channel._on(r2.diff, {}, (e11) => {
            let { onJoin: t11, onLeave: r3, onSync: i2 } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(e11) : (this.state = N.syncDiff(this.state, e11, t11, r3), i2());
          }), this.onJoin((e11, t11, r3) => {
            this.channel._trigger("presence", { event: "join", key: e11, currentPresences: t11, newPresences: r3 });
          }), this.onLeave((e11, t11, r3) => {
            this.channel._trigger("presence", { event: "leave", key: e11, currentPresences: t11, leftPresences: r3 });
          }), this.onSync(() => {
            this.channel._trigger("presence", { event: "sync" });
          });
        }
        static syncState(e10, t10, r2, i2) {
          let n2 = this.cloneDeep(e10), s2 = this.transformState(t10), a2 = {}, o2 = {};
          return this.map(n2, (e11, t11) => {
            s2[e11] || (o2[e11] = t11);
          }), this.map(s2, (e11, t11) => {
            let r3 = n2[e11];
            if (r3) {
              let i3 = t11.map((e12) => e12.presence_ref), n3 = r3.map((e12) => e12.presence_ref), s3 = t11.filter((e12) => 0 > n3.indexOf(e12.presence_ref)), l2 = r3.filter((e12) => 0 > i3.indexOf(e12.presence_ref));
              s3.length > 0 && (a2[e11] = s3), l2.length > 0 && (o2[e11] = l2);
            } else a2[e11] = t11;
          }), this.syncDiff(n2, { joins: a2, leaves: o2 }, r2, i2);
        }
        static syncDiff(e10, t10, r2, i2) {
          let { joins: n2, leaves: s2 } = { joins: this.transformState(t10.joins), leaves: this.transformState(t10.leaves) };
          return r2 || (r2 = () => {
          }), i2 || (i2 = () => {
          }), this.map(n2, (t11, i3) => {
            var n3;
            let s3 = null !== (n3 = e10[t11]) && void 0 !== n3 ? n3 : [];
            if (e10[t11] = this.cloneDeep(i3), s3.length > 0) {
              let r3 = e10[t11].map((e11) => e11.presence_ref), i4 = s3.filter((e11) => 0 > r3.indexOf(e11.presence_ref));
              e10[t11].unshift(...i4);
            }
            r2(t11, s3, i3);
          }), this.map(s2, (t11, r3) => {
            let n3 = e10[t11];
            if (!n3) return;
            let s3 = r3.map((e11) => e11.presence_ref);
            n3 = n3.filter((e11) => 0 > s3.indexOf(e11.presence_ref)), e10[t11] = n3, i2(t11, n3, r3), 0 === n3.length && delete e10[t11];
          }), e10;
        }
        static map(e10, t10) {
          return Object.getOwnPropertyNames(e10).map((r2) => t10(r2, e10[r2]));
        }
        static transformState(e10) {
          return Object.getOwnPropertyNames(e10 = this.cloneDeep(e10)).reduce((t10, r2) => {
            let i2 = e10[r2];
            return "metas" in i2 ? t10[r2] = i2.metas.map((e11) => (e11.presence_ref = e11.phx_ref, delete e11.phx_ref, delete e11.phx_ref_prev, e11)) : t10[r2] = i2, t10;
          }, {});
        }
        static cloneDeep(e10) {
          return JSON.parse(JSON.stringify(e10));
        }
        onJoin(e10) {
          this.caller.onJoin = e10;
        }
        onLeave(e10) {
          this.caller.onLeave = e10;
        }
        onSync(e10) {
          this.caller.onSync = e10;
        }
        inPendingSyncState() {
          return !this.joinRef || this.joinRef !== this.channel._joinRef();
        }
      }
      !function(e10) {
        e10.ALL = "*", e10.INSERT = "INSERT", e10.UPDATE = "UPDATE", e10.DELETE = "DELETE";
      }(ei || (ei = {})), function(e10) {
        e10.BROADCAST = "broadcast", e10.PRESENCE = "presence", e10.POSTGRES_CHANGES = "postgres_changes", e10.SYSTEM = "system";
      }(en || (en = {})), function(e10) {
        e10.SUBSCRIBED = "SUBSCRIBED", e10.TIMED_OUT = "TIMED_OUT", e10.CLOSED = "CLOSED", e10.CHANNEL_ERROR = "CHANNEL_ERROR";
      }(es || (es = {}));
      class L {
        constructor(e10, t10 = { config: {} }, r2) {
          var i2, n2;
          if (this.topic = e10, this.params = t10, this.socket = r2, this.bindings = {}, this.state = Y.closed, this.joinedOnce = false, this.pushBuffer = [], this.subTopic = e10.replace(/^realtime:/i, ""), this.params.config = Object.assign({ broadcast: { ack: false, self: false }, presence: { key: "", enabled: false }, private: false }, t10.config), this.timeout = this.socket.timeout, this.joinPush = new j(this, Z.join, this.params, this.timeout), this.rejoinTimer = new S(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
            this.state = Y.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((e11) => e11.send()), this.pushBuffer = [];
          }), this._onClose(() => {
            this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = Y.closed, this.socket._remove(this);
          }), this._onError((e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = Y.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("timeout", () => {
            this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = Y.errored, this.rejoinTimer.scheduleTimeout());
          }), this.joinPush.receive("error", (e11) => {
            this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, e11), this.state = Y.errored, this.rejoinTimer.scheduleTimeout());
          }), this._on(Z.reply, {}, (e11, t11) => {
            this._trigger(this._replyEventName(t11), e11);
          }), this.presence = new N(this), this.broadcastEndpointURL = A(this.socket.endPoint), this.private = this.params.config.private || false, !this.private && (null === (n2 = null === (i2 = this.params.config) || void 0 === i2 ? void 0 : i2.broadcast) || void 0 === n2 ? void 0 : n2.replay)) throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
        }
        subscribe(e10, t10 = this.timeout) {
          var r2, i2, n2;
          if (this.socket.isConnected() || this.socket.connect(), this.state == Y.closed) {
            let { config: { broadcast: s2, presence: a2, private: o2 } } = this.params, l2 = null !== (i2 = null === (r2 = this.bindings.postgres_changes) || void 0 === r2 ? void 0 : r2.map((e11) => e11.filter)) && void 0 !== i2 ? i2 : [], u2 = !!this.bindings[en.PRESENCE] && this.bindings[en.PRESENCE].length > 0 || (null === (n2 = this.params.config.presence) || void 0 === n2 ? void 0 : n2.enabled) === true, c2 = {}, h2 = { broadcast: s2, presence: Object.assign(Object.assign({}, a2), { enabled: u2 }), postgres_changes: l2, private: o2 };
            this.socket.accessTokenValue && (c2.access_token = this.socket.accessTokenValue), this._onError((t11) => null == e10 ? void 0 : e10(es.CHANNEL_ERROR, t11)), this._onClose(() => null == e10 ? void 0 : e10(es.CLOSED)), this.updateJoinPayload(Object.assign({ config: h2 }, c2)), this.joinedOnce = true, this._rejoin(t10), this.joinPush.receive("ok", async ({ postgres_changes: t11 }) => {
              var r3;
              if (this.socket.setAuth(), void 0 === t11) {
                null == e10 || e10(es.SUBSCRIBED);
                return;
              }
              {
                let i3 = this.bindings.postgres_changes, n3 = null !== (r3 = null == i3 ? void 0 : i3.length) && void 0 !== r3 ? r3 : 0, s3 = [];
                for (let r4 = 0; r4 < n3; r4++) {
                  let n4 = i3[r4], { filter: { event: a3, schema: o3, table: l3, filter: u3 } } = n4, c3 = t11 && t11[r4];
                  if (c3 && c3.event === a3 && c3.schema === o3 && c3.table === l3 && c3.filter === u3) s3.push(Object.assign(Object.assign({}, n4), { id: c3.id }));
                  else {
                    this.unsubscribe(), this.state = Y.errored, null == e10 || e10(es.CHANNEL_ERROR, Error("mismatch between server and client bindings for postgres changes"));
                    return;
                  }
                }
                this.bindings.postgres_changes = s3, e10 && e10(es.SUBSCRIBED);
                return;
              }
            }).receive("error", (t11) => {
              this.state = Y.errored, null == e10 || e10(es.CHANNEL_ERROR, Error(JSON.stringify(Object.values(t11).join(", ") || "error")));
            }).receive("timeout", () => {
              null == e10 || e10(es.TIMED_OUT);
            });
          }
          return this;
        }
        presenceState() {
          return this.presence.state;
        }
        async track(e10, t10 = {}) {
          return await this.send({ type: "presence", event: "track", payload: e10 }, t10.timeout || this.timeout);
        }
        async untrack(e10 = {}) {
          return await this.send({ type: "presence", event: "untrack" }, e10);
        }
        on(e10, t10, r2) {
          return this.state === Y.joined && e10 === en.PRESENCE && (this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`), this.unsubscribe().then(() => this.subscribe())), this._on(e10, t10, r2);
        }
        async send(e10, t10 = {}) {
          var r2, i2;
          if (this._canPush() || "broadcast" !== e10.type) return new Promise((r3) => {
            var i3, n2, s2;
            let a2 = this._push(e10.type, e10, t10.timeout || this.timeout);
            "broadcast" !== e10.type || (null === (s2 = null === (n2 = null === (i3 = this.params) || void 0 === i3 ? void 0 : i3.config) || void 0 === n2 ? void 0 : n2.broadcast) || void 0 === s2 ? void 0 : s2.ack) || r3("ok"), a2.receive("ok", () => r3("ok")), a2.receive("error", () => r3("error")), a2.receive("timeout", () => r3("timed out"));
          });
          {
            let { event: n2, payload: s2 } = e10, a2 = { method: "POST", headers: { Authorization: this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "", apikey: this.socket.apiKey ? this.socket.apiKey : "", "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ topic: this.subTopic, event: n2, payload: s2, private: this.private }] }) };
            try {
              let e11 = await this._fetchWithTimeout(this.broadcastEndpointURL, a2, null !== (r2 = t10.timeout) && void 0 !== r2 ? r2 : this.timeout);
              return await (null === (i2 = e11.body) || void 0 === i2 ? void 0 : i2.cancel()), e11.ok ? "ok" : "error";
            } catch (e11) {
              if ("AbortError" === e11.name) return "timed out";
              return "error";
            }
          }
        }
        updateJoinPayload(e10) {
          this.joinPush.updatePayload(e10);
        }
        unsubscribe(e10 = this.timeout) {
          this.state = Y.leaving;
          let t10 = () => {
            this.socket.log("channel", `leave ${this.topic}`), this._trigger(Z.close, "leave", this._joinRef());
          };
          this.joinPush.destroy();
          let r2 = null;
          return new Promise((i2) => {
            (r2 = new j(this, Z.leave, {}, e10)).receive("ok", () => {
              t10(), i2("ok");
            }).receive("timeout", () => {
              t10(), i2("timed out");
            }).receive("error", () => {
              i2("error");
            }), r2.send(), this._canPush() || r2.trigger("ok", {});
          }).finally(() => {
            null == r2 || r2.destroy();
          });
        }
        teardown() {
          this.pushBuffer.forEach((e10) => e10.destroy()), this.pushBuffer = [], this.rejoinTimer.reset(), this.joinPush.destroy(), this.state = Y.closed, this.bindings = {};
        }
        async _fetchWithTimeout(e10, t10, r2) {
          let i2 = new AbortController(), n2 = setTimeout(() => i2.abort(), r2), s2 = await this.socket.fetch(e10, Object.assign(Object.assign({}, t10), { signal: i2.signal }));
          return clearTimeout(n2), s2;
        }
        _push(e10, t10, r2 = this.timeout) {
          if (!this.joinedOnce) throw `tried to push '${e10}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
          let i2 = new j(this, e10, t10, r2);
          return this._canPush() ? i2.send() : this._addToPushBuffer(i2), i2;
        }
        _addToPushBuffer(e10) {
          if (e10.startTimeout(), this.pushBuffer.push(e10), this.pushBuffer.length > 100) {
            let e11 = this.pushBuffer.shift();
            e11 && (e11.destroy(), this.socket.log("channel", `discarded push due to buffer overflow: ${e11.event}`, e11.payload));
          }
        }
        _onMessage(e10, t10, r2) {
          return t10;
        }
        _isMember(e10) {
          return this.topic === e10;
        }
        _joinRef() {
          return this.joinPush.ref;
        }
        _trigger(e10, t10, r2) {
          var i2, n2;
          let s2 = e10.toLocaleLowerCase(), { close: a2, error: o2, leave: l2, join: u2 } = Z;
          if (r2 && [a2, o2, l2, u2].indexOf(s2) >= 0 && r2 !== this._joinRef()) return;
          let c2 = this._onMessage(s2, t10, r2);
          if (t10 && !c2) throw "channel onMessage callbacks must return the payload, modified or unmodified";
          ["insert", "update", "delete"].includes(s2) ? null === (i2 = this.bindings.postgres_changes) || void 0 === i2 || i2.filter((e11) => {
            var t11, r3, i3;
            return (null === (t11 = e11.filter) || void 0 === t11 ? void 0 : t11.event) === "*" || (null === (i3 = null === (r3 = e11.filter) || void 0 === r3 ? void 0 : r3.event) || void 0 === i3 ? void 0 : i3.toLocaleLowerCase()) === s2;
          }).map((e11) => e11.callback(c2, r2)) : null === (n2 = this.bindings[s2]) || void 0 === n2 || n2.filter((e11) => {
            var r3, i3, n3, a3, o3, l3;
            if (!["broadcast", "presence", "postgres_changes"].includes(s2)) return e11.type.toLocaleLowerCase() === s2;
            if ("id" in e11) {
              let s3 = e11.id, a4 = null === (r3 = e11.filter) || void 0 === r3 ? void 0 : r3.event;
              return s3 && (null === (i3 = t10.ids) || void 0 === i3 ? void 0 : i3.includes(s3)) && ("*" === a4 || (null == a4 ? void 0 : a4.toLocaleLowerCase()) === (null === (n3 = t10.data) || void 0 === n3 ? void 0 : n3.type.toLocaleLowerCase()));
            }
            {
              let r4 = null === (o3 = null === (a3 = null == e11 ? void 0 : e11.filter) || void 0 === a3 ? void 0 : a3.event) || void 0 === o3 ? void 0 : o3.toLocaleLowerCase();
              return "*" === r4 || r4 === (null === (l3 = null == t10 ? void 0 : t10.event) || void 0 === l3 ? void 0 : l3.toLocaleLowerCase());
            }
          }).map((e11) => {
            if ("object" == typeof c2 && "ids" in c2) {
              let e12 = c2.data, { schema: t11, table: r3, commit_timestamp: i3, type: n3, errors: s3 } = e12;
              c2 = Object.assign(Object.assign({}, { schema: t11, table: r3, commit_timestamp: i3, eventType: n3, new: {}, old: {}, errors: s3 }), this._getPayloadRecords(e12));
            }
            e11.callback(c2, r2);
          });
        }
        _isClosed() {
          return this.state === Y.closed;
        }
        _isJoined() {
          return this.state === Y.joined;
        }
        _isJoining() {
          return this.state === Y.joining;
        }
        _isLeaving() {
          return this.state === Y.leaving;
        }
        _replyEventName(e10) {
          return `chan_reply_${e10}`;
        }
        _on(e10, t10, r2) {
          let i2 = e10.toLocaleLowerCase(), n2 = { type: i2, filter: t10, callback: r2 };
          return this.bindings[i2] ? this.bindings[i2].push(n2) : this.bindings[i2] = [n2], this;
        }
        _off(e10, t10) {
          let r2 = e10.toLocaleLowerCase();
          return this.bindings[r2] && (this.bindings[r2] = this.bindings[r2].filter((e11) => {
            var i2;
            return !((null === (i2 = e11.type) || void 0 === i2 ? void 0 : i2.toLocaleLowerCase()) === r2 && L.isEqual(e11.filter, t10));
          })), this;
        }
        static isEqual(e10, t10) {
          if (Object.keys(e10).length !== Object.keys(t10).length) return false;
          for (let r2 in e10) if (e10[r2] !== t10[r2]) return false;
          return true;
        }
        _rejoinUntilConnected() {
          this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
        }
        _onClose(e10) {
          this._on(Z.close, {}, e10);
        }
        _onError(e10) {
          this._on(Z.error, {}, (t10) => e10(t10));
        }
        _canPush() {
          return this.socket.isConnected() && this._isJoined();
        }
        _rejoin(e10 = this.timeout) {
          this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = Y.joining, this.joinPush.resend(e10));
        }
        _getPayloadRecords(e10) {
          let t10 = { new: {}, old: {} };
          return ("INSERT" === e10.type || "UPDATE" === e10.type) && (t10.new = k(e10.columns, e10.record)), ("UPDATE" === e10.type || "DELETE" === e10.type) && (t10.old = k(e10.columns, e10.old_record)), t10;
        }
      }
      let $ = () => {
      }, M = { HEARTBEAT_INTERVAL: 25e3, RECONNECT_DELAY: 10, HEARTBEAT_TIMEOUT_FALLBACK: 100 }, U = [1e3, 2e3, 5e3, 1e4], D = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
      class B {
        constructor(e10, t10) {
          var i2;
          if (this.accessTokenValue = null, this.apiKey = null, this.channels = [], this.endPoint = "", this.httpEndpoint = "", this.headers = {}, this.params = {}, this.timeout = 1e4, this.transport = null, this.heartbeatIntervalMs = M.HEARTBEAT_INTERVAL, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.heartbeatCallback = $, this.ref = 0, this.reconnectTimer = null, this.logger = $, this.conn = null, this.sendBuffer = [], this.serializer = new _(), this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] }, this.accessToken = null, this._connectionState = "disconnected", this._wasManualDisconnect = false, this._authPromise = null, this._resolveFetch = (e11) => {
            let t11;
            return e11 ? t11 = e11 : "undefined" == typeof fetch ? t11 = (...e12) => Promise.resolve().then(r.bind(r, 8254)).then(({ default: t12 }) => t12(...e12)).catch((e13) => {
              throw Error(`Failed to load @supabase/node-fetch: ${e13.message}. This is required for HTTP requests in Node.js environments without native fetch.`);
            }) : t11 = fetch, (...e12) => t11(...e12);
          }, !(null === (i2 = null == t10 ? void 0 : t10.params) || void 0 === i2 ? void 0 : i2.apikey)) throw Error("API key is required to connect to Realtime");
          this.apiKey = t10.params.apikey, this.endPoint = `${e10}/${Q.websocket}`, this.httpEndpoint = A(e10), this._initializeOptions(t10), this._setupReconnectionTimer(), this.fetch = this._resolveFetch(null == t10 ? void 0 : t10.fetch);
        }
        connect() {
          if (!(this.isConnecting() || this.isDisconnecting() || null !== this.conn && this.isConnected())) {
            if (this._setConnectionState("connecting"), this._setAuthSafely("connect"), this.transport) this.conn = new this.transport(this.endpointURL());
            else try {
              this.conn = y.createWebSocket(this.endpointURL());
            } catch (t10) {
              this._setConnectionState("disconnected");
              let e10 = t10.message;
              if (e10.includes("Node.js")) throw Error(`${e10}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
              throw Error(`WebSocket not available: ${e10}`);
            }
            this._setupConnectionHandlers();
          }
        }
        endpointURL() {
          return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: "1.0.0" }));
        }
        disconnect(e10, t10) {
          if (!this.isDisconnecting()) {
            if (this._setConnectionState("disconnecting", true), this.conn) {
              let r2 = setTimeout(() => {
                this._setConnectionState("disconnected");
              }, 100);
              this.conn.onclose = () => {
                clearTimeout(r2), this._setConnectionState("disconnected");
              }, e10 ? this.conn.close(e10, null != t10 ? t10 : "") : this.conn.close(), this._teardownConnection();
            } else this._setConnectionState("disconnected");
          }
        }
        getChannels() {
          return this.channels;
        }
        async removeChannel(e10) {
          let t10 = await e10.unsubscribe();
          return 0 === this.channels.length && this.disconnect(), t10;
        }
        async removeAllChannels() {
          let e10 = await Promise.all(this.channels.map((e11) => e11.unsubscribe()));
          return this.channels = [], this.disconnect(), e10;
        }
        log(e10, t10, r2) {
          this.logger(e10, t10, r2);
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case X.connecting:
              return ee.Connecting;
            case X.open:
              return ee.Open;
            case X.closing:
              return ee.Closing;
            default:
              return ee.Closed;
          }
        }
        isConnected() {
          return this.connectionState() === ee.Open;
        }
        isConnecting() {
          return "connecting" === this._connectionState;
        }
        isDisconnecting() {
          return "disconnecting" === this._connectionState;
        }
        channel(e10, t10 = { config: {} }) {
          let r2 = `realtime:${e10}`, i2 = this.getChannels().find((e11) => e11.topic === r2);
          if (i2) return i2;
          {
            let r3 = new L(`realtime:${e10}`, t10, this);
            return this.channels.push(r3), r3;
          }
        }
        push(e10) {
          let { topic: t10, event: r2, payload: i2, ref: n2 } = e10, s2 = () => {
            this.encode(e10, (e11) => {
              var t11;
              null === (t11 = this.conn) || void 0 === t11 || t11.send(e11);
            });
          };
          this.log("push", `${t10} ${r2} (${n2})`, i2), this.isConnected() ? s2() : this.sendBuffer.push(s2);
        }
        async setAuth(e10 = null) {
          this._authPromise = this._performAuth(e10);
          try {
            await this._authPromise;
          } finally {
            this._authPromise = null;
          }
        }
        async sendHeartbeat() {
          var e10;
          if (!this.isConnected()) {
            try {
              this.heartbeatCallback("disconnected");
            } catch (e11) {
              this.log("error", "error in heartbeat callback", e11);
            }
            return;
          }
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            try {
              this.heartbeatCallback("timeout");
            } catch (e11) {
              this.log("error", "error in heartbeat callback", e11);
            }
            this._wasManualDisconnect = false, null === (e10 = this.conn) || void 0 === e10 || e10.close(1e3, "heartbeat timeout"), setTimeout(() => {
              var e11;
              this.isConnected() || null === (e11 = this.reconnectTimer) || void 0 === e11 || e11.scheduleTimeout();
            }, M.HEARTBEAT_TIMEOUT_FALLBACK);
            return;
          }
          this.pendingHeartbeatRef = this._makeRef(), this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
          try {
            this.heartbeatCallback("sent");
          } catch (e11) {
            this.log("error", "error in heartbeat callback", e11);
          }
          this._setAuthSafely("heartbeat");
        }
        onHeartbeat(e10) {
          this.heartbeatCallback = e10;
        }
        flushSendBuffer() {
          this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e10) => e10()), this.sendBuffer = []);
        }
        _makeRef() {
          let e10 = this.ref + 1;
          return e10 === this.ref ? this.ref = 0 : this.ref = e10, this.ref.toString();
        }
        _leaveOpenTopic(e10) {
          let t10 = this.channels.find((t11) => t11.topic === e10 && (t11._isJoined() || t11._isJoining()));
          t10 && (this.log("transport", `leaving duplicate topic "${e10}"`), t10.unsubscribe());
        }
        _remove(e10) {
          this.channels = this.channels.filter((t10) => t10.topic !== e10.topic);
        }
        _onConnMessage(e10) {
          this.decode(e10.data, (e11) => {
            if ("phoenix" === e11.topic && "phx_reply" === e11.event) try {
              this.heartbeatCallback("ok" === e11.payload.status ? "ok" : "error");
            } catch (e12) {
              this.log("error", "error in heartbeat callback", e12);
            }
            e11.ref && e11.ref === this.pendingHeartbeatRef && (this.pendingHeartbeatRef = null);
            let { topic: t10, event: r2, payload: i2, ref: n2 } = e11, s2 = n2 ? `(${n2})` : "", a2 = i2.status || "";
            this.log("receive", `${a2} ${t10} ${r2} ${s2}`.trim(), i2), this.channels.filter((e12) => e12._isMember(t10)).forEach((e12) => e12._trigger(r2, i2, n2)), this._triggerStateCallbacks("message", e11);
          });
        }
        _clearTimer(e10) {
          var t10;
          "heartbeat" === e10 && this.heartbeatTimer ? (clearInterval(this.heartbeatTimer), this.heartbeatTimer = void 0) : "reconnect" === e10 && (null === (t10 = this.reconnectTimer) || void 0 === t10 || t10.reset());
        }
        _clearAllTimers() {
          this._clearTimer("heartbeat"), this._clearTimer("reconnect");
        }
        _setupConnectionHandlers() {
          this.conn && ("binaryType" in this.conn && (this.conn.binaryType = "arraybuffer"), this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (e10) => this._onConnError(e10), this.conn.onmessage = (e10) => this._onConnMessage(e10), this.conn.onclose = (e10) => this._onConnClose(e10));
        }
        _teardownConnection() {
          this.conn && (this.conn.onopen = null, this.conn.onerror = null, this.conn.onmessage = null, this.conn.onclose = null, this.conn = null), this._clearAllTimers(), this.channels.forEach((e10) => e10.teardown());
        }
        _onConnOpen() {
          this._setConnectionState("connected"), this.log("transport", `connected to ${this.endpointURL()}`), this.flushSendBuffer(), this._clearTimer("reconnect"), this.worker ? this.workerRef || this._startWorkerHeartbeat() : this._startHeartbeat(), this._triggerStateCallbacks("open");
        }
        _startHeartbeat() {
          this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        _startWorkerHeartbeat() {
          this.workerUrl ? this.log("worker", `starting worker for from ${this.workerUrl}`) : this.log("worker", "starting default worker");
          let e10 = this._workerObjectUrl(this.workerUrl);
          this.workerRef = new Worker(e10), this.workerRef.onerror = (e11) => {
            this.log("worker", "worker error", e11.message), this.workerRef.terminate();
          }, this.workerRef.onmessage = (e11) => {
            "keepAlive" === e11.data.event && this.sendHeartbeat();
          }, this.workerRef.postMessage({ event: "start", interval: this.heartbeatIntervalMs });
        }
        _onConnClose(e10) {
          var t10;
          this._setConnectionState("disconnected"), this.log("transport", "close", e10), this._triggerChanError(), this._clearTimer("heartbeat"), this._wasManualDisconnect || null === (t10 = this.reconnectTimer) || void 0 === t10 || t10.scheduleTimeout(), this._triggerStateCallbacks("close", e10);
        }
        _onConnError(e10) {
          this._setConnectionState("disconnected"), this.log("transport", `${e10}`), this._triggerChanError(), this._triggerStateCallbacks("error", e10);
        }
        _triggerChanError() {
          this.channels.forEach((e10) => e10._trigger(Z.error));
        }
        _appendParams(e10, t10) {
          if (0 === Object.keys(t10).length) return e10;
          let r2 = e10.match(/\?/) ? "&" : "?", i2 = new URLSearchParams(t10);
          return `${e10}${r2}${i2}`;
        }
        _workerObjectUrl(e10) {
          let t10;
          if (e10) t10 = e10;
          else {
            let e11 = new Blob([D], { type: "application/javascript" });
            t10 = URL.createObjectURL(e11);
          }
          return t10;
        }
        _setConnectionState(e10, t10 = false) {
          this._connectionState = e10, "connecting" === e10 ? this._wasManualDisconnect = false : "disconnecting" === e10 && (this._wasManualDisconnect = t10);
        }
        async _performAuth(e10 = null) {
          let t10;
          t10 = e10 || (this.accessToken ? await this.accessToken() : this.accessTokenValue), this.accessTokenValue != t10 && (this.accessTokenValue = t10, this.channels.forEach((e11) => {
            t10 && e11.updateJoinPayload({ access_token: t10, version: "realtime-js/2.74.0" }), e11.joinedOnce && e11._isJoined() && e11._push(Z.access_token, { access_token: t10 });
          }));
        }
        async _waitForAuthIfNeeded() {
          this._authPromise && await this._authPromise;
        }
        _setAuthSafely(e10 = "general") {
          this.setAuth().catch((t10) => {
            this.log("error", `error setting auth in ${e10}`, t10);
          });
        }
        _triggerStateCallbacks(e10, t10) {
          try {
            this.stateChangeCallbacks[e10].forEach((r2) => {
              try {
                r2(t10);
              } catch (t11) {
                this.log("error", `error in ${e10} callback`, t11);
              }
            });
          } catch (t11) {
            this.log("error", `error triggering ${e10} callbacks`, t11);
          }
        }
        _setupReconnectionTimer() {
          this.reconnectTimer = new S(async () => {
            setTimeout(async () => {
              await this._waitForAuthIfNeeded(), this.isConnected() || this.connect();
            }, M.RECONNECT_DELAY);
          }, this.reconnectAfterMs);
        }
        _initializeOptions(e10) {
          var t10, r2, i2, n2, s2, a2, o2, l2, u2;
          if (this.transport = null !== (t10 = null == e10 ? void 0 : e10.transport) && void 0 !== t10 ? t10 : null, this.timeout = null !== (r2 = null == e10 ? void 0 : e10.timeout) && void 0 !== r2 ? r2 : 1e4, this.heartbeatIntervalMs = null !== (i2 = null == e10 ? void 0 : e10.heartbeatIntervalMs) && void 0 !== i2 ? i2 : M.HEARTBEAT_INTERVAL, this.worker = null !== (n2 = null == e10 ? void 0 : e10.worker) && void 0 !== n2 && n2, this.accessToken = null !== (s2 = null == e10 ? void 0 : e10.accessToken) && void 0 !== s2 ? s2 : null, this.heartbeatCallback = null !== (a2 = null == e10 ? void 0 : e10.heartbeatCallback) && void 0 !== a2 ? a2 : $, (null == e10 ? void 0 : e10.params) && (this.params = e10.params), (null == e10 ? void 0 : e10.logger) && (this.logger = e10.logger), ((null == e10 ? void 0 : e10.logLevel) || (null == e10 ? void 0 : e10.log_level)) && (this.logLevel = e10.logLevel || e10.log_level, this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel })), this.reconnectAfterMs = null !== (o2 = null == e10 ? void 0 : e10.reconnectAfterMs) && void 0 !== o2 ? o2 : (e11) => U[e11 - 1] || 1e4, this.encode = null !== (l2 = null == e10 ? void 0 : e10.encode) && void 0 !== l2 ? l2 : (e11, t11) => t11(JSON.stringify(e11)), this.decode = null !== (u2 = null == e10 ? void 0 : e10.decode) && void 0 !== u2 ? u2 : this.serializer.decode.bind(this.serializer), this.worker) {
            if ("undefined" != typeof window && !window.Worker) throw Error("Web Worker is not supported");
            this.workerUrl = null == e10 ? void 0 : e10.workerUrl;
          }
        }
      }
      class q extends Error {
        constructor(e10) {
          super(e10), this.__isStorageError = true, this.name = "StorageError";
        }
      }
      function V(e10) {
        return "object" == typeof e10 && null !== e10 && "__isStorageError" in e10;
      }
      class H extends q {
        constructor(e10, t10, r2) {
          super(e10), this.name = "StorageApiError", this.status = t10, this.statusCode = r2;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, statusCode: this.statusCode };
        }
      }
      class F extends q {
        constructor(e10, t10) {
          super(e10), this.name = "StorageUnknownError", this.originalError = t10;
        }
      }
      let z = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = (...e11) => Promise.resolve().then(r.bind(r, 8254)).then(({ default: t11 }) => t11(...e11)) : t10 = fetch, (...e11) => t10(...e11);
      }, K = () => function(e10, t10, r2, i2) {
        return new (r2 || (r2 = Promise))(function(n2, s2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      }(void 0, void 0, void 0, function* () {
        return "undefined" == typeof Response ? (yield Promise.resolve().then(r.bind(r, 8254))).Response : Response;
      }), W = (e10) => {
        if (Array.isArray(e10)) return e10.map((e11) => W(e11));
        if ("function" == typeof e10 || e10 !== Object(e10)) return e10;
        let t10 = {};
        return Object.entries(e10).forEach(([e11, r2]) => {
          t10[e11.replace(/([-_][a-z])/gi, (e12) => e12.toUpperCase().replace(/[-_]/g, ""))] = W(r2);
        }), t10;
      }, J = (e10) => {
        if ("object" != typeof e10 || null === e10) return false;
        let t10 = Object.getPrototypeOf(e10);
        return (null === t10 || t10 === Object.prototype || null === Object.getPrototypeOf(t10)) && !(Symbol.toStringTag in e10) && !(Symbol.iterator in e10);
      };
      var G, X, Y, Z, Q, ee, et, er, ei, en, es, ea = function(e10, t10, r2, i2) {
        return new (r2 || (r2 = Promise))(function(n2, s2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      };
      let eo = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), el = (e10, t10, r2) => ea(void 0, void 0, void 0, function* () {
        e10 instanceof (yield K()) && !(null == r2 ? void 0 : r2.noResolveJson) ? e10.json().then((r3) => {
          let i2 = e10.status || 500, n2 = (null == r3 ? void 0 : r3.statusCode) || i2 + "";
          t10(new H(eo(r3), i2, n2));
        }).catch((e11) => {
          t10(new F(eo(e11), e11));
        }) : t10(new F(eo(e10), e10));
      }), eu = (e10, t10, r2, i2) => {
        let n2 = { method: e10, headers: (null == t10 ? void 0 : t10.headers) || {} };
        return "GET" !== e10 && i2 ? (J(i2) ? (n2.headers = Object.assign({ "Content-Type": "application/json" }, null == t10 ? void 0 : t10.headers), n2.body = JSON.stringify(i2)) : n2.body = i2, (null == t10 ? void 0 : t10.duplex) && (n2.duplex = t10.duplex), Object.assign(Object.assign({}, n2), r2)) : n2;
      };
      function ec(e10, t10, r2, i2, n2, s2) {
        return ea(this, void 0, void 0, function* () {
          return new Promise((a2, o2) => {
            e10(r2, eu(t10, i2, n2, s2)).then((e11) => {
              if (!e11.ok) throw e11;
              return (null == i2 ? void 0 : i2.noResolveJson) ? e11 : e11.json();
            }).then((e11) => a2(e11)).catch((e11) => el(e11, o2, i2));
          });
        });
      }
      function eh(e10, t10, r2, i2) {
        return ea(this, void 0, void 0, function* () {
          return ec(e10, "GET", t10, r2, i2);
        });
      }
      function ed(e10, t10, r2, i2, n2) {
        return ea(this, void 0, void 0, function* () {
          return ec(e10, "POST", t10, i2, n2, r2);
        });
      }
      function ep(e10, t10, r2, i2, n2) {
        return ea(this, void 0, void 0, function* () {
          return ec(e10, "PUT", t10, i2, n2, r2);
        });
      }
      function ef(e10, t10, r2, i2, n2) {
        return ea(this, void 0, void 0, function* () {
          return ec(e10, "DELETE", t10, i2, n2, r2);
        });
      }
      class eg {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10;
        }
        then(e10, t10) {
          return this.execute().then(e10, t10);
        }
        execute() {
          var e10, t10, r2, i2;
          return e10 = this, t10 = void 0, r2 = void 0, i2 = function* () {
            try {
              return { data: (yield this.downloadFn()).body, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          }, new (r2 || (r2 = Promise))(function(n2, s2) {
            function a2(e11) {
              try {
                l2(i2.next(e11));
              } catch (e12) {
                s2(e12);
              }
            }
            function o2(e11) {
              try {
                l2(i2.throw(e11));
              } catch (e12) {
                s2(e12);
              }
            }
            function l2(e11) {
              var t11;
              e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
                e12(t11);
              })).then(a2, o2);
            }
            l2((i2 = i2.apply(e10, t10 || [])).next());
          });
        }
      }
      class eb {
        constructor(e10, t10) {
          this.downloadFn = e10, this.shouldThrowOnError = t10;
        }
        asStream() {
          return new eg(this.downloadFn, this.shouldThrowOnError);
        }
        then(e10, t10) {
          return this.execute().then(e10, t10);
        }
        execute() {
          var e10, t10, r2, i2;
          return e10 = this, t10 = void 0, r2 = void 0, i2 = function* () {
            try {
              let e11 = yield this.downloadFn();
              return { data: yield e11.blob(), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          }, new (r2 || (r2 = Promise))(function(n2, s2) {
            function a2(e11) {
              try {
                l2(i2.next(e11));
              } catch (e12) {
                s2(e12);
              }
            }
            function o2(e11) {
              try {
                l2(i2.throw(e11));
              } catch (e12) {
                s2(e12);
              }
            }
            function l2(e11) {
              var t11;
              e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
                e12(t11);
              })).then(a2, o2);
            }
            l2((i2 = i2.apply(e10, t10 || [])).next());
          });
        }
      }
      var ev = r(6195).Buffer, ew = function(e10, t10, r2, i2) {
        return new (r2 || (r2 = Promise))(function(n2, s2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      };
      let em = { limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }, ey = { cacheControl: "3600", contentType: "text/plain;charset=UTF-8", upsert: false };
      class e_ {
        constructor(e10, t10 = {}, r2, i2) {
          this.shouldThrowOnError = false, this.url = e10, this.headers = t10, this.bucketId = r2, this.fetch = z(i2);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        uploadOrUpdate(e10, t10, r2, i2) {
          return ew(this, void 0, void 0, function* () {
            try {
              let n2;
              let s2 = Object.assign(Object.assign({}, ey), i2), a2 = Object.assign(Object.assign({}, this.headers), "POST" === e10 && { "x-upsert": String(s2.upsert) }), o2 = s2.metadata;
              "undefined" != typeof Blob && r2 instanceof Blob ? ((n2 = new FormData()).append("cacheControl", s2.cacheControl), o2 && n2.append("metadata", this.encodeMetadata(o2)), n2.append("", r2)) : "undefined" != typeof FormData && r2 instanceof FormData ? ((n2 = r2).append("cacheControl", s2.cacheControl), o2 && n2.append("metadata", this.encodeMetadata(o2))) : (n2 = r2, a2["cache-control"] = `max-age=${s2.cacheControl}`, a2["content-type"] = s2.contentType, o2 && (a2["x-metadata"] = this.toBase64(this.encodeMetadata(o2)))), (null == i2 ? void 0 : i2.headers) && (a2 = Object.assign(Object.assign({}, a2), i2.headers));
              let l2 = this._removeEmptyFolders(t10), u2 = this._getFinalPath(l2), c2 = yield ("PUT" == e10 ? ep : ed)(this.fetch, `${this.url}/object/${u2}`, n2, Object.assign({ headers: a2 }, (null == s2 ? void 0 : s2.duplex) ? { duplex: s2.duplex } : {}));
              return { data: { path: l2, id: c2.Id, fullPath: c2.Key }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        upload(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("POST", e10, t10, r2);
          });
        }
        uploadToSignedUrl(e10, t10, r2, i2) {
          return ew(this, void 0, void 0, function* () {
            let n2 = this._removeEmptyFolders(e10), s2 = this._getFinalPath(n2), a2 = new URL(this.url + `/object/upload/sign/${s2}`);
            a2.searchParams.set("token", t10);
            try {
              let e11;
              let t11 = Object.assign({ upsert: ey.upsert }, i2), s3 = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(t11.upsert) });
              "undefined" != typeof Blob && r2 instanceof Blob ? ((e11 = new FormData()).append("cacheControl", t11.cacheControl), e11.append("", r2)) : "undefined" != typeof FormData && r2 instanceof FormData ? (e11 = r2).append("cacheControl", t11.cacheControl) : (e11 = r2, s3["cache-control"] = `max-age=${t11.cacheControl}`, s3["content-type"] = t11.contentType);
              let o2 = yield ep(this.fetch, a2.toString(), e11, { headers: s3 });
              return { data: { path: n2, fullPath: o2.Key }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUploadUrl(e10, t10) {
          return ew(this, void 0, void 0, function* () {
            try {
              let r2 = this._getFinalPath(e10), i2 = Object.assign({}, this.headers);
              (null == t10 ? void 0 : t10.upsert) && (i2["x-upsert"] = "true");
              let n2 = yield ed(this.fetch, `${this.url}/object/upload/sign/${r2}`, {}, { headers: i2 }), s2 = new URL(this.url + n2.url), a2 = s2.searchParams.get("token");
              if (!a2) throw new q("No token returned by API");
              return { data: { signedUrl: s2.toString(), path: e10, token: a2 }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        update(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("PUT", e10, t10, r2);
          });
        }
        move(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            try {
              return { data: yield ed(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r2 ? void 0 : r2.destinationBucket }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        copy(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            try {
              return { data: { path: (yield ed(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: e10, destinationKey: t10, destinationBucket: null == r2 ? void 0 : r2.destinationBucket }, { headers: this.headers })).Key }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUrl(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            try {
              let i2 = this._getFinalPath(e10), n2 = yield ed(this.fetch, `${this.url}/object/sign/${i2}`, Object.assign({ expiresIn: t10 }, (null == r2 ? void 0 : r2.transform) ? { transform: r2.transform } : {}), { headers: this.headers }), s2 = (null == r2 ? void 0 : r2.download) ? `&download=${true === r2.download ? "" : r2.download}` : "";
              return { data: n2 = { signedUrl: encodeURI(`${this.url}${n2.signedURL}${s2}`) }, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createSignedUrls(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            try {
              let i2 = yield ed(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: t10, paths: e10 }, { headers: this.headers }), n2 = (null == r2 ? void 0 : r2.download) ? `&download=${true === r2.download ? "" : r2.download}` : "";
              return { data: i2.map((e11) => Object.assign(Object.assign({}, e11), { signedUrl: e11.signedURL ? encodeURI(`${this.url}${e11.signedURL}${n2}`) : null })), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        download(e10, t10) {
          let r2 = void 0 !== (null == t10 ? void 0 : t10.transform) ? "render/image/authenticated" : "object", i2 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {}), n2 = i2 ? `?${i2}` : "", s2 = this._getFinalPath(e10);
          return new eb(() => eh(this.fetch, `${this.url}/${r2}/${s2}${n2}`, { headers: this.headers, noResolveJson: true }), this.shouldThrowOnError);
        }
        info(e10) {
          return ew(this, void 0, void 0, function* () {
            let t10 = this._getFinalPath(e10);
            try {
              let e11 = yield eh(this.fetch, `${this.url}/object/info/${t10}`, { headers: this.headers });
              return { data: W(e11), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        exists(e10) {
          return ew(this, void 0, void 0, function* () {
            let t10 = this._getFinalPath(e10);
            try {
              return yield function(e11, t11, r2, i2) {
                return ea(this, void 0, void 0, function* () {
                  return ec(e11, "HEAD", t11, Object.assign(Object.assign({}, r2), { noResolveJson: true }), void 0);
                });
              }(this.fetch, `${this.url}/object/${t10}`, { headers: this.headers }), { data: true, error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11) && e11 instanceof F) {
                let t11 = e11.originalError;
                if ([400, 404].includes(null == t11 ? void 0 : t11.status)) return { data: false, error: e11 };
              }
              throw e11;
            }
          });
        }
        getPublicUrl(e10, t10) {
          let r2 = this._getFinalPath(e10), i2 = [], n2 = (null == t10 ? void 0 : t10.download) ? `download=${true === t10.download ? "" : t10.download}` : "";
          "" !== n2 && i2.push(n2);
          let s2 = void 0 !== (null == t10 ? void 0 : t10.transform), a2 = this.transformOptsToQueryString((null == t10 ? void 0 : t10.transform) || {});
          "" !== a2 && i2.push(a2);
          let o2 = i2.join("&");
          return "" !== o2 && (o2 = `?${o2}`), { data: { publicUrl: encodeURI(`${this.url}/${s2 ? "render/image" : "object"}/public/${r2}${o2}`) } };
        }
        remove(e10) {
          return ew(this, void 0, void 0, function* () {
            try {
              return { data: yield ef(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: e10 }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        list(e10, t10, r2) {
          return ew(this, void 0, void 0, function* () {
            try {
              let i2 = Object.assign(Object.assign(Object.assign({}, em), t10), { prefix: e10 || "" });
              return { data: yield ed(this.fetch, `${this.url}/object/list/${this.bucketId}`, i2, { headers: this.headers }, r2), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        listV2(e10, t10) {
          return ew(this, void 0, void 0, function* () {
            try {
              let r2 = Object.assign({}, e10);
              return { data: yield ed(this.fetch, `${this.url}/object/list-v2/${this.bucketId}`, r2, { headers: this.headers }, t10), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        encodeMetadata(e10) {
          return JSON.stringify(e10);
        }
        toBase64(e10) {
          return void 0 !== ev ? ev.from(e10).toString("base64") : btoa(e10);
        }
        _getFinalPath(e10) {
          return `${this.bucketId}/${e10.replace(/^\/+/, "")}`;
        }
        _removeEmptyFolders(e10) {
          return e10.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
        transformOptsToQueryString(e10) {
          let t10 = [];
          return e10.width && t10.push(`width=${e10.width}`), e10.height && t10.push(`height=${e10.height}`), e10.resize && t10.push(`resize=${e10.resize}`), e10.format && t10.push(`format=${e10.format}`), e10.quality && t10.push(`quality=${e10.quality}`), t10.join("&");
        }
      }
      let eS = { "X-Client-Info": "storage-js/2.74.0" };
      var ek = function(e10, t10, r2, i2) {
        return new (r2 || (r2 = Promise))(function(n2, s2) {
          function a2(e11) {
            try {
              l2(i2.next(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function o2(e11) {
            try {
              l2(i2.throw(e11));
            } catch (e12) {
              s2(e12);
            }
          }
          function l2(e11) {
            var t11;
            e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
              e12(t11);
            })).then(a2, o2);
          }
          l2((i2 = i2.apply(e10, t10 || [])).next());
        });
      };
      class eO {
        constructor(e10, t10 = {}, r2, i2) {
          this.shouldThrowOnError = false;
          let n2 = new URL(e10);
          (null == i2 ? void 0 : i2.useNewHostname) && /supabase\.(co|in|red)$/.test(n2.hostname) && !n2.hostname.includes("storage.supabase.") && (n2.hostname = n2.hostname.replace("supabase.", "storage.supabase.")), this.url = n2.href.replace(/\/$/, ""), this.headers = Object.assign(Object.assign({}, eS), t10), this.fetch = z(r2);
        }
        throwOnError() {
          return this.shouldThrowOnError = true, this;
        }
        listBuckets() {
          return ek(this, void 0, void 0, function* () {
            try {
              return { data: yield eh(this.fetch, `${this.url}/bucket`, { headers: this.headers }), error: null };
            } catch (e10) {
              if (this.shouldThrowOnError) throw e10;
              if (V(e10)) return { data: null, error: e10 };
              throw e10;
            }
          });
        }
        getBucket(e10) {
          return ek(this, void 0, void 0, function* () {
            try {
              return { data: yield eh(this.fetch, `${this.url}/bucket/${e10}`, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        createBucket(e10) {
          return ek(this, arguments, void 0, function* (e11, t10 = { public: false }) {
            try {
              return { data: yield ed(this.fetch, `${this.url}/bucket`, { id: e11, name: e11, type: t10.type, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (e12) {
              if (this.shouldThrowOnError) throw e12;
              if (V(e12)) return { data: null, error: e12 };
              throw e12;
            }
          });
        }
        updateBucket(e10, t10) {
          return ek(this, void 0, void 0, function* () {
            try {
              return { data: yield ep(this.fetch, `${this.url}/bucket/${e10}`, { id: e10, name: e10, public: t10.public, file_size_limit: t10.fileSizeLimit, allowed_mime_types: t10.allowedMimeTypes }, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        emptyBucket(e10) {
          return ek(this, void 0, void 0, function* () {
            try {
              return { data: yield ed(this.fetch, `${this.url}/bucket/${e10}/empty`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        deleteBucket(e10) {
          return ek(this, void 0, void 0, function* () {
            try {
              return { data: yield ef(this.fetch, `${this.url}/bucket/${e10}`, {}, { headers: this.headers }), error: null };
            } catch (e11) {
              if (this.shouldThrowOnError) throw e11;
              if (V(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
      }
      class eE extends eO {
        constructor(e10, t10 = {}, r2, i2) {
          super(e10, t10, r2, i2);
        }
        from(e10) {
          return new e_(this.url, this.headers, e10, this.fetch);
        }
      }
      let eT = "";
      "undefined" != typeof Deno ? eT = "deno" : "undefined" != typeof document ? eT = "web" : "undefined" != typeof navigator && "ReactNative" === navigator.product ? eT = "react-native" : eT = "node";
      let ex = { headers: { "X-Client-Info": `supabase-js-${eT}/2.74.0` } }, eC = { schema: "public" }, eP = { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, flowType: "implicit" }, eI = {};
      var eR = r(8254);
      let eA = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = eR.default : t10 = fetch, (...e11) => t10(...e11);
      }, ej = () => "undefined" == typeof Headers ? eR.Headers : Headers, eN = (e10, t10, r2) => {
        let i2 = eA(r2), n2 = ej();
        return (r3, s2) => function(e11, t11, r4, i3) {
          return new (r4 || (r4 = Promise))(function(n3, s3) {
            function a2(e12) {
              try {
                l2(i3.next(e12));
              } catch (e13) {
                s3(e13);
              }
            }
            function o2(e12) {
              try {
                l2(i3.throw(e12));
              } catch (e13) {
                s3(e13);
              }
            }
            function l2(e12) {
              var t12;
              e12.done ? n3(e12.value) : ((t12 = e12.value) instanceof r4 ? t12 : new r4(function(e13) {
                e13(t12);
              })).then(a2, o2);
            }
            l2((i3 = i3.apply(e11, t11 || [])).next());
          });
        }(void 0, void 0, void 0, function* () {
          var a2;
          let o2 = null !== (a2 = yield t10()) && void 0 !== a2 ? a2 : e10, l2 = new n2(null == s2 ? void 0 : s2.headers);
          return l2.has("apikey") || l2.set("apikey", e10), l2.has("Authorization") || l2.set("Authorization", `Bearer ${o2}`), i2(r3, Object.assign(Object.assign({}, s2), { headers: l2 }));
        });
      }, eL = "2.74.0", e$ = { "X-Client-Info": `gotrue-js/${eL}` }, eM = "X-Supabase-Api-Version", eU = { "2024-01-01": { timestamp: Date.parse("2024-01-01T00:00:00.0Z"), name: "2024-01-01" } }, eD = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
      class eB extends Error {
        constructor(e10, t10, r2) {
          super(e10), this.__isAuthError = true, this.name = "AuthError", this.status = t10, this.code = r2;
        }
      }
      function eq(e10) {
        return "object" == typeof e10 && null !== e10 && "__isAuthError" in e10;
      }
      class eV extends eB {
        constructor(e10, t10, r2) {
          super(e10, t10, r2), this.name = "AuthApiError", this.status = t10, this.code = r2;
        }
      }
      class eH extends eB {
        constructor(e10, t10) {
          super(e10), this.name = "AuthUnknownError", this.originalError = t10;
        }
      }
      class eF extends eB {
        constructor(e10, t10, r2, i2) {
          super(e10, r2, i2), this.name = t10, this.status = r2;
        }
      }
      class ez extends eF {
        constructor() {
          super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
        }
      }
      class eK extends eF {
        constructor() {
          super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
        }
      }
      class eW extends eF {
        constructor(e10) {
          super(e10, "AuthInvalidCredentialsError", 400, void 0);
        }
      }
      class eJ extends eF {
        constructor(e10, t10 = null) {
          super(e10, "AuthImplicitGrantRedirectError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class eG extends eF {
        constructor(e10, t10 = null) {
          super(e10, "AuthPKCEGrantCodeExchangeError", 500, void 0), this.details = null, this.details = t10;
        }
        toJSON() {
          return { name: this.name, message: this.message, status: this.status, details: this.details };
        }
      }
      class eX extends eF {
        constructor(e10, t10) {
          super(e10, "AuthRetryableFetchError", t10, void 0);
        }
      }
      function eY(e10) {
        return eq(e10) && "AuthRetryableFetchError" === e10.name;
      }
      class eZ extends eF {
        constructor(e10, t10, r2) {
          super(e10, "AuthWeakPasswordError", t10, "weak_password"), this.reasons = r2;
        }
      }
      class eQ extends eF {
        constructor(e10) {
          super(e10, "AuthInvalidJwtError", 400, "invalid_jwt");
        }
      }
      let e0 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""), e1 = " 	\n\r=".split(""), e2 = (() => {
        let e10 = Array(128);
        for (let t10 = 0; t10 < e10.length; t10 += 1) e10[t10] = -1;
        for (let t10 = 0; t10 < e1.length; t10 += 1) e10[e1[t10].charCodeAt(0)] = -2;
        for (let t10 = 0; t10 < e0.length; t10 += 1) e10[e0[t10].charCodeAt(0)] = t10;
        return e10;
      })();
      function e3(e10, t10, r2) {
        if (null !== e10) for (t10.queue = t10.queue << 8 | e10, t10.queuedBits += 8; t10.queuedBits >= 6; ) r2(e0[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
        else if (t10.queuedBits > 0) for (t10.queue = t10.queue << 6 - t10.queuedBits, t10.queuedBits = 6; t10.queuedBits >= 6; ) r2(e0[t10.queue >> t10.queuedBits - 6 & 63]), t10.queuedBits -= 6;
      }
      function e4(e10, t10, r2) {
        let i2 = e2[e10];
        if (i2 > -1) for (t10.queue = t10.queue << 6 | i2, t10.queuedBits += 6; t10.queuedBits >= 8; ) r2(t10.queue >> t10.queuedBits - 8 & 255), t10.queuedBits -= 8;
        else if (-2 === i2) return;
        else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e10)}"`);
      }
      function e6(e10) {
        let t10 = [], r2 = (e11) => {
          t10.push(String.fromCodePoint(e11));
        }, i2 = { utf8seq: 0, codepoint: 0 }, n2 = { queue: 0, queuedBits: 0 }, s2 = (e11) => {
          !function(e12, t11, r3) {
            if (0 === t11.utf8seq) {
              if (e12 <= 127) {
                r3(e12);
                return;
              }
              for (let r4 = 1; r4 < 6; r4 += 1) if ((e12 >> 7 - r4 & 1) == 0) {
                t11.utf8seq = r4;
                break;
              }
              if (2 === t11.utf8seq) t11.codepoint = 31 & e12;
              else if (3 === t11.utf8seq) t11.codepoint = 15 & e12;
              else if (4 === t11.utf8seq) t11.codepoint = 7 & e12;
              else throw Error("Invalid UTF-8 sequence");
              t11.utf8seq -= 1;
            } else if (t11.utf8seq > 0) {
              if (e12 <= 127) throw Error("Invalid UTF-8 sequence");
              t11.codepoint = t11.codepoint << 6 | 63 & e12, t11.utf8seq -= 1, 0 === t11.utf8seq && r3(t11.codepoint);
            }
          }(e11, i2, r2);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) e4(e10.charCodeAt(t11), n2, s2);
        return t10.join("");
      }
      function e8(e10) {
        let t10 = [], r2 = { queue: 0, queuedBits: 0 }, i2 = (e11) => {
          t10.push(e11);
        };
        for (let t11 = 0; t11 < e10.length; t11 += 1) e4(e10.charCodeAt(t11), r2, i2);
        return new Uint8Array(t10);
      }
      function e5(e10) {
        let t10 = [], r2 = { queue: 0, queuedBits: 0 }, i2 = (e11) => {
          t10.push(e11);
        };
        return e10.forEach((e11) => e3(e11, r2, i2)), e3(null, r2, i2), t10.join("");
      }
      let e9 = () => "undefined" != typeof window && "undefined" != typeof document, e7 = { tested: false, writable: false }, te = () => {
        if (!e9()) return false;
        try {
          if ("object" != typeof globalThis.localStorage) return false;
        } catch (e11) {
          return false;
        }
        if (e7.tested) return e7.writable;
        let e10 = `lswt-${Math.random()}${Math.random()}`;
        try {
          globalThis.localStorage.setItem(e10, e10), globalThis.localStorage.removeItem(e10), e7.tested = true, e7.writable = true;
        } catch (e11) {
          e7.tested = true, e7.writable = false;
        }
        return e7.writable;
      }, tt = (e10) => {
        let t10;
        return e10 ? t10 = e10 : "undefined" == typeof fetch ? t10 = (...e11) => Promise.resolve().then(r.bind(r, 8254)).then(({ default: t11 }) => t11(...e11)) : t10 = fetch, (...e11) => t10(...e11);
      }, tr = (e10) => "object" == typeof e10 && null !== e10 && "status" in e10 && "ok" in e10 && "json" in e10 && "function" == typeof e10.json, ti = async (e10, t10, r2) => {
        await e10.setItem(t10, JSON.stringify(r2));
      }, tn = async (e10, t10) => {
        let r2 = await e10.getItem(t10);
        if (!r2) return null;
        try {
          return JSON.parse(r2);
        } catch (e11) {
          return r2;
        }
      }, ts = async (e10, t10) => {
        await e10.removeItem(t10);
      };
      class ta {
        constructor() {
          this.promise = new ta.promiseConstructor((e10, t10) => {
            this.resolve = e10, this.reject = t10;
          });
        }
      }
      function to(e10) {
        let t10 = e10.split(".");
        if (3 !== t10.length) throw new eQ("Invalid JWT structure");
        for (let e11 = 0; e11 < t10.length; e11++) if (!eD.test(t10[e11])) throw new eQ("JWT not in base64url format");
        return { header: JSON.parse(e6(t10[0])), payload: JSON.parse(e6(t10[1])), signature: e8(t10[2]), raw: { header: t10[0], payload: t10[1] } };
      }
      async function tl(e10) {
        return await new Promise((t10) => {
          setTimeout(() => t10(null), e10);
        });
      }
      function tu(e10) {
        return ("0" + e10.toString(16)).substr(-2);
      }
      async function tc(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => String.fromCharCode(e11)).join("");
      }
      async function th(e10) {
        return "undefined" != typeof crypto && void 0 !== crypto.subtle && "undefined" != typeof TextEncoder ? btoa(await tc(e10)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : (console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), e10);
      }
      async function td(e10, t10, r2 = false) {
        let i2 = function() {
          let e11 = new Uint32Array(56);
          if ("undefined" == typeof crypto) {
            let e12 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", t11 = e12.length, r3 = "";
            for (let i3 = 0; i3 < 56; i3++) r3 += e12.charAt(Math.floor(Math.random() * t11));
            return r3;
          }
          return crypto.getRandomValues(e11), Array.from(e11, tu).join("");
        }(), n2 = i2;
        r2 && (n2 += "/PASSWORD_RECOVERY"), await ti(e10, `${t10}-code-verifier`, n2);
        let s2 = await th(i2), a2 = i2 === s2 ? "plain" : "s256";
        return [s2, a2];
      }
      ta.promiseConstructor = Promise;
      let tp = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i, tf = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
      function tg(e10) {
        if (!tf.test(e10)) throw Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
      function tb() {
        return new Proxy({}, { get: (e10, t10) => {
          if ("__isUserNotAvailableProxy" === t10) return true;
          if ("symbol" == typeof t10) {
            let e11 = t10.toString();
            if ("Symbol(Symbol.toPrimitive)" === e11 || "Symbol(Symbol.toStringTag)" === e11 || "Symbol(util.inspect.custom)" === e11) return;
          }
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t10}" property of the session object is not supported. Please use getUser() instead.`);
        }, set: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }, deleteProperty: (e10, t10) => {
          throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t10}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        } });
      }
      function tv(e10) {
        return JSON.parse(JSON.stringify(e10));
      }
      var tw = function(e10, t10) {
        var r2 = {};
        for (var i2 in e10) Object.prototype.hasOwnProperty.call(e10, i2) && 0 > t10.indexOf(i2) && (r2[i2] = e10[i2]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var n2 = 0, i2 = Object.getOwnPropertySymbols(e10); n2 < i2.length; n2++) 0 > t10.indexOf(i2[n2]) && Object.prototype.propertyIsEnumerable.call(e10, i2[n2]) && (r2[i2[n2]] = e10[i2[n2]]);
        return r2;
      };
      let tm = (e10) => e10.msg || e10.message || e10.error_description || e10.error || JSON.stringify(e10), ty = [502, 503, 504];
      async function t_(e10) {
        var t10;
        let r2, i2;
        if (!tr(e10)) throw new eX(tm(e10), 0);
        if (ty.includes(e10.status)) throw new eX(tm(e10), e10.status);
        try {
          r2 = await e10.json();
        } catch (e11) {
          throw new eH(tm(e11), e11);
        }
        let n2 = function(e11) {
          let t11 = e11.headers.get(eM);
          if (!t11 || !t11.match(tp)) return null;
          try {
            return /* @__PURE__ */ new Date(`${t11}T00:00:00.0Z`);
          } catch (e12) {
            return null;
          }
        }(e10);
        if (n2 && n2.getTime() >= eU["2024-01-01"].timestamp && "object" == typeof r2 && r2 && "string" == typeof r2.code ? i2 = r2.code : "object" == typeof r2 && r2 && "string" == typeof r2.error_code && (i2 = r2.error_code), i2) {
          if ("weak_password" === i2) throw new eZ(tm(r2), e10.status, (null === (t10 = r2.weak_password) || void 0 === t10 ? void 0 : t10.reasons) || []);
          if ("session_not_found" === i2) throw new ez();
        } else if ("object" == typeof r2 && r2 && "object" == typeof r2.weak_password && r2.weak_password && Array.isArray(r2.weak_password.reasons) && r2.weak_password.reasons.length && r2.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true)) throw new eZ(tm(r2), e10.status, r2.weak_password.reasons);
        throw new eV(tm(r2), e10.status || 500, i2);
      }
      let tS = (e10, t10, r2, i2) => {
        let n2 = { method: e10, headers: (null == t10 ? void 0 : t10.headers) || {} };
        return "GET" === e10 ? n2 : (n2.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, null == t10 ? void 0 : t10.headers), n2.body = JSON.stringify(i2), Object.assign(Object.assign({}, n2), r2));
      };
      async function tk(e10, t10, r2, i2) {
        var n2;
        let s2 = Object.assign({}, null == i2 ? void 0 : i2.headers);
        s2[eM] || (s2[eM] = eU["2024-01-01"].name), (null == i2 ? void 0 : i2.jwt) && (s2.Authorization = `Bearer ${i2.jwt}`);
        let a2 = null !== (n2 = null == i2 ? void 0 : i2.query) && void 0 !== n2 ? n2 : {};
        (null == i2 ? void 0 : i2.redirectTo) && (a2.redirect_to = i2.redirectTo);
        let o2 = Object.keys(a2).length ? "?" + new URLSearchParams(a2).toString() : "", l2 = await tO(e10, t10, r2 + o2, { headers: s2, noResolveJson: null == i2 ? void 0 : i2.noResolveJson }, {}, null == i2 ? void 0 : i2.body);
        return (null == i2 ? void 0 : i2.xform) ? null == i2 ? void 0 : i2.xform(l2) : { data: Object.assign({}, l2), error: null };
      }
      async function tO(e10, t10, r2, i2, n2, s2) {
        let a2;
        let o2 = tS(t10, i2, n2, s2);
        try {
          a2 = await e10(r2, Object.assign({}, o2));
        } catch (e11) {
          throw console.error(e11), new eX(tm(e11), 0);
        }
        if (a2.ok || await t_(a2), null == i2 ? void 0 : i2.noResolveJson) return a2;
        try {
          return await a2.json();
        } catch (e11) {
          await t_(e11);
        }
      }
      function tE(e10) {
        var t10, r2;
        let i2 = null;
        return e10.access_token && e10.refresh_token && e10.expires_in && (i2 = Object.assign({}, e10), !e10.expires_at) && (i2.expires_at = (r2 = e10.expires_in, Math.round(Date.now() / 1e3) + r2)), { data: { session: i2, user: null !== (t10 = e10.user) && void 0 !== t10 ? t10 : e10 }, error: null };
      }
      function tT(e10) {
        let t10 = tE(e10);
        return !t10.error && e10.weak_password && "object" == typeof e10.weak_password && Array.isArray(e10.weak_password.reasons) && e10.weak_password.reasons.length && e10.weak_password.message && "string" == typeof e10.weak_password.message && e10.weak_password.reasons.reduce((e11, t11) => e11 && "string" == typeof t11, true) && (t10.data.weak_password = e10.weak_password), t10;
      }
      function tx(e10) {
        var t10;
        return { data: { user: null !== (t10 = e10.user) && void 0 !== t10 ? t10 : e10 }, error: null };
      }
      function tC(e10) {
        return { data: e10, error: null };
      }
      function tP(e10) {
        let { action_link: t10, email_otp: r2, hashed_token: i2, redirect_to: n2, verification_type: s2 } = e10;
        return { data: { properties: { action_link: t10, email_otp: r2, hashed_token: i2, redirect_to: n2, verification_type: s2 }, user: Object.assign({}, tw(e10, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])) }, error: null };
      }
      function tI(e10) {
        return e10;
      }
      let tR = ["global", "local", "others"];
      var tA = function(e10, t10) {
        var r2 = {};
        for (var i2 in e10) Object.prototype.hasOwnProperty.call(e10, i2) && 0 > t10.indexOf(i2) && (r2[i2] = e10[i2]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var n2 = 0, i2 = Object.getOwnPropertySymbols(e10); n2 < i2.length; n2++) 0 > t10.indexOf(i2[n2]) && Object.prototype.propertyIsEnumerable.call(e10, i2[n2]) && (r2[i2[n2]] = e10[i2[n2]]);
        return r2;
      };
      class tj {
        constructor({ url: e10 = "", headers: t10 = {}, fetch: r2 }) {
          this.url = e10, this.headers = t10, this.fetch = tt(r2), this.mfa = { listFactors: this._listFactors.bind(this), deleteFactor: this._deleteFactor.bind(this) }, this.oauth = { listClients: this._listOAuthClients.bind(this), createClient: this._createOAuthClient.bind(this), getClient: this._getOAuthClient.bind(this), deleteClient: this._deleteOAuthClient.bind(this), regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this) };
        }
        async signOut(e10, t10 = tR[0]) {
          if (0 > tR.indexOf(t10)) throw Error(`@supabase/auth-js: Parameter scope must be one of ${tR.join(", ")}`);
          try {
            return await tk(this.fetch, "POST", `${this.url}/logout?scope=${t10}`, { headers: this.headers, jwt: e10, noResolveJson: true }), { data: null, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async inviteUserByEmail(e10, t10 = {}) {
          try {
            return await tk(this.fetch, "POST", `${this.url}/invite`, { body: { email: e10, data: t10.data }, headers: this.headers, redirectTo: t10.redirectTo, xform: tx });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async generateLink(e10) {
          try {
            let { options: t10 } = e10, r2 = tA(e10, ["options"]), i2 = Object.assign(Object.assign({}, r2), t10);
            return "newEmail" in r2 && (i2.new_email = null == r2 ? void 0 : r2.newEmail, delete i2.newEmail), await tk(this.fetch, "POST", `${this.url}/admin/generate_link`, { body: i2, headers: this.headers, xform: tP, redirectTo: null == t10 ? void 0 : t10.redirectTo });
          } catch (e11) {
            if (eq(e11)) return { data: { properties: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async createUser(e10) {
          try {
            return await tk(this.fetch, "POST", `${this.url}/admin/users`, { body: e10, headers: this.headers, xform: tx });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async listUsers(e10) {
          var t10, r2, i2, n2, s2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await tk(this.fetch, "GET", `${this.url}/admin/users`, { headers: this.headers, noResolveJson: true, query: { page: null !== (r2 = null === (t10 = null == e10 ? void 0 : e10.page) || void 0 === t10 ? void 0 : t10.toString()) && void 0 !== r2 ? r2 : "", per_page: null !== (n2 = null === (i2 = null == e10 ? void 0 : e10.perPage) || void 0 === i2 ? void 0 : i2.toString()) && void 0 !== n2 ? n2 : "" }, xform: tI });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null !== (s2 = u2.headers.get("x-total-count")) && void 0 !== s2 ? s2 : 0, d2 = null !== (o2 = null === (a2 = u2.headers.get("link")) || void 0 === a2 ? void 0 : a2.split(",")) && void 0 !== o2 ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r3 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r3}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { users: [] }, error: e11 };
            throw e11;
          }
        }
        async getUserById(e10) {
          tg(e10);
          try {
            return await tk(this.fetch, "GET", `${this.url}/admin/users/${e10}`, { headers: this.headers, xform: tx });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUserById(e10, t10) {
          tg(e10);
          try {
            return await tk(this.fetch, "PUT", `${this.url}/admin/users/${e10}`, { body: t10, headers: this.headers, xform: tx });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async deleteUser(e10, t10 = false) {
          tg(e10);
          try {
            return await tk(this.fetch, "DELETE", `${this.url}/admin/users/${e10}`, { headers: this.headers, body: { should_soft_delete: t10 }, xform: tx });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async _listFactors(e10) {
          tg(e10.userId);
          try {
            let { data: t10, error: r2 } = await tk(this.fetch, "GET", `${this.url}/admin/users/${e10.userId}/factors`, { headers: this.headers, xform: (e11) => ({ data: { factors: e11 }, error: null }) });
            return { data: t10, error: r2 };
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteFactor(e10) {
          tg(e10.userId), tg(e10.id);
          try {
            return { data: await tk(this.fetch, "DELETE", `${this.url}/admin/users/${e10.userId}/factors/${e10.id}`, { headers: this.headers }), error: null };
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _listOAuthClients(e10) {
          var t10, r2, i2, n2, s2, a2, o2;
          try {
            let l2 = { nextPage: null, lastPage: 0, total: 0 }, u2 = await tk(this.fetch, "GET", `${this.url}/admin/oauth/clients`, { headers: this.headers, noResolveJson: true, query: { page: null !== (r2 = null === (t10 = null == e10 ? void 0 : e10.page) || void 0 === t10 ? void 0 : t10.toString()) && void 0 !== r2 ? r2 : "", per_page: null !== (n2 = null === (i2 = null == e10 ? void 0 : e10.perPage) || void 0 === i2 ? void 0 : i2.toString()) && void 0 !== n2 ? n2 : "" }, xform: tI });
            if (u2.error) throw u2.error;
            let c2 = await u2.json(), h2 = null !== (s2 = u2.headers.get("x-total-count")) && void 0 !== s2 ? s2 : 0, d2 = null !== (o2 = null === (a2 = u2.headers.get("link")) || void 0 === a2 ? void 0 : a2.split(",")) && void 0 !== o2 ? o2 : [];
            return d2.length > 0 && (d2.forEach((e11) => {
              let t11 = parseInt(e11.split(";")[0].split("=")[1].substring(0, 1)), r3 = JSON.parse(e11.split(";")[1].split("=")[1]);
              l2[`${r3}Page`] = t11;
            }), l2.total = parseInt(h2)), { data: Object.assign(Object.assign({}, c2), l2), error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { clients: [] }, error: e11 };
            throw e11;
          }
        }
        async _createOAuthClient(e10) {
          try {
            return await tk(this.fetch, "POST", `${this.url}/admin/oauth/clients`, { body: e10, headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _getOAuthClient(e10) {
          try {
            return await tk(this.fetch, "GET", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _deleteOAuthClient(e10) {
          try {
            return await tk(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${e10}`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _regenerateOAuthClientSecret(e10) {
          try {
            return await tk(this.fetch, "POST", `${this.url}/admin/oauth/clients/${e10}/regenerate_secret`, { headers: this.headers, xform: (e11) => ({ data: e11, error: null }) });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      function tN(e10 = {}) {
        return { getItem: (t10) => e10[t10] || null, setItem: (t10, r2) => {
          e10[t10] = r2;
        }, removeItem: (t10) => {
          delete e10[t10];
        } };
      }
      let tL = { debug: !!(globalThis && te() && globalThis.localStorage && "true" === globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")) };
      class t$ extends Error {
        constructor(e10) {
          super(e10), this.isAcquireTimeout = true;
        }
      }
      class tM extends t$ {
      }
      async function tU(e10, t10, r2) {
        tL.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", e10, t10);
        let i2 = new globalThis.AbortController();
        return t10 > 0 && setTimeout(() => {
          i2.abort(), tL.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", e10);
        }, t10), await Promise.resolve().then(() => globalThis.navigator.locks.request(e10, 0 === t10 ? { mode: "exclusive", ifAvailable: true } : { mode: "exclusive", signal: i2.signal }, async (i3) => {
          if (i3) {
            tL.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", e10, i3.name);
            try {
              return await r2();
            } finally {
              tL.debug && console.log("@supabase/gotrue-js: navigatorLock: released", e10, i3.name);
            }
          } else {
            if (0 === t10) throw tL.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", e10), new tM(`Acquiring an exclusive Navigator LockManager lock "${e10}" immediately failed`);
            if (tL.debug) try {
              let e11 = await globalThis.navigator.locks.query();
              console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(e11, null, "  "));
            } catch (e11) {
              console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e11);
            }
            return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), await r2();
          }
        }));
      }
      function tD(e10) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(e10)) throw Error(`@supabase/auth-js: Address "${e10}" is invalid.`);
        return e10.toLowerCase();
      }
      class tB extends Error {
        constructor({ message: e10, code: t10, cause: r2, name: i2 }) {
          var n2;
          super(e10, { cause: r2 }), this.__isWebAuthnError = true, this.name = null !== (n2 = null != i2 ? i2 : r2 instanceof Error ? r2.name : void 0) && void 0 !== n2 ? n2 : "Unknown Error", this.code = t10;
        }
      }
      class tq extends tB {
        constructor(e10, t10) {
          super({ code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: t10, message: e10 }), this.name = "WebAuthnUnknownError", this.originalError = t10;
        }
      }
      var tV = function(e10, t10) {
        var r2 = {};
        for (var i2 in e10) Object.prototype.hasOwnProperty.call(e10, i2) && 0 > t10.indexOf(i2) && (r2[i2] = e10[i2]);
        if (null != e10 && "function" == typeof Object.getOwnPropertySymbols) for (var n2 = 0, i2 = Object.getOwnPropertySymbols(e10); n2 < i2.length; n2++) 0 > t10.indexOf(i2[n2]) && Object.prototype.propertyIsEnumerable.call(e10, i2[n2]) && (r2[i2[n2]] = e10[i2[n2]]);
        return r2;
      };
      class tH {
        createNewAbortSignal() {
          if (this.controller) {
            let e11 = Error("Cancelling existing WebAuthn API call for new one");
            e11.name = "AbortError", this.controller.abort(e11);
          }
          let e10 = new AbortController();
          return this.controller = e10, e10.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let e10 = Error("Manually cancelling existing WebAuthn API call");
            e10.name = "AbortError", this.controller.abort(e10), this.controller = void 0;
          }
        }
      }
      let tF = new tH();
      function tz(e10) {
        return "localhost" === e10 || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e10);
      }
      function tK() {
        var e10, t10;
        return !!(e9() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && "function" == typeof (null === (e10 = null == navigator ? void 0 : navigator.credentials) || void 0 === e10 ? void 0 : e10.create) && "function" == typeof (null === (t10 = null == navigator ? void 0 : navigator.credentials) || void 0 === t10 ? void 0 : t10.get));
      }
      async function tW(e10) {
        try {
          let t10 = await navigator.credentials.create(e10);
          if (!t10) return { data: null, error: new tq("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new tq("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            var r2, i2, n2;
            let { publicKey: s2 } = t11;
            if (!s2) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new tB({ message: "Registration ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("ConstraintError" === e11.name) {
              if ((null === (r2 = s2.authenticatorSelection) || void 0 === r2 ? void 0 : r2.requireResidentKey) === true) return new tB({ message: "Discoverable credentials were required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT", cause: e11 });
              if ("conditional" === t11.mediation && (null === (i2 = s2.authenticatorSelection) || void 0 === i2 ? void 0 : i2.userVerification) === "required") return new tB({ message: "User verification was required during automatic registration but it could not be performed", code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE", cause: e11 });
              if ((null === (n2 = s2.authenticatorSelection) || void 0 === n2 ? void 0 : n2.userVerification) === "required") return new tB({ message: "User verification was required but no available authenticator supported it", code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT", cause: e11 });
            } else if ("InvalidStateError" === e11.name) return new tB({ message: "The authenticator was previously registered", code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED", cause: e11 });
            else if ("NotAllowedError" === e11.name) return new tB({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("NotSupportedError" === e11.name) return new tB(0 === s2.pubKeyCredParams.filter((e12) => "public-key" === e12.type).length ? { message: 'No entry in pubKeyCredParams was of type "public-key"', code: "ERROR_MALFORMED_PUBKEYCREDPARAMS", cause: e11 } : { message: "No available authenticator supported any of the specified pubKeyCredParams algorithms", code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!tz(t12)) return new tB({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (s2.rp.id !== t12) return new tB({ message: `The RP ID "${s2.rp.id}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("TypeError" === e11.name) {
              if (s2.user.id.byteLength < 1 || s2.user.id.byteLength > 64) return new tB({ message: "User ID was not between 1 and 64 characters", code: "ERROR_INVALID_USER_ID_LENGTH", cause: e11 });
            } else if ("UnknownError" === e11.name) return new tB({ message: "The authenticator was unable to process the specified options, or could not create a new credential", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new tB({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      async function tJ(e10) {
        try {
          let t10 = await navigator.credentials.get(e10);
          if (!t10) return { data: null, error: new tq("Empty credential response", t10) };
          if (!(t10 instanceof PublicKeyCredential)) return { data: null, error: new tq("Browser returned unexpected credential type", t10) };
          return { data: t10, error: null };
        } catch (t10) {
          return { data: null, error: function({ error: e11, options: t11 }) {
            let { publicKey: r2 } = t11;
            if (!r2) throw Error("options was missing required publicKey property");
            if ("AbortError" === e11.name) {
              if (t11.signal instanceof AbortSignal) return new tB({ message: "Authentication ceremony was sent an abort signal", code: "ERROR_CEREMONY_ABORTED", cause: e11 });
            } else if ("NotAllowedError" === e11.name) return new tB({ message: e11.message, code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
            else if ("SecurityError" === e11.name) {
              let t12 = window.location.hostname;
              if (!tz(t12)) return new tB({ message: `${window.location.hostname} is an invalid domain`, code: "ERROR_INVALID_DOMAIN", cause: e11 });
              if (r2.rpId !== t12) return new tB({ message: `The RP ID "${r2.rpId}" is invalid for this domain`, code: "ERROR_INVALID_RP_ID", cause: e11 });
            } else if ("UnknownError" === e11.name) return new tB({ message: "The authenticator was unable to process the specified options, or could not create a new assertion signature", code: "ERROR_AUTHENTICATOR_GENERAL_ERROR", cause: e11 });
            return new tB({ message: "a Non-Webauthn related error has occurred", code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY", cause: e11 });
          }({ error: t10, options: e10 }) };
        }
      }
      let tG = { hints: ["security-key"], authenticatorSelection: { authenticatorAttachment: "cross-platform", requireResidentKey: false, userVerification: "preferred", residentKey: "discouraged" }, attestation: "none" }, tX = { userVerification: "preferred", hints: ["security-key"] };
      function tY(...e10) {
        let t10 = (e11) => null !== e11 && "object" == typeof e11 && !Array.isArray(e11), r2 = (e11) => e11 instanceof ArrayBuffer || ArrayBuffer.isView(e11), i2 = {};
        for (let n2 of e10) if (n2) for (let e11 in n2) {
          let s2 = n2[e11];
          if (void 0 !== s2) {
            if (Array.isArray(s2)) i2[e11] = s2;
            else if (r2(s2)) i2[e11] = s2;
            else if (t10(s2)) {
              let r3 = i2[e11];
              t10(r3) ? i2[e11] = tY(r3, s2) : i2[e11] = tY(s2);
            } else i2[e11] = s2;
          }
        }
        return i2;
      }
      class tZ {
        constructor(e10) {
          this.client = e10, this.enroll = this._enroll.bind(this), this.challenge = this._challenge.bind(this), this.verify = this._verify.bind(this), this.authenticate = this._authenticate.bind(this), this.register = this._register.bind(this);
        }
        async _enroll(e10) {
          return this.client.mfa.enroll(Object.assign(Object.assign({}, e10), { factorType: "webauthn" }));
        }
        async _challenge({ factorId: e10, webauthn: t10, friendlyName: r2, signal: i2 }, n2) {
          try {
            var s2, a2, o2, l2;
            let { data: u2, error: c2 } = await this.client.mfa.challenge({ factorId: e10, webauthn: t10 });
            if (!u2) return { data: null, error: c2 };
            let h2 = null != i2 ? i2 : tF.createNewAbortSignal();
            if ("create" === u2.webauthn.type) {
              let { user: e11 } = u2.webauthn.credential_options.publicKey;
              e11.name || (e11.name = `${e11.id}:${r2}`), e11.displayName || (e11.displayName = e11.name);
            }
            switch (u2.webauthn.type) {
              case "create": {
                let t11 = (s2 = u2.webauthn.credential_options.publicKey, a2 = null == n2 ? void 0 : n2.create, tY(tG, s2, a2 || {})), { data: r3, error: i3 } = await tW({ publicKey: t11, signal: h2 });
                if (r3) return { data: { factorId: e10, challengeId: u2.id, webauthn: { type: u2.webauthn.type, credential_response: r3 } }, error: null };
                return { data: null, error: i3 };
              }
              case "request": {
                let t11 = (o2 = u2.webauthn.credential_options.publicKey, l2 = null == n2 ? void 0 : n2.request, tY(tX, o2, l2 || {})), { data: r3, error: i3 } = await tJ(Object.assign(Object.assign({}, u2.webauthn.credential_options), { publicKey: t11, signal: h2 }));
                if (r3) return { data: { factorId: e10, challengeId: u2.id, webauthn: { type: u2.webauthn.type, credential_response: r3 } }, error: null };
                return { data: null, error: i3 };
              }
            }
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            return { data: null, error: new eH("Unexpected error in challenge", e11) };
          }
        }
        async _verify({ challengeId: e10, factorId: t10, webauthn: r2 }) {
          return this.client.mfa.verify({ factorId: t10, challengeId: e10, webauthn: r2 });
        }
        async _authenticate({ factorId: e10, webauthn: { rpId: t10 = "undefined" != typeof window ? window.location.hostname : void 0, rpOrigins: r2 = "undefined" != typeof window ? [window.location.origin] : void 0, signal: i2 } }, n2) {
          if (!t10) return { data: null, error: new eB("rpId is required for WebAuthn authentication") };
          try {
            if (!tK()) return { data: null, error: new eH("Browser does not support WebAuthn", null) };
            let { data: s2, error: a2 } = await this.challenge({ factorId: e10, webauthn: { rpId: t10, rpOrigins: r2 }, signal: i2 }, { request: n2 });
            if (!s2) return { data: null, error: a2 };
            let { webauthn: o2 } = s2;
            return this._verify({ factorId: e10, challengeId: s2.challengeId, webauthn: { type: o2.type, rpId: t10, rpOrigins: r2, credential_response: o2.credential_response } });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            return { data: null, error: new eH("Unexpected error in authenticate", e11) };
          }
        }
        async _register({ friendlyName: e10, rpId: t10 = "undefined" != typeof window ? window.location.hostname : void 0, rpOrigins: r2 = "undefined" != typeof window ? [window.location.origin] : void 0, signal: i2 }, n2) {
          if (!t10) return { data: null, error: new eB("rpId is required for WebAuthn registration") };
          try {
            if (!tK()) return { data: null, error: new eH("Browser does not support WebAuthn", null) };
            let { data: s2, error: a2 } = await this._enroll({ friendlyName: e10 });
            if (!s2) return await this.client.mfa.listFactors().then((t11) => {
              var r3;
              return null === (r3 = t11.data) || void 0 === r3 ? void 0 : r3.all.find((t12) => "webauthn" === t12.factor_type && t12.friendly_name === e10 && "unverified" !== t12.status);
            }).then((e11) => e11 ? this.client.mfa.unenroll({ factorId: null == e11 ? void 0 : e11.id }) : void 0), { data: null, error: a2 };
            let { data: o2, error: l2 } = await this._challenge({ factorId: s2.id, friendlyName: s2.friendly_name, webauthn: { rpId: t10, rpOrigins: r2 }, signal: i2 }, { create: n2 });
            if (!o2) return { data: null, error: l2 };
            return this._verify({ factorId: s2.id, challengeId: o2.challengeId, webauthn: { rpId: t10, rpOrigins: r2, type: o2.webauthn.type, credential_response: o2.webauthn.credential_response } });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            return { data: null, error: new eH("Unexpected error in register", e11) };
          }
        }
      }
      !function() {
        if ("object" != typeof globalThis) try {
          Object.defineProperty(Object.prototype, "__magic__", { get: function() {
            return this;
          }, configurable: true }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
        } catch (e10) {
          "undefined" != typeof self && (self.globalThis = self);
        }
      }();
      let tQ = { url: "http://localhost:9999", storageKey: "supabase.auth.token", autoRefreshToken: true, persistSession: true, detectSessionInUrl: true, headers: e$, flowType: "implicit", debug: false, hasCustomAuthorizationHeader: false };
      async function t0(e10, t10, r2) {
        return await r2();
      }
      let t1 = {};
      class t2 {
        get jwks() {
          var e10, t10;
          return null !== (t10 = null === (e10 = t1[this.storageKey]) || void 0 === e10 ? void 0 : e10.jwks) && void 0 !== t10 ? t10 : { keys: [] };
        }
        set jwks(e10) {
          t1[this.storageKey] = Object.assign(Object.assign({}, t1[this.storageKey]), { jwks: e10 });
        }
        get jwks_cached_at() {
          var e10, t10;
          return null !== (t10 = null === (e10 = t1[this.storageKey]) || void 0 === e10 ? void 0 : e10.cachedAt) && void 0 !== t10 ? t10 : Number.MIN_SAFE_INTEGER;
        }
        set jwks_cached_at(e10) {
          t1[this.storageKey] = Object.assign(Object.assign({}, t1[this.storageKey]), { cachedAt: e10 });
        }
        constructor(e10) {
          var t10, r2;
          this.userStorage = null, this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = true, this.hasCustomAuthorizationHeader = false, this.suppressGetSessionWarning = false, this.lockAcquired = false, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log, this.instanceID = t2.nextInstanceID, t2.nextInstanceID += 1, this.instanceID > 0 && e9() && console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
          let i2 = Object.assign(Object.assign({}, tQ), e10);
          if (this.logDebugMessages = !!i2.debug, "function" == typeof i2.debug && (this.logger = i2.debug), this.persistSession = i2.persistSession, this.storageKey = i2.storageKey, this.autoRefreshToken = i2.autoRefreshToken, this.admin = new tj({ url: i2.url, headers: i2.headers, fetch: i2.fetch }), this.url = i2.url, this.headers = i2.headers, this.fetch = tt(i2.fetch), this.lock = i2.lock || t0, this.detectSessionInUrl = i2.detectSessionInUrl, this.flowType = i2.flowType, this.hasCustomAuthorizationHeader = i2.hasCustomAuthorizationHeader, i2.lock ? this.lock = i2.lock : e9() && (null === (t10 = null == globalThis ? void 0 : globalThis.navigator) || void 0 === t10 ? void 0 : t10.locks) ? this.lock = tU : this.lock = t0, this.jwks || (this.jwks = { keys: [] }, this.jwks_cached_at = Number.MIN_SAFE_INTEGER), this.mfa = { verify: this._verify.bind(this), enroll: this._enroll.bind(this), unenroll: this._unenroll.bind(this), challenge: this._challenge.bind(this), listFactors: this._listFactors.bind(this), challengeAndVerify: this._challengeAndVerify.bind(this), getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this), webauthn: new tZ(this) }, this.persistSession ? (i2.storage ? this.storage = i2.storage : te() ? this.storage = globalThis.localStorage : (this.memoryStorage = {}, this.storage = tN(this.memoryStorage)), i2.userStorage && (this.userStorage = i2.userStorage)) : (this.memoryStorage = {}, this.storage = tN(this.memoryStorage)), e9() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
              this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
            } catch (e11) {
              console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e11);
            }
            null === (r2 = this.broadcastChannel) || void 0 === r2 || r2.addEventListener("message", async (e11) => {
              this._debug("received broadcast notification from other tab or client", e11), await this._notifyAllSubscribers(e11.data.event, e11.data.session, false);
            });
          }
          this.initialize();
        }
        _debug(...e10) {
          return this.logDebugMessages && this.logger(`GoTrueClient@${this.instanceID} (${eL}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...e10), this;
        }
        async initialize() {
          return this.initializePromise || (this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))()), await this.initializePromise;
        }
        async _initialize() {
          var e10;
          try {
            let t10 = function(e11) {
              let t11 = {}, r3 = new URL(e11);
              if (r3.hash && "#" === r3.hash[0]) try {
                new URLSearchParams(r3.hash.substring(1)).forEach((e12, r4) => {
                  t11[r4] = e12;
                });
              } catch (e12) {
              }
              return r3.searchParams.forEach((e12, r4) => {
                t11[r4] = e12;
              }), t11;
            }(window.location.href), r2 = "none";
            if (this._isImplicitGrantCallback(t10) ? r2 = "implicit" : await this._isPKCECallback(t10) && (r2 = "pkce"), e9() && this.detectSessionInUrl && "none" !== r2) {
              let { data: i2, error: n2 } = await this._getSessionFromURL(t10, r2);
              if (n2) {
                if (this._debug("#_initialize()", "error detecting session from URL", n2), eq(n2) && "AuthImplicitGrantRedirectError" === n2.name) {
                  let t11 = null === (e10 = n2.details) || void 0 === e10 ? void 0 : e10.code;
                  if ("identity_already_exists" === t11 || "identity_not_found" === t11 || "single_identity_not_deletable" === t11) return { error: n2 };
                }
                return await this._removeSession(), { error: n2 };
              }
              let { session: s2, redirectType: a2 } = i2;
              return this._debug("#_initialize()", "detected session in URL", s2, "redirect type", a2), await this._saveSession(s2), setTimeout(async () => {
                "recovery" === a2 ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", s2) : await this._notifyAllSubscribers("SIGNED_IN", s2);
              }, 0), { error: null };
            }
            return await this._recoverAndRefresh(), { error: null };
          } catch (e11) {
            if (eq(e11)) return { error: e11 };
            return { error: new eH("Unexpected error during initialization", e11) };
          } finally {
            await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
          }
        }
        async signInAnonymously(e10) {
          var t10, r2, i2;
          try {
            let { data: n2, error: s2 } = await tk(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { data: null !== (r2 = null === (t10 = null == e10 ? void 0 : e10.options) || void 0 === t10 ? void 0 : t10.data) && void 0 !== r2 ? r2 : {}, gotrue_meta_security: { captcha_token: null === (i2 = null == e10 ? void 0 : e10.options) || void 0 === i2 ? void 0 : i2.captchaToken } }, xform: tE });
            if (s2 || !n2) return { data: { user: null, session: null }, error: s2 };
            let a2 = n2.session, o2 = n2.user;
            return n2.session && (await this._saveSession(n2.session), await this._notifyAllSubscribers("SIGNED_IN", a2)), { data: { user: o2, session: a2 }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signUp(e10) {
          var t10, r2, i2;
          try {
            let n2;
            if ("email" in e10) {
              let { email: r3, password: i3, options: s3 } = e10, a3 = null, o3 = null;
              "pkce" === this.flowType && ([a3, o3] = await td(this.storage, this.storageKey)), n2 = await tk(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, redirectTo: null == s3 ? void 0 : s3.emailRedirectTo, body: { email: r3, password: i3, data: null !== (t10 = null == s3 ? void 0 : s3.data) && void 0 !== t10 ? t10 : {}, gotrue_meta_security: { captcha_token: null == s3 ? void 0 : s3.captchaToken }, code_challenge: a3, code_challenge_method: o3 }, xform: tE });
            } else if ("phone" in e10) {
              let { phone: t11, password: s3, options: a3 } = e10;
              n2 = await tk(this.fetch, "POST", `${this.url}/signup`, { headers: this.headers, body: { phone: t11, password: s3, data: null !== (r2 = null == a3 ? void 0 : a3.data) && void 0 !== r2 ? r2 : {}, channel: null !== (i2 = null == a3 ? void 0 : a3.channel) && void 0 !== i2 ? i2 : "sms", gotrue_meta_security: { captcha_token: null == a3 ? void 0 : a3.captchaToken } }, xform: tE });
            } else throw new eW("You must provide either an email or phone number and a password");
            let { data: s2, error: a2 } = n2;
            if (a2 || !s2) return { data: { user: null, session: null }, error: a2 };
            let o2 = s2.session, l2 = s2.user;
            return s2.session && (await this._saveSession(s2.session), await this._notifyAllSubscribers("SIGNED_IN", o2)), { data: { user: l2, session: o2 }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithPassword(e10) {
          try {
            let t10;
            if ("email" in e10) {
              let { email: r3, password: i3, options: n2 } = e10;
              t10 = await tk(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { email: r3, password: i3, gotrue_meta_security: { captcha_token: null == n2 ? void 0 : n2.captchaToken } }, xform: tT });
            } else if ("phone" in e10) {
              let { phone: r3, password: i3, options: n2 } = e10;
              t10 = await tk(this.fetch, "POST", `${this.url}/token?grant_type=password`, { headers: this.headers, body: { phone: r3, password: i3, gotrue_meta_security: { captcha_token: null == n2 ? void 0 : n2.captchaToken } }, xform: tT });
            } else throw new eW("You must provide either an email or phone number and a password");
            let { data: r2, error: i2 } = t10;
            if (i2) return { data: { user: null, session: null }, error: i2 };
            if (!r2 || !r2.session || !r2.user) return { data: { user: null, session: null }, error: new eK() };
            return r2.session && (await this._saveSession(r2.session), await this._notifyAllSubscribers("SIGNED_IN", r2.session)), { data: Object.assign({ user: r2.user, session: r2.session }, r2.weak_password ? { weakPassword: r2.weak_password } : null), error: i2 };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithOAuth(e10) {
          var t10, r2, i2, n2;
          return await this._handleProviderSignIn(e10.provider, { redirectTo: null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.redirectTo, scopes: null === (r2 = e10.options) || void 0 === r2 ? void 0 : r2.scopes, queryParams: null === (i2 = e10.options) || void 0 === i2 ? void 0 : i2.queryParams, skipBrowserRedirect: null === (n2 = e10.options) || void 0 === n2 ? void 0 : n2.skipBrowserRedirect });
        }
        async exchangeCodeForSession(e10) {
          return await this.initializePromise, this._acquireLock(-1, async () => this._exchangeCodeForSession(e10));
        }
        async signInWithWeb3(e10) {
          let { chain: t10 } = e10;
          switch (t10) {
            case "ethereum":
              return await this.signInWithEthereum(e10);
            case "solana":
              return await this.signInWithSolana(e10);
            default:
              throw Error(`@supabase/auth-js: Unsupported chain "${t10}"`);
          }
        }
        async signInWithEthereum(e10) {
          var t10, r2, i2, n2, s2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let c3;
            let { chain: h3, wallet: g2, statement: b2, options: v2 } = e10;
            if (e9()) {
              if ("object" == typeof g2) c3 = g2;
              else {
                let e11 = window;
                if ("ethereum" in e11 && "object" == typeof e11.ethereum && "request" in e11.ethereum && "function" == typeof e11.ethereum.request) c3 = e11.ethereum;
                else throw Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.");
              }
            } else {
              if ("object" != typeof g2 || !(null == v2 ? void 0 : v2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              c3 = g2;
            }
            let w2 = new URL(null !== (t10 = null == v2 ? void 0 : v2.url) && void 0 !== t10 ? t10 : window.location.href), m2 = await c3.request({ method: "eth_requestAccounts" }).then((e11) => e11).catch(() => {
              throw Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid");
            });
            if (!m2 || 0 === m2.length) throw Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");
            let y2 = tD(m2[0]), _2 = null === (r2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === r2 ? void 0 : r2.chainId;
            _2 || (_2 = parseInt(await c3.request({ method: "eth_chainId" }), 16)), p2 = function(e11) {
              var t11;
              let { chainId: r3, domain: i3, expirationTime: n3, issuedAt: s3 = /* @__PURE__ */ new Date(), nonce: a3, notBefore: o3, requestId: l3, resources: u3, scheme: c4, uri: h4, version: d3 } = e11;
              if (!Number.isInteger(r3)) throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r3}`);
              if (!i3) throw Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');
              if (a3 && a3.length < 8) throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a3}`);
              if (!h4) throw Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');
              if ("1" !== d3) throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d3}`);
              if (null === (t11 = e11.statement) || void 0 === t11 ? void 0 : t11.includes("\n")) throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e11.statement}`);
              let p3 = tD(e11.address), f3 = c4 ? `${c4}://${i3}` : i3, g3 = e11.statement ? `${e11.statement}
` : "", b3 = `${f3} wants you to sign in with your Ethereum account:
${p3}

${g3}`, v3 = `URI: ${h4}
Version: ${d3}
Chain ID: ${r3}${a3 ? `
Nonce: ${a3}` : ""}
Issued At: ${s3.toISOString()}`;
              if (n3 && (v3 += `
Expiration Time: ${n3.toISOString()}`), o3 && (v3 += `
Not Before: ${o3.toISOString()}`), l3 && (v3 += `
Request ID: ${l3}`), u3) {
                let e12 = "\nResources:";
                for (let t12 of u3) {
                  if (!t12 || "string" != typeof t12) throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t12}`);
                  e12 += `
- ${t12}`;
                }
                v3 += e12;
              }
              return `${b3}
${v3}`;
            }({ domain: w2.host, address: y2, statement: b2, uri: w2.href, version: "1", chainId: _2, nonce: null === (i2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === i2 ? void 0 : i2.nonce, issuedAt: null !== (s2 = null === (n2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === n2 ? void 0 : n2.issuedAt) && void 0 !== s2 ? s2 : /* @__PURE__ */ new Date(), expirationTime: null === (a2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === a2 ? void 0 : a2.expirationTime, notBefore: null === (o2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === o2 ? void 0 : o2.notBefore, requestId: null === (l2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === l2 ? void 0 : l2.requestId, resources: null === (u2 = null == v2 ? void 0 : v2.signInWithEthereum) || void 0 === u2 ? void 0 : u2.resources }), f2 = await c3.request({ method: "personal_sign", params: [(d2 = p2, "0x" + Array.from(new TextEncoder().encode(d2), (e11) => e11.toString(16).padStart(2, "0")).join("")), y2] });
          }
          try {
            let { data: t11, error: r3 } = await tk(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "ethereum", message: p2, signature: f2 }, (null === (c2 = e10.options) || void 0 === c2 ? void 0 : c2.captchaToken) ? { gotrue_meta_security: { captcha_token: null === (h2 = e10.options) || void 0 === h2 ? void 0 : h2.captchaToken } } : null), xform: tE });
            if (r3) throw r3;
            if (!t11 || !t11.session || !t11.user) return { data: { user: null, session: null }, error: new eK() };
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), { data: Object.assign({}, t11), error: r3 };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithSolana(e10) {
          var t10, r2, i2, n2, s2, a2, o2, l2, u2, c2, h2, d2;
          let p2, f2;
          if ("message" in e10) p2 = e10.message, f2 = e10.signature;
          else {
            let h3;
            let { chain: d3, wallet: g2, statement: b2, options: v2 } = e10;
            if (e9()) {
              if ("object" == typeof g2) h3 = g2;
              else {
                let e11 = window;
                if ("solana" in e11 && "object" == typeof e11.solana && ("signIn" in e11.solana && "function" == typeof e11.solana.signIn || "signMessage" in e11.solana && "function" == typeof e11.solana.signMessage)) h3 = e11.solana;
                else throw Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.");
              }
            } else {
              if ("object" != typeof g2 || !(null == v2 ? void 0 : v2.url)) throw Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
              h3 = g2;
            }
            let w2 = new URL(null !== (t10 = null == v2 ? void 0 : v2.url) && void 0 !== t10 ? t10 : window.location.href);
            if ("signIn" in h3 && h3.signIn) {
              let e11;
              let t11 = await h3.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, null == v2 ? void 0 : v2.signInWithSolana), { version: "1", domain: w2.host, uri: w2.href }), b2 ? { statement: b2 } : null));
              if (Array.isArray(t11) && t11[0] && "object" == typeof t11[0]) e11 = t11[0];
              else if (t11 && "object" == typeof t11 && "signedMessage" in t11 && "signature" in t11) e11 = t11;
              else throw Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
              if ("signedMessage" in e11 && "signature" in e11 && ("string" == typeof e11.signedMessage || e11.signedMessage instanceof Uint8Array) && e11.signature instanceof Uint8Array) p2 = "string" == typeof e11.signedMessage ? e11.signedMessage : new TextDecoder().decode(e11.signedMessage), f2 = e11.signature;
              else throw Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            } else {
              if (!("signMessage" in h3) || "function" != typeof h3.signMessage || !("publicKey" in h3) || "object" != typeof h3 || !h3.publicKey || !("toBase58" in h3.publicKey) || "function" != typeof h3.publicKey.toBase58) throw Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
              p2 = [`${w2.host} wants you to sign in with your Solana account:`, h3.publicKey.toBase58(), ...b2 ? ["", b2, ""] : [""], "Version: 1", `URI: ${w2.href}`, `Issued At: ${null !== (i2 = null === (r2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === r2 ? void 0 : r2.issuedAt) && void 0 !== i2 ? i2 : (/* @__PURE__ */ new Date()).toISOString()}`, ...(null === (n2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === n2 ? void 0 : n2.notBefore) ? [`Not Before: ${v2.signInWithSolana.notBefore}`] : [], ...(null === (s2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === s2 ? void 0 : s2.expirationTime) ? [`Expiration Time: ${v2.signInWithSolana.expirationTime}`] : [], ...(null === (a2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === a2 ? void 0 : a2.chainId) ? [`Chain ID: ${v2.signInWithSolana.chainId}`] : [], ...(null === (o2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === o2 ? void 0 : o2.nonce) ? [`Nonce: ${v2.signInWithSolana.nonce}`] : [], ...(null === (l2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === l2 ? void 0 : l2.requestId) ? [`Request ID: ${v2.signInWithSolana.requestId}`] : [], ...(null === (c2 = null === (u2 = null == v2 ? void 0 : v2.signInWithSolana) || void 0 === u2 ? void 0 : u2.resources) || void 0 === c2 ? void 0 : c2.length) ? ["Resources", ...v2.signInWithSolana.resources.map((e12) => `- ${e12}`)] : []].join("\n");
              let e11 = await h3.signMessage(new TextEncoder().encode(p2), "utf8");
              if (!e11 || !(e11 instanceof Uint8Array)) throw Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
              f2 = e11;
            }
          }
          try {
            let { data: t11, error: r3 } = await tk(this.fetch, "POST", `${this.url}/token?grant_type=web3`, { headers: this.headers, body: Object.assign({ chain: "solana", message: p2, signature: e5(f2) }, (null === (h2 = e10.options) || void 0 === h2 ? void 0 : h2.captchaToken) ? { gotrue_meta_security: { captcha_token: null === (d2 = e10.options) || void 0 === d2 ? void 0 : d2.captchaToken } } : null), xform: tE });
            if (r3) throw r3;
            if (!t11 || !t11.session || !t11.user) return { data: { user: null, session: null }, error: new eK() };
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), { data: Object.assign({}, t11), error: r3 };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async _exchangeCodeForSession(e10) {
          let t10 = await tn(this.storage, `${this.storageKey}-code-verifier`), [r2, i2] = (null != t10 ? t10 : "").split("/");
          try {
            let { data: t11, error: n2 } = await tk(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, { headers: this.headers, body: { auth_code: e10, code_verifier: r2 }, xform: tE });
            if (await ts(this.storage, `${this.storageKey}-code-verifier`), n2) throw n2;
            if (!t11 || !t11.session || !t11.user) return { data: { user: null, session: null, redirectType: null }, error: new eK() };
            return t11.session && (await this._saveSession(t11.session), await this._notifyAllSubscribers("SIGNED_IN", t11.session)), { data: Object.assign(Object.assign({}, t11), { redirectType: null != i2 ? i2 : null }), error: n2 };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null, redirectType: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithIdToken(e10) {
          try {
            let { options: t10, provider: r2, token: i2, access_token: n2, nonce: s2 } = e10, { data: a2, error: o2 } = await tk(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, body: { provider: r2, id_token: i2, access_token: n2, nonce: s2, gotrue_meta_security: { captcha_token: null == t10 ? void 0 : t10.captchaToken } }, xform: tE });
            if (o2) return { data: { user: null, session: null }, error: o2 };
            if (!a2 || !a2.session || !a2.user) return { data: { user: null, session: null }, error: new eK() };
            return a2.session && (await this._saveSession(a2.session), await this._notifyAllSubscribers("SIGNED_IN", a2.session)), { data: a2, error: o2 };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithOtp(e10) {
          var t10, r2, i2, n2, s2;
          try {
            if ("email" in e10) {
              let { email: i3, options: n3 } = e10, s3 = null, a2 = null;
              "pkce" === this.flowType && ([s3, a2] = await td(this.storage, this.storageKey));
              let { error: o2 } = await tk(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { email: i3, data: null !== (t10 = null == n3 ? void 0 : n3.data) && void 0 !== t10 ? t10 : {}, create_user: null === (r2 = null == n3 ? void 0 : n3.shouldCreateUser) || void 0 === r2 || r2, gotrue_meta_security: { captcha_token: null == n3 ? void 0 : n3.captchaToken }, code_challenge: s3, code_challenge_method: a2 }, redirectTo: null == n3 ? void 0 : n3.emailRedirectTo });
              return { data: { user: null, session: null }, error: o2 };
            }
            if ("phone" in e10) {
              let { phone: t11, options: r3 } = e10, { data: a2, error: o2 } = await tk(this.fetch, "POST", `${this.url}/otp`, { headers: this.headers, body: { phone: t11, data: null !== (i2 = null == r3 ? void 0 : r3.data) && void 0 !== i2 ? i2 : {}, create_user: null === (n2 = null == r3 ? void 0 : r3.shouldCreateUser) || void 0 === n2 || n2, gotrue_meta_security: { captcha_token: null == r3 ? void 0 : r3.captchaToken }, channel: null !== (s2 = null == r3 ? void 0 : r3.channel) && void 0 !== s2 ? s2 : "sms" } });
              return { data: { user: null, session: null, messageId: null == a2 ? void 0 : a2.message_id }, error: o2 };
            }
            throw new eW("You must provide either an email or phone number.");
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async verifyOtp(e10) {
          var t10, r2;
          try {
            let i2, n2;
            "options" in e10 && (i2 = null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.redirectTo, n2 = null === (r2 = e10.options) || void 0 === r2 ? void 0 : r2.captchaToken);
            let { data: s2, error: a2 } = await tk(this.fetch, "POST", `${this.url}/verify`, { headers: this.headers, body: Object.assign(Object.assign({}, e10), { gotrue_meta_security: { captcha_token: n2 } }), redirectTo: i2, xform: tE });
            if (a2) throw a2;
            if (!s2) throw Error("An error occurred on token verification.");
            let o2 = s2.session, l2 = s2.user;
            return (null == o2 ? void 0 : o2.access_token) && (await this._saveSession(o2), await this._notifyAllSubscribers("recovery" == e10.type ? "PASSWORD_RECOVERY" : "SIGNED_IN", o2)), { data: { user: l2, session: o2 }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async signInWithSSO(e10) {
          var t10, r2, i2;
          try {
            let n2 = null, s2 = null;
            return "pkce" === this.flowType && ([n2, s2] = await td(this.storage, this.storageKey)), await tk(this.fetch, "POST", `${this.url}/sso`, { body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e10 ? { provider_id: e10.providerId } : null), "domain" in e10 ? { domain: e10.domain } : null), { redirect_to: null !== (r2 = null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.redirectTo) && void 0 !== r2 ? r2 : void 0 }), (null === (i2 = null == e10 ? void 0 : e10.options) || void 0 === i2 ? void 0 : i2.captchaToken) ? { gotrue_meta_security: { captcha_token: e10.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: n2, code_challenge_method: s2 }), headers: this.headers, xform: tC });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async reauthenticate() {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._reauthenticate());
        }
        async _reauthenticate() {
          try {
            return await this._useSession(async (e10) => {
              let { data: { session: t10 }, error: r2 } = e10;
              if (r2) throw r2;
              if (!t10) throw new ez();
              let { error: i2 } = await tk(this.fetch, "GET", `${this.url}/reauthenticate`, { headers: this.headers, jwt: t10.access_token });
              return { data: { user: null, session: null }, error: i2 };
            });
          } catch (e10) {
            if (eq(e10)) return { data: { user: null, session: null }, error: e10 };
            throw e10;
          }
        }
        async resend(e10) {
          try {
            let t10 = `${this.url}/resend`;
            if ("email" in e10) {
              let { email: r2, type: i2, options: n2 } = e10, { error: s2 } = await tk(this.fetch, "POST", t10, { headers: this.headers, body: { email: r2, type: i2, gotrue_meta_security: { captcha_token: null == n2 ? void 0 : n2.captchaToken } }, redirectTo: null == n2 ? void 0 : n2.emailRedirectTo });
              return { data: { user: null, session: null }, error: s2 };
            }
            if ("phone" in e10) {
              let { phone: r2, type: i2, options: n2 } = e10, { data: s2, error: a2 } = await tk(this.fetch, "POST", t10, { headers: this.headers, body: { phone: r2, type: i2, gotrue_meta_security: { captcha_token: null == n2 ? void 0 : n2.captchaToken } } });
              return { data: { user: null, session: null, messageId: null == s2 ? void 0 : s2.message_id }, error: a2 };
            }
            throw new eW("You must provide either an email or phone number and a type");
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async getSession() {
          return await this.initializePromise, await this._acquireLock(-1, async () => this._useSession(async (e10) => e10));
        }
        async _acquireLock(e10, t10) {
          this._debug("#_acquireLock", "begin", e10);
          try {
            if (this.lockAcquired) {
              let e11 = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), r2 = (async () => (await e11, await t10()))();
              return this.pendingInLock.push((async () => {
                try {
                  await r2;
                } catch (e12) {
                }
              })()), r2;
            }
            return await this.lock(`lock:${this.storageKey}`, e10, async () => {
              this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
              try {
                this.lockAcquired = true;
                let e11 = t10();
                for (this.pendingInLock.push((async () => {
                  try {
                    await e11;
                  } catch (e12) {
                  }
                })()), await e11; this.pendingInLock.length; ) {
                  let e12 = [...this.pendingInLock];
                  await Promise.all(e12), this.pendingInLock.splice(0, e12.length);
                }
                return await e11;
              } finally {
                this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = false;
              }
            });
          } finally {
            this._debug("#_acquireLock", "end");
          }
        }
        async _useSession(e10) {
          this._debug("#_useSession", "begin");
          try {
            let t10 = await this.__loadSession();
            return await e10(t10);
          } finally {
            this._debug("#_useSession", "end");
          }
        }
        async __loadSession() {
          this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", Error().stack);
          try {
            let e10 = null, t10 = await tn(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", t10), null !== t10 && (this._isValidSession(t10) ? e10 = t10 : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !e10) return { data: { session: null }, error: null };
            let r2 = !!e10.expires_at && 1e3 * e10.expires_at - Date.now() < 9e4;
            if (this._debug("#__loadSession()", `session has${r2 ? "" : " not"} expired`, "expires_at", e10.expires_at), !r2) {
              if (this.userStorage) {
                let t11 = await tn(this.userStorage, this.storageKey + "-user");
                (null == t11 ? void 0 : t11.user) ? e10.user = t11.user : e10.user = tb();
              }
              if (this.storage.isServer && e10.user) {
                let t11 = this.suppressGetSessionWarning;
                e10 = new Proxy(e10, { get: (e11, r3, i3) => (t11 || "user" !== r3 || (console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."), t11 = true, this.suppressGetSessionWarning = true), Reflect.get(e11, r3, i3)) });
              }
              return { data: { session: e10 }, error: null };
            }
            let { data: i2, error: n2 } = await this._callRefreshToken(e10.refresh_token);
            if (n2) return { data: { session: null }, error: n2 };
            return { data: { session: i2 }, error: null };
          } finally {
            this._debug("#__loadSession()", "end");
          }
        }
        async getUser(e10) {
          return e10 ? await this._getUser(e10) : (await this.initializePromise, await this._acquireLock(-1, async () => await this._getUser()));
        }
        async _getUser(e10) {
          try {
            if (e10) return await tk(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: e10, xform: tx });
            return await this._useSession(async (e11) => {
              var t10, r2, i2;
              let { data: n2, error: s2 } = e11;
              if (s2) throw s2;
              return (null === (t10 = n2.session) || void 0 === t10 ? void 0 : t10.access_token) || this.hasCustomAuthorizationHeader ? await tk(this.fetch, "GET", `${this.url}/user`, { headers: this.headers, jwt: null !== (i2 = null === (r2 = n2.session) || void 0 === r2 ? void 0 : r2.access_token) && void 0 !== i2 ? i2 : void 0, xform: tx }) : { data: { user: null }, error: new ez() };
            });
          } catch (e11) {
            if (eq(e11)) return eq(e11) && "AuthSessionMissingError" === e11.name && (await this._removeSession(), await ts(this.storage, `${this.storageKey}-code-verifier`)), { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async updateUser(e10, t10 = {}) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._updateUser(e10, t10));
        }
        async _updateUser(e10, t10 = {}) {
          try {
            return await this._useSession(async (r2) => {
              let { data: i2, error: n2 } = r2;
              if (n2) throw n2;
              if (!i2.session) throw new ez();
              let s2 = i2.session, a2 = null, o2 = null;
              "pkce" === this.flowType && null != e10.email && ([a2, o2] = await td(this.storage, this.storageKey));
              let { data: l2, error: u2 } = await tk(this.fetch, "PUT", `${this.url}/user`, { headers: this.headers, redirectTo: null == t10 ? void 0 : t10.emailRedirectTo, body: Object.assign(Object.assign({}, e10), { code_challenge: a2, code_challenge_method: o2 }), jwt: s2.access_token, xform: tx });
              if (u2) throw u2;
              return s2.user = l2.user, await this._saveSession(s2), await this._notifyAllSubscribers("USER_UPDATED", s2), { data: { user: s2.user }, error: null };
            });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null }, error: e11 };
            throw e11;
          }
        }
        async setSession(e10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._setSession(e10));
        }
        async _setSession(e10) {
          try {
            if (!e10.access_token || !e10.refresh_token) throw new ez();
            let t10 = Date.now() / 1e3, r2 = t10, i2 = true, n2 = null, { payload: s2 } = to(e10.access_token);
            if (s2.exp && (i2 = (r2 = s2.exp) <= t10), i2) {
              let { data: t11, error: r3 } = await this._callRefreshToken(e10.refresh_token);
              if (r3) return { data: { user: null, session: null }, error: r3 };
              if (!t11) return { data: { user: null, session: null }, error: null };
              n2 = t11;
            } else {
              let { data: i3, error: s3 } = await this._getUser(e10.access_token);
              if (s3) throw s3;
              n2 = { access_token: e10.access_token, refresh_token: e10.refresh_token, user: i3.user, token_type: "bearer", expires_in: r2 - t10, expires_at: r2 }, await this._saveSession(n2), await this._notifyAllSubscribers("SIGNED_IN", n2);
            }
            return { data: { user: n2.user, session: n2 }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { session: null, user: null }, error: e11 };
            throw e11;
          }
        }
        async refreshSession(e10) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._refreshSession(e10));
        }
        async _refreshSession(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r2;
              if (!e10) {
                let { data: i3, error: n3 } = t10;
                if (n3) throw n3;
                e10 = null !== (r2 = i3.session) && void 0 !== r2 ? r2 : void 0;
              }
              if (!(null == e10 ? void 0 : e10.refresh_token)) throw new ez();
              let { data: i2, error: n2 } = await this._callRefreshToken(e10.refresh_token);
              return n2 ? { data: { user: null, session: null }, error: n2 } : i2 ? { data: { user: i2.user, session: i2 }, error: null } : { data: { user: null, session: null }, error: null };
            });
          } catch (e11) {
            if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
            throw e11;
          }
        }
        async _getSessionFromURL(e10, t10) {
          try {
            if (!e9()) throw new eJ("No browser detected.");
            if (e10.error || e10.error_description || e10.error_code) throw new eJ(e10.error_description || "Error in URL with unspecified error_description", { error: e10.error || "unspecified_error", code: e10.error_code || "unspecified_code" });
            switch (t10) {
              case "implicit":
                if ("pkce" === this.flowType) throw new eG("Not a valid PKCE flow url.");
                break;
              case "pkce":
                if ("implicit" === this.flowType) throw new eJ("Not a valid implicit grant flow url.");
            }
            if ("pkce" === t10) {
              if (this._debug("#_initialize()", "begin", "is PKCE flow", true), !e10.code) throw new eG("No code detected.");
              let { data: t11, error: r3 } = await this._exchangeCodeForSession(e10.code);
              if (r3) throw r3;
              let i3 = new URL(window.location.href);
              return i3.searchParams.delete("code"), window.history.replaceState(window.history.state, "", i3.toString()), { data: { session: t11.session, redirectType: null }, error: null };
            }
            let { provider_token: r2, provider_refresh_token: i2, access_token: n2, refresh_token: s2, expires_in: a2, expires_at: o2, token_type: l2 } = e10;
            if (!n2 || !a2 || !s2 || !l2) throw new eJ("No session defined in URL");
            let u2 = Math.round(Date.now() / 1e3), c2 = parseInt(a2), h2 = u2 + c2;
            o2 && (h2 = parseInt(o2));
            let d2 = h2 - u2;
            1e3 * d2 <= 3e4 && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${d2}s, should have been closer to ${c2}s`);
            let p2 = h2 - c2;
            u2 - p2 >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", p2, h2, u2) : u2 - p2 < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", p2, h2, u2);
            let { data: f2, error: g2 } = await this._getUser(n2);
            if (g2) throw g2;
            let b2 = { provider_token: r2, provider_refresh_token: i2, access_token: n2, expires_in: c2, expires_at: h2, refresh_token: s2, token_type: l2, user: f2.user };
            return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), { data: { session: b2, redirectType: e10.type }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: { session: null, redirectType: null }, error: e11 };
            throw e11;
          }
        }
        _isImplicitGrantCallback(e10) {
          return !!(e10.access_token || e10.error_description);
        }
        async _isPKCECallback(e10) {
          let t10 = await tn(this.storage, `${this.storageKey}-code-verifier`);
          return !!(e10.code && t10);
        }
        async signOut(e10 = { scope: "global" }) {
          return await this.initializePromise, await this._acquireLock(-1, async () => await this._signOut(e10));
        }
        async _signOut({ scope: e10 } = { scope: "global" }) {
          return await this._useSession(async (t10) => {
            var r2;
            let { data: i2, error: n2 } = t10;
            if (n2) return { error: n2 };
            let s2 = null === (r2 = i2.session) || void 0 === r2 ? void 0 : r2.access_token;
            if (s2) {
              let { error: t11 } = await this.admin.signOut(s2, e10);
              if (t11 && !(eq(t11) && "AuthApiError" === t11.name && (404 === t11.status || 401 === t11.status || 403 === t11.status))) return { error: t11 };
            }
            return "others" !== e10 && (await this._removeSession(), await ts(this.storage, `${this.storageKey}-code-verifier`)), { error: null };
          });
        }
        onAuthStateChange(e10) {
          let t10 = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e11) {
            let t11 = 16 * Math.random() | 0;
            return ("x" == e11 ? t11 : 3 & t11 | 8).toString(16);
          }), r2 = { id: t10, callback: e10, unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", t10), this.stateChangeEmitters.delete(t10);
          } };
          return this._debug("#onAuthStateChange()", "registered callback with id", t10), this.stateChangeEmitters.set(t10, r2), (async () => {
            await this.initializePromise, await this._acquireLock(-1, async () => {
              this._emitInitialSession(t10);
            });
          })(), { data: { subscription: r2 } };
        }
        async _emitInitialSession(e10) {
          return await this._useSession(async (t10) => {
            var r2, i2;
            try {
              let { data: { session: i3 }, error: n2 } = t10;
              if (n2) throw n2;
              await (null === (r2 = this.stateChangeEmitters.get(e10)) || void 0 === r2 ? void 0 : r2.callback("INITIAL_SESSION", i3)), this._debug("INITIAL_SESSION", "callback id", e10, "session", i3);
            } catch (t11) {
              await (null === (i2 = this.stateChangeEmitters.get(e10)) || void 0 === i2 ? void 0 : i2.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", e10, "error", t11), console.error(t11);
            }
          });
        }
        async resetPasswordForEmail(e10, t10 = {}) {
          let r2 = null, i2 = null;
          "pkce" === this.flowType && ([r2, i2] = await td(this.storage, this.storageKey, true));
          try {
            return await tk(this.fetch, "POST", `${this.url}/recover`, { body: { email: e10, code_challenge: r2, code_challenge_method: i2, gotrue_meta_security: { captcha_token: t10.captchaToken } }, headers: this.headers, redirectTo: t10.redirectTo });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async getUserIdentities() {
          var e10;
          try {
            let { data: t10, error: r2 } = await this.getUser();
            if (r2) throw r2;
            return { data: { identities: null !== (e10 = t10.user.identities) && void 0 !== e10 ? e10 : [] }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async linkIdentity(e10) {
          return "token" in e10 ? this.linkIdentityIdToken(e10) : this.linkIdentityOAuth(e10);
        }
        async linkIdentityOAuth(e10) {
          var t10;
          try {
            let { data: r2, error: i2 } = await this._useSession(async (t11) => {
              var r3, i3, n2, s2, a2;
              let { data: o2, error: l2 } = t11;
              if (l2) throw l2;
              let u2 = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e10.provider, { redirectTo: null === (r3 = e10.options) || void 0 === r3 ? void 0 : r3.redirectTo, scopes: null === (i3 = e10.options) || void 0 === i3 ? void 0 : i3.scopes, queryParams: null === (n2 = e10.options) || void 0 === n2 ? void 0 : n2.queryParams, skipBrowserRedirect: true });
              return await tk(this.fetch, "GET", u2, { headers: this.headers, jwt: null !== (a2 = null === (s2 = o2.session) || void 0 === s2 ? void 0 : s2.access_token) && void 0 !== a2 ? a2 : void 0 });
            });
            if (i2) throw i2;
            return !e9() || (null === (t10 = e10.options) || void 0 === t10 ? void 0 : t10.skipBrowserRedirect) || window.location.assign(null == r2 ? void 0 : r2.url), { data: { provider: e10.provider, url: null == r2 ? void 0 : r2.url }, error: null };
          } catch (t11) {
            if (eq(t11)) return { data: { provider: e10.provider, url: null }, error: t11 };
            throw t11;
          }
        }
        async linkIdentityIdToken(e10) {
          return await this._useSession(async (t10) => {
            var r2;
            try {
              let { error: i2, data: { session: n2 } } = t10;
              if (i2) throw i2;
              let { options: s2, provider: a2, token: o2, access_token: l2, nonce: u2 } = e10, { data: c2, error: h2 } = await tk(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, { headers: this.headers, jwt: null !== (r2 = null == n2 ? void 0 : n2.access_token) && void 0 !== r2 ? r2 : void 0, body: { provider: a2, id_token: o2, access_token: l2, nonce: u2, link_identity: true, gotrue_meta_security: { captcha_token: null == s2 ? void 0 : s2.captchaToken } }, xform: tE });
              if (h2) return { data: { user: null, session: null }, error: h2 };
              if (!c2 || !c2.session || !c2.user) return { data: { user: null, session: null }, error: new eK() };
              return c2.session && (await this._saveSession(c2.session), await this._notifyAllSubscribers("USER_UPDATED", c2.session)), { data: c2, error: h2 };
            } catch (e11) {
              if (eq(e11)) return { data: { user: null, session: null }, error: e11 };
              throw e11;
            }
          });
        }
        async unlinkIdentity(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r2, i2;
              let { data: n2, error: s2 } = t10;
              if (s2) throw s2;
              return await tk(this.fetch, "DELETE", `${this.url}/user/identities/${e10.identity_id}`, { headers: this.headers, jwt: null !== (i2 = null === (r2 = n2.session) || void 0 === r2 ? void 0 : r2.access_token) && void 0 !== i2 ? i2 : void 0 });
            });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _refreshAccessToken(e10) {
          let t10 = `#_refreshAccessToken(${e10.substring(0, 5)}...)`;
          this._debug(t10, "begin");
          try {
            var r2, i2;
            let n2 = Date.now();
            return await (r2 = async (r3) => (r3 > 0 && await tl(200 * Math.pow(2, r3 - 1)), this._debug(t10, "refreshing attempt", r3), await tk(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, { body: { refresh_token: e10 }, headers: this.headers, xform: tE })), i2 = (e11, t11) => t11 && eY(t11) && Date.now() + 200 * Math.pow(2, e11) - n2 < 3e4, new Promise((e11, t11) => {
              (async () => {
                for (let n3 = 0; n3 < 1 / 0; n3++) try {
                  let t12 = await r2(n3);
                  if (!i2(n3, null, t12)) {
                    e11(t12);
                    return;
                  }
                } catch (e12) {
                  if (!i2(n3, e12)) {
                    t11(e12);
                    return;
                  }
                }
              })();
            }));
          } catch (e11) {
            if (this._debug(t10, "error", e11), eq(e11)) return { data: { session: null, user: null }, error: e11 };
            throw e11;
          } finally {
            this._debug(t10, "end");
          }
        }
        _isValidSession(e10) {
          return "object" == typeof e10 && null !== e10 && "access_token" in e10 && "refresh_token" in e10 && "expires_at" in e10;
        }
        async _handleProviderSignIn(e10, t10) {
          let r2 = await this._getUrlForProvider(`${this.url}/authorize`, e10, { redirectTo: t10.redirectTo, scopes: t10.scopes, queryParams: t10.queryParams });
          return this._debug("#_handleProviderSignIn()", "provider", e10, "options", t10, "url", r2), e9() && !t10.skipBrowserRedirect && window.location.assign(r2), { data: { provider: e10, url: r2 }, error: null };
        }
        async _recoverAndRefresh() {
          var e10, t10;
          let r2 = "#_recoverAndRefresh()";
          this._debug(r2, "begin");
          try {
            let i2 = await tn(this.storage, this.storageKey);
            if (i2 && this.userStorage) {
              let t11 = await tn(this.userStorage, this.storageKey + "-user");
              !this.storage.isServer && Object.is(this.storage, this.userStorage) && !t11 && (t11 = { user: i2.user }, await ti(this.userStorage, this.storageKey + "-user", t11)), i2.user = null !== (e10 = null == t11 ? void 0 : t11.user) && void 0 !== e10 ? e10 : tb();
            } else if (i2 && !i2.user && !i2.user) {
              let e11 = await tn(this.storage, this.storageKey + "-user");
              e11 && (null == e11 ? void 0 : e11.user) ? (i2.user = e11.user, await ts(this.storage, this.storageKey + "-user"), await ti(this.storage, this.storageKey, i2)) : i2.user = tb();
            }
            if (this._debug(r2, "session from storage", i2), !this._isValidSession(i2)) {
              this._debug(r2, "session is not valid"), null !== i2 && await this._removeSession();
              return;
            }
            let n2 = (null !== (t10 = i2.expires_at) && void 0 !== t10 ? t10 : 1 / 0) * 1e3 - Date.now() < 9e4;
            if (this._debug(r2, `session has${n2 ? "" : " not"} expired with margin of 90000s`), n2) {
              if (this.autoRefreshToken && i2.refresh_token) {
                let { error: e11 } = await this._callRefreshToken(i2.refresh_token);
                e11 && (console.error(e11), eY(e11) || (this._debug(r2, "refresh failed with a non-retryable error, removing the session", e11), await this._removeSession()));
              }
            } else if (i2.user && true === i2.user.__isUserNotAvailableProxy) try {
              let { data: e11, error: t11 } = await this._getUser(i2.access_token);
              !t11 && (null == e11 ? void 0 : e11.user) ? (i2.user = e11.user, await this._saveSession(i2), await this._notifyAllSubscribers("SIGNED_IN", i2)) : this._debug(r2, "could not get user data, skipping SIGNED_IN notification");
            } catch (e11) {
              console.error("Error getting user data:", e11), this._debug(r2, "error getting user data, skipping SIGNED_IN notification", e11);
            }
            else await this._notifyAllSubscribers("SIGNED_IN", i2);
          } catch (e11) {
            this._debug(r2, "error", e11), console.error(e11);
            return;
          } finally {
            this._debug(r2, "end");
          }
        }
        async _callRefreshToken(e10) {
          var t10, r2;
          if (!e10) throw new ez();
          if (this.refreshingDeferred) return this.refreshingDeferred.promise;
          let i2 = `#_callRefreshToken(${e10.substring(0, 5)}...)`;
          this._debug(i2, "begin");
          try {
            this.refreshingDeferred = new ta();
            let { data: t11, error: r3 } = await this._refreshAccessToken(e10);
            if (r3) throw r3;
            if (!t11.session) throw new ez();
            await this._saveSession(t11.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", t11.session);
            let i3 = { data: t11.session, error: null };
            return this.refreshingDeferred.resolve(i3), i3;
          } catch (e11) {
            if (this._debug(i2, "error", e11), eq(e11)) {
              let r3 = { data: null, error: e11 };
              return eY(e11) || await this._removeSession(), null === (t10 = this.refreshingDeferred) || void 0 === t10 || t10.resolve(r3), r3;
            }
            throw null === (r2 = this.refreshingDeferred) || void 0 === r2 || r2.reject(e11), e11;
          } finally {
            this.refreshingDeferred = null, this._debug(i2, "end");
          }
        }
        async _notifyAllSubscribers(e10, t10, r2 = true) {
          let i2 = `#_notifyAllSubscribers(${e10})`;
          this._debug(i2, "begin", t10, `broadcast = ${r2}`);
          try {
            this.broadcastChannel && r2 && this.broadcastChannel.postMessage({ event: e10, session: t10 });
            let i3 = [], n2 = Array.from(this.stateChangeEmitters.values()).map(async (r3) => {
              try {
                await r3.callback(e10, t10);
              } catch (e11) {
                i3.push(e11);
              }
            });
            if (await Promise.all(n2), i3.length > 0) {
              for (let e11 = 0; e11 < i3.length; e11 += 1) console.error(i3[e11]);
              throw i3[0];
            }
          } finally {
            this._debug(i2, "end");
          }
        }
        async _saveSession(e10) {
          this._debug("#_saveSession()", e10), this.suppressGetSessionWarning = true;
          let t10 = Object.assign({}, e10), r2 = t10.user && true === t10.user.__isUserNotAvailableProxy;
          if (this.userStorage) {
            !r2 && t10.user && await ti(this.userStorage, this.storageKey + "-user", { user: t10.user });
            let e11 = Object.assign({}, t10);
            delete e11.user;
            let i2 = tv(e11);
            await ti(this.storage, this.storageKey, i2);
          } else {
            let e11 = tv(t10);
            await ti(this.storage, this.storageKey, e11);
          }
        }
        async _removeSession() {
          this._debug("#_removeSession()"), await ts(this.storage, this.storageKey), await ts(this.storage, this.storageKey + "-code-verifier"), await ts(this.storage, this.storageKey + "-user"), this.userStorage && await ts(this.userStorage, this.storageKey + "-user"), await this._notifyAllSubscribers("SIGNED_OUT", null);
        }
        _removeVisibilityChangedCallback() {
          this._debug("#_removeVisibilityChangedCallback()");
          let e10 = this.visibilityChangedCallback;
          this.visibilityChangedCallback = null;
          try {
            e10 && e9() && (null == window ? void 0 : window.removeEventListener) && window.removeEventListener("visibilitychange", e10);
          } catch (e11) {
            console.error("removing visibilitychange callback failed", e11);
          }
        }
        async _startAutoRefresh() {
          await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
          let e10 = setInterval(() => this._autoRefreshTokenTick(), 3e4);
          this.autoRefreshTicker = e10, e10 && "object" == typeof e10 && "function" == typeof e10.unref ? e10.unref() : "undefined" != typeof Deno && "function" == typeof Deno.unrefTimer && Deno.unrefTimer(e10), setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
          }, 0);
        }
        async _stopAutoRefresh() {
          this._debug("#_stopAutoRefresh()");
          let e10 = this.autoRefreshTicker;
          this.autoRefreshTicker = null, e10 && clearInterval(e10);
        }
        async startAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
        }
        async stopAutoRefresh() {
          this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
        }
        async _autoRefreshTokenTick() {
          this._debug("#_autoRefreshTokenTick()", "begin");
          try {
            await this._acquireLock(0, async () => {
              try {
                let e10 = Date.now();
                try {
                  return await this._useSession(async (t10) => {
                    let { data: { session: r2 } } = t10;
                    if (!r2 || !r2.refresh_token || !r2.expires_at) {
                      this._debug("#_autoRefreshTokenTick()", "no session");
                      return;
                    }
                    let i2 = Math.floor((1e3 * r2.expires_at - e10) / 3e4);
                    this._debug("#_autoRefreshTokenTick()", `access token expires in ${i2} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`), i2 <= 3 && await this._callRefreshToken(r2.refresh_token);
                  });
                } catch (e11) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", e11);
                }
              } finally {
                this._debug("#_autoRefreshTokenTick()", "end");
              }
            });
          } catch (e10) {
            if (e10.isAcquireTimeout || e10 instanceof t$) this._debug("auto refresh token tick lock not available");
            else throw e10;
          }
        }
        async _handleVisibilityChange() {
          if (this._debug("#_handleVisibilityChange()"), !e9() || !(null == window ? void 0 : window.addEventListener)) return this.autoRefreshToken && this.startAutoRefresh(), false;
          try {
            this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false), null == window || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(true);
          } catch (e10) {
            console.error("_handleVisibilityChange", e10);
          }
        }
        async _onVisibilityChanged(e10) {
          let t10 = `#_onVisibilityChanged(${e10})`;
          this._debug(t10, "visibilityState", document.visibilityState), "visible" === document.visibilityState ? (this.autoRefreshToken && this._startAutoRefresh(), e10 || (await this.initializePromise, await this._acquireLock(-1, async () => {
            if ("visible" !== document.visibilityState) {
              this._debug(t10, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
              return;
            }
            await this._recoverAndRefresh();
          }))) : "hidden" === document.visibilityState && this.autoRefreshToken && this._stopAutoRefresh();
        }
        async _getUrlForProvider(e10, t10, r2) {
          let i2 = [`provider=${encodeURIComponent(t10)}`];
          if ((null == r2 ? void 0 : r2.redirectTo) && i2.push(`redirect_to=${encodeURIComponent(r2.redirectTo)}`), (null == r2 ? void 0 : r2.scopes) && i2.push(`scopes=${encodeURIComponent(r2.scopes)}`), "pkce" === this.flowType) {
            let [e11, t11] = await td(this.storage, this.storageKey), r3 = new URLSearchParams({ code_challenge: `${encodeURIComponent(e11)}`, code_challenge_method: `${encodeURIComponent(t11)}` });
            i2.push(r3.toString());
          }
          if (null == r2 ? void 0 : r2.queryParams) {
            let e11 = new URLSearchParams(r2.queryParams);
            i2.push(e11.toString());
          }
          return (null == r2 ? void 0 : r2.skipBrowserRedirect) && i2.push(`skip_http_redirect=${r2.skipBrowserRedirect}`), `${e10}?${i2.join("&")}`;
        }
        async _unenroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r2;
              let { data: i2, error: n2 } = t10;
              return n2 ? { data: null, error: n2 } : await tk(this.fetch, "DELETE", `${this.url}/factors/${e10.factorId}`, { headers: this.headers, jwt: null === (r2 = null == i2 ? void 0 : i2.session) || void 0 === r2 ? void 0 : r2.access_token });
            });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _enroll(e10) {
          try {
            return await this._useSession(async (t10) => {
              var r2, i2;
              let { data: n2, error: s2 } = t10;
              if (s2) return { data: null, error: s2 };
              let a2 = Object.assign({ friendly_name: e10.friendlyName, factor_type: e10.factorType }, "phone" === e10.factorType ? { phone: e10.phone } : "totp" === e10.factorType ? { issuer: e10.issuer } : {}), { data: o2, error: l2 } = await tk(this.fetch, "POST", `${this.url}/factors`, { body: a2, headers: this.headers, jwt: null === (r2 = null == n2 ? void 0 : n2.session) || void 0 === r2 ? void 0 : r2.access_token });
              return l2 ? { data: null, error: l2 } : ("totp" === e10.factorType && "totp" === o2.type && (null === (i2 = null == o2 ? void 0 : o2.totp) || void 0 === i2 ? void 0 : i2.qr_code) && (o2.totp.qr_code = `data:image/svg+xml;utf-8,${o2.totp.qr_code}`), { data: o2, error: null });
            });
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
        async _verify(e10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r2, i2, n2;
                let { data: s2, error: a2 } = t10;
                if (a2) return { data: null, error: a2 };
                let o2 = Object.assign({ challenge_id: e10.challengeId }, "webauthn" in e10 ? { webauthn: Object.assign(Object.assign({}, e10.webauthn), { credential_response: "create" === e10.webauthn.type ? (i2 = e10.webauthn.credential_response, "toJSON" in i2 && "function" == typeof i2.toJSON ? i2.toJSON() : { id: i2.id, rawId: i2.id, response: { attestationObject: e5(new Uint8Array(i2.response.attestationObject)), clientDataJSON: e5(new Uint8Array(i2.response.clientDataJSON)) }, type: "public-key", clientExtensionResults: i2.getClientExtensionResults(), authenticatorAttachment: null !== (n2 = i2.authenticatorAttachment) && void 0 !== n2 ? n2 : void 0 }) : function(e11) {
                  var t11;
                  if ("toJSON" in e11 && "function" == typeof e11.toJSON) return e11.toJSON();
                  let r3 = e11.getClientExtensionResults(), i3 = e11.response;
                  return { id: e11.id, rawId: e11.id, response: { authenticatorData: e5(new Uint8Array(i3.authenticatorData)), clientDataJSON: e5(new Uint8Array(i3.clientDataJSON)), signature: e5(new Uint8Array(i3.signature)), userHandle: i3.userHandle ? e5(new Uint8Array(i3.userHandle)) : void 0 }, type: "public-key", clientExtensionResults: r3, authenticatorAttachment: null !== (t11 = e11.authenticatorAttachment) && void 0 !== t11 ? t11 : void 0 };
                }(e10.webauthn.credential_response) }) } : { code: e10.code }), { data: l2, error: u2 } = await tk(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/verify`, { body: o2, headers: this.headers, jwt: null === (r2 = null == s2 ? void 0 : s2.session) || void 0 === r2 ? void 0 : r2.access_token });
                return u2 ? { data: null, error: u2 } : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + l2.expires_in }, l2)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", l2), { data: l2, error: u2 });
              });
            } catch (e11) {
              if (eq(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        async _challenge(e10) {
          return this._acquireLock(-1, async () => {
            try {
              return await this._useSession(async (t10) => {
                var r2;
                let { data: i2, error: n2 } = t10;
                if (n2) return { data: null, error: n2 };
                let s2 = await tk(this.fetch, "POST", `${this.url}/factors/${e10.factorId}/challenge`, { body: e10, headers: this.headers, jwt: null === (r2 = null == i2 ? void 0 : i2.session) || void 0 === r2 ? void 0 : r2.access_token });
                if (s2.error) return s2;
                let { data: a2 } = s2;
                if ("webauthn" !== a2.type) return { data: a2, error: null };
                switch (a2.webauthn.type) {
                  case "create":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: function(e11) {
                      if (!e11) throw Error("Credential creation options are required");
                      if ("undefined" != typeof PublicKeyCredential && "parseCreationOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseCreationOptionsFromJSON) return PublicKeyCredential.parseCreationOptionsFromJSON(e11);
                      let { challenge: t11, user: r3, excludeCredentials: i3 } = e11, n3 = tV(e11, ["challenge", "user", "excludeCredentials"]), s3 = e8(t11).buffer, a3 = Object.assign(Object.assign({}, r3), { id: e8(r3.id).buffer }), o2 = Object.assign(Object.assign({}, n3), { challenge: s3, user: a3 });
                      if (i3 && i3.length > 0) {
                        o2.excludeCredentials = Array(i3.length);
                        for (let e12 = 0; e12 < i3.length; e12++) {
                          let t12 = i3[e12];
                          o2.excludeCredentials[e12] = Object.assign(Object.assign({}, t12), { id: e8(t12.id).buffer, type: t12.type || "public-key", transports: t12.transports });
                        }
                      }
                      return o2;
                    }(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                  case "request":
                    return { data: Object.assign(Object.assign({}, a2), { webauthn: Object.assign(Object.assign({}, a2.webauthn), { credential_options: Object.assign(Object.assign({}, a2.webauthn.credential_options), { publicKey: function(e11) {
                      if (!e11) throw Error("Credential request options are required");
                      if ("undefined" != typeof PublicKeyCredential && "parseRequestOptionsFromJSON" in PublicKeyCredential && "function" == typeof PublicKeyCredential.parseRequestOptionsFromJSON) return PublicKeyCredential.parseRequestOptionsFromJSON(e11);
                      let { challenge: t11, allowCredentials: r3 } = e11, i3 = tV(e11, ["challenge", "allowCredentials"]), n3 = e8(t11).buffer, s3 = Object.assign(Object.assign({}, i3), { challenge: n3 });
                      if (r3 && r3.length > 0) {
                        s3.allowCredentials = Array(r3.length);
                        for (let e12 = 0; e12 < r3.length; e12++) {
                          let t12 = r3[e12];
                          s3.allowCredentials[e12] = Object.assign(Object.assign({}, t12), { id: e8(t12.id).buffer, type: t12.type || "public-key", transports: t12.transports });
                        }
                      }
                      return s3;
                    }(a2.webauthn.credential_options.publicKey) }) }) }), error: null };
                }
              });
            } catch (e11) {
              if (eq(e11)) return { data: null, error: e11 };
              throw e11;
            }
          });
        }
        async _challengeAndVerify(e10) {
          let { data: t10, error: r2 } = await this._challenge({ factorId: e10.factorId });
          return r2 ? { data: null, error: r2 } : await this._verify({ factorId: e10.factorId, challengeId: t10.id, code: e10.code });
        }
        async _listFactors() {
          var e10;
          let { data: { user: t10 }, error: r2 } = await this.getUser();
          if (r2) return { data: null, error: r2 };
          let i2 = { all: [], phone: [], totp: [], webauthn: [] };
          for (let r3 of null !== (e10 = null == t10 ? void 0 : t10.factors) && void 0 !== e10 ? e10 : []) i2.all.push(r3), "verified" === r3.status && i2[r3.factor_type].push(r3);
          return { data: i2, error: null };
        }
        async _getAuthenticatorAssuranceLevel() {
          return this._acquireLock(-1, async () => await this._useSession(async (e10) => {
            var t10, r2;
            let { data: { session: i2 }, error: n2 } = e10;
            if (n2) return { data: null, error: n2 };
            if (!i2) return { data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] }, error: null };
            let { payload: s2 } = to(i2.access_token), a2 = null;
            s2.aal && (a2 = s2.aal);
            let o2 = a2;
            return (null !== (r2 = null === (t10 = i2.user.factors) || void 0 === t10 ? void 0 : t10.filter((e11) => "verified" === e11.status)) && void 0 !== r2 ? r2 : []).length > 0 && (o2 = "aal2"), { data: { currentLevel: a2, nextLevel: o2, currentAuthenticationMethods: s2.amr || [] }, error: null };
          }));
        }
        async fetchJwk(e10, t10 = { keys: [] }) {
          let r2 = t10.keys.find((t11) => t11.kid === e10);
          if (r2) return r2;
          let i2 = Date.now();
          if ((r2 = this.jwks.keys.find((t11) => t11.kid === e10)) && this.jwks_cached_at + 6e5 > i2) return r2;
          let { data: n2, error: s2 } = await tk(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, { headers: this.headers });
          if (s2) throw s2;
          return n2.keys && 0 !== n2.keys.length && (this.jwks = n2, this.jwks_cached_at = i2, r2 = n2.keys.find((t11) => t11.kid === e10)) ? r2 : null;
        }
        async getClaims(e10, t10 = {}) {
          try {
            let r2 = e10;
            if (!r2) {
              let { data: e11, error: t11 } = await this.getSession();
              if (t11 || !e11.session) return { data: null, error: t11 };
              r2 = e11.session.access_token;
            }
            let { header: i2, payload: n2, signature: s2, raw: { header: a2, payload: o2 } } = to(r2);
            (null == t10 ? void 0 : t10.allowExpired) || function(e11) {
              if (!e11) throw Error("Missing exp claim");
              if (e11 <= Math.floor(Date.now() / 1e3)) throw Error("JWT has expired");
            }(n2.exp);
            let l2 = !i2.alg || i2.alg.startsWith("HS") || !i2.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(i2.kid, (null == t10 ? void 0 : t10.keys) ? { keys: t10.keys } : null == t10 ? void 0 : t10.jwks);
            if (!l2) {
              let { error: e11 } = await this.getUser(r2);
              if (e11) throw e11;
              return { data: { claims: n2, header: i2, signature: s2 }, error: null };
            }
            let u2 = function(e11) {
              switch (e11) {
                case "RS256":
                  return { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } };
                case "ES256":
                  return { name: "ECDSA", namedCurve: "P-256", hash: { name: "SHA-256" } };
                default:
                  throw Error("Invalid alg claim");
              }
            }(i2.alg), c2 = await crypto.subtle.importKey("jwk", l2, u2, true, ["verify"]);
            if (!await crypto.subtle.verify(u2, c2, s2, function(e11) {
              let t11 = [];
              return function(e12, t12) {
                for (let r3 = 0; r3 < e12.length; r3 += 1) {
                  let i3 = e12.charCodeAt(r3);
                  if (i3 > 55295 && i3 <= 56319) {
                    let t13 = (i3 - 55296) * 1024 & 65535;
                    i3 = (e12.charCodeAt(r3 + 1) - 56320 & 65535 | t13) + 65536, r3 += 1;
                  }
                  !function(e13, t13) {
                    if (e13 <= 127) {
                      t13(e13);
                      return;
                    }
                    if (e13 <= 2047) {
                      t13(192 | e13 >> 6), t13(128 | 63 & e13);
                      return;
                    }
                    if (e13 <= 65535) {
                      t13(224 | e13 >> 12), t13(128 | e13 >> 6 & 63), t13(128 | 63 & e13);
                      return;
                    }
                    if (e13 <= 1114111) {
                      t13(240 | e13 >> 18), t13(128 | e13 >> 12 & 63), t13(128 | e13 >> 6 & 63), t13(128 | 63 & e13);
                      return;
                    }
                    throw Error(`Unrecognized Unicode codepoint: ${e13.toString(16)}`);
                  }(i3, t12);
                }
              }(e11, (e12) => t11.push(e12)), new Uint8Array(t11);
            }(`${a2}.${o2}`))) throw new eQ("Invalid JWT signature");
            return { data: { claims: n2, header: i2, signature: s2 }, error: null };
          } catch (e11) {
            if (eq(e11)) return { data: null, error: e11 };
            throw e11;
          }
        }
      }
      t2.nextInstanceID = 0;
      let t3 = t2;
      class t4 extends t3 {
        constructor(e10) {
          super(e10);
        }
      }
      class t6 {
        constructor(e10, t10, r2) {
          var i2, n2, s2;
          this.supabaseUrl = e10, this.supabaseKey = t10;
          let a2 = function(e11) {
            let t11 = null == e11 ? void 0 : e11.trim();
            if (!t11) throw Error("supabaseUrl is required.");
            if (!t11.match(/^https?:\/\//i)) throw Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
            try {
              return new URL(t11.endsWith("/") ? t11 : t11 + "/");
            } catch (e12) {
              throw Error("Invalid supabaseUrl: Provided URL is malformed.");
            }
          }(e10);
          if (!t10) throw Error("supabaseKey is required.");
          this.realtimeUrl = new URL("realtime/v1", a2), this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws"), this.authUrl = new URL("auth/v1", a2), this.storageUrl = new URL("storage/v1", a2), this.functionsUrl = new URL("functions/v1", a2);
          let o2 = `sb-${a2.hostname.split(".")[0]}-auth-token`, l2 = function(e11, t11) {
            var r3, i3;
            let { db: n3, auth: s3, realtime: a3, global: o3 } = e11, { db: l3, auth: u2, realtime: c2, global: h2 } = t11, d2 = { db: Object.assign(Object.assign({}, l3), n3), auth: Object.assign(Object.assign({}, u2), s3), realtime: Object.assign(Object.assign({}, c2), a3), storage: {}, global: Object.assign(Object.assign(Object.assign({}, h2), o3), { headers: Object.assign(Object.assign({}, null !== (r3 = null == h2 ? void 0 : h2.headers) && void 0 !== r3 ? r3 : {}), null !== (i3 = null == o3 ? void 0 : o3.headers) && void 0 !== i3 ? i3 : {}) }), accessToken: () => {
              var e12, t12, r4, i4;
              return e12 = this, t12 = void 0, i4 = function* () {
                return "";
              }, new (r4 = void 0, r4 = Promise)(function(n4, s4) {
                function a4(e13) {
                  try {
                    l4(i4.next(e13));
                  } catch (e14) {
                    s4(e14);
                  }
                }
                function o4(e13) {
                  try {
                    l4(i4.throw(e13));
                  } catch (e14) {
                    s4(e14);
                  }
                }
                function l4(e13) {
                  var t13;
                  e13.done ? n4(e13.value) : ((t13 = e13.value) instanceof r4 ? t13 : new r4(function(e14) {
                    e14(t13);
                  })).then(a4, o4);
                }
                l4((i4 = i4.apply(e12, t12 || [])).next());
              });
            } };
            return e11.accessToken ? d2.accessToken = e11.accessToken : delete d2.accessToken, d2;
          }(null != r2 ? r2 : {}, { db: eC, realtime: eI, auth: Object.assign(Object.assign({}, eP), { storageKey: o2 }), global: ex });
          this.storageKey = null !== (i2 = l2.auth.storageKey) && void 0 !== i2 ? i2 : "", this.headers = null !== (n2 = l2.global.headers) && void 0 !== n2 ? n2 : {}, l2.accessToken ? (this.accessToken = l2.accessToken, this.auth = new Proxy({}, { get: (e11, t11) => {
            throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t11)} is not possible`);
          } })) : this.auth = this._initSupabaseAuthClient(null !== (s2 = l2.auth) && void 0 !== s2 ? s2 : {}, this.headers, l2.global.fetch), this.fetch = eN(t10, this._getAccessToken.bind(this), l2.global.fetch), this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, l2.realtime)), this.rest = new f(new URL("rest/v1", a2).href, { headers: this.headers, schema: l2.db.schema, fetch: this.fetch }), this.storage = new eE(this.storageUrl.href, this.headers, this.fetch, null == r2 ? void 0 : r2.storage), l2.accessToken || this._listenForAuthEvents();
        }
        get functions() {
          return new p(this.functionsUrl.href, { headers: this.headers, customFetch: this.fetch });
        }
        from(e10) {
          return this.rest.from(e10);
        }
        schema(e10) {
          return this.rest.schema(e10);
        }
        rpc(e10, t10 = {}, r2 = {}) {
          return this.rest.rpc(e10, t10, r2);
        }
        channel(e10, t10 = { config: {} }) {
          return this.realtime.channel(e10, t10);
        }
        getChannels() {
          return this.realtime.getChannels();
        }
        removeChannel(e10) {
          return this.realtime.removeChannel(e10);
        }
        removeAllChannels() {
          return this.realtime.removeAllChannels();
        }
        _getAccessToken() {
          var e10, t10, r2, i2;
          return e10 = this, t10 = void 0, r2 = void 0, i2 = function* () {
            var e11, t11;
            if (this.accessToken) return yield this.accessToken();
            let { data: r3 } = yield this.auth.getSession();
            return null !== (t11 = null === (e11 = r3.session) || void 0 === e11 ? void 0 : e11.access_token) && void 0 !== t11 ? t11 : this.supabaseKey;
          }, new (r2 || (r2 = Promise))(function(n2, s2) {
            function a2(e11) {
              try {
                l2(i2.next(e11));
              } catch (e12) {
                s2(e12);
              }
            }
            function o2(e11) {
              try {
                l2(i2.throw(e11));
              } catch (e12) {
                s2(e12);
              }
            }
            function l2(e11) {
              var t11;
              e11.done ? n2(e11.value) : ((t11 = e11.value) instanceof r2 ? t11 : new r2(function(e12) {
                e12(t11);
              })).then(a2, o2);
            }
            l2((i2 = i2.apply(e10, t10 || [])).next());
          });
        }
        _initSupabaseAuthClient({ autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r2, storage: i2, userStorage: n2, storageKey: s2, flowType: a2, lock: o2, debug: l2 }, u2, c2) {
          let h2 = { Authorization: `Bearer ${this.supabaseKey}`, apikey: `${this.supabaseKey}` };
          return new t4({ url: this.authUrl.href, headers: Object.assign(Object.assign({}, h2), u2), storageKey: s2, autoRefreshToken: e10, persistSession: t10, detectSessionInUrl: r2, storage: i2, userStorage: n2, flowType: a2, lock: o2, debug: l2, fetch: c2, hasCustomAuthorizationHeader: Object.keys(this.headers).some((e11) => "authorization" === e11.toLowerCase()) });
        }
        _initRealtimeClient(e10) {
          return new B(this.realtimeUrl.href, Object.assign(Object.assign({}, e10), { params: Object.assign({ apikey: this.supabaseKey }, null == e10 ? void 0 : e10.params) }));
        }
        _listenForAuthEvents() {
          return this.auth.onAuthStateChange((e10, t10) => {
            this._handleTokenChanged(e10, "CLIENT", null == t10 ? void 0 : t10.access_token);
          });
        }
        _handleTokenChanged(e10, t10, r2) {
          ("TOKEN_REFRESHED" === e10 || "SIGNED_IN" === e10) && this.changedAccessToken !== r2 ? (this.changedAccessToken = r2, this.realtime.setAuth(r2)) : "SIGNED_OUT" === e10 && (this.realtime.setAuth(), "STORAGE" == t10 && this.auth.signOut(), this.changedAccessToken = void 0);
        }
      }
      let t8 = (e10, t10, r2) => new t6(e10, t10, r2);
      (function() {
        if ("undefined" != typeof window || "undefined" == typeof process) return false;
        let e10 = process.version;
        if (null == e10) return false;
        let t10 = e10.match(/^v(\d+)\./);
        return !!t10 && 18 >= parseInt(t10[1], 10);
      })() && console.warn(`\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
      var t5 = Object.create, t9 = Object.defineProperty, t7 = Object.getOwnPropertyDescriptor, re = Object.getOwnPropertyNames, rt = Object.getPrototypeOf, rr = Object.prototype.hasOwnProperty, ri = (e10, t10, r2, i2) => {
        if (t10 && "object" == typeof t10 || "function" == typeof t10) for (let n2 of re(t10)) rr.call(e10, n2) || n2 === r2 || t9(e10, n2, { get: () => t10[n2], enumerable: !(i2 = t7(t10, n2)) || i2.enumerable });
        return e10;
      }, rn = (e10, t10, r2) => (r2 = null != e10 ? t5(rt(e10)) : {}, ri(!t10 && e10 && e10.__esModule ? r2 : t9(r2, "default", { value: e10, enumerable: true }), e10)), rs = (i = { "../../node_modules/.pnpm/cookie@0.5.0/node_modules/cookie/index.js"(e10) {
        e10.parse = function(e11, t11) {
          if ("string" != typeof e11) throw TypeError("argument str must be a string");
          for (var r3 = {}, n3 = (t11 || {}).decode || i2, s2 = 0; s2 < e11.length; ) {
            var a2 = e11.indexOf("=", s2);
            if (-1 === a2) break;
            var o2 = e11.indexOf(";", s2);
            if (-1 === o2) o2 = e11.length;
            else if (o2 < a2) {
              s2 = e11.lastIndexOf(";", a2 - 1) + 1;
              continue;
            }
            var l2 = e11.slice(s2, a2).trim();
            if (void 0 === r3[l2]) {
              var u2 = e11.slice(a2 + 1, o2).trim();
              34 === u2.charCodeAt(0) && (u2 = u2.slice(1, -1)), r3[l2] = function(e12, t12) {
                try {
                  return t12(e12);
                } catch (t13) {
                  return e12;
                }
              }(u2, n3);
            }
            s2 = o2 + 1;
          }
          return r3;
        }, e10.serialize = function(e11, i3, s2) {
          var a2 = s2 || {}, o2 = a2.encode || n2;
          if ("function" != typeof o2) throw TypeError("option encode is invalid");
          if (!r2.test(e11)) throw TypeError("argument name is invalid");
          var l2 = o2(i3);
          if (l2 && !r2.test(l2)) throw TypeError("argument val is invalid");
          var u2 = e11 + "=" + l2;
          if (null != a2.maxAge) {
            var c2 = a2.maxAge - 0;
            if (isNaN(c2) || !isFinite(c2)) throw TypeError("option maxAge is invalid");
            u2 += "; Max-Age=" + Math.floor(c2);
          }
          if (a2.domain) {
            if (!r2.test(a2.domain)) throw TypeError("option domain is invalid");
            u2 += "; Domain=" + a2.domain;
          }
          if (a2.path) {
            if (!r2.test(a2.path)) throw TypeError("option path is invalid");
            u2 += "; Path=" + a2.path;
          }
          if (a2.expires) {
            var h2 = a2.expires;
            if ("[object Date]" !== t10.call(h2) && !(h2 instanceof Date) || isNaN(h2.valueOf())) throw TypeError("option expires is invalid");
            u2 += "; Expires=" + h2.toUTCString();
          }
          if (a2.httpOnly && (u2 += "; HttpOnly"), a2.secure && (u2 += "; Secure"), a2.priority) switch ("string" == typeof a2.priority ? a2.priority.toLowerCase() : a2.priority) {
            case "low":
              u2 += "; Priority=Low";
              break;
            case "medium":
              u2 += "; Priority=Medium";
              break;
            case "high":
              u2 += "; Priority=High";
              break;
            default:
              throw TypeError("option priority is invalid");
          }
          if (a2.sameSite) switch ("string" == typeof a2.sameSite ? a2.sameSite.toLowerCase() : a2.sameSite) {
            case true:
            case "strict":
              u2 += "; SameSite=Strict";
              break;
            case "lax":
              u2 += "; SameSite=Lax";
              break;
            case "none":
              u2 += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return u2;
        };
        var t10 = Object.prototype.toString, r2 = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        function i2(e11) {
          return -1 !== e11.indexOf("%") ? decodeURIComponent(e11) : e11;
        }
        function n2(e11) {
          return encodeURIComponent(e11);
        }
      } }, function() {
        return n || (0, i[re(i)[0]])((n = { exports: {} }).exports, n), n.exports;
      }), ra = rn(rs()), ro = rn(rs());
      function rl(e10) {
        if (!e10) return null;
        try {
          let t10 = JSON.parse(e10);
          if (!t10) return null;
          if ("Object" === t10.constructor.name) return t10;
          if ("Array" !== t10.constructor.name) throw Error(`Unexpected format: ${t10.constructor.name}`);
          let [r2, i2, n2] = t10[0].split("."), s2 = o(i2), a2 = new TextDecoder(), { exp: l2, sub: u2, ...c2 } = JSON.parse(a2.decode(s2));
          return { expires_at: l2, expires_in: l2 - Math.round(Date.now() / 1e3), token_type: "bearer", access_token: t10[0], refresh_token: t10[1], provider_token: t10[2], provider_refresh_token: t10[3], user: { id: u2, factors: t10[4], ...c2 } };
        } catch (e11) {
          return console.warn("Failed to parse cookie string:", e11), null;
        }
      }
      function ru(e10) {
        var t10;
        return JSON.stringify([e10.access_token, e10.refresh_token, e10.provider_token, e10.provider_refresh_token, (null == (t10 = e10.user) ? void 0 : t10.factors) ?? null]);
      }
      function rc() {
        return "undefined" != typeof window && void 0 !== window.document;
      }
      var rh = { path: "/", sameSite: "lax", maxAge: 31536e6 }, rd = RegExp(".{1,3180}", "g"), rp = class {
        constructor(e10) {
          this.cookieOptions = { ...rh, ...e10, maxAge: rh.maxAge };
        }
        getItem(e10) {
          let t10 = this.getCookie(e10);
          if (e10.endsWith("-code-verifier") && t10) return t10;
          if (t10) return JSON.stringify(rl(t10));
          let r2 = function(e11, t11 = () => null) {
            let r3 = [];
            for (let i2 = 0; ; i2++) {
              let n2 = t11(`${e11}.${i2}`);
              if (!n2) break;
              r3.push(n2);
            }
            return r3.length ? r3.join("") : null;
          }(e10, (e11) => this.getCookie(e11));
          return null !== r2 ? JSON.stringify(rl(r2)) : null;
        }
        setItem(e10, t10) {
          if (e10.endsWith("-code-verifier")) {
            this.setCookie(e10, t10);
            return;
          }
          (function(e11, t11, r2) {
            if (1 === Math.ceil(t11.length / 3180)) return [{ name: e11, value: t11 }];
            let i2 = [], n2 = t11.match(rd);
            return null == n2 || n2.forEach((t12, r3) => {
              let n3 = `${e11}.${r3}`;
              i2.push({ name: n3, value: t12 });
            }), i2;
          })(e10, ru(JSON.parse(t10))).forEach((e11) => {
            this.setCookie(e11.name, e11.value);
          });
        }
        removeItem(e10) {
          this._deleteSingleCookie(e10), this._deleteChunkedCookies(e10);
        }
        _deleteSingleCookie(e10) {
          this.getCookie(e10) && this.deleteCookie(e10);
        }
        _deleteChunkedCookies(e10, t10 = 0) {
          for (let r2 = t10; ; r2++) {
            let t11 = `${e10}.${r2}`;
            if (void 0 === this.getCookie(t11)) break;
            this.deleteCookie(t11);
          }
        }
      }, rf = class extends rp {
        constructor(e10) {
          super(e10);
        }
        getCookie(e10) {
          return rc() ? (0, ra.parse)(document.cookie)[e10] : null;
        }
        setCookie(e10, t10) {
          if (!rc()) return null;
          document.cookie = (0, ra.serialize)(e10, t10, { ...this.cookieOptions, httpOnly: false });
        }
        deleteCookie(e10) {
          if (!rc()) return null;
          document.cookie = (0, ra.serialize)(e10, "", { ...this.cookieOptions, maxAge: 0, httpOnly: false });
        }
      };
      function rg(e10, t10, r2) {
        var i2;
        let n2 = rc();
        return t8(e10, t10, { ...r2, auth: { flowType: "pkce", autoRefreshToken: n2, detectSessionInUrl: n2, persistSession: true, storage: r2.auth.storage, ...(null == (i2 = r2.auth) ? void 0 : i2.storageKey) ? { storageKey: r2.auth.storageKey } : {} } });
      }
      var rb = ro.parse, rv = ro.serialize;
    } }, (e) => {
      var t = e(e.s = 3410);
      (_ENTRIES = "undefined" == typeof _ENTRIES ? {} : _ENTRIES).middleware_middleware = t;
    }]);
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^/.*$"] }];
    require_edge_runtime_webpack();
    require_middleware();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "eslint": { "ignoreDuringBuilds": false }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.js", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "analyticsId": "", "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/webp"], "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "inline", "remotePatterns": [], "unoptimized": false }, "devIndicators": { "buildActivity": true, "buildActivityPosition": "bottom-right" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "optimizeFonts": true, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "httpAgentOptions": { "keepAlive": true }, "outputFileTracing": true, "staticPageGenerationTimeout": 60, "swcMinify": true, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "experimental": { "multiZoneDraftMode": false, "prerenderEarlyExit": false, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "outputFileTracingRoot": "/Users/hector.alvarez/Finance", "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "adjustFontFallbacks": false, "adjustFontFallbacksWithSizeAdjust": false, "typedRoutes": false, "instrumentationHook": false, "bundlePagesExternals": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "missingSuspenseWithCSRBailout": true, "optimizeServerReact": true, "useEarlyImport": false, "staleTimes": { "dynamic": 30, "static": 300 }, "serverActions": { "bodySizeLimit": "2mb" }, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "configFileName": "next.config.js" };
var BuildId = "304VbPK6Y4RGeXtW6xVfF";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/accounts", "regex": "^/accounts(?:/)?$", "routeKeys": {}, "namedRegex": "^/accounts(?:/)?$" }, { "page": "/auth/callback", "regex": "^/auth/callback(?:/)?$", "routeKeys": {}, "namedRegex": "^/auth/callback(?:/)?$" }, { "page": "/budgets", "regex": "^/budgets(?:/)?$", "routeKeys": {}, "namedRegex": "^/budgets(?:/)?$" }, { "page": "/categories", "regex": "^/categories(?:/)?$", "routeKeys": {}, "namedRegex": "^/categories(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/insights", "regex": "^/insights(?:/)?$", "routeKeys": {}, "namedRegex": "^/insights(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/portfolio", "regex": "^/portfolio(?:/)?$", "routeKeys": {}, "namedRegex": "^/portfolio(?:/)?$" }, { "page": "/recurring", "regex": "^/recurring(?:/)?$", "routeKeys": {}, "namedRegex": "^/recurring(?:/)?$" }, { "page": "/reset-password", "regex": "^/reset\\-password(?:/)?$", "routeKeys": {}, "namedRegex": "^/reset\\-password(?:/)?$" }, { "page": "/settings", "regex": "^/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/settings(?:/)?$" }, { "page": "/signup", "regex": "^/signup(?:/)?$", "routeKeys": {}, "namedRegex": "^/signup(?:/)?$" }, { "page": "/transactions", "regex": "^/transactions(?:/)?$", "routeKeys": {}, "namedRegex": "^/transactions(?:/)?$" }], "dynamic": [], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/login": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/login", "dataRoute": "/login.rsc" }, "/reset-password": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/reset-password", "dataRoute": "/reset-password.rsc" }, "/signup": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/signup", "dataRoute": "/signup.rsc" }, "/": { "experimentalBypassFor": [{ "type": "header", "key": "Next-Action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc" } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "0ec47ec1d89fbba3b920a4d9a14d9fc1", "previewModeSigningKey": "e49fe89500ae8d76afd8f60d3d039c011f437befe0ae3572a75948a7ae5f1c5a", "previewModeEncryptionKey": "673dc87ded5ee296eaa53a99921524b833a9461fb488ec72641641bbb55b71e7" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge-runtime-webpack.js", "server/middleware.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^/.*$", "originalSource": "/:path*" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "304VbPK6Y4RGeXtW6xVfF", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "HNV5pXmOhrkUq4kpJrH1xH0yTtIuHYfXClpus80+v9w=", "__NEXT_PREVIEW_MODE_ID": "0ec47ec1d89fbba3b920a4d9a14d9fc1", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "673dc87ded5ee296eaa53a99921524b833a9461fb488ec72641641bbb55b71e7", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "e49fe89500ae8d76afd8f60d3d039c011f437befe0ae3572a75948a7ae5f1c5a" } } }, "functions": { "/api/cron/process-recurring/route": { "files": ["server/middleware-build-manifest.js", "server/middleware-react-loadable-manifest.js", "server/next-font-manifest.js", "server/interception-route-rewrite-manifest.js", "server/edge-runtime-webpack.js", "server/app/api/cron/process-recurring/route.js"], "name": "app/api/cron/process-recurring/route", "page": "/api/cron/process-recurring/route", "matchers": [{ "regexp": "^/api/cron/process\\-recurring$", "originalSource": "/api/cron/process-recurring" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "304VbPK6Y4RGeXtW6xVfF", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "HNV5pXmOhrkUq4kpJrH1xH0yTtIuHYfXClpus80+v9w=", "__NEXT_PREVIEW_MODE_ID": "0ec47ec1d89fbba3b920a4d9a14d9fc1", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "673dc87ded5ee296eaa53a99921524b833a9461fb488ec72641641bbb55b71e7", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "e49fe89500ae8d76afd8f60d3d039c011f437befe0ae3572a75948a7ae5f1c5a" } } }, "sortedMiddleware": ["/"] };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/auth/callback/route": "/auth/callback", "/api/ai-assistant/route": "/api/ai-assistant", "/page": "/", "/api/ai-categorize/route": "/api/ai-categorize", "/(dashboard)/categories/page": "/categories", "/(dashboard)/budgets/page": "/budgets", "/(dashboard)/insights/page": "/insights", "/(dashboard)/dashboard/page": "/dashboard", "/(dashboard)/portfolio/page": "/portfolio", "/(dashboard)/accounts/page": "/accounts", "/(auth)/login/page": "/login", "/(auth)/signup/page": "/signup", "/(dashboard)/settings/page": "/settings", "/(dashboard)/recurring/page": "/recurring", "/(dashboard)/transactions/page": "/transactions", "/(auth)/reset-password/page": "/reset-password", "/api/cron/process-recurring/route": "/api/cron/process-recurring" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/api/cron/process-recurring": {} } };
var PagesManifest = { "/_app": "pages/_app.js", "/_error": "pages/_error.js", "/_document": "pages/_document.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream2 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: constructNextUrl(internalEvent.url, `/${detectedLocale}`)
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (host) {
    return pattern.test(url) && !url.includes(host);
  }
  return pattern.test(url);
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream2({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
async function computeCacheControl(path3, body, host, revalidate, lastModified) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest.routes).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  if (finalRevalidate !== CACHE_ONE_YEAR) {
    const sMaxAge = Math.max(finalRevalidate - age, 1);
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate
    });
    const isStale = sMaxAge === 1;
    if (isStale) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
async function generateResult(event, localizedPath, cachedValue, lastModified) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  switch (cachedValue.type) {
    case "app":
      isDataRequest = Boolean(event.headers.rsc);
      body = isDataRequest ? cachedValue.rsc : cachedValue.html;
      type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
      break;
    case "page":
      isDataRequest = Boolean(event.query.__nextDataReq);
      body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
      type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
      break;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest.routes).includes(localizedPath ?? "/") || Object.values(PrerenderManifest.dynamicRoutes).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const tags = getTagsFromValue(cachedData.value);
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes, routes } = prerenderManifest;
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest.preview.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
