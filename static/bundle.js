(() => {
  // node_modules/delegate-it/delegate.js
  var ledger = /* @__PURE__ */ new WeakMap();
  function editLedger(wanted, baseElement, callback, setup) {
    if (!wanted && !ledger.has(baseElement)) {
      return false;
    }
    const elementMap = ledger.get(baseElement) ?? /* @__PURE__ */ new WeakMap();
    ledger.set(baseElement, elementMap);
    const setups = elementMap.get(callback) ?? /* @__PURE__ */ new Set();
    elementMap.set(callback, setups);
    const existed = setups.has(setup);
    if (wanted) {
      setups.add(setup);
    } else {
      setups.delete(setup);
    }
    return existed && wanted;
  }
  function safeClosest(event, selector) {
    let target = event.target;
    if (target instanceof Text) {
      target = target.parentElement;
    }
    if (target instanceof Element && event.currentTarget instanceof Node) {
      const closest = target.closest(selector);
      if (closest && event.currentTarget.contains(closest)) {
        return closest;
      }
    }
  }
  function delegate(selector, type, callback, options = {}) {
    const { signal, base = document } = options;
    if (signal?.aborted) {
      return;
    }
    const { once, ...nativeListenerOptions } = options;
    const baseElement = base instanceof Document ? base.documentElement : base;
    const capture = Boolean(typeof options === "object" ? options.capture : options);
    const listenerFunction = (event) => {
      const delegateTarget = safeClosest(event, String(selector));
      if (delegateTarget) {
        const delegateEvent = Object.assign(event, { delegateTarget });
        callback.call(baseElement, delegateEvent);
        if (once) {
          baseElement.removeEventListener(type, listenerFunction, nativeListenerOptions);
          editLedger(false, baseElement, callback, setup);
        }
      }
    };
    const setup = JSON.stringify({ selector, type, capture });
    const isAlreadyListening = editLedger(true, baseElement, callback, setup);
    if (!isAlreadyListening) {
      baseElement.addEventListener(type, listenerFunction, nativeListenerOptions);
    }
    signal?.addEventListener("abort", () => {
      editLedger(false, baseElement, callback, setup);
    });
  }
  var delegate_default = delegate;

  // node_modules/swup/dist/Swup.modern.js
  function i() {
    return i = Object.assign ? Object.assign.bind() : function(t) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var i3 = arguments[e2];
        for (var s2 in i3) ({}).hasOwnProperty.call(i3, s2) && (t[s2] = i3[s2]);
      }
      return t;
    }, i.apply(null, arguments);
  }
  var s = (t, e2) => String(t).toLowerCase().replace(/[\s/_.]+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+|-+$/g, "") || e2 || "";
  var n = ({ hash: t } = {}) => window.location.pathname + window.location.search + (t ? window.location.hash : "");
  var o = (t, e2 = {}) => {
    const s2 = i({ url: t = t || n({ hash: true }), random: Math.random(), source: "swup" }, e2);
    window.history.pushState(s2, "", t);
  };
  var r = (t = null, e2 = {}) => {
    t = t || n({ hash: true });
    const s2 = i({}, window.history.state || {}, { url: t, random: Math.random(), source: "swup" }, e2);
    window.history.replaceState(s2, "", t);
  };
  var a = (e2, s2, n4, o3) => {
    const r4 = new AbortController();
    return o3 = i({}, o3, { signal: r4.signal }), delegate_default(e2, s2, n4, o3), { destroy: () => r4.abort() };
  };
  var l = class _l extends URL {
    constructor(t, e2 = document.baseURI) {
      super(t.toString(), e2), Object.setPrototypeOf(this, _l.prototype);
    }
    get url() {
      return this.pathname + this.search;
    }
    static fromElement(t) {
      const e2 = t.getAttribute("href") || t.getAttribute("xlink:href") || "";
      return new _l(e2);
    }
    static fromUrl(t) {
      return new _l(t);
    }
  };
  var c = class extends Error {
    constructor(t, e2) {
      super(t), this.url = void 0, this.status = void 0, this.aborted = void 0, this.timedOut = void 0, this.name = "FetchError", this.url = e2.url, this.status = e2.status, this.aborted = e2.aborted || false, this.timedOut = e2.timedOut || false;
    }
  };
  async function u(t, e2 = {}) {
    var s2;
    t = l.fromUrl(t).url;
    const { visit: n4 = this.visit } = e2, o3 = i({}, this.options.requestHeaders, e2.headers), r4 = null != (s2 = e2.timeout) ? s2 : this.options.timeout, a3 = new AbortController(), { signal: h } = a3;
    e2 = i({}, e2, { headers: o3, signal: h });
    let u2, d2 = false, p2 = null;
    r4 && r4 > 0 && (p2 = setTimeout(() => {
      d2 = true, a3.abort("timeout");
    }, r4));
    try {
      u2 = await this.hooks.call("fetch:request", n4, { url: t, options: e2 }, (t2, { url: e3, options: i3 }) => fetch(e3, i3)), p2 && clearTimeout(p2);
    } catch (e3) {
      if (d2) throw this.hooks.call("fetch:timeout", n4, { url: t }), new c(`Request timed out: ${t}`, { url: t, timedOut: d2 });
      if ("AbortError" === (null == e3 ? void 0 : e3.name) || h.aborted) throw new c(`Request aborted: ${t}`, { url: t, aborted: true });
      throw e3;
    }
    const { status: m2, url: w2 } = u2, f2 = await u2.text();
    if (500 === m2) throw this.hooks.call("fetch:error", n4, { status: m2, response: u2, url: w2 }), new c(`Server error: ${w2}`, { status: m2, url: w2 });
    if (!f2) throw new c(`Empty response: ${w2}`, { status: m2, url: w2 });
    const { url: g2 } = l.fromUrl(w2), v = { url: g2, html: f2 };
    return !n4.cache.write || e2.method && "GET" !== e2.method || t !== g2 || this.cache.set(v.url, v), v;
  }
  var d = class {
    constructor(t) {
      this.swup = void 0, this.pages = /* @__PURE__ */ new Map(), this.swup = t;
    }
    get size() {
      return this.pages.size;
    }
    get all() {
      const t = /* @__PURE__ */ new Map();
      return this.pages.forEach((e2, s2) => {
        t.set(s2, i({}, e2));
      }), t;
    }
    has(t) {
      return this.pages.has(this.resolve(t));
    }
    get(t) {
      const e2 = this.pages.get(this.resolve(t));
      return e2 ? i({}, e2) : e2;
    }
    set(t, e2) {
      e2 = i({}, e2, { url: t = this.resolve(t) }), this.pages.set(t, e2), this.swup.hooks.callSync("cache:set", void 0, { page: e2 });
    }
    update(t, e2) {
      t = this.resolve(t);
      const s2 = i({}, this.get(t), e2, { url: t });
      this.pages.set(t, s2);
    }
    delete(t) {
      this.pages.delete(this.resolve(t));
    }
    clear() {
      this.pages.clear(), this.swup.hooks.callSync("cache:clear", void 0, void 0);
    }
    prune(t) {
      this.pages.forEach((e2, i3) => {
        t(i3, e2) && this.delete(i3);
      });
    }
    resolve(t) {
      const { url: e2 } = l.fromUrl(t);
      return this.swup.resolveUrl(e2);
    }
  };
  var p = (t, e2 = document) => e2.querySelector(t);
  var m = (t, e2 = document) => Array.from(e2.querySelectorAll(t));
  var w = () => new Promise((t) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        t();
      });
    });
  });
  function f(t) {
    return !!t && ("object" == typeof t || "function" == typeof t) && "function" == typeof t.then;
  }
  function g(t, e2 = []) {
    return new Promise((i3, s2) => {
      const n4 = t(...e2);
      f(n4) ? n4.then(i3, s2) : i3(n4);
    });
  }
  function y(t, e2) {
    const i3 = null == t ? void 0 : t.closest(`[${e2}]`);
    return null != i3 && i3.hasAttribute(e2) ? (null == i3 ? void 0 : i3.getAttribute(e2)) || true : void 0;
  }
  var k = class {
    constructor(t) {
      this.swup = void 0, this.swupClasses = ["to-", "is-changing", "is-rendering", "is-popstate", "is-animating", "is-leaving"], this.swup = t;
    }
    get selectors() {
      const { scope: t } = this.swup.visit.animation;
      return "containers" === t ? this.swup.visit.containers : "html" === t ? ["html"] : Array.isArray(t) ? t : [];
    }
    get selector() {
      return this.selectors.join(",");
    }
    get targets() {
      return this.selector.trim() ? m(this.selector) : [];
    }
    add(...t) {
      this.targets.forEach((e2) => e2.classList.add(...t));
    }
    remove(...t) {
      this.targets.forEach((e2) => e2.classList.remove(...t));
    }
    clear() {
      this.targets.forEach((t) => {
        const e2 = t.className.split(" ").filter((t2) => this.isSwupClass(t2));
        t.classList.remove(...e2);
      });
    }
    isSwupClass(t) {
      return this.swupClasses.some((e2) => t.startsWith(e2));
    }
  };
  var b = class {
    constructor(t, e2) {
      this.id = void 0, this.state = void 0, this.from = void 0, this.to = void 0, this.containers = void 0, this.animation = void 0, this.trigger = void 0, this.cache = void 0, this.history = void 0, this.scroll = void 0, this.meta = void 0;
      const { to: i3, from: s2, hash: n4, el: o3, event: r4 } = e2;
      this.id = Math.random(), this.state = 1, this.from = { url: null != s2 ? s2 : t.location.url, hash: t.location.hash }, this.to = { url: i3, hash: n4 }, this.containers = t.options.containers, this.animation = { animate: true, wait: false, name: void 0, native: t.options.native, scope: t.options.animationScope, selector: t.options.animationSelector }, this.trigger = { el: o3, event: r4 }, this.cache = { read: t.options.cache, write: t.options.cache }, this.history = { action: "push", popstate: false, direction: void 0 }, this.scroll = { reset: true, target: void 0 }, this.meta = {};
    }
    advance(t) {
      this.state < t && (this.state = t);
    }
    abort() {
      this.state = 8;
    }
    get done() {
      return this.state >= 7;
    }
  };
  function S(t) {
    return new b(this, t);
  }
  var E = class {
    constructor(t) {
      this.swup = void 0, this.registry = /* @__PURE__ */ new Map(), this.hooks = ["animation:out:start", "animation:out:await", "animation:out:end", "animation:in:start", "animation:in:await", "animation:in:end", "animation:skip", "cache:clear", "cache:set", "content:replace", "content:scroll", "enable", "disable", "fetch:request", "fetch:error", "fetch:timeout", "history:popstate", "link:click", "link:self", "link:anchor", "link:newtab", "page:load", "page:view", "scroll:top", "scroll:anchor", "visit:start", "visit:transition", "visit:abort", "visit:end"], this.swup = t, this.init();
    }
    init() {
      this.hooks.forEach((t) => this.create(t));
    }
    create(t) {
      this.registry.has(t) || this.registry.set(t, /* @__PURE__ */ new Map());
    }
    exists(t) {
      return this.registry.has(t);
    }
    get(t) {
      const e2 = this.registry.get(t);
      if (e2) return e2;
      console.error(`Unknown hook '${t}'`);
    }
    clear() {
      this.registry.forEach((t) => t.clear());
    }
    on(t, e2, s2 = {}) {
      const n4 = this.get(t);
      if (!n4) return console.warn(`Hook '${t}' not found.`), () => {
      };
      const o3 = i({}, s2, { id: n4.size + 1, hook: t, handler: e2 });
      return n4.set(e2, o3), () => this.off(t, e2);
    }
    before(t, e2, s2 = {}) {
      return this.on(t, e2, i({}, s2, { before: true }));
    }
    replace(t, e2, s2 = {}) {
      return this.on(t, e2, i({}, s2, { replace: true }));
    }
    once(t, e2, s2 = {}) {
      return this.on(t, e2, i({}, s2, { once: true }));
    }
    off(t, e2) {
      const i3 = this.get(t);
      i3 && e2 ? i3.delete(e2) || console.warn(`Handler for hook '${t}' not found.`) : i3 && i3.clear();
    }
    async call(t, e2, i3, s2) {
      const [n4, o3, r4] = this.parseCallArgs(t, e2, i3, s2), { before: a3, handler: l3, after: h } = this.getHandlers(t, r4);
      await this.run(a3, n4, o3);
      const [c2] = await this.run(l3, n4, o3, true);
      return await this.run(h, n4, o3), this.dispatchDomEvent(t, n4, o3), c2;
    }
    callSync(t, e2, i3, s2) {
      const [n4, o3, r4] = this.parseCallArgs(t, e2, i3, s2), { before: a3, handler: l3, after: h } = this.getHandlers(t, r4);
      this.runSync(a3, n4, o3);
      const [c2] = this.runSync(l3, n4, o3, true);
      return this.runSync(h, n4, o3), this.dispatchDomEvent(t, n4, o3), c2;
    }
    parseCallArgs(t, e2, i3, s2) {
      return e2 instanceof b || "object" != typeof e2 && "function" != typeof i3 ? [e2, i3, s2] : [void 0, e2, i3];
    }
    async run(t, e2 = this.swup.visit, i3, s2 = false) {
      const n4 = [];
      for (const { hook: o3, handler: r4, defaultHandler: a3, once: l3 } of t) if (null == e2 || !e2.done) {
        l3 && this.off(o3, r4);
        try {
          const t2 = await g(r4, [e2, i3, a3]);
          n4.push(t2);
        } catch (t2) {
          if (s2) throw t2;
          console.error(`Error in hook '${o3}':`, t2);
        }
      }
      return n4;
    }
    runSync(t, e2 = this.swup.visit, i3, s2 = false) {
      const n4 = [];
      for (const { hook: o3, handler: r4, defaultHandler: a3, once: l3 } of t) if (null == e2 || !e2.done) {
        l3 && this.off(o3, r4);
        try {
          const t2 = r4(e2, i3, a3);
          n4.push(t2), f(t2) && console.warn(`Swup will not await Promises in handler for synchronous hook '${o3}'.`);
        } catch (t2) {
          if (s2) throw t2;
          console.error(`Error in hook '${o3}':`, t2);
        }
      }
      return n4;
    }
    getHandlers(t, e2) {
      const i3 = this.get(t);
      if (!i3) return { found: false, before: [], handler: [], after: [], replaced: false };
      const s2 = Array.from(i3.values()), n4 = this.sortRegistrations, o3 = s2.filter(({ before: t2, replace: e3 }) => t2 && !e3).sort(n4), r4 = s2.filter(({ replace: t2 }) => t2).filter((t2) => true).sort(n4), a3 = s2.filter(({ before: t2, replace: e3 }) => !t2 && !e3).sort(n4), l3 = r4.length > 0;
      let h = [];
      if (e2 && (h = [{ id: 0, hook: t, handler: e2 }], l3)) {
        const i4 = r4.length - 1, { handler: s3, once: n5 } = r4[i4], o4 = (t2) => {
          const i5 = r4[t2 - 1];
          return i5 ? (e3, s4) => i5.handler(e3, s4, o4(t2 - 1)) : e2;
        };
        h = [{ id: 0, hook: t, once: n5, handler: s3, defaultHandler: o4(i4) }];
      }
      return { found: true, before: o3, handler: h, after: a3, replaced: l3 };
    }
    sortRegistrations(t, e2) {
      var i3, s2;
      return (null != (i3 = t.priority) ? i3 : 0) - (null != (s2 = e2.priority) ? s2 : 0) || t.id - e2.id || 0;
    }
    dispatchDomEvent(t, e2, i3) {
      if (null != e2 && e2.done) return;
      const s2 = { hook: t, args: i3, visit: e2 || this.swup.visit };
      document.dispatchEvent(new CustomEvent("swup:any", { detail: s2, bubbles: true })), document.dispatchEvent(new CustomEvent(`swup:${t}`, { detail: s2, bubbles: true }));
    }
    parseName(t) {
      const [e2, ...s2] = t.split(".");
      return [e2, s2.reduce((t2, e3) => i({}, t2, { [e3]: true }), {})];
    }
  };
  var C = (t) => {
    if (t && "#" === t.charAt(0) && (t = t.substring(1)), !t) return null;
    const e2 = decodeURIComponent(t);
    let i3 = document.getElementById(t) || document.getElementById(e2) || p(`a[name='${CSS.escape(t)}']`) || p(`a[name='${CSS.escape(e2)}']`);
    return i3 || "top" !== t || (i3 = document.body), i3;
  };
  var U = "transition";
  var P = "animation";
  async function $({ selector: t, elements: e2 }) {
    if (false === t && !e2) return;
    let i3 = [];
    if (e2) i3 = Array.from(e2);
    else if (t && (i3 = m(t, document.body), !i3.length)) return void console.warn(`[swup] No elements found matching animationSelector \`${t}\``);
    const s2 = i3.map((t2) => (function(t3) {
      const { type: e3, timeout: i4, propCount: s3 } = (function(t4) {
        const e4 = window.getComputedStyle(t4), i5 = A(e4, `${U}Delay`), s4 = A(e4, `${U}Duration`), n4 = x(i5, s4), o3 = A(e4, `${P}Delay`), r4 = A(e4, `${P}Duration`), a3 = x(o3, r4), l3 = Math.max(n4, a3), h = l3 > 0 ? n4 > a3 ? U : P : null;
        return { type: h, timeout: l3, propCount: h ? h === U ? s4.length : r4.length : 0 };
      })(t3);
      return !(!e3 || !i4) && new Promise((n4) => {
        const o3 = `${e3}end`, r4 = performance.now();
        let a3 = 0;
        const l3 = () => {
          t3.removeEventListener(o3, h), n4();
        }, h = (e4) => {
          e4.target === t3 && ((performance.now() - r4) / 1e3 < e4.elapsedTime || ++a3 >= s3 && l3());
        };
        setTimeout(() => {
          a3 < s3 && l3();
        }, i4 + 1), t3.addEventListener(o3, h);
      });
    })(t2));
    s2.filter(Boolean).length > 0 ? await Promise.all(s2) : t && console.warn(`[swup] No CSS animation duration defined on elements matching \`${t}\``);
  }
  function A(t, e2) {
    return (t[e2] || "").split(", ");
  }
  function x(t, e2) {
    for (; t.length < e2.length; ) t = t.concat(t);
    return Math.max(...e2.map((e3, i3) => H(e3) + H(t[i3])));
  }
  function H(t) {
    return 1e3 * parseFloat(t);
  }
  function V(t, e2 = {}, s2 = {}) {
    if ("string" != typeof t) throw new Error("swup.navigate() requires a URL parameter");
    if (this.shouldIgnoreVisit(t, { el: s2.el, event: s2.event })) return void window.location.assign(t);
    const { url: n4, hash: o3 } = l.fromUrl(t), r4 = this.createVisit(i({}, s2, { to: n4, hash: o3 }));
    this.performNavigation(r4, e2);
  }
  async function I(t, e2 = {}) {
    if (this.navigating) {
      if (this.visit.state >= 6) return t.state = 2, void (this.onVisitEnd = () => this.performNavigation(t, e2));
      await this.hooks.call("visit:abort", this.visit, void 0), delete this.visit.to.document, this.visit.state = 8;
    }
    this.navigating = true, this.visit = t;
    const { el: i3 } = t.trigger;
    e2.referrer = e2.referrer || this.location.url, false === e2.animate && (t.animation.animate = false), t.animation.animate || this.classes.clear();
    const n4 = e2.history || y(i3, "data-swup-history");
    "string" == typeof n4 && ["push", "replace"].includes(n4) && (t.history.action = n4);
    const a3 = e2.animation || y(i3, "data-swup-animation");
    var h, c2;
    "string" == typeof a3 && (t.animation.name = a3), t.meta = e2.meta || {}, "object" == typeof e2.cache ? (t.cache.read = null != (h = e2.cache.read) ? h : t.cache.read, t.cache.write = null != (c2 = e2.cache.write) ? c2 : t.cache.write) : void 0 !== e2.cache && (t.cache = { read: !!e2.cache, write: !!e2.cache }), delete e2.cache;
    try {
      await this.hooks.call("visit:start", t, void 0), t.state = 3;
      const i4 = this.hooks.call("page:load", t, { options: e2 }, async (t2, e3) => {
        let i5;
        return t2.cache.read && (i5 = this.cache.get(t2.to.url)), e3.page = i5 || await this.fetchPage(t2.to.url, e3.options), e3.cache = !!i5, e3.page;
      });
      i4.then(({ html: e3 }) => {
        t.advance(5), t.to.html = e3, t.to.document = new DOMParser().parseFromString(e3, "text/html");
      });
      const n5 = t.to.url + t.to.hash;
      if (t.history.popstate || ("replace" === t.history.action || t.to.url === this.location.url ? r(n5) : (this.currentHistoryIndex++, o(n5, { index: this.currentHistoryIndex }))), this.location = l.fromUrl(n5), t.history.popstate && this.classes.add("is-popstate"), t.animation.name && this.classes.add(`to-${s(t.animation.name)}`), t.animation.wait && await i4, t.done) return;
      if (await this.hooks.call("visit:transition", t, void 0, async () => {
        if (!t.animation.animate) return await this.hooks.call("animation:skip", void 0), void await this.renderPage(t, await i4);
        t.advance(4), await this.animatePageOut(t), t.animation.native && document.startViewTransition ? await document.startViewTransition(async () => await this.renderPage(t, await i4)).finished : await this.renderPage(t, await i4), await this.animatePageIn(t);
      }), t.done) return;
      await this.hooks.call("visit:end", t, void 0, () => this.classes.clear()), t.state = 7, this.navigating = false, this.onVisitEnd && (this.onVisitEnd(), this.onVisitEnd = void 0);
    } catch (e3) {
      if (!e3 || null != e3 && e3.aborted) return void (t.state = 8);
      t.state = 9, console.error(e3), this.options.skipPopStateHandling = () => (window.location.assign(t.to.url + t.to.hash), true), window.history.back();
    } finally {
      delete t.to.document;
    }
  }
  var L = async function(t) {
    await this.hooks.call("animation:out:start", t, void 0, () => {
      this.classes.add("is-changing", "is-animating", "is-leaving");
    }), await this.hooks.call("animation:out:await", t, { skip: false }, (t2, { skip: e2 }) => {
      if (!e2) return this.awaitAnimations({ selector: t2.animation.selector });
    }), await this.hooks.call("animation:out:end", t, void 0);
  };
  var q = function(t) {
    var e2;
    const i3 = t.to.document;
    if (!i3) return false;
    const s2 = (null == (e2 = i3.querySelector("title")) ? void 0 : e2.innerText) || "";
    document.title = s2;
    const n4 = m('[data-swup-persist]:not([data-swup-persist=""])'), o3 = t.containers.map((t2) => {
      const e3 = document.querySelector(t2), s3 = i3.querySelector(t2);
      return e3 && s3 ? (e3.replaceWith(s3.cloneNode(true)), true) : (e3 || console.warn(`[swup] Container missing in current document: ${t2}`), s3 || console.warn(`[swup] Container missing in incoming document: ${t2}`), false);
    }).filter(Boolean);
    return n4.forEach((t2) => {
      const e3 = t2.getAttribute("data-swup-persist"), i4 = p(`[data-swup-persist="${e3}"]`);
      i4 && i4 !== t2 && i4.replaceWith(t2);
    }), o3.length === t.containers.length;
  };
  var R = function(t) {
    const e2 = { behavior: "auto" }, { target: s2, reset: n4 } = t.scroll, o3 = null != s2 ? s2 : t.to.hash;
    let r4 = false;
    return o3 && (r4 = this.hooks.callSync("scroll:anchor", t, { hash: o3, options: e2 }, (t2, { hash: e3, options: i3 }) => {
      const s3 = this.getAnchorElement(e3);
      return s3 && s3.scrollIntoView(i3), !!s3;
    })), n4 && !r4 && (r4 = this.hooks.callSync("scroll:top", t, { options: e2 }, (t2, { options: e3 }) => (window.scrollTo(i({ top: 0, left: 0 }, e3)), true))), r4;
  };
  var T = async function(t) {
    if (t.done) return;
    const e2 = this.hooks.call("animation:in:await", t, { skip: false }, (t2, { skip: e3 }) => {
      if (!e3) return this.awaitAnimations({ selector: t2.animation.selector });
    });
    await w(), await this.hooks.call("animation:in:start", t, void 0, () => {
      this.classes.remove("is-animating");
    }), await e2, await this.hooks.call("animation:in:end", t, void 0);
  };
  var N = async function(t, e2) {
    if (t.done) return;
    t.advance(6);
    const { url: i3 } = e2;
    this.isSameResolvedUrl(n(), i3) || (r(i3), this.location = l.fromUrl(i3), t.to.url = this.location.url, t.to.hash = this.location.hash), await this.hooks.call("content:replace", t, { page: e2 }, (t2, {}) => {
      if (this.classes.remove("is-leaving"), t2.animation.animate && this.classes.add("is-rendering"), !this.replaceContent(t2)) throw new Error("[swup] Container mismatch, aborting");
      t2.animation.animate && (this.classes.add("is-changing", "is-animating", "is-rendering"), t2.animation.name && this.classes.add(`to-${s(t2.animation.name)}`));
    }), await this.hooks.call("content:scroll", t, void 0, () => this.scrollToContent(t)), await this.hooks.call("page:view", t, { url: this.location.url, title: document.title });
  };
  var O = function(t) {
    var e2;
    if (e2 = t, Boolean(null == e2 ? void 0 : e2.isSwupPlugin)) {
      if (t.swup = this, !t._checkRequirements || t._checkRequirements()) return t._beforeMount && t._beforeMount(), t.mount(), this.plugins.push(t), this.plugins;
    } else console.error("Not a swup plugin instance", t);
  };
  function D(t) {
    const e2 = this.findPlugin(t);
    if (e2) return e2.unmount(), e2._afterUnmount && e2._afterUnmount(), this.plugins = this.plugins.filter((t2) => t2 !== e2), this.plugins;
    console.error("No such plugin", e2);
  }
  function M(t) {
    return this.plugins.find((e2) => e2 === t || e2.name === t || e2.name === `Swup${String(t)}`);
  }
  function W(t) {
    if ("function" != typeof this.options.resolveUrl) return console.warn("[swup] options.resolveUrl expects a callback function."), t;
    const e2 = this.options.resolveUrl(t);
    return e2 && "string" == typeof e2 ? e2.startsWith("//") || e2.startsWith("http") ? (console.warn("[swup] options.resolveUrl needs to return a relative url"), t) : e2 : (console.warn("[swup] options.resolveUrl needs to return a url"), t);
  }
  function B(t, e2) {
    return this.resolveUrl(t) === this.resolveUrl(e2);
  }
  var j = { animateHistoryBrowsing: false, animationSelector: '[class*="transition-"]', animationScope: "html", cache: true, containers: ["#swup"], hooks: {}, ignoreVisit: (t, { el: e2 } = {}) => !(null == e2 || !e2.closest("[data-no-swup]")), linkSelector: "a[href]", linkToSelf: "scroll", native: false, plugins: [], resolveUrl: (t) => t, requestHeaders: { "X-Requested-With": "swup", Accept: "text/html, application/xhtml+xml" }, skipPopStateHandling: (t) => {
    var e2;
    return "swup" !== (null == (e2 = t.state) ? void 0 : e2.source);
  }, timeout: 0 };
  var _ = class {
    get currentPageUrl() {
      return this.location.url;
    }
    constructor(t = {}) {
      var e2, s2;
      this.version = "4.8.3", this.options = void 0, this.defaults = j, this.plugins = [], this.visit = void 0, this.cache = void 0, this.hooks = void 0, this.classes = void 0, this.location = l.fromUrl(window.location.href), this.currentHistoryIndex = void 0, this.clickDelegate = void 0, this.navigating = false, this.onVisitEnd = void 0, this.use = O, this.unuse = D, this.findPlugin = M, this.log = () => {
      }, this.navigate = V, this.performNavigation = I, this.createVisit = S, this.delegateEvent = a, this.fetchPage = u, this.awaitAnimations = $, this.renderPage = N, this.replaceContent = q, this.animatePageIn = T, this.animatePageOut = L, this.scrollToContent = R, this.getAnchorElement = C, this.getCurrentUrl = n, this.resolveUrl = W, this.isSameResolvedUrl = B, this.options = i({}, this.defaults, t), this.handleLinkClick = this.handleLinkClick.bind(this), this.handlePopState = this.handlePopState.bind(this), this.cache = new d(this), this.classes = new k(this), this.hooks = new E(this), this.visit = this.createVisit({ to: "" }), this.currentHistoryIndex = null != (e2 = null == (s2 = window.history.state) ? void 0 : s2.index) ? e2 : 1, this.enable();
    }
    async enable() {
      var t;
      const { linkSelector: e2 } = this.options;
      this.clickDelegate = this.delegateEvent(e2, "click", this.handleLinkClick), window.addEventListener("popstate", this.handlePopState), this.options.animateHistoryBrowsing && (window.history.scrollRestoration = "manual"), this.options.native = this.options.native && !!document.startViewTransition, this.options.plugins.forEach((t2) => this.use(t2));
      for (const [t2, e3] of Object.entries(this.options.hooks)) {
        const [i3, s2] = this.hooks.parseName(t2);
        this.hooks.on(i3, e3, s2);
      }
      "swup" !== (null == (t = window.history.state) ? void 0 : t.source) && r(null, { index: this.currentHistoryIndex }), await w(), await this.hooks.call("enable", void 0, void 0, () => {
        const t2 = document.documentElement;
        t2.classList.add("swup-enabled"), t2.classList.toggle("swup-native", this.options.native);
      });
    }
    async destroy() {
      this.clickDelegate.destroy(), window.removeEventListener("popstate", this.handlePopState), this.cache.clear(), this.options.plugins.forEach((t) => this.unuse(t)), await this.hooks.call("disable", void 0, void 0, () => {
        const t = document.documentElement;
        t.classList.remove("swup-enabled"), t.classList.remove("swup-native");
      }), this.hooks.clear();
    }
    shouldIgnoreVisit(t, { el: e2, event: i3 } = {}) {
      const { origin: s2, url: n4, hash: o3 } = l.fromUrl(t);
      return s2 !== window.location.origin || !(!e2 || !this.triggerWillOpenNewWindow(e2)) || !!this.options.ignoreVisit(n4 + o3, { el: e2, event: i3 });
    }
    handleLinkClick(t) {
      const e2 = t.delegateTarget, { href: i3, url: s2, hash: n4 } = l.fromElement(e2);
      if (this.shouldIgnoreVisit(i3, { el: e2, event: t })) return;
      if (this.navigating && s2 === this.visit.to.url) return void t.preventDefault();
      const o3 = this.createVisit({ to: s2, hash: n4, el: e2, event: t });
      t.metaKey || t.ctrlKey || t.shiftKey || t.altKey ? this.hooks.callSync("link:newtab", o3, { href: i3 }) : 0 === t.button && this.hooks.callSync("link:click", o3, { el: e2, event: t }, () => {
        var e3;
        const i4 = null != (e3 = o3.from.url) ? e3 : "";
        t.preventDefault(), s2 && s2 !== i4 ? this.isSameResolvedUrl(s2, i4) || this.performNavigation(o3) : n4 ? this.hooks.callSync("link:anchor", o3, { hash: n4 }, () => {
          r(s2 + n4), this.scrollToContent(o3);
        }) : this.hooks.callSync("link:self", o3, void 0, () => {
          "navigate" === this.options.linkToSelf ? this.performNavigation(o3) : (r(s2), this.scrollToContent(o3));
        });
      });
    }
    handlePopState(t) {
      var e2, i3, s2, o3;
      const r4 = null != (e2 = null == (i3 = t.state) ? void 0 : i3.url) ? e2 : window.location.href;
      if (this.options.skipPopStateHandling(t)) return;
      if (this.isSameResolvedUrl(n(), this.location.url)) return;
      const { url: a3, hash: h } = l.fromUrl(r4), c2 = this.createVisit({ to: a3, hash: h, event: t });
      c2.history.popstate = true;
      const u2 = null != (s2 = null == (o3 = t.state) ? void 0 : o3.index) ? s2 : 0;
      u2 && u2 !== this.currentHistoryIndex && (c2.history.direction = u2 - this.currentHistoryIndex > 0 ? "forwards" : "backwards", this.currentHistoryIndex = u2), c2.animation.animate = false, c2.scroll.reset = false, c2.scroll.target = false, this.options.animateHistoryBrowsing && (c2.animation.animate = true, c2.scroll.reset = true), this.hooks.callSync("history:popstate", c2, { event: t }, () => {
        this.performNavigation(c2);
      });
    }
    triggerWillOpenNewWindow(t) {
      return !!t.matches('[download], [target="_blank"]');
    }
  };

  // node_modules/@swup/plugin/dist/index.modern.js
  function r2() {
    return r2 = Object.assign ? Object.assign.bind() : function(r4) {
      for (var n4 = 1; n4 < arguments.length; n4++) {
        var e2 = arguments[n4];
        for (var t in e2) Object.prototype.hasOwnProperty.call(e2, t) && (r4[t] = e2[t]);
      }
      return r4;
    }, r2.apply(this, arguments);
  }
  var n2 = (r4) => String(r4).split(".").map((r5) => String(parseInt(r5 || "0", 10))).concat(["0", "0"]).slice(0, 3).join(".");
  var e = class {
    constructor() {
      this.isSwupPlugin = true, this.swup = void 0, this.version = void 0, this.requires = {}, this.handlersToUnregister = [];
    }
    mount() {
    }
    unmount() {
      this.handlersToUnregister.forEach((r4) => r4()), this.handlersToUnregister = [];
    }
    _beforeMount() {
      if (!this.name) throw new Error("You must define a name of plugin when creating a class.");
    }
    _afterUnmount() {
    }
    _checkRequirements() {
      return "object" != typeof this.requires || Object.entries(this.requires).forEach(([r4, e2]) => {
        if (!(function(r5, e3, t) {
          const s2 = (function(r6, n4) {
            var e4;
            if ("swup" === r6) return null != (e4 = n4.version) ? e4 : "";
            {
              var t2;
              const e5 = n4.findPlugin(r6);
              return null != (t2 = null == e5 ? void 0 : e5.version) ? t2 : "";
            }
          })(r5, t);
          return !!s2 && ((r6, e4) => e4.every((e5) => {
            const [, t2, s3] = e5.match(/^([\D]+)?(.*)$/) || [];
            var o3, i3;
            return ((r7, n4) => {
              const e6 = { "": (r8) => 0 === r8, ">": (r8) => r8 > 0, ">=": (r8) => r8 >= 0, "<": (r8) => r8 < 0, "<=": (r8) => r8 <= 0 };
              return (e6[n4] || e6[""])(r7);
            })((i3 = s3, o3 = n2(o3 = r6), i3 = n2(i3), o3.localeCompare(i3, void 0, { numeric: true })), t2 || ">=");
          }))(s2, e3);
        })(r4, e2 = Array.isArray(e2) ? e2 : [e2], this.swup)) {
          const n4 = `${r4} ${e2.join(", ")}`;
          throw new Error(`Plugin version mismatch: ${this.name} requires ${n4}`);
        }
      }), true;
    }
    on(r4, n4, e2 = {}) {
      var t;
      n4 = !(t = n4).name.startsWith("bound ") || t.hasOwnProperty("prototype") ? n4.bind(this) : n4;
      const s2 = this.swup.hooks.on(r4, n4, e2);
      return this.handlersToUnregister.push(s2), s2;
    }
    once(n4, e2, t = {}) {
      return this.on(n4, e2, r2({}, t, { once: true }));
    }
    before(n4, e2, t = {}) {
      return this.on(n4, e2, r2({}, t, { before: true }));
    }
    replace(n4, e2, t = {}) {
      return this.on(n4, e2, r2({}, t, { replace: true }));
    }
    off(r4, n4) {
      return this.swup.hooks.off(r4, n4);
    }
  };

  // node_modules/@swup/preload-plugin/dist/index.modern.js
  function r3() {
    return r3 = Object.assign ? Object.assign.bind() : function(e2) {
      for (var t = 1; t < arguments.length; t++) {
        var s2 = arguments[t];
        for (var r4 in s2) ({}).hasOwnProperty.call(s2, r4) && (e2[r4] = s2[r4]);
      }
      return e2;
    }, r3.apply(null, arguments);
  }
  function o2() {
    return window.matchMedia("(hover: hover)").matches;
  }
  function i2(e2) {
    return !!e2 && (e2 instanceof HTMLAnchorElement || e2 instanceof SVGAElement);
  }
  var n3 = window.requestIdleCallback || ((e2) => setTimeout(e2, 1));
  var a2 = ["preloadVisibleLinks"];
  var l2 = class extends e {
    constructor(e2 = {}) {
      var s2;
      super(), s2 = this, this.name = "SwupPreloadPlugin", this.requires = { swup: ">=4.5" }, this.defaults = { throttle: 5, preloadInitialPage: true, preloadHoveredLinks: true, preloadVisibleLinks: { enabled: false, threshold: 0.2, delay: 500, containers: ["body"], ignore: () => false } }, this.options = void 0, this.queue = void 0, this.preloadObserver = void 0, this.preloadPromises = /* @__PURE__ */ new Map(), this.mouseEnterDelegate = void 0, this.touchStartDelegate = void 0, this.focusDelegate = void 0, this.onPageLoad = (e3, t, s3) => {
        const { url: r4 } = e3.to;
        return r4 && this.preloadPromises.has(r4) ? this.preloadPromises.get(r4) : s3(e3, t);
      }, this.onMouseEnter = async function(e3) {
        if (e3.target !== e3.delegateTarget) return;
        if (!o2()) return;
        const r4 = e3.delegateTarget;
        if (!i2(r4)) return;
        const { url: n5, hash: a3 } = l.fromElement(r4), l4 = s2.swup.createVisit({ to: n5, hash: a3, el: r4, event: e3 });
        s2.swup.hooks.callSync("link:hover", l4, { el: r4, event: e3 }), s2.preload(r4, { priority: true });
      }, this.onTouchStart = (e3) => {
        if (o2()) return;
        const t = e3.delegateTarget;
        i2(t) && this.preload(t, { priority: true });
      }, this.onFocus = (e3) => {
        const t = e3.delegateTarget;
        i2(t) && this.preload(t, { priority: true });
      };
      const { preloadVisibleLinks: n4 } = e2, l3 = (function(e3, t) {
        if (null == e3) return {};
        var s3 = {};
        for (var r4 in e3) if ({}.hasOwnProperty.call(e3, r4)) {
          if (t.includes(r4)) continue;
          s3[r4] = e3[r4];
        }
        return s3;
      })(e2, a2);
      this.options = r3({}, this.defaults, l3), "object" == typeof n4 ? this.options.preloadVisibleLinks = r3({}, this.options.preloadVisibleLinks, { enabled: true }, n4) : this.options.preloadVisibleLinks.enabled = Boolean(n4), this.preload = this.preload.bind(this), this.queue = /* @__PURE__ */ (function(e3 = 1) {
        const t = [], s3 = [];
        let r4 = 0, o3 = 0;
        function i3() {
          o3 < e3 && r4 > 0 && ((s3.shift() || t.shift() || (() => {
          }))(), r4--, o3++);
        }
        return { add: function(e4, o4 = false) {
          if (e4.__queued) {
            if (!o4) return;
            {
              const s4 = t.indexOf(e4);
              if (s4 >= 0) {
                const e5 = t.splice(s4, 1);
                r4 -= e5.length;
              }
            }
          }
          e4.__queued = true, (o4 ? s3 : t).push(e4), r4++, r4 <= 1 && i3();
        }, next: function() {
          o3--, i3();
        } };
      })(this.options.throttle);
    }
    mount() {
      const e2 = this.swup;
      e2.options.cache ? (e2.hooks.create("page:preload"), e2.hooks.create("link:hover"), e2.preload = this.preload, e2.preloadLinks = this.preloadLinks, this.replace("page:load", this.onPageLoad), this.preloadLinks(), this.on("page:view", () => this.preloadLinks()), this.options.preloadVisibleLinks.enabled && (this.preloadVisibleLinks(), this.on("page:view", () => this.preloadVisibleLinks())), this.options.preloadHoveredLinks && this.preloadLinksOnAttention(), this.options.preloadInitialPage && this.preload(n())) : console.warn("SwupPreloadPlugin: swup cache needs to be enabled for preloading");
    }
    unmount() {
      var e2, t, s2;
      this.swup.preload = void 0, this.swup.preloadLinks = void 0, this.preloadPromises.clear(), null == (e2 = this.mouseEnterDelegate) || e2.destroy(), null == (t = this.touchStartDelegate) || t.destroy(), null == (s2 = this.focusDelegate) || s2.destroy(), this.stopPreloadingVisibleLinks();
    }
    async preload(e2, s2 = {}) {
      var r4;
      let o3, n4;
      const a3 = null != (r4 = s2.priority) && r4;
      if (Array.isArray(e2)) return Promise.all(e2.map((e3) => this.preload(e3)));
      if (i2(e2)) n4 = e2, { href: o3 } = l.fromElement(e2);
      else {
        if ("string" != typeof e2) return;
        o3 = e2;
      }
      if (!o3) return;
      if (this.swup.cache.has(o3)) return this.swup.cache.get(o3);
      if (this.preloadPromises.has(o3)) return this.preloadPromises.get(o3);
      if (!this.shouldPreload(o3, { el: n4 })) return;
      const l3 = new Promise((e3) => {
        this.queue.add(() => {
          this.performPreload(o3).catch(() => {
          }).then((t) => e3(t)).finally(() => {
            this.queue.next(), this.preloadPromises.delete(o3);
          });
        }, a3);
      });
      return this.preloadPromises.set(o3, l3), l3;
    }
    preloadLinks() {
      n3(() => {
        Array.from(document.querySelectorAll("a[data-swup-preload], [data-swup-preload-all] a")).forEach((e2) => this.preload(e2));
      });
    }
    preloadLinksOnAttention() {
      const { swup: e2 } = this, { linkSelector: t } = e2.options, s2 = { passive: true, capture: true };
      this.mouseEnterDelegate = e2.delegateEvent(t, "mouseenter", this.onMouseEnter, s2), this.touchStartDelegate = e2.delegateEvent(t, "touchstart", this.onTouchStart, s2), this.focusDelegate = e2.delegateEvent(t, "focus", this.onFocus, s2);
    }
    preloadVisibleLinks() {
      if (this.preloadObserver) return void this.preloadObserver.update();
      const { threshold: e2, delay: s2, containers: r4 } = this.options.preloadVisibleLinks;
      this.preloadObserver = (function({ threshold: e3, delay: s3, containers: r5, callback: o3, filter: i3 }) {
        const a3 = /* @__PURE__ */ new Map(), l3 = new IntersectionObserver((e4) => {
          e4.forEach((e5) => {
            e5.isIntersecting ? h(e5.target) : u2(e5.target);
          });
        }, { threshold: e3 }), h = (e4) => {
          var r6;
          const { href: i4 } = l.fromElement(e4), n4 = null != (r6 = a3.get(i4)) ? r6 : /* @__PURE__ */ new Set();
          a3.set(i4, n4), n4.add(e4), setTimeout(() => {
            const t = a3.get(i4);
            null != t && t.size && (o3(e4), l3.unobserve(e4), t.delete(e4));
          }, s3);
        }, u2 = (e4) => {
          var s4;
          const { href: r6 } = l.fromElement(e4);
          null == (s4 = a3.get(r6)) || s4.delete(e4);
        }, d2 = () => {
          n3(() => {
            const e4 = r5.map((e5) => `${e5} a[*|href]`).join(", ");
            Array.from(document.querySelectorAll(e4)).filter((e5) => i3(e5)).forEach((e5) => l3.observe(e5));
          });
        };
        return { start: () => d2(), stop: () => l3.disconnect(), update: () => (a3.clear(), d2()) };
      })({ threshold: e2, delay: s2, containers: r4, callback: (e3) => this.preload(e3), filter: (e3) => {
        if (this.options.preloadVisibleLinks.ignore(e3)) return false;
        if (!e3.matches(this.swup.options.linkSelector)) return false;
        const { href: s3 } = l.fromElement(e3);
        return this.shouldPreload(s3, { el: e3 });
      } }), this.preloadObserver.start();
    }
    stopPreloadingVisibleLinks() {
      this.preloadObserver && this.preloadObserver.stop();
    }
    shouldPreload(e2, { el: r4 } = {}) {
      const { url: o3, href: i3 } = l.fromUrl(e2);
      return !(!(function() {
        if (navigator.connection) {
          var e3;
          if (navigator.connection.saveData) return false;
          if (null != (e3 = navigator.connection.effectiveType) && e3.endsWith("2g")) return false;
        }
        return true;
      })() || this.swup.cache.has(o3) || this.preloadPromises.has(o3) || this.swup.shouldIgnoreVisit(i3, { el: r4 }) || r4 && this.swup.resolveUrl(o3) === this.swup.resolveUrl(n()));
    }
    async performPreload(e2) {
      var s2 = this;
      const { url: r4 } = l.fromUrl(e2), o3 = this.swup.createVisit({ to: r4 }), i3 = await this.swup.hooks.call("page:preload", o3, { url: r4 }, async function(t, r5) {
        return r5.page = await s2.swup.fetchPage(e2, { visit: t }), r5.page;
      });
      return i3;
    }
  };

  // static/js/main.js
  var swup = new _({
    containers: ["#swup", "#main-nav"],
    plugins: [new l2()]
  });
})();
