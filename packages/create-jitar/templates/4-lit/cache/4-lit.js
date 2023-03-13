(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload"))
    return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]'))
    i(s);
  new MutationObserver((s) => {
    for (const n of s)
      if (n.type === "childList")
        for (const r of n.addedNodes)
          r.tagName === "LINK" && r.rel === "modulepreload" && i(r);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const n = {};
    return s.integrity && (n.integrity = s.integrity), s.referrerPolicy && (n.referrerPolicy = s.referrerPolicy), s.crossOrigin === "use-credentials" ? n.credentials = "include" : s.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
  }
  function i(s) {
    if (s.ep)
      return;
    s.ep = !0;
    const n = e(s);
    fetch(s.href, n);
  }
})();
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = window, G = P.ShadowRoot && (P.ShadyCSS === void 0 || P.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Z = Symbol(), W = /* @__PURE__ */ new WeakMap();
let st = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== Z)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (G && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = W.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && W.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const at = (o) => new st(typeof o == "string" ? o : o + "", void 0, Z), dt = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, n) => i + ((r) => {
    if (r._$cssResult$ === !0)
      return r.cssText;
    if (typeof r == "number")
      return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[n + 1], o[0]);
  return new st(e, o, Z);
}, ct = (o, t) => {
  G ? o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet) : t.forEach((e) => {
    const i = document.createElement("style"), s = P.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  });
}, Y = G ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules)
    e += i.cssText;
  return at(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var L;
const x = window, V = x.trustedTypes, ut = V ? V.emptyScript : "", Q = x.reactiveElementPolyfillSupport, B = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? ut : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, ot = (o, t) => t !== o && (t == t || o == o), U = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: ot };
let g = class extends HTMLElement {
  constructor() {
    super(), this._$Ei = /* @__PURE__ */ new Map(), this.isUpdatePending = !1, this.hasUpdated = !1, this._$El = null, this.u();
  }
  static addInitializer(t) {
    var e;
    this.finalize(), ((e = this.h) !== null && e !== void 0 ? e : this.h = []).push(t);
  }
  static get observedAttributes() {
    this.finalize();
    const t = [];
    return this.elementProperties.forEach((e, i) => {
      const s = this._$Ep(i, e);
      s !== void 0 && (this._$Ev.set(s, i), t.push(s));
    }), t;
  }
  static createProperty(t, e = U) {
    if (e.state && (e.attribute = !1), this.finalize(), this.elementProperties.set(t, e), !e.noAccessor && !this.prototype.hasOwnProperty(t)) {
      const i = typeof t == "symbol" ? Symbol() : "__" + t, s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Object.defineProperty(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    return { get() {
      return this[e];
    }, set(s) {
      const n = this[t];
      this[e] = s, this.requestUpdate(t, n, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) || U;
  }
  static finalize() {
    if (this.hasOwnProperty("finalized"))
      return !1;
    this.finalized = !0;
    const t = Object.getPrototypeOf(this);
    if (t.finalize(), t.h !== void 0 && (this.h = [...t.h]), this.elementProperties = new Map(t.elementProperties), this._$Ev = /* @__PURE__ */ new Map(), this.hasOwnProperty("properties")) {
      const e = this.properties, i = [...Object.getOwnPropertyNames(e), ...Object.getOwnPropertySymbols(e)];
      for (const s of i)
        this.createProperty(s, e[s]);
    }
    return this.elementStyles = this.finalizeStyles(this.styles), !0;
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i)
        e.unshift(Y(s));
    } else
      t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Ep(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  u() {
    var t;
    this._$E_ = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$Eg(), this.requestUpdate(), (t = this.constructor.h) === null || t === void 0 || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, i;
    ((e = this._$ES) !== null && e !== void 0 ? e : this._$ES = []).push(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) === null || i === void 0 || i.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.splice(this._$ES.indexOf(t) >>> 0, 1);
  }
  _$Eg() {
    this.constructor.elementProperties.forEach((t, e) => {
      this.hasOwnProperty(e) && (this._$Ei.set(e, this[e]), delete this[e]);
    });
  }
  createRenderRoot() {
    var t;
    const e = (t = this.shadowRoot) !== null && t !== void 0 ? t : this.attachShadow(this.constructor.shadowRootOptions);
    return ct(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var t;
    this.renderRoot === void 0 && (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) === null || i === void 0 ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$ES) === null || t === void 0 || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) === null || i === void 0 ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$EO(t, e, i = U) {
    var s;
    const n = this.constructor._$Ep(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const r = (((s = i.converter) === null || s === void 0 ? void 0 : s.toAttribute) !== void 0 ? i.converter : B).toAttribute(e, i.type);
      this._$El = t, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$El = null;
    }
  }
  _$AK(t, e) {
    var i;
    const s = this.constructor, n = s._$Ev.get(t);
    if (n !== void 0 && this._$El !== n) {
      const r = s.getPropertyOptions(n), d = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((i = r.converter) === null || i === void 0 ? void 0 : i.fromAttribute) !== void 0 ? r.converter : B;
      this._$El = n, this[n] = d.fromAttribute(e, r.type), this._$El = null;
    }
  }
  requestUpdate(t, e, i) {
    let s = !0;
    t !== void 0 && (((i = i || this.constructor.getPropertyOptions(t)).hasChanged || ot)(this[t], e) ? (this._$AL.has(t) || this._$AL.set(t, e), i.reflect === !0 && this._$El !== t && (this._$EC === void 0 && (this._$EC = /* @__PURE__ */ new Map()), this._$EC.set(t, i))) : s = !1), !this.isUpdatePending && s && (this._$E_ = this._$Ej());
  }
  async _$Ej() {
    this.isUpdatePending = !0;
    try {
      await this._$E_;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var t;
    if (!this.isUpdatePending)
      return;
    this.hasUpdated, this._$Ei && (this._$Ei.forEach((s, n) => this[n] = s), this._$Ei = void 0);
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (t = this._$ES) === null || t === void 0 || t.forEach((s) => {
        var n;
        return (n = s.hostUpdate) === null || n === void 0 ? void 0 : n.call(s);
      }), this.update(i)) : this._$Ek();
    } catch (s) {
      throw e = !1, this._$Ek(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$ES) === null || e === void 0 || e.forEach((i) => {
      var s;
      return (s = i.hostUpdated) === null || s === void 0 ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$Ek() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$E_;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$EC !== void 0 && (this._$EC.forEach((e, i) => this._$EO(i, this[i], e)), this._$EC = void 0), this._$Ek();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
g.finalized = !0, g.elementProperties = /* @__PURE__ */ new Map(), g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, Q?.({ ReactiveElement: g }), ((L = x.reactiveElementVersions) !== null && L !== void 0 ? L : x.reactiveElementVersions = []).push("1.6.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var R;
const O = window, _ = O.trustedTypes, J = _ ? _.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, $ = `lit$${(Math.random() + "").slice(9)}$`, nt = "?" + $, pt = `<${nt}>`, y = document, w = (o = "") => y.createComment(o), C = (o) => o === null || typeof o != "object" && typeof o != "function", rt = Array.isArray, vt = (o) => rt(o) || typeof o?.[Symbol.iterator] == "function", E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, F = /-->/g, q = />/g, f = RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), K = /'/g, X = /"/g, lt = /^(?:script|style|textarea|title)$/i, $t = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), ft = $t(1), A = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), tt = /* @__PURE__ */ new WeakMap(), m = y.createTreeWalker(y, 129, null, !1), gt = (o, t) => {
  const e = o.length - 1, i = [];
  let s, n = t === 2 ? "<svg>" : "", r = E;
  for (let l = 0; l < e; l++) {
    const h = o[l];
    let v, a, c = -1, p = 0;
    for (; p < h.length && (r.lastIndex = p, a = r.exec(h), a !== null); )
      p = r.lastIndex, r === E ? a[1] === "!--" ? r = F : a[1] !== void 0 ? r = q : a[2] !== void 0 ? (lt.test(a[2]) && (s = RegExp("</" + a[2], "g")), r = f) : a[3] !== void 0 && (r = f) : r === f ? a[0] === ">" ? (r = s ?? E, c = -1) : a[1] === void 0 ? c = -2 : (c = r.lastIndex - a[2].length, v = a[1], r = a[3] === void 0 ? f : a[3] === '"' ? X : K) : r === X || r === K ? r = f : r === F || r === q ? r = E : (r = f, s = void 0);
    const T = r === f && o[l + 1].startsWith("/>") ? " " : "";
    n += r === E ? h + pt : c >= 0 ? (i.push(v), h.slice(0, c) + "$lit$" + h.slice(c) + $ + T) : h + $ + (c === -2 ? (i.push(void 0), l) : T);
  }
  const d = n + (o[e] || "<?>") + (t === 2 ? "</svg>" : "");
  if (!Array.isArray(o) || !o.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return [J !== void 0 ? J.createHTML(d) : d, i];
};
class N {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let n = 0, r = 0;
    const d = t.length - 1, l = this.parts, [h, v] = gt(t, e);
    if (this.el = N.createElement(h, i), m.currentNode = this.el.content, e === 2) {
      const a = this.el.content, c = a.firstChild;
      c.remove(), a.append(...c.childNodes);
    }
    for (; (s = m.nextNode()) !== null && l.length < d; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) {
          const a = [];
          for (const c of s.getAttributeNames())
            if (c.endsWith("$lit$") || c.startsWith($)) {
              const p = v[r++];
              if (a.push(c), p !== void 0) {
                const T = s.getAttribute(p.toLowerCase() + "$lit$").split($), j = /([.?@])?(.*)/.exec(p);
                l.push({ type: 1, index: n, name: j[2], strings: T, ctor: j[1] === "." ? _t : j[1] === "?" ? At : j[1] === "@" ? bt : I });
              } else
                l.push({ type: 6, index: n });
            }
          for (const c of a)
            s.removeAttribute(c);
        }
        if (lt.test(s.tagName)) {
          const a = s.textContent.split($), c = a.length - 1;
          if (c > 0) {
            s.textContent = _ ? _.emptyScript : "";
            for (let p = 0; p < c; p++)
              s.append(a[p], w()), m.nextNode(), l.push({ type: 2, index: ++n });
            s.append(a[c], w());
          }
        }
      } else if (s.nodeType === 8)
        if (s.data === nt)
          l.push({ type: 2, index: n });
        else {
          let a = -1;
          for (; (a = s.data.indexOf($, a + 1)) !== -1; )
            l.push({ type: 7, index: n }), a += $.length - 1;
        }
      n++;
    }
  }
  static createElement(t, e) {
    const i = y.createElement("template");
    return i.innerHTML = t, i;
  }
}
function b(o, t, e = o, i) {
  var s, n, r, d;
  if (t === A)
    return t;
  let l = i !== void 0 ? (s = e._$Co) === null || s === void 0 ? void 0 : s[i] : e._$Cl;
  const h = C(t) ? void 0 : t._$litDirective$;
  return l?.constructor !== h && ((n = l?._$AO) === null || n === void 0 || n.call(l, !1), h === void 0 ? l = void 0 : (l = new h(o), l._$AT(o, e, i)), i !== void 0 ? ((r = (d = e)._$Co) !== null && r !== void 0 ? r : d._$Co = [])[i] = l : e._$Cl = l), l !== void 0 && (t = b(o, l._$AS(o, t.values), l, i)), t;
}
class mt {
  constructor(t, e) {
    this.u = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  v(t) {
    var e;
    const { el: { content: i }, parts: s } = this._$AD, n = ((e = t?.creationScope) !== null && e !== void 0 ? e : y).importNode(i, !0);
    m.currentNode = n;
    let r = m.nextNode(), d = 0, l = 0, h = s[0];
    for (; h !== void 0; ) {
      if (d === h.index) {
        let v;
        h.type === 2 ? v = new M(r, r.nextSibling, this, t) : h.type === 1 ? v = new h.ctor(r, h.name, h.strings, this, t) : h.type === 6 && (v = new Et(r, this, t)), this.u.push(v), h = s[++l];
      }
      d !== h?.index && (r = m.nextNode(), d++);
    }
    return n;
  }
  p(t) {
    let e = 0;
    for (const i of this.u)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class M {
  constructor(t, e, i, s) {
    var n;
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cm = (n = s?.isConnected) === null || n === void 0 || n;
  }
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) === null || t === void 0 ? void 0 : t._$AU) !== null && e !== void 0 ? e : this._$Cm;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = b(this, t, e), C(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== A && this.g(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : vt(t) ? this.k(t) : this.g(t);
  }
  O(t, e = this._$AB) {
    return this._$AA.parentNode.insertBefore(t, e);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  g(t) {
    this._$AH !== u && C(this._$AH) ? this._$AA.nextSibling.data = t : this.T(y.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var e;
    const { values: i, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = N.createElement(s.h, this.options)), s);
    if (((e = this._$AH) === null || e === void 0 ? void 0 : e._$AD) === n)
      this._$AH.p(i);
    else {
      const r = new mt(n, this), d = r.v(this.options);
      r.p(i), this.T(d), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = tt.get(t.strings);
    return e === void 0 && tt.set(t.strings, e = new N(t)), e;
  }
  k(t) {
    rt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const n of t)
      s === e.length ? e.push(i = new M(this.O(w()), this.O(w()), this, this.options)) : i = e[s], i._$AI(n), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) === null || i === void 0 || i.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const s = t.nextSibling;
      t.remove(), t = s;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cm = t, (e = this._$AP) === null || e === void 0 || e.call(this, t));
  }
}
class I {
  constructor(t, e, i, s, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = u;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t, e = this, i, s) {
    const n = this.strings;
    let r = !1;
    if (n === void 0)
      t = b(this, t, e, 0), r = !C(t) || t !== this._$AH && t !== A, r && (this._$AH = t);
    else {
      const d = t;
      let l, h;
      for (t = n[0], l = 0; l < n.length - 1; l++)
        h = b(this, d[i + l], e, l), h === A && (h = this._$AH[l]), r || (r = !C(h) || h !== this._$AH[l]), h === u ? t = u : t !== u && (t += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    r && !s && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class _t extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
const yt = _ ? _.emptyScript : "";
class At extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    t && t !== u ? this.element.setAttribute(this.name, yt) : this.element.removeAttribute(this.name);
  }
}
class bt extends I {
  constructor(t, e, i, s, n) {
    super(t, e, i, s, n), this.type = 5;
  }
  _$AI(t, e = this) {
    var i;
    if ((t = (i = b(this, t, e, 0)) !== null && i !== void 0 ? i : u) === A)
      return;
    const s = this._$AH, n = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== u && (s === u || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, i;
    typeof this._$AH == "function" ? this._$AH.call((i = (e = this.options) === null || e === void 0 ? void 0 : e.host) !== null && i !== void 0 ? i : this.element, t) : this._$AH.handleEvent(t);
  }
}
class Et {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    b(this, t);
  }
}
const et = O.litHtmlPolyfillSupport;
et?.(N, M), ((R = O.litHtmlVersions) !== null && R !== void 0 ? R : O.litHtmlVersions = []).push("2.6.1");
const St = (o, t, e) => {
  var i, s;
  const n = (i = e?.renderBefore) !== null && i !== void 0 ? i : t;
  let r = n._$litPart$;
  if (r === void 0) {
    const d = (s = e?.renderBefore) !== null && s !== void 0 ? s : null;
    n._$litPart$ = r = new M(t.insertBefore(w(), d), d, void 0, e ?? {});
  }
  return r._$AI(o), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var k, z;
class S extends g {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t, e;
    const i = super.createRenderRoot();
    return (t = (e = this.renderOptions).renderBefore) !== null && t !== void 0 || (e.renderBefore = i.firstChild), i;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = St(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) === null || t === void 0 || t.setConnected(!1);
  }
  render() {
    return A;
  }
}
S.finalized = !0, S._$litElement$ = !0, (k = globalThis.litElementHydrateSupport) === null || k === void 0 || k.call(globalThis, { LitElement: S });
const it = globalThis.litElementPolyfillSupport;
it?.({ LitElement: S });
((z = globalThis.litElementVersions) !== null && z !== void 0 ? z : globalThis.litElementVersions = []).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wt = (o) => (t) => typeof t == "function" ? ((e, i) => (customElements.define(e, i), i))(o, t) : ((e, i) => {
  const { kind: s, elements: n } = i;
  return { kind: s, elements: n, finisher(r) {
    customElements.define(e, r);
  } };
})(o, t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = (o, t) => t.kind === "method" && t.descriptor && !("value" in t.descriptor) ? { ...t, finisher(e) {
  e.createProperty(t.key, o);
} } : { kind: "field", key: Symbol(), placement: "own", descriptor: {}, originalKey: t.key, initializer() {
  typeof t.initializer == "function" && (this[t.key] = t.initializer.call(this));
}, finisher(e) {
  e.createProperty(t.key, o);
} };
function Nt(o) {
  return (t, e) => e !== void 0 ? ((i, s, n) => {
    s.constructor.createProperty(n, i);
  })(o, t, e) : Ct(o, t);
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var D;
((D = window.HTMLSlotElement) === null || D === void 0 ? void 0 : D.prototype.assignedElements) != null;
const Mt = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBhcmlhLWhpZGRlbj0idHJ1ZSIgcm9sZT0iaW1nIiBjbGFzcz0iaWNvbmlmeSBpY29uaWZ5LS1sb2dvcyIgd2lkdGg9IjI1LjYiIGhlaWdodD0iMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiIHZpZXdCb3g9IjAgMCAyNTYgMzIwIj48cGF0aCBmaWxsPSIjMDBFOEZGIiBkPSJtNjQgMTkybDI1LjkyNi00NC43MjdsMzguMjMzLTE5LjExNGw2My45NzQgNjMuOTc0bDEwLjgzMyA2MS43NTRMMTkyIDMyMGwtNjQtNjRsLTM4LjA3NC0yNS42MTV6Ij48L3BhdGg+PHBhdGggZmlsbD0iIzI4MzE5OCIgZD0iTTEyOCAyNTZWMTI4bDY0LTY0djEyOGwtNjQgNjRaTTAgMjU2bDY0IDY0bDkuMjAyLTYwLjYwMkw2NCAxOTJsLTM3LjU0MiAyMy43MUwwIDI1NloiPjwvcGF0aD48cGF0aCBmaWxsPSIjMzI0RkZGIiBkPSJNNjQgMTkyVjY0bDY0LTY0djEyOGwtNjQgNjRabTEyOCAxMjhWMTkybDY0LTY0djEyOGwtNjQgNjRaTTAgMjU2VjEyOGw2NCA2NGwtNjQgNjRaIj48L3BhdGg+PHBhdGggZmlsbD0iIzBGRiIgZD0iTTY0IDMyMFYxOTJsNjQgNjR6Ij48L3BhdGg+PC9zdmc+", Tt = await import(
  /* @vite-ignore */
  "/jitar/client.js"
), jt = await Tt.getClient(), Pt = await jt.import("./shared/sayHello.js"), xt = Pt.sayHello;
var Ot = Object.defineProperty, Ht = Object.getOwnPropertyDescriptor, ht = (o, t, e, i) => {
  for (var s = i > 1 ? void 0 : i ? Ht(t, e) : t, n = o.length - 1, r; n >= 0; n--)
    (r = o[n]) && (s = (i ? r(t, e, s) : r(s)) || s);
  return i && s && Ot(t, e, s), s;
};
let H = class extends S {
  constructor() {
    super(), this.message = "", xt("Lit + Vite + Jitar").then((o) => this.message = o);
  }
  render() {
    return ft`
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://lit.dev" target="_blank">
          <img src=${Mt} class="logo lit" alt="Lit logo" />
        </a>
      </div>
      <div><h1>${this.message}</h1></div>
    `;
  }
};
H.styles = dt`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.lit:hover {
      filter: drop-shadow(0 0 2em #325cffaa);
    }

    .card {
      padding: 2em;
    }

    .read-the-docs {
      color: #888;
    }

    h1 {
      font-size: 3.2em;
      line-height: 1.1;
    }

    a {
      font-weight: 500;
      color: #646cff;
      text-decoration: inherit;
    }
    a:hover {
      color: #535bf2;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `;
ht([
  Nt({ type: String })
], H.prototype, "message", 2);
H = ht([
  wt("my-element")
], H);
