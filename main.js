"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  WardrobeStore: () => WardrobeStore,
  default: () => StyleZonePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// node_modules/yaml/browser/dist/nodes/identity.js
var ALIAS = Symbol.for("yaml.alias");
var DOC = Symbol.for("yaml.document");
var MAP = Symbol.for("yaml.map");
var PAIR = Symbol.for("yaml.pair");
var SCALAR = Symbol.for("yaml.scalar");
var SEQ = Symbol.for("yaml.seq");
var NODE_TYPE = Symbol.for("yaml.node.type");
var isAlias = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === ALIAS;
var isDocument = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === DOC;
var isMap = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === MAP;
var isPair = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === PAIR;
var isScalar = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === SCALAR;
var isSeq = (node2) => !!node2 && typeof node2 === "object" && node2[NODE_TYPE] === SEQ;
function isCollection(node2) {
  if (node2 && typeof node2 === "object")
    switch (node2[NODE_TYPE]) {
      case MAP:
      case SEQ:
        return true;
    }
  return false;
}
function isNode(node2) {
  if (node2 && typeof node2 === "object")
    switch (node2[NODE_TYPE]) {
      case ALIAS:
      case MAP:
      case SCALAR:
      case SEQ:
        return true;
    }
  return false;
}
var hasAnchor = (node2) => (isScalar(node2) || isCollection(node2)) && !!node2.anchor;

// node_modules/yaml/browser/dist/visit.js
var BREAK = Symbol("break visit");
var SKIP = Symbol("skip children");
var REMOVE = Symbol("remove node");
function visit(node2, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node2)) {
    const cd = visit_(null, node2.contents, visitor_, Object.freeze([node2]));
    if (cd === REMOVE)
      node2.contents = null;
  } else
    visit_(null, node2, visitor_, Object.freeze([]));
}
visit.BREAK = BREAK;
visit.SKIP = SKIP;
visit.REMOVE = REMOVE;
function visit_(key, node2, visitor, path) {
  const ctrl = callVisitor(key, node2, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visit_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node2)) {
      path = Object.freeze(path.concat(node2));
      for (let i = 0; i < node2.items.length; ++i) {
        const ci = visit_(i, node2.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node2.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node2)) {
      path = Object.freeze(path.concat(node2));
      const ck = visit_("key", node2.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node2.key = null;
      const cv = visit_("value", node2.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node2.value = null;
    }
  }
  return ctrl;
}
async function visitAsync(node2, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node2)) {
    const cd = await visitAsync_(null, node2.contents, visitor_, Object.freeze([node2]));
    if (cd === REMOVE)
      node2.contents = null;
  } else
    await visitAsync_(null, node2, visitor_, Object.freeze([]));
}
visitAsync.BREAK = BREAK;
visitAsync.SKIP = SKIP;
visitAsync.REMOVE = REMOVE;
async function visitAsync_(key, node2, visitor, path) {
  const ctrl = await callVisitor(key, node2, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visitAsync_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node2)) {
      path = Object.freeze(path.concat(node2));
      for (let i = 0; i < node2.items.length; ++i) {
        const ci = await visitAsync_(i, node2.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node2.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node2)) {
      path = Object.freeze(path.concat(node2));
      const ck = await visitAsync_("key", node2.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node2.key = null;
      const cv = await visitAsync_("value", node2.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node2.value = null;
    }
  }
  return ctrl;
}
function initVisitor(visitor) {
  if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
    return Object.assign({
      Alias: visitor.Node,
      Map: visitor.Node,
      Scalar: visitor.Node,
      Seq: visitor.Node
    }, visitor.Value && {
      Map: visitor.Value,
      Scalar: visitor.Value,
      Seq: visitor.Value
    }, visitor.Collection && {
      Map: visitor.Collection,
      Seq: visitor.Collection
    }, visitor);
  }
  return visitor;
}
function callVisitor(key, node2, visitor, path) {
  if (typeof visitor === "function")
    return visitor(key, node2, path);
  if (isMap(node2))
    return visitor.Map?.(key, node2, path);
  if (isSeq(node2))
    return visitor.Seq?.(key, node2, path);
  if (isPair(node2))
    return visitor.Pair?.(key, node2, path);
  if (isScalar(node2))
    return visitor.Scalar?.(key, node2, path);
  if (isAlias(node2))
    return visitor.Alias?.(key, node2, path);
  return void 0;
}
function replaceNode(key, path, node2) {
  const parent = path[path.length - 1];
  if (isCollection(parent)) {
    parent.items[key] = node2;
  } else if (isPair(parent)) {
    if (key === "key")
      parent.key = node2;
    else
      parent.value = node2;
  } else if (isDocument(parent)) {
    parent.contents = node2;
  } else {
    const pt = isAlias(parent) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${pt} parent`);
  }
}

// node_modules/yaml/browser/dist/doc/directives.js
var escapeChars = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
};
var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
var Directives = class _Directives {
  constructor(yaml, tags) {
    this.docStart = null;
    this.docEnd = false;
    this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
    this.tags = Object.assign({}, _Directives.defaultTags, tags);
  }
  clone() {
    const copy = new _Directives(this.yaml, this.tags);
    copy.docStart = this.docStart;
    return copy;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const res = new _Directives(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = true;
        break;
      case "1.2":
        this.atNextDocument = false;
        this.yaml = {
          explicit: _Directives.defaultYaml.explicit,
          version: "1.2"
        };
        this.tags = Object.assign({}, _Directives.defaultTags);
        break;
    }
    return res;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(line, onError) {
    if (this.atNextDocument) {
      this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
      this.tags = Object.assign({}, _Directives.defaultTags);
      this.atNextDocument = false;
    }
    const parts = line.trim().split(/[ \t]+/);
    const name = parts.shift();
    switch (name) {
      case "%TAG": {
        if (parts.length !== 2) {
          onError(0, "%TAG directive should contain exactly two parts");
          if (parts.length < 2)
            return false;
        }
        const [handle, prefix] = parts;
        this.tags[handle] = prefix;
        return true;
      }
      case "%YAML": {
        this.yaml.explicit = true;
        if (parts.length !== 1) {
          onError(0, "%YAML directive should contain exactly one part");
          return false;
        }
        const [version] = parts;
        if (version === "1.1" || version === "1.2") {
          this.yaml.version = version;
          return true;
        } else {
          const isValid = /^\d+\.\d+$/.test(version);
          onError(6, `Unsupported YAML version ${version}`, isValid);
          return false;
        }
      }
      default:
        onError(0, `Unknown directive ${name}`, true);
        return false;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(source, onError) {
    if (source === "!")
      return "!";
    if (source[0] !== "!") {
      onError(`Not a valid tag: ${source}`);
      return null;
    }
    if (source[1] === "<") {
      const verbatim = source.slice(2, -1);
      if (verbatim === "!" || verbatim === "!!") {
        onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
        return null;
      }
      if (source[source.length - 1] !== ">")
        onError("Verbatim tags must end with a >");
      return verbatim;
    }
    const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
    if (!suffix)
      onError(`The ${source} tag has no suffix`);
    const prefix = this.tags[handle];
    if (prefix) {
      try {
        return prefix + decodeURIComponent(suffix);
      } catch (error) {
        onError(String(error));
        return null;
      }
    }
    if (handle === "!")
      return source;
    onError(`Could not resolve tag: ${source}`);
    return null;
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(tag) {
    for (const [handle, prefix] of Object.entries(this.tags)) {
      if (tag.startsWith(prefix))
        return handle + escapeTagName(tag.substring(prefix.length));
    }
    return tag[0] === "!" ? tag : `!<${tag}>`;
  }
  toString(doc) {
    const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
    const tagEntries = Object.entries(this.tags);
    let tagNames;
    if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
      const tags = {};
      visit(doc.contents, (_key, node2) => {
        if (isNode(node2) && node2.tag)
          tags[node2.tag] = true;
      });
      tagNames = Object.keys(tags);
    } else
      tagNames = [];
    for (const [handle, prefix] of tagEntries) {
      if (handle === "!!" && prefix === "tag:yaml.org,2002:")
        continue;
      if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
        lines.push(`%TAG ${handle} ${prefix}`);
    }
    return lines.join("\n");
  }
};
Directives.defaultYaml = { explicit: false, version: "1.2" };
Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

// node_modules/yaml/browser/dist/doc/anchors.js
function anchorIsValid(anchor) {
  if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
    const sa = JSON.stringify(anchor);
    const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
    throw new Error(msg);
  }
  return true;
}
function anchorNames(root) {
  const anchors = /* @__PURE__ */ new Set();
  visit(root, {
    Value(_key, node2) {
      if (node2.anchor)
        anchors.add(node2.anchor);
    }
  });
  return anchors;
}
function findNewAnchor(prefix, exclude) {
  for (let i = 1; true; ++i) {
    const name = `${prefix}${i}`;
    if (!exclude.has(name))
      return name;
  }
}
function createNodeAnchors(doc, prefix) {
  const aliasObjects = [];
  const sourceObjects = /* @__PURE__ */ new Map();
  let prevAnchors = null;
  return {
    onAnchor: (source) => {
      aliasObjects.push(source);
      prevAnchors ?? (prevAnchors = anchorNames(doc));
      const anchor = findNewAnchor(prefix, prevAnchors);
      prevAnchors.add(anchor);
      return anchor;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const source of aliasObjects) {
        const ref = sourceObjects.get(source);
        if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
          ref.node.anchor = ref.anchor;
        } else {
          const error = new Error("Failed to resolve repeated object (this should not happen)");
          error.source = source;
          throw error;
        }
      }
    },
    sourceObjects
  };
}

// node_modules/yaml/browser/dist/doc/applyReviver.js
function applyReviver(reviver, obj, key, val) {
  if (val && typeof val === "object") {
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length; i < len; ++i) {
        const v0 = val[i];
        const v1 = applyReviver(reviver, val, String(i), v0);
        if (v1 === void 0)
          delete val[i];
        else if (v1 !== v0)
          val[i] = v1;
      }
    } else if (val instanceof Map) {
      for (const k of Array.from(val.keys())) {
        const v0 = val.get(k);
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          val.delete(k);
        else if (v1 !== v0)
          val.set(k, v1);
      }
    } else if (val instanceof Set) {
      for (const v0 of Array.from(val)) {
        const v1 = applyReviver(reviver, val, v0, v0);
        if (v1 === void 0)
          val.delete(v0);
        else if (v1 !== v0) {
          val.delete(v0);
          val.add(v1);
        }
      }
    } else {
      for (const [k, v0] of Object.entries(val)) {
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          delete val[k];
        else if (v1 !== v0)
          val[k] = v1;
      }
    }
  }
  return reviver.call(obj, key, val);
}

// node_modules/yaml/browser/dist/nodes/toJS.js
function toJS(value, arg, ctx) {
  if (Array.isArray(value))
    return value.map((v, i) => toJS(v, String(i), ctx));
  if (value && typeof value.toJSON === "function") {
    if (!ctx || !hasAnchor(value))
      return value.toJSON(arg, ctx);
    const data = { aliasCount: 0, count: 1, res: void 0 };
    ctx.anchors.set(value, data);
    ctx.onCreate = (res2) => {
      data.res = res2;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (ctx.onCreate)
      ctx.onCreate(res);
    return res;
  }
  if (typeof value === "bigint" && !ctx?.keep)
    return Number(value);
  return value;
}

// node_modules/yaml/browser/dist/nodes/Node.js
var NodeBase = class {
  constructor(type) {
    Object.defineProperty(this, NODE_TYPE, { value: type });
  }
  /** Create a copy of this node.  */
  clone() {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** A plain JavaScript representation of this node. */
  toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    if (!isDocument(doc))
      throw new TypeError("A document argument is required");
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc,
      keep: true,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this, "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
};

// node_modules/yaml/browser/dist/nodes/Alias.js
var Alias = class extends NodeBase {
  constructor(source) {
    super(ALIAS);
    this.source = source;
    Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(doc, ctx) {
    if (ctx?.maxAliasCount === 0)
      throw new ReferenceError("Alias resolution is disabled");
    let nodes;
    if (ctx?.aliasResolveCache) {
      nodes = ctx.aliasResolveCache;
    } else {
      nodes = [];
      visit(doc, {
        Node: (_key, node2) => {
          if (isAlias(node2) || hasAnchor(node2))
            nodes.push(node2);
        }
      });
      if (ctx)
        ctx.aliasResolveCache = nodes;
    }
    let found = void 0;
    for (const node2 of nodes) {
      if (node2 === this)
        break;
      if (node2.anchor === this.source)
        found = node2;
    }
    if (found && ctx) {
      const { anchors, doc: doc2, maxAliasCount } = ctx;
      let data = anchors.get(found);
      if (!data) {
        toJS(found, null, ctx);
        data = anchors.get(found);
      }
      if (data?.res === void 0) {
        const msg = "This should not happen: Alias anchor was not resolved?";
        throw new ReferenceError(msg);
      }
      if (maxAliasCount >= 0) {
        data.count += 1;
        if (data.aliasCount === 0)
          data.aliasCount = getAliasCount(doc2, found, anchors);
        if (data.count * data.aliasCount > maxAliasCount) {
          const msg = "Excessive alias count indicates a resource exhaustion attack";
          throw new ReferenceError(msg);
        }
      }
    }
    return found;
  }
  toJSON(_arg, ctx) {
    if (!ctx)
      return { source: this.source };
    const source = this.resolve(ctx.doc, ctx);
    if (!source) {
      const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(msg);
    }
    return ctx.anchors.get(source).res;
  }
  toString(ctx, _onComment, _onChompKeep) {
    const src = `*${this.source}`;
    if (ctx) {
      anchorIsValid(this.source);
      if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(msg);
      }
      if (ctx.implicitKey)
        return `${src} `;
    }
    return src;
  }
};
function getAliasCount(doc, node2, anchors) {
  if (isAlias(node2)) {
    const source = node2.resolve(doc);
    const anchor = anchors && source && anchors.get(source);
    return anchor ? anchor.count * anchor.aliasCount : 0;
  } else if (isCollection(node2)) {
    let count = 0;
    for (const item of node2.items) {
      const c = getAliasCount(doc, item, anchors);
      if (c > count)
        count = c;
    }
    return count;
  } else if (isPair(node2)) {
    const kc = getAliasCount(doc, node2.key, anchors);
    const vc = getAliasCount(doc, node2.value, anchors);
    return Math.max(kc, vc);
  }
  return 1;
}

// node_modules/yaml/browser/dist/nodes/Scalar.js
var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
var Scalar = class extends NodeBase {
  constructor(value) {
    super(SCALAR);
    this.value = value;
  }
  toJSON(arg, ctx) {
    return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
  }
  toString() {
    return String(this.value);
  }
};
Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
Scalar.PLAIN = "PLAIN";
Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

// node_modules/yaml/browser/dist/doc/createNode.js
var defaultTagPrefix = "tag:yaml.org,2002:";
function findTagObject(value, tagName, tags) {
  if (tagName) {
    const match = tags.filter((t) => t.tag === tagName);
    const tagObj = match.find((t) => !t.format) ?? match[0];
    if (!tagObj)
      throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  }
  return tags.find((t) => t.identify?.(value) && !t.format);
}
function createNode(value, tagName, ctx) {
  if (isDocument(value))
    value = value.contents;
  if (isNode(value))
    return value;
  if (isPair(value)) {
    const map2 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
    map2.items.push(value);
    return map2;
  }
  if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
    value = value.valueOf();
  }
  const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
  let ref = void 0;
  if (aliasDuplicateObjects && value && typeof value === "object") {
    ref = sourceObjects.get(value);
    if (ref) {
      ref.anchor ?? (ref.anchor = onAnchor(value));
      return new Alias(ref.anchor);
    } else {
      ref = { anchor: null, node: null };
      sourceObjects.set(value, ref);
    }
  }
  if (tagName?.startsWith("!!"))
    tagName = defaultTagPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema4.tags);
  if (!tagObj) {
    if (value && typeof value.toJSON === "function") {
      value = value.toJSON();
    }
    if (!value || typeof value !== "object") {
      const node3 = new Scalar(value);
      if (ref)
        ref.node = node3;
      return node3;
    }
    tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
  }
  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  }
  const node2 = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
  if (tagName)
    node2.tag = tagName;
  else if (!tagObj.default)
    node2.tag = tagObj.tag;
  if (ref)
    ref.node = node2;
  return node2;
}

// node_modules/yaml/browser/dist/nodes/Collection.js
function collectionFromPath(schema4, path, value) {
  let v = value;
  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
      const a = [];
      a[k] = v;
      v = a;
    } else {
      v = /* @__PURE__ */ new Map([[k, v]]);
    }
  }
  return createNode(v, void 0, {
    aliasDuplicateObjects: false,
    keepUndefined: false,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: schema4,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
var Collection = class extends NodeBase {
  constructor(type, schema4) {
    super(type);
    Object.defineProperty(this, "schema", {
      value: schema4,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(schema4) {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (schema4)
      copy.schema = schema4;
    copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(path, value) {
    if (isEmptyPath(path))
      this.add(value);
    else {
      const [key, ...rest] = path;
      const node2 = this.get(key, true);
      if (isCollection(node2))
        node2.addIn(rest, value);
      else if (node2 === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.delete(key);
    const node2 = this.get(key, true);
    if (isCollection(node2))
      return node2.deleteIn(rest);
    else
      throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    const [key, ...rest] = path;
    const node2 = this.get(key, true);
    if (rest.length === 0)
      return !keepScalar && isScalar(node2) ? node2.value : node2;
    else
      return isCollection(node2) ? node2.getIn(rest, keepScalar) : void 0;
  }
  hasAllNullValues(allowScalar) {
    return this.items.every((node2) => {
      if (!isPair(node2))
        return false;
      const n = node2.value;
      return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.has(key);
    const node2 = this.get(key, true);
    return isCollection(node2) ? node2.hasIn(rest) : false;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    const [key, ...rest] = path;
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node2 = this.get(key, true);
      if (isCollection(node2))
        node2.setIn(rest, value);
      else if (node2 === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyComment.js
var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
function indentComment(comment, indent) {
  if (/^\n+$/.test(comment))
    return comment.substring(1);
  return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;

// node_modules/yaml/browser/dist/stringify/foldFlowLines.js
var FOLD_FLOW = "flow";
var FOLD_BLOCK = "block";
var FOLD_QUOTED = "quoted";
function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
  if (!lineWidth || lineWidth < 0)
    return text;
  if (lineWidth < minContentWidth)
    minContentWidth = 0;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep)
    return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - indent.length;
  if (typeof indentAtStart === "number") {
    if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
      folds.push(0);
    else
      end = lineWidth - indentAtStart;
  }
  let split = void 0;
  let prev = void 0;
  let overflow = false;
  let i = -1;
  let escStart = -1;
  let escEnd = -1;
  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i, indent.length);
    if (i !== -1)
      end = i + endStep;
  }
  for (let ch; ch = text[i += 1]; ) {
    if (mode === FOLD_QUOTED && ch === "\\") {
      escStart = i;
      switch (text[i + 1]) {
        case "x":
          i += 3;
          break;
        case "u":
          i += 5;
          break;
        case "U":
          i += 9;
          break;
        default:
          i += 1;
      }
      escEnd = i;
    }
    if (ch === "\n") {
      if (mode === FOLD_BLOCK)
        i = consumeMoreIndentedLines(text, i, indent.length);
      end = i + indent.length + endStep;
      split = void 0;
    } else {
      if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
        const next = text[i + 1];
        if (next && next !== " " && next !== "\n" && next !== "	")
          split = i;
      }
      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = void 0;
        } else if (mode === FOLD_QUOTED) {
          while (prev === " " || prev === "	") {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          }
          const j = i > escEnd + 1 ? i - 2 : escStart - 1;
          if (escapedFolds[j])
            return text;
          folds.push(j);
          escapedFolds[j] = true;
          end = j + endStep;
          split = void 0;
        } else {
          overflow = true;
        }
      }
    }
    prev = ch;
  }
  if (overflow && onOverflow)
    onOverflow();
  if (folds.length === 0)
    return text;
  if (onFold)
    onFold();
  let res = text.slice(0, folds[0]);
  for (let i2 = 0; i2 < folds.length; ++i2) {
    const fold = folds[i2];
    const end2 = folds[i2 + 1] || text.length;
    if (fold === 0)
      res = `
${indent}${text.slice(0, end2)}`;
    else {
      if (mode === FOLD_QUOTED && escapedFolds[fold])
        res += `${text[fold]}\\`;
      res += `
${indent}${text.slice(fold + 1, end2)}`;
    }
  }
  return res;
}
function consumeMoreIndentedLines(text, i, indent) {
  let end = i;
  let start = i + 1;
  let ch = text[start];
  while (ch === " " || ch === "	") {
    if (i < start + indent) {
      ch = text[++i];
    } else {
      do {
        ch = text[++i];
      } while (ch && ch !== "\n");
      end = i;
      start = i + 1;
      ch = text[start];
    }
  }
  return end;
}

// node_modules/yaml/browser/dist/stringify/stringifyString.js
var getFoldOptions = (ctx, isBlock2) => ({
  indentAtStart: isBlock2 ? ctx.indent.length : ctx.indentAtStart,
  lineWidth: ctx.options.lineWidth,
  minContentWidth: ctx.options.minContentWidth
});
var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
function lineLengthOverLimit(str, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0)
    return false;
  const limit = lineWidth - indentLength;
  const strLen = str.length;
  if (strLen <= limit)
    return false;
  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === "\n") {
      if (i - start > limit)
        return true;
      start = i + 1;
      if (strLen - start <= limit)
        return false;
    }
  }
  return true;
}
function doubleQuotedString(value, ctx) {
  const json = JSON.stringify(value);
  if (ctx.options.doubleQuotedAsJSON)
    return json;
  const { implicitKey } = ctx;
  const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  let str = "";
  let start = 0;
  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
      str += json.slice(start, i) + "\\ ";
      i += 1;
      start = i;
      ch = "\\";
    }
    if (ch === "\\")
      switch (json[i + 1]) {
        case "u":
          {
            str += json.slice(start, i);
            const code = json.substr(i + 2, 4);
            switch (code) {
              case "0000":
                str += "\\0";
                break;
              case "0007":
                str += "\\a";
                break;
              case "000b":
                str += "\\v";
                break;
              case "001b":
                str += "\\e";
                break;
              case "0085":
                str += "\\N";
                break;
              case "00a0":
                str += "\\_";
                break;
              case "2028":
                str += "\\L";
                break;
              case "2029":
                str += "\\P";
                break;
              default:
                if (code.substr(0, 2) === "00")
                  str += "\\x" + code.substr(2);
                else
                  str += json.substr(i, 6);
            }
            i += 5;
            start = i + 1;
          }
          break;
        case "n":
          if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
            i += 1;
          } else {
            str += json.slice(start, i) + "\n\n";
            while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
              str += "\n";
              i += 2;
            }
            str += indent;
            if (json[i + 2] === " ")
              str += "\\";
            i += 1;
            start = i + 1;
          }
          break;
        default:
          i += 1;
      }
  }
  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
}
function singleQuotedString(value, ctx) {
  if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
    return doubleQuotedString(value, ctx);
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function quotedString(value, ctx) {
  const { singleQuote } = ctx.options;
  let qs;
  if (singleQuote === false)
    qs = doubleQuotedString;
  else {
    const hasDouble = value.includes('"');
    const hasSingle = value.includes("'");
    if (hasDouble && !hasSingle)
      qs = singleQuotedString;
    else if (hasSingle && !hasDouble)
      qs = doubleQuotedString;
    else
      qs = singleQuote ? singleQuotedString : doubleQuotedString;
  }
  return qs(value, ctx);
}
var blockEndNewlines;
try {
  blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
  blockEndNewlines = /\n+(?!\n|$)/g;
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
  const { blockQuote, commentString, lineWidth } = ctx.options;
  if (!blockQuote || /\n[\t ]+$/.test(value)) {
    return quotedString(value, ctx);
  }
  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
  const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
  if (!value)
    return literal ? "|\n" : ">\n";
  let chomp;
  let endStart;
  for (endStart = value.length; endStart > 0; --endStart) {
    const ch = value[endStart - 1];
    if (ch !== "\n" && ch !== "	" && ch !== " ")
      break;
  }
  let end = value.substring(endStart);
  const endNlPos = end.indexOf("\n");
  if (endNlPos === -1) {
    chomp = "-";
  } else if (value === end || endNlPos !== end.length - 1) {
    chomp = "+";
    if (onChompKeep)
      onChompKeep();
  } else {
    chomp = "";
  }
  if (end) {
    value = value.slice(0, -end.length);
    if (end[end.length - 1] === "\n")
      end = end.slice(0, -1);
    end = end.replace(blockEndNewlines, `$&${indent}`);
  }
  let startWithSpace = false;
  let startEnd;
  let startNlPos = -1;
  for (startEnd = 0; startEnd < value.length; ++startEnd) {
    const ch = value[startEnd];
    if (ch === " ")
      startWithSpace = true;
    else if (ch === "\n")
      startNlPos = startEnd;
    else
      break;
  }
  let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
  if (start) {
    value = value.substring(start.length);
    start = start.replace(/\n+/g, `$&${indent}`);
  }
  const indentSize = indent ? "2" : "1";
  let header = (startWithSpace ? indentSize : "") + chomp;
  if (comment) {
    header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
    if (onComment)
      onComment();
  }
  if (!literal) {
    const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    let literalFallback = false;
    const foldOptions = getFoldOptions(ctx, true);
    if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) {
      foldOptions.onOverflow = () => {
        literalFallback = true;
      };
    }
    const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
    if (!literalFallback)
      return `>${header}
${indent}${body}`;
  }
  value = value.replace(/\n+/g, `$&${indent}`);
  return `|${header}
${indent}${start}${value}${end}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
  const { type, value } = item;
  const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
  if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
    return quotedString(value, ctx);
  }
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }
  if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
    return blockString(item, ctx, onComment, onChompKeep);
  }
  if (containsDocumentMarker(value)) {
    if (indent === "") {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    } else if (implicitKey && indent === indentStep) {
      return quotedString(value, ctx);
    }
  }
  const str = value.replace(/\n+/g, `$&
${indent}`);
  if (actualString) {
    const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
    const { compat, tags } = ctx.doc.schema;
    if (tags.some(test) || compat?.some(test))
      return quotedString(value, ctx);
  }
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
  const { implicitKey, inFlow } = ctx;
  const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
  let { type } = item;
  if (type !== Scalar.QUOTE_DOUBLE) {
    if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
      type = Scalar.QUOTE_DOUBLE;
  }
  const _stringify = (_type) => {
    switch (_type) {
      case Scalar.BLOCK_FOLDED:
      case Scalar.BLOCK_LITERAL:
        return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
      case Scalar.QUOTE_DOUBLE:
        return doubleQuotedString(ss.value, ctx);
      case Scalar.QUOTE_SINGLE:
        return singleQuotedString(ss.value, ctx);
      case Scalar.PLAIN:
        return plainString(ss, ctx, onComment, onChompKeep);
      default:
        return null;
    }
  };
  let res = _stringify(type);
  if (res === null) {
    const { defaultKeyType, defaultStringType } = ctx.options;
    const t = implicitKey && defaultKeyType || defaultStringType;
    res = _stringify(t);
    if (res === null)
      throw new Error(`Unsupported default string type ${t}`);
  }
  return res;
}

// node_modules/yaml/browser/dist/stringify/stringify.js
function createStringifyContext(doc, options) {
  const opt = Object.assign({
    blockQuote: true,
    commentString: stringifyComment,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: false,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: true,
    indentSeq: true,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: false,
    singleQuote: null,
    trailingComma: false,
    trueStr: "true",
    verifyAliasOrder: true
  }, doc.schema.toStringOptions, options);
  let inFlow;
  switch (opt.collectionStyle) {
    case "block":
      inFlow = false;
      break;
    case "flow":
      inFlow = true;
      break;
    default:
      inFlow = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc,
    flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
    inFlow,
    options: opt
  };
}
function getTagObject(tags, item) {
  if (item.tag) {
    const match = tags.filter((t) => t.tag === item.tag);
    if (match.length > 0)
      return match.find((t) => t.format === item.format) ?? match[0];
  }
  let tagObj = void 0;
  let obj;
  if (isScalar(item)) {
    obj = item.value;
    let match = tags.filter((t) => t.identify?.(obj));
    if (match.length > 1) {
      const testMatch = match.filter((t) => t.test);
      if (testMatch.length > 0)
        match = testMatch;
    }
    tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
  } else {
    obj = item;
    tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
  }
  if (!tagObj) {
    const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
    throw new Error(`Tag not resolved for ${name} value`);
  }
  return tagObj;
}
function stringifyProps(node2, tagObj, { anchors, doc }) {
  if (!doc.directives)
    return "";
  const props = [];
  const anchor = (isScalar(node2) || isCollection(node2)) && node2.anchor;
  if (anchor && anchorIsValid(anchor)) {
    anchors.add(anchor);
    props.push(`&${anchor}`);
  }
  const tag = node2.tag ?? (tagObj.default ? null : tagObj.tag);
  if (tag)
    props.push(doc.directives.tagString(tag));
  return props.join(" ");
}
function stringify(item, ctx, onComment, onChompKeep) {
  if (isPair(item))
    return item.toString(ctx, onComment, onChompKeep);
  if (isAlias(item)) {
    if (ctx.doc.directives)
      return item.toString(ctx);
    if (ctx.resolvedAliases?.has(item)) {
      throw new TypeError(`Cannot stringify circular structure without alias nodes`);
    } else {
      if (ctx.resolvedAliases)
        ctx.resolvedAliases.add(item);
      else
        ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
      item = item.resolve(ctx.doc);
    }
  }
  let tagObj = void 0;
  const node2 = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
  tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node2));
  const props = stringifyProps(node2, tagObj, ctx);
  if (props.length > 0)
    ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
  const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node2, ctx, onComment, onChompKeep) : isScalar(node2) ? stringifyString(node2, ctx, onComment, onChompKeep) : node2.toString(ctx, onComment, onChompKeep);
  if (!props)
    return str;
  return isScalar(node2) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
}

// node_modules/yaml/browser/dist/stringify/stringifyPair.js
function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
  const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
  let keyComment = isNode(key) && key.comment || null;
  if (simpleKeys) {
    if (keyComment) {
      throw new Error("With simple keys, key nodes cannot have comments");
    }
    if (isCollection(key) || !isNode(key) && typeof key === "object") {
      const msg = "With simple keys, collection cannot be used as a key value";
      throw new Error(msg);
    }
  }
  let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
  ctx = Object.assign({}, ctx, {
    allNullValues: false,
    implicitKey: !explicitKey && (simpleKeys || !allNullValues),
    indent: indent + indentStep
  });
  let keyCommentDone = false;
  let chompKeep = false;
  let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
  if (!explicitKey && !ctx.inFlow && str.length > 1024) {
    if (simpleKeys)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    explicitKey = true;
  }
  if (ctx.inFlow) {
    if (allNullValues || value == null) {
      if (keyCommentDone && onComment)
        onComment();
      return str === "" ? "?" : explicitKey ? `? ${str}` : str;
    }
  } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
    str = `? ${str}`;
    if (keyComment && !keyCommentDone) {
      str += lineComment(str, ctx.indent, commentString(keyComment));
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  if (keyCommentDone)
    keyComment = null;
  if (explicitKey) {
    if (keyComment)
      str += lineComment(str, ctx.indent, commentString(keyComment));
    str = `? ${str}
${indent}:`;
  } else {
    str = `${str}:`;
    if (keyComment)
      str += lineComment(str, ctx.indent, commentString(keyComment));
  }
  let vsb, vcb, valueComment;
  if (isNode(value)) {
    vsb = !!value.spaceBefore;
    vcb = value.commentBefore;
    valueComment = value.comment;
  } else {
    vsb = false;
    vcb = null;
    valueComment = null;
    if (value && typeof value === "object")
      value = doc.createNode(value);
  }
  ctx.implicitKey = false;
  if (!explicitKey && !keyComment && isScalar(value))
    ctx.indentAtStart = str.length + 1;
  chompKeep = false;
  if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
    ctx.indent = ctx.indent.substring(2);
  }
  let valueCommentDone = false;
  const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
  let ws = " ";
  if (keyComment || vsb || vcb) {
    ws = vsb ? "\n" : "";
    if (vcb) {
      const cs = commentString(vcb);
      ws += `
${indentComment(cs, ctx.indent)}`;
    }
    if (valueStr === "" && !ctx.inFlow) {
      if (ws === "\n" && valueComment)
        ws = "\n\n";
    } else {
      ws += `
${ctx.indent}`;
    }
  } else if (!explicitKey && isCollection(value)) {
    const vs0 = valueStr[0];
    const nl0 = valueStr.indexOf("\n");
    const hasNewline = nl0 !== -1;
    const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
    if (hasNewline || !flow) {
      let hasPropsLine = false;
      if (hasNewline && (vs0 === "&" || vs0 === "!")) {
        let sp0 = valueStr.indexOf(" ");
        if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
          sp0 = valueStr.indexOf(" ", sp0 + 1);
        }
        if (sp0 === -1 || nl0 < sp0)
          hasPropsLine = true;
      }
      if (!hasPropsLine)
        ws = `
${ctx.indent}`;
    }
  } else if (valueStr === "" || valueStr[0] === "\n") {
    ws = "";
  }
  str += ws + valueStr;
  if (ctx.inFlow) {
    if (valueCommentDone && onComment)
      onComment();
  } else if (valueComment && !valueCommentDone) {
    str += lineComment(str, ctx.indent, commentString(valueComment));
  } else if (chompKeep && onChompKeep) {
    onChompKeep();
  }
  return str;
}

// node_modules/yaml/browser/dist/log.js
function warn(logLevel, warning) {
  if (logLevel === "debug" || logLevel === "warn") {
    console.warn(warning);
  }
}

// node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var MERGE_KEY = "<<";
var merge = {
  identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), {
    addToJSMap: addMergeToJSMap
  }),
  stringify: () => MERGE_KEY
};
var isMergeKey = (ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
function addMergeToJSMap(ctx, map2, value) {
  const source = resolveAliasValue(ctx, value);
  if (isSeq(source))
    for (const it of source.items)
      mergeValue(ctx, map2, it);
  else if (Array.isArray(source))
    for (const it of source)
      mergeValue(ctx, map2, it);
  else
    mergeValue(ctx, map2, source);
}
function mergeValue(ctx, map2, value) {
  const source = resolveAliasValue(ctx, value);
  if (!isMap(source))
    throw new Error("Merge sources must be maps or map aliases");
  const srcMap = source.toJSON(null, ctx, Map);
  for (const [key, value2] of srcMap) {
    if (map2 instanceof Map) {
      if (!map2.has(key))
        map2.set(key, value2);
    } else if (map2 instanceof Set) {
      map2.add(key);
    } else if (!Object.prototype.hasOwnProperty.call(map2, key)) {
      Object.defineProperty(map2, key, {
        value: value2,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  }
  return map2;
}
function resolveAliasValue(ctx, value) {
  return ctx && isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
}

// node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function addPairToJSMap(ctx, map2, { key, value }) {
  if (isNode(key) && key.addToJSMap)
    key.addToJSMap(ctx, map2, value);
  else if (isMergeKey(ctx, key))
    addMergeToJSMap(ctx, map2, value);
  else {
    const jsKey = toJS(key, "", ctx);
    if (map2 instanceof Map) {
      map2.set(jsKey, toJS(value, jsKey, ctx));
    } else if (map2 instanceof Set) {
      map2.add(jsKey);
    } else {
      const stringKey = stringifyKey(key, jsKey, ctx);
      const jsValue = toJS(value, stringKey, ctx);
      if (stringKey in map2)
        Object.defineProperty(map2, stringKey, {
          value: jsValue,
          writable: true,
          enumerable: true,
          configurable: true
        });
      else
        map2[stringKey] = jsValue;
    }
  }
  return map2;
}
function stringifyKey(key, jsKey, ctx) {
  if (jsKey === null)
    return "";
  if (typeof jsKey !== "object")
    return String(jsKey);
  if (isNode(key) && ctx?.doc) {
    const strCtx = createStringifyContext(ctx.doc, {});
    strCtx.anchors = /* @__PURE__ */ new Set();
    for (const node2 of ctx.anchors.keys())
      strCtx.anchors.add(node2.anchor);
    strCtx.inFlow = true;
    strCtx.inStringifyKey = true;
    const strKey = key.toString(strCtx);
    if (!ctx.mapKeyWarned) {
      let jsonStr = JSON.stringify(strKey);
      if (jsonStr.length > 40)
        jsonStr = jsonStr.substring(0, 36) + '..."';
      warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
      ctx.mapKeyWarned = true;
    }
    return strKey;
  }
  return JSON.stringify(jsKey);
}

// node_modules/yaml/browser/dist/nodes/Pair.js
function createPair(key, value, ctx) {
  const k = createNode(key, void 0, ctx);
  const v = createNode(value, void 0, ctx);
  return new Pair(k, v);
}
var Pair = class _Pair {
  constructor(key, value = null) {
    Object.defineProperty(this, NODE_TYPE, { value: PAIR });
    this.key = key;
    this.value = value;
  }
  clone(schema4) {
    let { key, value } = this;
    if (isNode(key))
      key = key.clone(schema4);
    if (isNode(value))
      value = value.clone(schema4);
    return new _Pair(key, value);
  }
  toJSON(_, ctx) {
    const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return addPairToJSMap(ctx, pair, this);
  }
  toString(ctx, onComment, onChompKeep) {
    return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function stringifyCollection(collection, ctx, options) {
  const flow = ctx.inFlow ?? collection.flow;
  const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
  return stringify4(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
  const { indent, options: { commentString } } = ctx;
  const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
  let chompKeep = false;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment2 = null;
    if (isNode(item)) {
      if (!chompKeep && item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
      if (item.comment)
        comment2 = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (!chompKeep && ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
      }
    }
    chompKeep = false;
    let str2 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
    if (comment2)
      str2 += lineComment(str2, itemIndent, commentString(comment2));
    if (chompKeep && comment2)
      chompKeep = false;
    lines.push(blockItemPrefix + str2);
  }
  let str;
  if (lines.length === 0) {
    str = flowChars.start + flowChars.end;
  } else {
    str = lines[0];
    for (let i = 1; i < lines.length; ++i) {
      const line = lines[i];
      str += line ? `
${indent}${line}` : "\n";
    }
  }
  if (comment) {
    str += "\n" + indentComment(commentString(comment), indent);
    if (onComment)
      onComment();
  } else if (chompKeep && onChompKeep)
    onChompKeep();
  return str;
}
function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
  const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
  itemIndent += indentStep;
  const itemCtx = Object.assign({}, ctx, {
    indent: itemIndent,
    inFlow: true,
    type: null
  });
  let reqNewline = false;
  let linesAtValue = 0;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment = null;
    if (isNode(item)) {
      if (item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, false);
      if (item.comment)
        comment = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, false);
        if (ik.comment)
          reqNewline = true;
      }
      const iv = isNode(item.value) ? item.value : null;
      if (iv) {
        if (iv.comment)
          comment = iv.comment;
        if (iv.commentBefore)
          reqNewline = true;
      } else if (item.value == null && ik?.comment) {
        comment = ik.comment;
      }
    }
    if (comment)
      reqNewline = true;
    let str = stringify(item, itemCtx, () => comment = null);
    reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
    if (i < items.length - 1) {
      str += ",";
    } else if (ctx.options.trailingComma) {
      if (ctx.options.lineWidth > 0) {
        reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
      }
      if (reqNewline) {
        str += ",";
      }
    }
    if (comment)
      str += lineComment(str, itemIndent, commentString(comment));
    lines.push(str);
    linesAtValue = lines.length;
  }
  const { start, end } = flowChars;
  if (lines.length === 0) {
    return start + end;
  } else {
    if (!reqNewline) {
      const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
      reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
    }
    if (reqNewline) {
      let str = start;
      for (const line of lines)
        str += line ? `
${indentStep}${indent}${line}` : "\n";
      return `${str}
${indent}${end}`;
    } else {
      return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
    }
  }
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
  if (comment && chompKeep)
    comment = comment.replace(/^\n+/, "");
  if (comment) {
    const ic = indentComment(commentString(comment), indent);
    lines.push(ic.trimStart());
  }
}

// node_modules/yaml/browser/dist/nodes/YAMLMap.js
function findPair(items, key) {
  const k = isScalar(key) ? key.value : key;
  for (const it of items) {
    if (isPair(it)) {
      if (it.key === key || it.key === k)
        return it;
      if (isScalar(it.key) && it.key.value === k)
        return it;
    }
  }
  return void 0;
}
var YAMLMap = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(schema4) {
    super(MAP, schema4);
    this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(schema4, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map2 = new this(schema4);
    const add = (key, value) => {
      if (typeof replacer === "function")
        value = replacer.call(obj, key, value);
      else if (Array.isArray(replacer) && !replacer.includes(key))
        return;
      if (value !== void 0 || keepUndefined)
        map2.items.push(createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
      for (const [key, value] of obj)
        add(key, value);
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj))
        add(key, obj[key]);
    }
    if (typeof schema4.sortMapEntries === "function") {
      map2.items.sort(schema4.sortMapEntries);
    }
    return map2;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(pair, overwrite) {
    let _pair;
    if (isPair(pair))
      _pair = pair;
    else if (!pair || typeof pair !== "object" || !("key" in pair)) {
      _pair = new Pair(pair, pair?.value);
    } else
      _pair = new Pair(pair.key, pair.value);
    const prev = findPair(this.items, _pair.key);
    const sortEntries = this.schema?.sortMapEntries;
    if (prev) {
      if (!overwrite)
        throw new Error(`Key ${_pair.key} already set`);
      if (isScalar(prev.value) && isScalarValue(_pair.value))
        prev.value.value = _pair.value;
      else
        prev.value = _pair.value;
    } else if (sortEntries) {
      const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
      if (i === -1)
        this.items.push(_pair);
      else
        this.items.splice(i, 0, _pair);
    } else {
      this.items.push(_pair);
    }
  }
  delete(key) {
    const it = findPair(this.items, key);
    if (!it)
      return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node2 = it?.value;
    return (!keepScalar && isScalar(node2) ? node2.value : node2) ?? void 0;
  }
  has(key) {
    return !!findPair(this.items, key);
  }
  set(key, value) {
    this.add(new Pair(key, value), true);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(_, ctx, Type) {
    const map2 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    if (ctx?.onCreate)
      ctx.onCreate(map2);
    for (const item of this.items)
      addPairToJSMap(ctx, map2, item);
    return map2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    for (const item of this.items) {
      if (!isPair(item))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }
    if (!ctx.allNullValues && this.hasAllNullValues(false))
      ctx = Object.assign({}, ctx, { allNullValues: true });
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: ctx.indent || "",
      onChompKeep,
      onComment
    });
  }
};

// node_modules/yaml/browser/dist/schema/common/map.js
var map = {
  collection: "map",
  default: true,
  nodeClass: YAMLMap,
  tag: "tag:yaml.org,2002:map",
  resolve(map2, onError) {
    if (!isMap(map2))
      onError("Expected a mapping for this tag");
    return map2;
  },
  createNode: (schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx)
};

// node_modules/yaml/browser/dist/nodes/YAMLSeq.js
var YAMLSeq = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(schema4) {
    super(SEQ, schema4);
    this.items = [];
  }
  add(value) {
    this.items.push(value);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return void 0;
    const it = this.items[idx];
    return !keepScalar && isScalar(it) ? it.value : it;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === "number" && idx < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      throw new Error(`Expected a valid index, not ${key}.`);
    const prev = this.items[idx];
    if (isScalar(prev) && isScalarValue(value))
      prev.value = value;
    else
      this.items[idx] = value;
  }
  toJSON(_, ctx) {
    const seq2 = [];
    if (ctx?.onCreate)
      ctx.onCreate(seq2);
    let i = 0;
    for (const item of this.items)
      seq2.push(toJS(item, String(i++), ctx));
    return seq2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (ctx.indent || "") + "  ",
      onChompKeep,
      onComment
    });
  }
  static from(schema4, obj, ctx) {
    const { replacer } = ctx;
    const seq2 = new this(schema4);
    if (obj && Symbol.iterator in Object(obj)) {
      let i = 0;
      for (let it of obj) {
        if (typeof replacer === "function") {
          const key = obj instanceof Set ? it : String(i++);
          it = replacer.call(obj, key, it);
        }
        seq2.items.push(createNode(it, void 0, ctx));
      }
    }
    return seq2;
  }
};
function asItemIndex(key) {
  let idx = isScalar(key) ? key.value : key;
  if (idx && typeof idx === "string")
    idx = Number(idx);
  return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
}

// node_modules/yaml/browser/dist/schema/common/seq.js
var seq = {
  collection: "seq",
  default: true,
  nodeClass: YAMLSeq,
  tag: "tag:yaml.org,2002:seq",
  resolve(seq2, onError) {
    if (!isSeq(seq2))
      onError("Expected a sequence for this tag");
    return seq2;
  },
  createNode: (schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx)
};

// node_modules/yaml/browser/dist/schema/common/string.js
var string = {
  identify: (value) => typeof value === "string",
  default: true,
  tag: "tag:yaml.org,2002:str",
  resolve: (str) => str,
  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({ actualString: true }, ctx);
    return stringifyString(item, ctx, onComment, onChompKeep);
  }
};

// node_modules/yaml/browser/dist/schema/common/null.js
var nullTag = {
  identify: (value) => value == null,
  createNode: () => new Scalar(null),
  default: true,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new Scalar(null),
  stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
};

// node_modules/yaml/browser/dist/schema/core/bool.js
var boolTag = {
  identify: (value) => typeof value === "boolean",
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (str) => new Scalar(str[0] === "t" || str[0] === "T"),
  stringify({ source, value }, ctx) {
    if (source && boolTag.test.test(source)) {
      const sv = source[0] === "t" || source[0] === "T";
      if (value === sv)
        return source;
    }
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function stringifyNumber({ format, minFractionDigits, tag, value }) {
  if (typeof value === "bigint")
    return String(value);
  const num = typeof value === "number" ? value : Number(value);
  if (!isFinite(num))
    return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
  let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
  if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
    let i = n.indexOf(".");
    if (i < 0) {
      i = n.length;
      n += ".";
    }
    let d = minFractionDigits - (n.length - i - 1);
    while (d-- > 0)
      n += "0";
  }
  return n;
}

// node_modules/yaml/browser/dist/schema/core/float.js
var floatNaN = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (str) => parseFloat(str),
  stringify(node2) {
    const num = Number(node2.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node2);
  }
};
var float = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(str) {
    const node2 = new Scalar(parseFloat(str));
    const dot = str.indexOf(".");
    if (dot !== -1 && str[str.length - 1] === "0")
      node2.minFractionDigits = str.length - dot - 1;
    return node2;
  },
  stringify: stringifyNumber
};

// node_modules/yaml/browser/dist/schema/core/int.js
var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
function intStringify(node2, radix, prefix) {
  const { value } = node2;
  if (intIdentify(value) && value >= 0)
    return prefix + value.toString(radix);
  return stringifyNumber(node2);
}
var intOct = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
  stringify: (node2) => intStringify(node2, 8, "0o")
};
var int = {
  identify: intIdentify,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
  stringify: (node2) => intStringify(node2, 16, "0x")
};

// node_modules/yaml/browser/dist/schema/core/schema.js
var schema = [
  map,
  seq,
  string,
  nullTag,
  boolTag,
  intOct,
  int,
  intHex,
  floatNaN,
  floatExp,
  float
];

// node_modules/yaml/browser/dist/schema/json/schema.js
function intIdentify2(value) {
  return typeof value === "bigint" || Number.isInteger(value);
}
var stringifyJSON = ({ value }) => JSON.stringify(value);
var jsonScalars = [
  {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify: stringifyJSON
  },
  {
    identify: (value) => value == null,
    createNode: () => new Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  },
  {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (str) => str === "true",
    stringify: stringifyJSON
  },
  {
    identify: intIdentify2,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
    stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
  },
  {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (str) => parseFloat(str),
    stringify: stringifyJSON
  }
];
var jsonError = {
  default: true,
  tag: "",
  test: /^/,
  resolve(str, onError) {
    onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
    return str;
  }
};
var schema2 = [map, seq].concat(jsonScalars, jsonError);

// node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
var binary = {
  identify: (value) => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(src, onError) {
    if (typeof atob === "function") {
      const str = atob(src.replace(/[\n\r]/g, ""));
      const buffer = new Uint8Array(str.length);
      for (let i = 0; i < str.length; ++i)
        buffer[i] = str.charCodeAt(i);
      return buffer;
    } else {
      onError("This environment does not support reading binary tags; either Buffer or atob is required");
      return src;
    }
  },
  stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
    if (!value)
      return "";
    const buf = value;
    let str;
    if (typeof btoa === "function") {
      let s = "";
      for (let i = 0; i < buf.length; ++i)
        s += String.fromCharCode(buf[i]);
      str = btoa(s);
    } else {
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    }
    type ?? (type = Scalar.BLOCK_LITERAL);
    if (type !== Scalar.QUOTE_DOUBLE) {
      const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
      const n = Math.ceil(str.length / lineWidth);
      const lines = new Array(n);
      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = str.substr(o, lineWidth);
      }
      str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
    }
    return stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
  }
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function resolvePairs(seq2, onError) {
  if (isSeq(seq2)) {
    for (let i = 0; i < seq2.items.length; ++i) {
      let item = seq2.items[i];
      if (isPair(item))
        continue;
      else if (isMap(item)) {
        if (item.items.length > 1)
          onError("Each pair must have its own sequence indicator");
        const pair = item.items[0] || new Pair(new Scalar(null));
        if (item.commentBefore)
          pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
        if (item.comment) {
          const cn = pair.value ?? pair.key;
          cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
        }
        item = pair;
      }
      seq2.items[i] = isPair(item) ? item : new Pair(item);
    }
  } else
    onError("Expected a sequence for this tag");
  return seq2;
}
function createPairs(schema4, iterable, ctx) {
  const { replacer } = ctx;
  const pairs2 = new YAMLSeq(schema4);
  pairs2.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (iterable && Symbol.iterator in Object(iterable))
    for (let it of iterable) {
      if (typeof replacer === "function")
        it = replacer.call(iterable, String(i++), it);
      let key, value;
      if (Array.isArray(it)) {
        if (it.length === 2) {
          key = it[0];
          value = it[1];
        } else
          throw new TypeError(`Expected [key, value] tuple: ${it}`);
      } else if (it && it instanceof Object) {
        const keys = Object.keys(it);
        if (keys.length === 1) {
          key = keys[0];
          value = it[key];
        } else {
          throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
        }
      } else {
        key = it;
      }
      pairs2.items.push(createPair(key, value, ctx));
    }
  return pairs2;
}
var pairs = {
  collection: "seq",
  default: false,
  tag: "tag:yaml.org,2002:pairs",
  resolve: resolvePairs,
  createNode: createPairs
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
var YAMLOMap = class _YAMLOMap extends YAMLSeq {
  constructor() {
    super();
    this.add = YAMLMap.prototype.add.bind(this);
    this.delete = YAMLMap.prototype.delete.bind(this);
    this.get = YAMLMap.prototype.get.bind(this);
    this.has = YAMLMap.prototype.has.bind(this);
    this.set = YAMLMap.prototype.set.bind(this);
    this.tag = _YAMLOMap.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(_, ctx) {
    if (!ctx)
      return super.toJSON(_);
    const map2 = /* @__PURE__ */ new Map();
    if (ctx?.onCreate)
      ctx.onCreate(map2);
    for (const pair of this.items) {
      let key, value;
      if (isPair(pair)) {
        key = toJS(pair.key, "", ctx);
        value = toJS(pair.value, key, ctx);
      } else {
        key = toJS(pair, "", ctx);
      }
      if (map2.has(key))
        throw new Error("Ordered maps must not include duplicate keys");
      map2.set(key, value);
    }
    return map2;
  }
  static from(schema4, iterable, ctx) {
    const pairs2 = createPairs(schema4, iterable, ctx);
    const omap2 = new this();
    omap2.items = pairs2.items;
    return omap2;
  }
};
YAMLOMap.tag = "tag:yaml.org,2002:omap";
var omap = {
  collection: "seq",
  identify: (value) => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: "tag:yaml.org,2002:omap",
  resolve(seq2, onError) {
    const pairs2 = resolvePairs(seq2, onError);
    const seenKeys = [];
    for (const { key } of pairs2.items) {
      if (isScalar(key)) {
        if (seenKeys.includes(key.value)) {
          onError(`Ordered maps must not include duplicate keys: ${key.value}`);
        } else {
          seenKeys.push(key.value);
        }
      }
    }
    return Object.assign(new YAMLOMap(), pairs2);
  },
  createNode: (schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx)
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function boolStringify({ value, source }, ctx) {
  const boolObj = value ? trueTag : falseTag;
  if (source && boolObj.test.test(source))
    return source;
  return value ? ctx.options.trueStr : ctx.options.falseStr;
}
var trueTag = {
  identify: (value) => value === true,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new Scalar(true),
  stringify: boolStringify
};
var falseTag = {
  identify: (value) => value === false,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new Scalar(false),
  stringify: boolStringify
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
var floatNaN2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (str) => parseFloat(str.replace(/_/g, "")),
  stringify(node2) {
    const num = Number(node2.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node2);
  }
};
var float2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(str) {
    const node2 = new Scalar(parseFloat(str.replace(/_/g, "")));
    const dot = str.indexOf(".");
    if (dot !== -1) {
      const f = str.substring(dot + 1).replace(/_/g, "");
      if (f[f.length - 1] === "0")
        node2.minFractionDigits = f.length;
    }
    return node2;
  },
  stringify: stringifyNumber
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
var intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
function intResolve2(str, offset, radix, { intAsBigInt }) {
  const sign = str[0];
  if (sign === "-" || sign === "+")
    offset += 1;
  str = str.substring(offset).replace(/_/g, "");
  if (intAsBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;
      case 8:
        str = `0o${str}`;
        break;
      case 16:
        str = `0x${str}`;
        break;
    }
    const n2 = BigInt(str);
    return sign === "-" ? BigInt(-1) * n2 : n2;
  }
  const n = parseInt(str, radix);
  return sign === "-" ? -1 * n : n;
}
function intStringify2(node2, radix, prefix) {
  const { value } = node2;
  if (intIdentify3(value)) {
    const str = value.toString(radix);
    return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
  }
  return stringifyNumber(node2);
}
var intBin = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 2, 2, opt),
  stringify: (node2) => intStringify2(node2, 2, "0b")
};
var intOct2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 1, 8, opt),
  stringify: (node2) => intStringify2(node2, 8, "0")
};
var int2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (str, _onError, opt) => intResolve2(str, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 2, 16, opt),
  stringify: (node2) => intStringify2(node2, 16, "0x")
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
var YAMLSet = class _YAMLSet extends YAMLMap {
  constructor(schema4) {
    super(schema4);
    this.tag = _YAMLSet.tag;
  }
  add(key) {
    let pair;
    if (isPair(key))
      pair = key;
    else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
      pair = new Pair(key.key, null);
    else
      pair = new Pair(key, null);
    const prev = findPair(this.items, pair.key);
    if (!prev)
      this.items.push(pair);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(key, keepPair) {
    const pair = findPair(this.items, key);
    return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
  }
  set(key, value) {
    if (typeof value !== "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = findPair(this.items, key);
    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new Pair(key));
    }
  }
  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    if (this.hasAllNullValues(true))
      return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
    else
      throw new Error("Set items must all have null values");
  }
  static from(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const set2 = new this(schema4);
    if (iterable && Symbol.iterator in Object(iterable))
      for (let value of iterable) {
        if (typeof replacer === "function")
          value = replacer.call(iterable, value, value);
        set2.items.push(createPair(value, null, ctx));
      }
    return set2;
  }
};
YAMLSet.tag = "tag:yaml.org,2002:set";
var set = {
  collection: "map",
  identify: (value) => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: "tag:yaml.org,2002:set",
  createNode: (schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx),
  resolve(map2, onError) {
    if (isMap(map2)) {
      if (map2.hasAllNullValues(true))
        return Object.assign(new YAMLSet(), map2);
      else
        onError("Set items must all have null values");
    } else
      onError("Expected a mapping for this tag");
    return map2;
  }
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function parseSexagesimal(str, asBigInt) {
  const sign = str[0];
  const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
  const num = (n) => asBigInt ? BigInt(n) : Number(n);
  const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
  return sign === "-" ? num(-1) * res : res;
}
function stringifySexagesimal(node2) {
  let { value } = node2;
  let num = (n) => n;
  if (typeof value === "bigint")
    num = (n) => BigInt(n);
  else if (isNaN(value) || !isFinite(value))
    return stringifyNumber(node2);
  let sign = "";
  if (value < 0) {
    sign = "-";
    value *= num(-1);
  }
  const _60 = num(60);
  const parts = [value % _60];
  if (value < 60) {
    parts.unshift(0);
  } else {
    value = (value - parts[0]) / _60;
    parts.unshift(value % _60);
    if (value >= 60) {
      value = (value - parts[0]) / _60;
      parts.unshift(value);
    }
  }
  return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var intTime = {
  identify: (value) => typeof value === "bigint" || Number.isInteger(value),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
  stringify: stringifySexagesimal
};
var floatTime = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (str) => parseSexagesimal(str, false),
  stringify: stringifySexagesimal
};
var timestamp = {
  identify: (value) => value instanceof Date,
  default: true,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(str) {
    const match = str.match(timestamp.test);
    if (!match)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, year, month, day, hour, minute, second] = match.map(Number);
    const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
    const tz = match[8];
    if (tz && tz !== "Z") {
      let d = parseSexagesimal(tz, false);
      if (Math.abs(d) < 30)
        d *= 60;
      date -= 6e4 * d;
    }
    return new Date(date);
  },
  stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
var schema3 = [
  map,
  seq,
  string,
  nullTag,
  trueTag,
  falseTag,
  intBin,
  intOct2,
  int2,
  intHex2,
  floatNaN2,
  floatExp2,
  float2,
  binary,
  merge,
  omap,
  pairs,
  set,
  intTime,
  floatTime,
  timestamp
];

// node_modules/yaml/browser/dist/schema/tags.js
var schemas = /* @__PURE__ */ new Map([
  ["core", schema],
  ["failsafe", [map, seq, string]],
  ["json", schema2],
  ["yaml11", schema3],
  ["yaml-1.1", schema3]
]);
var tagsByName = {
  binary,
  bool: boolTag,
  float,
  floatExp,
  floatNaN,
  floatTime,
  int,
  intHex,
  intOct,
  intTime,
  map,
  merge,
  null: nullTag,
  omap,
  pairs,
  seq,
  set,
  timestamp
};
var coreKnownTags = {
  "tag:yaml.org,2002:binary": binary,
  "tag:yaml.org,2002:merge": merge,
  "tag:yaml.org,2002:omap": omap,
  "tag:yaml.org,2002:pairs": pairs,
  "tag:yaml.org,2002:set": set,
  "tag:yaml.org,2002:timestamp": timestamp
};
function getTags(customTags, schemaName, addMergeTag) {
  const schemaTags = schemas.get(schemaName);
  if (schemaTags && !customTags) {
    return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
  }
  let tags = schemaTags;
  if (!tags) {
    if (Array.isArray(customTags))
      tags = [];
    else {
      const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
    }
  }
  if (Array.isArray(customTags)) {
    for (const tag of customTags)
      tags = tags.concat(tag);
  } else if (typeof customTags === "function") {
    tags = customTags(tags.slice());
  }
  if (addMergeTag)
    tags = tags.concat(merge);
  return tags.reduce((tags2, tag) => {
    const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
    if (!tagObj) {
      const tagName = JSON.stringify(tag);
      const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
    }
    if (!tags2.includes(tagObj))
      tags2.push(tagObj);
    return tags2;
  }, []);
}

// node_modules/yaml/browser/dist/schema/Schema.js
var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
var Schema = class _Schema {
  constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
    this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
    this.name = typeof schema4 === "string" && schema4 || "core";
    this.knownTags = resolveKnownTags ? coreKnownTags : {};
    this.tags = getTags(customTags, this.name, merge2);
    this.toStringOptions = toStringDefaults ?? null;
    Object.defineProperty(this, MAP, { value: map });
    Object.defineProperty(this, SCALAR, { value: string });
    Object.defineProperty(this, SEQ, { value: seq });
    this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
  }
  clone() {
    const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
    copy.tags = this.tags.slice();
    return copy;
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function stringifyDocument(doc, options) {
  const lines = [];
  let hasDirectives = options.directives === true;
  if (options.directives !== false && doc.directives) {
    const dir = doc.directives.toString(doc);
    if (dir) {
      lines.push(dir);
      hasDirectives = true;
    } else if (doc.directives.docStart)
      hasDirectives = true;
  }
  if (hasDirectives)
    lines.push("---");
  const ctx = createStringifyContext(doc, options);
  const { commentString } = ctx.options;
  if (doc.commentBefore) {
    if (lines.length !== 1)
      lines.unshift("");
    const cs = commentString(doc.commentBefore);
    lines.unshift(indentComment(cs, ""));
  }
  let chompKeep = false;
  let contentComment = null;
  if (doc.contents) {
    if (isNode(doc.contents)) {
      if (doc.contents.spaceBefore && hasDirectives)
        lines.push("");
      if (doc.contents.commentBefore) {
        const cs = commentString(doc.contents.commentBefore);
        lines.push(indentComment(cs, ""));
      }
      ctx.forceBlockIndent = !!doc.comment;
      contentComment = doc.contents.comment;
    }
    const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
    let body = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
    if (contentComment)
      body += lineComment(body, "", commentString(contentComment));
    if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
      lines[lines.length - 1] = `--- ${body}`;
    } else
      lines.push(body);
  } else {
    lines.push(stringify(doc.contents, ctx));
  }
  if (doc.directives?.docEnd) {
    if (doc.comment) {
      const cs = commentString(doc.comment);
      if (cs.includes("\n")) {
        lines.push("...");
        lines.push(indentComment(cs, ""));
      } else {
        lines.push(`... ${cs}`);
      }
    } else {
      lines.push("...");
    }
  } else {
    let dc = doc.comment;
    if (dc && chompKeep)
      dc = dc.replace(/^\n+/, "");
    if (dc) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
        lines.push("");
      lines.push(indentComment(commentString(dc), ""));
    }
  }
  return lines.join("\n") + "\n";
}

// node_modules/yaml/browser/dist/doc/Document.js
var Document = class _Document {
  constructor(value, replacer, options) {
    this.commentBefore = null;
    this.comment = null;
    this.errors = [];
    this.warnings = [];
    Object.defineProperty(this, NODE_TYPE, { value: DOC });
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const opt = Object.assign({
      intAsBigInt: false,
      keepSourceTokens: false,
      logLevel: "warn",
      prettyErrors: true,
      strict: true,
      stringKeys: false,
      uniqueKeys: true,
      version: "1.2"
    }, options);
    this.options = opt;
    let { version } = opt;
    if (options?._directives) {
      this.directives = options._directives.atDocument();
      if (this.directives.yaml.explicit)
        version = this.directives.yaml.version;
    } else
      this.directives = new Directives({ version });
    this.setSchema(version, options);
    this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const copy = Object.create(_Document.prototype, {
      [NODE_TYPE]: { value: DOC }
    });
    copy.commentBefore = this.commentBefore;
    copy.comment = this.comment;
    copy.errors = this.errors.slice();
    copy.warnings = this.warnings.slice();
    copy.options = Object.assign({}, this.options);
    if (this.directives)
      copy.directives = this.directives.clone();
    copy.schema = this.schema.clone();
    copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** Adds a value to the document. */
  add(value) {
    if (assertCollection(this.contents))
      this.contents.add(value);
  }
  /** Adds a value to the document. */
  addIn(path, value) {
    if (assertCollection(this.contents))
      this.contents.addIn(path, value);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(node2, name) {
    if (!node2.anchor) {
      const prev = anchorNames(this);
      node2.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
    }
    return new Alias(node2.anchor);
  }
  createNode(value, replacer, options) {
    let _replacer = void 0;
    if (typeof replacer === "function") {
      value = replacer.call({ "": value }, "", value);
      _replacer = replacer;
    } else if (Array.isArray(replacer)) {
      const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
      const asStr = replacer.filter(keyToStr).map(String);
      if (asStr.length > 0)
        replacer = replacer.concat(asStr);
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
    const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      anchorPrefix || "a"
    );
    const ctx = {
      aliasDuplicateObjects: aliasDuplicateObjects ?? true,
      keepUndefined: keepUndefined ?? false,
      onAnchor,
      onTagObj,
      replacer: _replacer,
      schema: this.schema,
      sourceObjects
    };
    const node2 = createNode(value, tag, ctx);
    if (flow && isCollection(node2))
      node2.flow = true;
    setAnchors();
    return node2;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(key, value, options = {}) {
    const k = this.createNode(key, null, options);
    const v = this.createNode(value, null, options);
    return new Pair(k, v);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    return assertCollection(this.contents) ? this.contents.delete(key) : false;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    if (isEmptyPath(path)) {
      if (this.contents == null)
        return false;
      this.contents = null;
      return true;
    }
    return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(key, keepScalar) {
    return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    if (isEmptyPath(path))
      return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
    return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(key) {
    return isCollection(this.contents) ? this.contents.has(key) : false;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(path) {
    if (isEmptyPath(path))
      return this.contents !== void 0;
    return isCollection(this.contents) ? this.contents.hasIn(path) : false;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(key, value) {
    if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, [key], value);
    } else if (assertCollection(this.contents)) {
      this.contents.set(key, value);
    }
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    if (isEmptyPath(path)) {
      this.contents = value;
    } else if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, Array.from(path), value);
    } else if (assertCollection(this.contents)) {
      this.contents.setIn(path, value);
    }
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(version, options = {}) {
    if (typeof version === "number")
      version = String(version);
    let opt;
    switch (version) {
      case "1.1":
        if (this.directives)
          this.directives.yaml.version = "1.1";
        else
          this.directives = new Directives({ version: "1.1" });
        opt = { resolveKnownTags: false, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        if (this.directives)
          this.directives.yaml.version = version;
        else
          this.directives = new Directives({ version });
        opt = { resolveKnownTags: true, schema: "core" };
        break;
      case null:
        if (this.directives)
          delete this.directives;
        opt = null;
        break;
      default: {
        const sv = JSON.stringify(version);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
      }
    }
    if (options.schema instanceof Object)
      this.schema = options.schema;
    else if (opt)
      this.schema = new Schema(Object.assign(opt, options));
    else
      throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !json,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this.contents, jsonArg ?? "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(jsonArg, onAnchor) {
    return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
  }
  /** A YAML representation of the document. */
  toString(options = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
      const s = JSON.stringify(options.indent);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }
    return stringifyDocument(this, options);
  }
};
function assertCollection(contents) {
  if (isCollection(contents))
    return true;
  throw new Error("Expected a YAML collection as document contents");
}

// node_modules/yaml/browser/dist/errors.js
var YAMLError = class extends Error {
  constructor(name, pos, code, message) {
    super();
    this.name = name;
    this.code = code;
    this.message = message;
    this.pos = pos;
  }
};
var YAMLParseError = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLParseError", pos, code, message);
  }
};
var YAMLWarning = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLWarning", pos, code, message);
  }
};
var prettifyError = (src, lc) => (error) => {
  if (error.pos[0] === -1)
    return;
  error.linePos = error.pos.map((pos) => lc.linePos(pos));
  const { line, col } = error.linePos[0];
  error.message += ` at line ${line}, column ${col}`;
  let ci = col - 1;
  let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
  if (ci >= 60 && lineStr.length > 80) {
    const trimStart = Math.min(ci - 39, lineStr.length - 79);
    lineStr = "\u2026" + lineStr.substring(trimStart);
    ci -= trimStart - 1;
  }
  if (lineStr.length > 80)
    lineStr = lineStr.substring(0, 79) + "\u2026";
  if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
    let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
    if (prev.length > 80)
      prev = prev.substring(0, 79) + "\u2026\n";
    lineStr = prev + lineStr;
  }
  if (/[^ ]/.test(lineStr)) {
    let count = 1;
    const end = error.linePos[1];
    if (end?.line === line && end.col > col) {
      count = Math.max(1, Math.min(end.col - col, 80 - ci));
    }
    const pointer = " ".repeat(ci) + "^".repeat(count);
    error.message += `:

${lineStr}
${pointer}
`;
  }
};

// node_modules/yaml/browser/dist/compose/resolve-props.js
function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
  let spaceBefore = false;
  let atNewline = startOnNewline;
  let hasSpace = startOnNewline;
  let comment = "";
  let commentSep = "";
  let hasNewline = false;
  let reqSpace = false;
  let tab = null;
  let anchor = null;
  let tag = null;
  let newlineAfterProp = null;
  let comma = null;
  let found = null;
  let start = null;
  for (const token of tokens) {
    if (reqSpace) {
      if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
        onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      reqSpace = false;
    }
    if (tab) {
      if (atNewline && token.type !== "comment" && token.type !== "newline") {
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      }
      tab = null;
    }
    switch (token.type) {
      case "space":
        if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
          tab = token;
        }
        hasSpace = true;
        break;
      case "comment": {
        if (!hasSpace)
          onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const cb = token.source.substring(1) || " ";
        if (!comment)
          comment = cb;
        else
          comment += commentSep + cb;
        commentSep = "";
        atNewline = false;
        break;
      }
      case "newline":
        if (atNewline) {
          if (comment)
            comment += token.source;
          else if (!found || indicator !== "seq-item-ind")
            spaceBefore = true;
        } else
          commentSep += token.source;
        atNewline = true;
        hasNewline = true;
        if (anchor || tag)
          newlineAfterProp = token;
        hasSpace = true;
        break;
      case "anchor":
        if (anchor)
          onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
        if (token.source.endsWith(":"))
          onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
        anchor = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      case "tag": {
        if (tag)
          onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
        tag = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      }
      case indicator:
        if (anchor || tag)
          onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
        if (found)
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
        found = token;
        atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
        hasSpace = false;
        break;
      case "comma":
        if (flow) {
          if (comma)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
          comma = token;
          atNewline = false;
          hasSpace = false;
          break;
        }
      // else fallthrough
      default:
        onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
        atNewline = false;
        hasSpace = false;
    }
  }
  const last = tokens[tokens.length - 1];
  const end = last ? last.offset + last.source.length : offset;
  if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
    onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
  }
  if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
    onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
  return {
    comma,
    found,
    spaceBefore,
    comment,
    hasNewline,
    anchor,
    tag,
    newlineAfterProp,
    end,
    start: start ?? end
  };
}

// node_modules/yaml/browser/dist/compose/util-contains-newline.js
function containsNewline(key) {
  if (!key)
    return null;
  switch (key.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (key.source.includes("\n"))
        return true;
      if (key.end) {
        for (const st of key.end)
          if (st.type === "newline")
            return true;
      }
      return false;
    case "flow-collection":
      for (const it of key.items) {
        for (const st of it.start)
          if (st.type === "newline")
            return true;
        if (it.sep) {
          for (const st of it.sep)
            if (st.type === "newline")
              return true;
        }
        if (containsNewline(it.key) || containsNewline(it.value))
          return true;
      }
      return false;
    default:
      return true;
  }
}

// node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function flowIndentCheck(indent, fc, onError) {
  if (fc?.type === "flow-collection") {
    const end = fc.end[0];
    if (end.indent === indent && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
      const msg = "Flow end indicator should be more indented than parent";
      onError(end, "BAD_INDENT", msg, true);
    }
  }
}

// node_modules/yaml/browser/dist/compose/util-map-includes.js
function mapIncludes(ctx, items, search) {
  const { uniqueKeys } = ctx.options;
  if (uniqueKeys === false)
    return false;
  const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value;
  return items.some((pair) => isEqual(pair.key, search));
}

// node_modules/yaml/browser/dist/compose/resolve-block-map.js
var startColMsg = "All mapping items must start at the same column";
function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLMap;
  const map2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  let offset = bm.offset;
  let commentEnd = null;
  for (const collItem of bm.items) {
    const { start, key, sep, value } = collItem;
    const keyProps = resolveProps(start, {
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: bm.indent,
      startOnNewline: true
    });
    const implicitKey = !keyProps.found;
    if (implicitKey) {
      if (key) {
        if (key.type === "block-seq")
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
        else if ("indent" in key && key.indent !== bm.indent)
          onError(offset, "BAD_INDENT", startColMsg);
      }
      if (!keyProps.anchor && !keyProps.tag && !sep) {
        commentEnd = keyProps.end;
        if (keyProps.comment) {
          if (map2.comment)
            map2.comment += "\n" + keyProps.comment;
          else
            map2.comment = keyProps.comment;
        }
        continue;
      }
      if (keyProps.newlineAfterProp || containsNewline(key)) {
        onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      }
    } else if (keyProps.found?.indent !== bm.indent) {
      onError(offset, "BAD_INDENT", startColMsg);
    }
    ctx.atKey = true;
    const keyStart = keyProps.end;
    const keyNode = key ? composeNode2(ctx, key, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bm.indent, key, onError);
    ctx.atKey = false;
    if (mapIncludes(ctx, map2.items, keyNode))
      onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
    const valueProps = resolveProps(sep ?? [], {
      indicator: "map-value-ind",
      next: value,
      offset: keyNode.range[2],
      onError,
      parentIndent: bm.indent,
      startOnNewline: !key || key.type === "block-scalar"
    });
    offset = valueProps.end;
    if (valueProps.found) {
      if (implicitKey) {
        if (value?.type === "block-map" && !valueProps.hasNewline)
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
        if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
          onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, value, onError);
      offset = valueNode.range[2];
      const pair = new Pair(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map2.items.push(pair);
    } else {
      if (implicitKey)
        onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
      if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair(keyNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map2.items.push(pair);
    }
  }
  if (commentEnd && commentEnd < offset)
    onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
  map2.range = [bm.offset, offset, commentEnd ?? offset];
  return map2;
}

// node_modules/yaml/browser/dist/compose/resolve-block-seq.js
function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLSeq;
  const seq2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = bs.offset;
  let commentEnd = null;
  for (const { start, value } of bs.items) {
    const props = resolveProps(start, {
      indicator: "seq-item-ind",
      next: value,
      offset,
      onError,
      parentIndent: bs.indent,
      startOnNewline: true
    });
    if (!props.found) {
      if (props.anchor || props.tag || value) {
        if (value?.type === "block-seq")
          onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
        else
          onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
      } else {
        commentEnd = props.end;
        if (props.comment)
          seq2.comment = props.comment;
        continue;
      }
    }
    const node2 = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bs.indent, value, onError);
    offset = node2.range[2];
    seq2.items.push(node2);
  }
  seq2.range = [bs.offset, offset, commentEnd ?? offset];
  return seq2;
}

// node_modules/yaml/browser/dist/compose/resolve-end.js
function resolveEnd(end, offset, reqSpace, onError) {
  let comment = "";
  if (end) {
    let hasSpace = false;
    let sep = "";
    for (const token of end) {
      const { source, type } = token;
      switch (type) {
        case "space":
          hasSpace = true;
          break;
        case "comment": {
          if (reqSpace && !hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += sep + cb;
          sep = "";
          break;
        }
        case "newline":
          if (comment)
            sep += source;
          hasSpace = true;
          break;
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
      }
      offset += source.length;
    }
  }
  return { comment, offset };
}

// node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var blockMsg = "Block collections are not allowed within flow collections";
var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError, tag) {
  const isMap2 = fc.start.source === "{";
  const fcName = isMap2 ? "flow map" : "flow sequence";
  const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap : YAMLSeq);
  const coll = new NodeClass(ctx.schema);
  coll.flow = true;
  const atRoot = ctx.atRoot;
  if (atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = fc.offset + fc.start.source.length;
  for (let i = 0; i < fc.items.length; ++i) {
    const collItem = fc.items[i];
    const { start, key, sep, value } = collItem;
    const props = resolveProps(start, {
      flow: fcName,
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: fc.indent,
      startOnNewline: false
    });
    if (!props.found) {
      if (!props.anchor && !props.tag && !sep && !value) {
        if (i === 0 && props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        else if (i < fc.items.length - 1)
          onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
        if (props.comment) {
          if (coll.comment)
            coll.comment += "\n" + props.comment;
          else
            coll.comment = props.comment;
        }
        offset = props.end;
        continue;
      }
      if (!isMap2 && ctx.options.strict && containsNewline(key))
        onError(
          key,
          // checked by containsNewline()
          "MULTILINE_IMPLICIT_KEY",
          "Implicit keys of flow sequence pairs need to be on a single line"
        );
    }
    if (i === 0) {
      if (props.comma)
        onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
    } else {
      if (!props.comma)
        onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
      if (props.comment) {
        let prevItemComment = "";
        loop: for (const st of start) {
          switch (st.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              prevItemComment = st.source.substring(1);
              break loop;
            default:
              break loop;
          }
        }
        if (prevItemComment) {
          let prev = coll.items[coll.items.length - 1];
          if (isPair(prev))
            prev = prev.value ?? prev.key;
          if (prev.comment)
            prev.comment += "\n" + prevItemComment;
          else
            prev.comment = prevItemComment;
          props.comment = props.comment.substring(prevItemComment.length + 1);
        }
      }
    }
    if (!isMap2 && !sep && !props.found) {
      const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
      coll.items.push(valueNode);
      offset = valueNode.range[2];
      if (isBlock(value))
        onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
    } else {
      ctx.atKey = true;
      const keyStart = props.end;
      const keyNode = key ? composeNode2(ctx, key, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
      if (isBlock(key))
        onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
      ctx.atKey = false;
      const valueProps = resolveProps(sep ?? [], {
        flow: fcName,
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (valueProps.found) {
        if (!isMap2 && !props.found && ctx.options.strict) {
          if (sep)
            for (const st of sep) {
              if (st === valueProps.found)
                break;
              if (st.type === "newline") {
                onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          if (props.start < valueProps.found.offset - 1024)
            onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else if (value) {
        if ("source" in value && value.source?.[0] === ":")
          onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
        else
          onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
      if (valueNode) {
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      if (isMap2) {
        const map2 = coll;
        if (mapIncludes(ctx, map2.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        map2.items.push(pair);
      } else {
        const map2 = new YAMLMap(ctx.schema);
        map2.flow = true;
        map2.items.push(pair);
        const endRange = (valueNode ?? keyNode).range;
        map2.range = [keyNode.range[0], endRange[1], endRange[2]];
        coll.items.push(map2);
      }
      offset = valueNode ? valueNode.range[2] : valueProps.end;
    }
  }
  const expectedEnd = isMap2 ? "}" : "]";
  const [ce, ...ee] = fc.end;
  let cePos = offset;
  if (ce?.source === expectedEnd)
    cePos = ce.offset + ce.source.length;
  else {
    const name = fcName[0].toUpperCase() + fcName.substring(1);
    const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
    onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
    if (ce && ce.source.length !== 1)
      ee.unshift(ce);
  }
  if (ee.length > 0) {
    const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
    if (end.comment) {
      if (coll.comment)
        coll.comment += "\n" + end.comment;
      else
        coll.comment = end.comment;
    }
    coll.range = [fc.offset, cePos, end.offset];
  } else {
    coll.range = [fc.offset, cePos, cePos];
  }
  return coll;
}

// node_modules/yaml/browser/dist/compose/compose-collection.js
function resolveCollection(CN2, ctx, token, onError, tagName, tag) {
  const coll = token.type === "block-map" ? resolveBlockMap(CN2, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq(CN2, ctx, token, onError, tag) : resolveFlowCollection(CN2, ctx, token, onError, tag);
  const Coll = coll.constructor;
  if (tagName === "!" || tagName === Coll.tagName) {
    coll.tag = Coll.tagName;
    return coll;
  }
  if (tagName)
    coll.tag = tagName;
  return coll;
}
function composeCollection(CN2, ctx, token, props, onError) {
  const tagToken = props.tag;
  const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
  if (token.type === "block-seq") {
    const { anchor, newlineAfterProp: nl } = props;
    const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
    if (lastProp && (!nl || nl.offset < lastProp.offset)) {
      const message = "Missing newline after block sequence props";
      onError(lastProp, "MISSING_CHAR", message);
    }
  }
  const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
  if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.tagName && expType === "seq") {
    return resolveCollection(CN2, ctx, token, onError, tagName);
  }
  let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
  if (!tag) {
    const kt = ctx.schema.knownTags[tagName];
    if (kt?.collection === expType) {
      ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
      tag = kt;
    } else {
      if (kt) {
        onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
      } else {
        onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
      }
      return resolveCollection(CN2, ctx, token, onError, tagName);
    }
  }
  const coll = resolveCollection(CN2, ctx, token, onError, tagName, tag);
  const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
  const node2 = isNode(res) ? res : new Scalar(res);
  node2.range = coll.range;
  node2.tag = tagName;
  if (tag?.format)
    node2.format = tag.format;
  return node2;
}

// node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function resolveBlockScalar(ctx, scalar, onError) {
  const start = scalar.offset;
  const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
  if (!header)
    return { value: "", type: null, comment: "", range: [start, start, start] };
  const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
  const lines = scalar.source ? splitLines(scalar.source) : [];
  let chompStart = lines.length;
  for (let i = lines.length - 1; i >= 0; --i) {
    const content = lines[i][1];
    if (content === "" || content === "\r")
      chompStart = i;
    else
      break;
  }
  if (chompStart === 0) {
    const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
    let end2 = start + header.length;
    if (scalar.source)
      end2 += scalar.source.length;
    return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
  }
  let trimIndent = scalar.indent + header.indent;
  let offset = scalar.offset + header.length;
  let contentStart = 0;
  for (let i = 0; i < chompStart; ++i) {
    const [indent, content] = lines[i];
    if (content === "" || content === "\r") {
      if (header.indent === 0 && indent.length > trimIndent)
        trimIndent = indent.length;
    } else {
      if (indent.length < trimIndent) {
        const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
        onError(offset + indent.length, "MISSING_CHAR", message);
      }
      if (header.indent === 0)
        trimIndent = indent.length;
      contentStart = i;
      if (trimIndent === 0 && !ctx.atRoot) {
        const message = "Block scalar values in collections must be indented";
        onError(offset, "BAD_INDENT", message);
      }
      break;
    }
    offset += indent.length + content.length + 1;
  }
  for (let i = lines.length - 1; i >= chompStart; --i) {
    if (lines[i][0].length > trimIndent)
      chompStart = i + 1;
  }
  let value = "";
  let sep = "";
  let prevMoreIndented = false;
  for (let i = 0; i < contentStart; ++i)
    value += lines[i][0].slice(trimIndent) + "\n";
  for (let i = contentStart; i < chompStart; ++i) {
    let [indent, content] = lines[i];
    offset += indent.length + content.length + 1;
    const crlf = content[content.length - 1] === "\r";
    if (crlf)
      content = content.slice(0, -1);
    if (content && indent.length < trimIndent) {
      const src = header.indent ? "explicit indentation indicator" : "first line";
      const message = `Block scalar lines must not be less indented than their ${src}`;
      onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
      indent = "";
    }
    if (type === Scalar.BLOCK_LITERAL) {
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
    } else if (indent.length > trimIndent || content[0] === "	") {
      if (sep === " ")
        sep = "\n";
      else if (!prevMoreIndented && sep === "\n")
        sep = "\n\n";
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
      prevMoreIndented = true;
    } else if (content === "") {
      if (sep === "\n")
        value += "\n";
      else
        sep = "\n";
    } else {
      value += sep + content;
      sep = " ";
      prevMoreIndented = false;
    }
  }
  switch (header.chomp) {
    case "-":
      break;
    case "+":
      for (let i = chompStart; i < lines.length; ++i)
        value += "\n" + lines[i][0].slice(trimIndent);
      if (value[value.length - 1] !== "\n")
        value += "\n";
      break;
    default:
      value += "\n";
  }
  const end = start + header.length + scalar.source.length;
  return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
  if (props[0].type !== "block-scalar-header") {
    onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
    return null;
  }
  const { source } = props[0];
  const mode = source[0];
  let indent = 0;
  let chomp = "";
  let error = -1;
  for (let i = 1; i < source.length; ++i) {
    const ch = source[i];
    if (!chomp && (ch === "-" || ch === "+"))
      chomp = ch;
    else {
      const n = Number(ch);
      if (!indent && n)
        indent = n;
      else if (error === -1)
        error = offset + i;
    }
  }
  if (error !== -1)
    onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
  let hasSpace = false;
  let comment = "";
  let length = source.length;
  for (let i = 1; i < props.length; ++i) {
    const token = props[i];
    switch (token.type) {
      case "space":
        hasSpace = true;
      // fallthrough
      case "newline":
        length += token.source.length;
        break;
      case "comment":
        if (strict && !hasSpace) {
          const message = "Comments must be separated from other tokens by white space characters";
          onError(token, "MISSING_CHAR", message);
        }
        length += token.source.length;
        comment = token.source.substring(1);
        break;
      case "error":
        onError(token, "UNEXPECTED_TOKEN", token.message);
        length += token.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        const message = `Unexpected token in block scalar header: ${token.type}`;
        onError(token, "UNEXPECTED_TOKEN", message);
        const ts = token.source;
        if (ts && typeof ts === "string")
          length += ts.length;
      }
    }
  }
  return { mode, indent, chomp, comment, length };
}
function splitLines(source) {
  const split = source.split(/\n( *)/);
  const first = split[0];
  const m = first.match(/^( *)/);
  const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
  const lines = [line0];
  for (let i = 1; i < split.length; i += 2)
    lines.push([split[i], split[i + 1]]);
  return lines;
}

// node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function resolveFlowScalar(scalar, strict, onError) {
  const { offset, type, source, end } = scalar;
  let _type;
  let value;
  const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
  switch (type) {
    case "scalar":
      _type = Scalar.PLAIN;
      value = plainValue(source, _onError);
      break;
    case "single-quoted-scalar":
      _type = Scalar.QUOTE_SINGLE;
      value = singleQuotedValue(source, _onError);
      break;
    case "double-quoted-scalar":
      _type = Scalar.QUOTE_DOUBLE;
      value = doubleQuotedValue(source, _onError);
      break;
    /* istanbul ignore next should not happen */
    default:
      onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
      return {
        value: "",
        type: null,
        comment: "",
        range: [offset, offset + source.length, offset + source.length]
      };
  }
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, strict, onError);
  return {
    value,
    type: _type,
    comment: re.comment,
    range: [offset, valueEnd, re.offset]
  };
}
function plainValue(source, onError) {
  let badChar = "";
  switch (source[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      badChar = "a tab character";
      break;
    case ",":
      badChar = "flow indicator character ,";
      break;
    case "%":
      badChar = "directive indicator character %";
      break;
    case "|":
    case ">": {
      badChar = `block scalar indicator ${source[0]}`;
      break;
    }
    case "@":
    case "`": {
      badChar = `reserved character ${source[0]}`;
      break;
    }
  }
  if (badChar)
    onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
  return unfoldLines(source);
}
function singleQuotedValue(source, onError) {
  if (source[source.length - 1] !== "'" || source.length === 1)
    onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
  return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function unfoldLines(source) {
  const line = /(.*?)\r?\n/sy;
  let match = line.exec(source);
  if (!match)
    return source;
  let trimEnd, trimBoth;
  try {
    trimEnd = new RegExp("(?<![ 	])[ 	]+$");
    trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
  } catch {
    trimEnd = /[ \t]+$/;
    trimBoth = /^[ \t]+|[ \t]+$/g;
  }
  let res = match[1].replace(trimEnd, "");
  let sep = " ";
  let pos = line.lastIndex;
  while (match = line.exec(source)) {
    const lm = match[1].replace(trimBoth, "");
    if (lm === "") {
      if (sep === "\n")
        res += sep;
      else
        sep = "\n";
    } else {
      res += sep + lm;
      sep = " ";
    }
    pos = line.lastIndex;
  }
  const last = /[ \t]*(.*)/sy;
  last.lastIndex = pos;
  match = last.exec(source);
  return res + sep + (match?.[1] ?? "");
}
function doubleQuotedValue(source, onError) {
  let res = "";
  for (let i = 1; i < source.length - 1; ++i) {
    const ch = source[i];
    if (ch === "\r" && source[i + 1] === "\n")
      continue;
    if (ch === "\n") {
      const { fold, offset } = foldNewline(source, i);
      res += fold;
      i = offset;
    } else if (ch === "\\") {
      let next = source[++i];
      const cc = escapeCodes[next];
      if (cc)
        res += cc;
      else if (next === "\n") {
        next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "\r" && source[i + 1] === "\n") {
        next = source[++i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "x" || next === "u" || next === "U") {
        const length = next === "x" ? 2 : next === "u" ? 4 : 8;
        res += parseCharCode(source, i + 1, length, onError);
        i += length;
      } else {
        const raw = source.substr(i - 1, 2);
        onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        res += raw;
      }
    } else if (ch === " " || ch === "	") {
      const wsStart = i;
      let next = source[i + 1];
      while (next === " " || next === "	")
        next = source[++i + 1];
      if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
        res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
    } else {
      res += ch;
    }
  }
  if (source[source.length - 1] !== '"' || source.length === 1)
    onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
  return res;
}
function foldNewline(source, offset) {
  let fold = "";
  let ch = source[offset + 1];
  while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
    if (ch === "\r" && source[offset + 2] !== "\n")
      break;
    if (ch === "\n")
      fold += "\n";
    offset += 1;
    ch = source[offset + 1];
  }
  if (!fold)
    fold = " ";
  return { fold, offset };
}
var escapeCodes = {
  "0": "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: "\n",
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "\x85",
  // Unicode next line
  _: "\xA0",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function parseCharCode(source, offset, length, onError) {
  const cc = source.substr(offset, length);
  const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
  const code = ok ? parseInt(cc, 16) : NaN;
  try {
    return String.fromCodePoint(code);
  } catch {
    const raw = source.substr(offset - 2, length + 2);
    onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
    return raw;
  }
}

// node_modules/yaml/browser/dist/compose/compose-scalar.js
function composeScalar(ctx, token, tagToken, onError) {
  const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar(ctx, token, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
  const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
  let tag;
  if (ctx.options.stringKeys && ctx.atKey) {
    tag = ctx.schema[SCALAR];
  } else if (tagName)
    tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
  else if (token.type === "scalar")
    tag = findScalarTagByTest(ctx, value, token, onError);
  else
    tag = ctx.schema[SCALAR];
  let scalar;
  try {
    const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
    scalar = isScalar(res) ? res : new Scalar(res);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
    scalar = new Scalar(value);
  }
  scalar.range = range;
  scalar.source = value;
  if (type)
    scalar.type = type;
  if (tagName)
    scalar.tag = tagName;
  if (tag.format)
    scalar.format = tag.format;
  if (comment)
    scalar.comment = comment;
  return scalar;
}
function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
  if (tagName === "!")
    return schema4[SCALAR];
  const matchWithTest = [];
  for (const tag of schema4.tags) {
    if (!tag.collection && tag.tag === tagName) {
      if (tag.default && tag.test)
        matchWithTest.push(tag);
      else
        return tag;
    }
  }
  for (const tag of matchWithTest)
    if (tag.test?.test(value))
      return tag;
  const kt = schema4.knownTags[tagName];
  if (kt && !kt.collection) {
    schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
    return kt;
  }
  onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
  return schema4[SCALAR];
}
function findScalarTagByTest({ atKey, directives, schema: schema4 }, value, token, onError) {
  const tag = schema4.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema4[SCALAR];
  if (schema4.compat) {
    const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
    if (tag.tag !== compat.tag) {
      const ts = directives.tagString(tag.tag);
      const cs = directives.tagString(compat.tag);
      const msg = `Value may be parsed as either ${ts} or ${cs}`;
      onError(token, "TAG_RESOLVE_FAILED", msg, true);
    }
  }
  return tag;
}

// node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function emptyScalarPosition(offset, before, pos) {
  if (before) {
    pos ?? (pos = before.length);
    for (let i = pos - 1; i >= 0; --i) {
      let st = before[i];
      switch (st.type) {
        case "space":
        case "comment":
        case "newline":
          offset -= st.source.length;
          continue;
      }
      st = before[++i];
      while (st?.type === "space") {
        offset += st.source.length;
        st = before[++i];
      }
      break;
    }
  }
  return offset;
}

// node_modules/yaml/browser/dist/compose/compose-node.js
var CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
  const atKey = ctx.atKey;
  const { spaceBefore, comment, anchor, tag } = props;
  let node2;
  let isSrcToken = true;
  switch (token.type) {
    case "alias":
      node2 = composeAlias(ctx, token, onError);
      if (anchor || tag)
        onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      node2 = composeScalar(ctx, token, tag, onError);
      if (anchor)
        node2.anchor = anchor.source.substring(1);
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        node2 = composeCollection(CN, ctx, token, props, onError);
        if (anchor)
          node2.anchor = anchor.source.substring(1);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        onError(token, "RESOURCE_EXHAUSTION", message);
      }
      break;
    default: {
      const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
      onError(token, "UNEXPECTED_TOKEN", message);
      isSrcToken = false;
    }
  }
  node2 ?? (node2 = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
  if (anchor && node2.anchor === "")
    onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  if (atKey && ctx.options.stringKeys && (!isScalar(node2) || typeof node2.value !== "string" || node2.tag && node2.tag !== "tag:yaml.org,2002:str")) {
    const msg = "With stringKeys, all keys must be strings";
    onError(tag ?? token, "NON_STRING_KEY", msg);
  }
  if (spaceBefore)
    node2.spaceBefore = true;
  if (comment) {
    if (token.type === "scalar" && token.source === "")
      node2.comment = comment;
    else
      node2.commentBefore = comment;
  }
  if (ctx.options.keepSourceTokens && isSrcToken)
    node2.srcToken = token;
  return node2;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
  const token = {
    type: "scalar",
    offset: emptyScalarPosition(offset, before, pos),
    indent: -1,
    source: ""
  };
  const node2 = composeScalar(ctx, token, tag, onError);
  if (anchor) {
    node2.anchor = anchor.source.substring(1);
    if (node2.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  }
  if (spaceBefore)
    node2.spaceBefore = true;
  if (comment) {
    node2.comment = comment;
    node2.range[2] = end;
  }
  return node2;
}
function composeAlias({ options }, { offset, source, end }, onError) {
  const alias = new Alias(source.substring(1));
  if (alias.source === "")
    onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
  if (alias.source.endsWith(":"))
    onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, options.strict, onError);
  alias.range = [offset, valueEnd, re.offset];
  if (re.comment)
    alias.comment = re.comment;
  return alias;
}

// node_modules/yaml/browser/dist/compose/compose-doc.js
function composeDoc(options, directives, { offset, start, value, end }, onError) {
  const opts = Object.assign({ _directives: directives }, options);
  const doc = new Document(void 0, opts);
  const ctx = {
    atKey: false,
    atRoot: true,
    directives: doc.directives,
    options: doc.options,
    schema: doc.schema
  };
  const props = resolveProps(start, {
    indicator: "doc-start",
    next: value ?? end?.[0],
    offset,
    onError,
    parentIndent: 0,
    startOnNewline: true
  });
  if (props.found) {
    doc.directives.docStart = true;
    if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
      onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
  }
  doc.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
  const contentEnd = doc.contents.range[2];
  const re = resolveEnd(end, contentEnd, false, onError);
  if (re.comment)
    doc.comment = re.comment;
  doc.range = [offset, contentEnd, re.offset];
  return doc;
}

// node_modules/yaml/browser/dist/compose/composer.js
function getErrorPos(src) {
  if (typeof src === "number")
    return [src, src + 1];
  if (Array.isArray(src))
    return src.length === 2 ? src : [src[0], src[1]];
  const { offset, source } = src;
  return [offset, offset + (typeof source === "string" ? source.length : 1)];
}
function parsePrelude(prelude) {
  let comment = "";
  let atComment = false;
  let afterEmptyLine = false;
  for (let i = 0; i < prelude.length; ++i) {
    const source = prelude[i];
    switch (source[0]) {
      case "#":
        comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
        atComment = true;
        afterEmptyLine = false;
        break;
      case "%":
        if (prelude[i + 1]?.[0] !== "#")
          i += 1;
        atComment = false;
        break;
      default:
        if (!atComment)
          afterEmptyLine = true;
        atComment = false;
    }
  }
  return { comment, afterEmptyLine };
}
var Composer = class {
  constructor(options = {}) {
    this.doc = null;
    this.atDirectives = false;
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
    this.onError = (source, code, message, warning) => {
      const pos = getErrorPos(source);
      if (warning)
        this.warnings.push(new YAMLWarning(pos, code, message));
      else
        this.errors.push(new YAMLParseError(pos, code, message));
    };
    this.directives = new Directives({ version: options.version || "1.2" });
    this.options = options;
  }
  decorate(doc, afterDoc) {
    const { comment, afterEmptyLine } = parsePrelude(this.prelude);
    if (comment) {
      const dc = doc.contents;
      if (afterDoc) {
        doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
      } else if (afterEmptyLine || doc.directives.docStart || !dc) {
        doc.commentBefore = comment;
      } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
        let it = dc.items[0];
        if (isPair(it))
          it = it.key;
        const cb = it.commentBefore;
        it.commentBefore = cb ? `${comment}
${cb}` : comment;
      } else {
        const cb = dc.commentBefore;
        dc.commentBefore = cb ? `${comment}
${cb}` : comment;
      }
    }
    if (afterDoc) {
      for (let i = 0; i < this.errors.length; ++i)
        doc.errors.push(this.errors[i]);
      for (let i = 0; i < this.warnings.length; ++i)
        doc.warnings.push(this.warnings[i]);
    } else {
      doc.errors = this.errors;
      doc.warnings = this.warnings;
    }
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: parsePrelude(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(tokens, forceDoc = false, endOffset = -1) {
    for (const token of tokens)
      yield* this.next(token);
    yield* this.end(forceDoc, endOffset);
  }
  /** Advance the composer by one CST token. */
  *next(token) {
    switch (token.type) {
      case "directive":
        this.directives.add(token.source, (offset, message, warning) => {
          const pos = getErrorPos(token);
          pos[0] += offset;
          this.onError(pos, "BAD_DIRECTIVE", message, warning);
        });
        this.prelude.push(token.source);
        this.atDirectives = true;
        break;
      case "document": {
        const doc = composeDoc(this.options, this.directives, token, this.onError);
        if (this.atDirectives && !doc.directives.docStart)
          this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
        this.decorate(doc, false);
        if (this.doc)
          yield this.doc;
        this.doc = doc;
        this.atDirectives = false;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(token.source);
        break;
      case "error": {
        const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
        const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
        if (this.atDirectives || !this.doc)
          this.errors.push(error);
        else
          this.doc.errors.push(error);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const msg = "Unexpected doc-end without preceding document";
          this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
          break;
        }
        this.doc.directives.docEnd = true;
        const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
        this.decorate(this.doc, true);
        if (end.comment) {
          const dc = this.doc.comment;
          this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
        }
        this.doc.range[2] = end.offset;
        break;
      }
      default:
        this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(forceDoc = false, endOffset = -1) {
    if (this.doc) {
      this.decorate(this.doc, true);
      yield this.doc;
      this.doc = null;
    } else if (forceDoc) {
      const opts = Object.assign({ _directives: this.directives }, this.options);
      const doc = new Document(void 0, opts);
      if (this.atDirectives)
        this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
      doc.range = [0, endOffset, endOffset];
      this.decorate(doc, false);
      yield doc;
    }
  }
};

// node_modules/yaml/browser/dist/parse/cst-visit.js
var BREAK2 = Symbol("break visit");
var SKIP2 = Symbol("skip children");
var REMOVE2 = Symbol("remove item");
function visit2(cst, visitor) {
  if ("type" in cst && cst.type === "document")
    cst = { start: cst.start, value: cst.value };
  _visit(Object.freeze([]), cst, visitor);
}
visit2.BREAK = BREAK2;
visit2.SKIP = SKIP2;
visit2.REMOVE = REMOVE2;
visit2.itemAtPath = (cst, path) => {
  let item = cst;
  for (const [field, index] of path) {
    const tok = item?.[field];
    if (tok && "items" in tok) {
      item = tok.items[index];
    } else
      return void 0;
  }
  return item;
};
visit2.parentCollection = (cst, path) => {
  const parent = visit2.itemAtPath(cst, path.slice(0, -1));
  const field = path[path.length - 1][0];
  const coll = parent?.[field];
  if (coll && "items" in coll)
    return coll;
  throw new Error("Parent collection not found");
};
function _visit(path, item, visitor) {
  let ctrl = visitor(item, path);
  if (typeof ctrl === "symbol")
    return ctrl;
  for (const field of ["key", "value"]) {
    const token = item[field];
    if (token && "items" in token) {
      for (let i = 0; i < token.items.length; ++i) {
        const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK2)
          return BREAK2;
        else if (ci === REMOVE2) {
          token.items.splice(i, 1);
          i -= 1;
        }
      }
      if (typeof ctrl === "function" && field === "key")
        ctrl = ctrl(item, path);
    }
  }
  return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
}

// node_modules/yaml/browser/dist/parse/cst.js
var BOM = "\uFEFF";
var DOCUMENT = "";
var FLOW_END = "";
var SCALAR2 = "";
function tokenType(source) {
  switch (source) {
    case BOM:
      return "byte-order-mark";
    case DOCUMENT:
      return "doc-mode";
    case FLOW_END:
      return "flow-error-end";
    case SCALAR2:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case "\n":
    case "\r\n":
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (source[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}

// node_modules/yaml/browser/dist/parse/lexer.js
function isEmpty(ch) {
  switch (ch) {
    case void 0:
    case " ":
    case "\n":
    case "\r":
    case "	":
      return true;
    default:
      return false;
  }
}
var hexDigits = new Set("0123456789ABCDEFabcdef");
var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
var flowIndicatorChars = new Set(",[]{}");
var invalidAnchorChars = new Set(" ,[]{}\n\r	");
var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
var Lexer = class {
  constructor() {
    this.atEnd = false;
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    this.buffer = "";
    this.flowKey = false;
    this.flowLevel = 0;
    this.indentNext = 0;
    this.indentValue = 0;
    this.lineEndPos = null;
    this.next = null;
    this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(source, incomplete = false) {
    if (source) {
      if (typeof source !== "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + source : source;
      this.lineEndPos = null;
    }
    this.atEnd = !incomplete;
    let next = this.next ?? "stream";
    while (next && (incomplete || this.hasChars(1)))
      next = yield* this.parseNext(next);
  }
  atLineEnd() {
    let i = this.pos;
    let ch = this.buffer[i];
    while (ch === " " || ch === "	")
      ch = this.buffer[++i];
    if (!ch || ch === "#" || ch === "\n")
      return true;
    if (ch === "\r")
      return this.buffer[i + 1] === "\n";
    return false;
  }
  charAt(n) {
    return this.buffer[this.pos + n];
  }
  continueScalar(offset) {
    let ch = this.buffer[offset];
    if (this.indentNext > 0) {
      let indent = 0;
      while (ch === " ")
        ch = this.buffer[++indent + offset];
      if (ch === "\r") {
        const next = this.buffer[indent + offset + 1];
        if (next === "\n" || !next && !this.atEnd)
          return offset + indent + 1;
      }
      return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
    }
    if (ch === "-" || ch === ".") {
      const dt = this.buffer.substr(offset, 3);
      if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
        return -1;
    }
    return offset;
  }
  getLine() {
    let end = this.lineEndPos;
    if (typeof end !== "number" || end !== -1 && end < this.pos) {
      end = this.buffer.indexOf("\n", this.pos);
      this.lineEndPos = end;
    }
    if (end === -1)
      return this.atEnd ? this.buffer.substring(this.pos) : null;
    if (this.buffer[end - 1] === "\r")
      end -= 1;
    return this.buffer.substring(this.pos, end);
  }
  hasChars(n) {
    return this.pos + n <= this.buffer.length;
  }
  setNext(state) {
    this.buffer = this.buffer.substring(this.pos);
    this.pos = 0;
    this.lineEndPos = null;
    this.next = state;
    return null;
  }
  peek(n) {
    return this.buffer.substr(this.pos, n);
  }
  *parseNext(next) {
    switch (next) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let line = this.getLine();
    if (line === null)
      return this.setNext("stream");
    if (line[0] === BOM) {
      yield* this.pushCount(1);
      line = line.substring(1);
    }
    if (line[0] === "%") {
      let dirEnd = line.length;
      let cs = line.indexOf("#");
      while (cs !== -1) {
        const ch = line[cs - 1];
        if (ch === " " || ch === "	") {
          dirEnd = cs - 1;
          break;
        } else {
          cs = line.indexOf("#", cs + 1);
        }
      }
      while (true) {
        const ch = line[dirEnd - 1];
        if (ch === " " || ch === "	")
          dirEnd -= 1;
        else
          break;
      }
      const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
      yield* this.pushCount(line.length - n);
      this.pushNewline();
      return "stream";
    }
    if (this.atLineEnd()) {
      const sp = yield* this.pushSpaces(true);
      yield* this.pushCount(line.length - sp);
      yield* this.pushNewline();
      return "stream";
    }
    yield DOCUMENT;
    return yield* this.parseLineStart();
  }
  *parseLineStart() {
    const ch = this.charAt(0);
    if (!ch && !this.atEnd)
      return this.setNext("line-start");
    if (ch === "-" || ch === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const s = this.peek(3);
      if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
        yield* this.pushCount(3);
        this.indentValue = 0;
        this.indentNext = 0;
        return s === "---" ? "doc" : "stream";
      }
    }
    this.indentValue = yield* this.pushSpaces(false);
    if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
      this.indentNext = this.indentValue;
    return yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [ch0, ch1] = this.peek(2);
    if (!ch1 && !this.atEnd)
      return this.setNext("block-start");
    if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
      this.indentNext = this.indentValue + 1;
      this.indentValue += n;
      return "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(true);
    const line = this.getLine();
    if (line === null)
      return this.setNext("doc");
    let n = yield* this.pushIndicators();
    switch (line[n]) {
      case "#":
        yield* this.pushCount(line.length - n);
      // fallthrough
      case void 0:
        yield* this.pushNewline();
        return yield* this.parseLineStart();
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel = 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        return "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        n += yield* this.parseBlockScalarHeader();
        n += yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - n);
        yield* this.pushNewline();
        return yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let nl, sp;
    let indent = -1;
    do {
      nl = yield* this.pushNewline();
      if (nl > 0) {
        sp = yield* this.pushSpaces(false);
        this.indentValue = indent = sp;
      } else {
        sp = 0;
      }
      sp += yield* this.pushSpaces(true);
    } while (nl + sp > 0);
    const line = this.getLine();
    if (line === null)
      return this.setNext("flow");
    if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
      const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
      if (!atFlowEndMarker) {
        this.flowLevel = 0;
        yield FLOW_END;
        return yield* this.parseLineStart();
      }
    }
    let n = 0;
    while (line[n] === ",") {
      n += yield* this.pushCount(1);
      n += yield* this.pushSpaces(true);
      this.flowKey = false;
    }
    n += yield* this.pushIndicators();
    switch (line[n]) {
      case void 0:
        return "flow";
      case "#":
        yield* this.pushCount(line.length - n);
        return "flow";
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel += 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        this.flowKey = true;
        this.flowLevel -= 1;
        return this.flowLevel ? "flow" : "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "flow";
      case '"':
      case "'":
        this.flowKey = true;
        return yield* this.parseQuotedScalar();
      case ":": {
        const next = this.charAt(1);
        if (this.flowKey || isEmpty(next) || next === ",") {
          this.flowKey = false;
          yield* this.pushCount(1);
          yield* this.pushSpaces(true);
          return "flow";
        }
      }
      // fallthrough
      default:
        this.flowKey = false;
        return yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const quote = this.charAt(0);
    let end = this.buffer.indexOf(quote, this.pos + 1);
    if (quote === "'") {
      while (end !== -1 && this.buffer[end + 1] === "'")
        end = this.buffer.indexOf("'", end + 2);
    } else {
      while (end !== -1) {
        let n = 0;
        while (this.buffer[end - 1 - n] === "\\")
          n += 1;
        if (n % 2 === 0)
          break;
        end = this.buffer.indexOf('"', end + 1);
      }
    }
    const qb = this.buffer.substring(0, end);
    let nl = qb.indexOf("\n", this.pos);
    if (nl !== -1) {
      while (nl !== -1) {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = qb.indexOf("\n", cs);
      }
      if (nl !== -1) {
        end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
      }
    }
    if (end === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      end = this.buffer.length;
    }
    yield* this.pushToIndex(end + 1, false);
    return this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    let i = this.pos;
    while (true) {
      const ch = this.buffer[++i];
      if (ch === "+")
        this.blockScalarKeep = true;
      else if (ch > "0" && ch <= "9")
        this.blockScalarIndent = Number(ch) - 1;
      else if (ch !== "-")
        break;
    }
    return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
  }
  *parseBlockScalar() {
    let nl = this.pos - 1;
    let indent = 0;
    let ch;
    loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
      switch (ch) {
        case " ":
          indent += 1;
          break;
        case "\n":
          nl = i2;
          indent = 0;
          break;
        case "\r": {
          const next = this.buffer[i2 + 1];
          if (!next && !this.atEnd)
            return this.setNext("block-scalar");
          if (next === "\n")
            break;
        }
        // fallthrough
        default:
          break loop;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("block-scalar");
    if (indent >= this.indentNext) {
      if (this.blockScalarIndent === -1)
        this.indentNext = indent;
      else {
        this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      }
      do {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = this.buffer.indexOf("\n", cs);
      } while (nl !== -1);
      if (nl === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        nl = this.buffer.length;
      }
    }
    let i = nl + 1;
    ch = this.buffer[i];
    while (ch === " ")
      ch = this.buffer[++i];
    if (ch === "	") {
      while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
        ch = this.buffer[++i];
      nl = i - 1;
    } else if (!this.blockScalarKeep) {
      do {
        let i2 = nl - 1;
        let ch2 = this.buffer[i2];
        if (ch2 === "\r")
          ch2 = this.buffer[--i2];
        const lastChar = i2;
        while (ch2 === " ")
          ch2 = this.buffer[--i2];
        if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
          nl = i2;
        else
          break;
      } while (true);
    }
    yield SCALAR2;
    yield* this.pushToIndex(nl + 1, true);
    return yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const inFlow = this.flowLevel > 0;
    let end = this.pos - 1;
    let i = this.pos - 1;
    let ch;
    while (ch = this.buffer[++i]) {
      if (ch === ":") {
        const next = this.buffer[i + 1];
        if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
          break;
        end = i;
      } else if (isEmpty(ch)) {
        let next = this.buffer[i + 1];
        if (ch === "\r") {
          if (next === "\n") {
            i += 1;
            ch = "\n";
            next = this.buffer[i + 1];
          } else
            end = i;
        }
        if (next === "#" || inFlow && flowIndicatorChars.has(next))
          break;
        if (ch === "\n") {
          const cs = this.continueScalar(i + 1);
          if (cs === -1)
            break;
          i = Math.max(i, cs - 2);
        }
      } else {
        if (inFlow && flowIndicatorChars.has(ch))
          break;
        end = i;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("plain-scalar");
    yield SCALAR2;
    yield* this.pushToIndex(end + 1, true);
    return inFlow ? "flow" : "doc";
  }
  *pushCount(n) {
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos += n;
      return n;
    }
    return 0;
  }
  *pushToIndex(i, allowEmpty) {
    const s = this.buffer.slice(this.pos, i);
    if (s) {
      yield s;
      this.pos += s.length;
      return s.length;
    } else if (allowEmpty)
      yield "";
    return 0;
  }
  *pushIndicators() {
    let n = 0;
    loop: while (true) {
      switch (this.charAt(0)) {
        case "!":
          n += yield* this.pushTag();
          n += yield* this.pushSpaces(true);
          continue loop;
        case "&":
          n += yield* this.pushUntil(isNotAnchorChar);
          n += yield* this.pushSpaces(true);
          continue loop;
        case "-":
        // this is an error
        case "?":
        // this is an error outside flow collections
        case ":": {
          const inFlow = this.flowLevel > 0;
          const ch1 = this.charAt(1);
          if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
            if (!inFlow)
              this.indentNext = this.indentValue + 1;
            else if (this.flowKey)
              this.flowKey = false;
            n += yield* this.pushCount(1);
            n += yield* this.pushSpaces(true);
            continue loop;
          }
        }
      }
      break loop;
    }
    return n;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let i = this.pos + 2;
      let ch = this.buffer[i];
      while (!isEmpty(ch) && ch !== ">")
        ch = this.buffer[++i];
      return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
    } else {
      let i = this.pos + 1;
      let ch = this.buffer[i];
      while (ch) {
        if (tagChars.has(ch))
          ch = this.buffer[++i];
        else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
          ch = this.buffer[i += 3];
        } else
          break;
      }
      return yield* this.pushToIndex(i, false);
    }
  }
  *pushNewline() {
    const ch = this.buffer[this.pos];
    if (ch === "\n")
      return yield* this.pushCount(1);
    else if (ch === "\r" && this.charAt(1) === "\n")
      return yield* this.pushCount(2);
    else
      return 0;
  }
  *pushSpaces(allowTabs) {
    let i = this.pos - 1;
    let ch;
    do {
      ch = this.buffer[++i];
    } while (ch === " " || allowTabs && ch === "	");
    const n = i - this.pos;
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos = i;
    }
    return n;
  }
  *pushUntil(test) {
    let i = this.pos;
    let ch = this.buffer[i];
    while (!test(ch))
      ch = this.buffer[++i];
    return yield* this.pushToIndex(i, false);
  }
};

// node_modules/yaml/browser/dist/parse/line-counter.js
var LineCounter = class {
  constructor() {
    this.lineStarts = [];
    this.addNewLine = (offset) => this.lineStarts.push(offset);
    this.linePos = (offset) => {
      let low = 0;
      let high = this.lineStarts.length;
      while (low < high) {
        const mid = low + high >> 1;
        if (this.lineStarts[mid] < offset)
          low = mid + 1;
        else
          high = mid;
      }
      if (this.lineStarts[low] === offset)
        return { line: low + 1, col: 1 };
      if (low === 0)
        return { line: 0, col: offset };
      const start = this.lineStarts[low - 1];
      return { line: low, col: offset - start + 1 };
    };
  }
};

// node_modules/yaml/browser/dist/parse/parser.js
function includesToken(list, type) {
  for (let i = 0; i < list.length; ++i)
    if (list[i].type === type)
      return true;
  return false;
}
function findNonEmptyIndex(list) {
  for (let i = 0; i < list.length; ++i) {
    switch (list[i].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return i;
    }
  }
  return -1;
}
function isFlowToken(token) {
  switch (token?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return true;
    default:
      return false;
  }
}
function getPrevProps(parent) {
  switch (parent.type) {
    case "document":
      return parent.start;
    case "block-map": {
      const it = parent.items[parent.items.length - 1];
      return it.sep ?? it.start;
    }
    case "block-seq":
      return parent.items[parent.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function getFirstKeyStartProps(prev) {
  if (prev.length === 0)
    return [];
  let i = prev.length;
  loop: while (--i >= 0) {
    switch (prev[i].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break loop;
    }
  }
  while (prev[++i]?.type === "space") {
  }
  return prev.splice(i, prev.length);
}
function arrayPushArray(target, source) {
  if (source.length < 1e5)
    Array.prototype.push.apply(target, source);
  else
    for (let i = 0; i < source.length; ++i)
      target.push(source[i]);
}
function fixFlowSeqItems(fc) {
  if (fc.start.type === "flow-seq-start") {
    for (const it of fc.items) {
      if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
        if (it.key)
          it.value = it.key;
        delete it.key;
        if (isFlowToken(it.value)) {
          if (it.value.end)
            arrayPushArray(it.value.end, it.sep);
          else
            it.value.end = it.sep;
        } else
          arrayPushArray(it.start, it.sep);
        delete it.sep;
      }
    }
  }
}
var Parser = class {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(onNewLine) {
    this.atNewLine = true;
    this.atScalar = false;
    this.indent = 0;
    this.offset = 0;
    this.onKeyLine = false;
    this.stack = [];
    this.source = "";
    this.type = "";
    this.lexer = new Lexer();
    this.onNewLine = onNewLine;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(source, incomplete = false) {
    if (this.onNewLine && this.offset === 0)
      this.onNewLine(0);
    for (const lexeme of this.lexer.lex(source, incomplete))
      yield* this.next(lexeme);
    if (!incomplete)
      yield* this.end();
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(source) {
    this.source = source;
    if (this.atScalar) {
      this.atScalar = false;
      yield* this.step();
      this.offset += source.length;
      return;
    }
    const type = tokenType(source);
    if (!type) {
      const message = `Not a YAML token: ${source}`;
      yield* this.pop({ type: "error", offset: this.offset, message, source });
      this.offset += source.length;
    } else if (type === "scalar") {
      this.atNewLine = false;
      this.atScalar = true;
      this.type = "scalar";
    } else {
      this.type = type;
      yield* this.step();
      switch (type) {
        case "newline":
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine)
            this.onNewLine(this.offset + source.length);
          break;
        case "space":
          if (this.atNewLine && source[0] === " ")
            this.indent += source.length;
          break;
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
          if (this.atNewLine)
            this.indent += source.length;
          break;
        case "doc-mode":
        case "flow-error-end":
          return;
        default:
          this.atNewLine = false;
      }
      this.offset += source.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    while (this.stack.length > 0)
      yield* this.pop();
  }
  get sourceToken() {
    const st = {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
    return st;
  }
  *step() {
    const top = this.peek(1);
    if (this.type === "doc-end" && top?.type !== "doc-end") {
      while (this.stack.length > 0)
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!top)
      return yield* this.stream();
    switch (top.type) {
      case "document":
        return yield* this.document(top);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(top);
      case "block-scalar":
        return yield* this.blockScalar(top);
      case "block-map":
        return yield* this.blockMap(top);
      case "block-seq":
        return yield* this.blockSequence(top);
      case "flow-collection":
        return yield* this.flowCollection(top);
      case "doc-end":
        return yield* this.documentEnd(top);
    }
    yield* this.pop();
  }
  peek(n) {
    return this.stack[this.stack.length - n];
  }
  *pop(error) {
    const token = error ?? this.stack.pop();
    if (!token) {
      const message = "Tried to pop an empty stack";
      yield { type: "error", offset: this.offset, source: "", message };
    } else if (this.stack.length === 0) {
      yield token;
    } else {
      const top = this.peek(1);
      if (token.type === "block-scalar") {
        token.indent = "indent" in top ? top.indent : 0;
      } else if (token.type === "flow-collection" && top.type === "document") {
        token.indent = 0;
      }
      if (token.type === "flow-collection")
        fixFlowSeqItems(token);
      switch (top.type) {
        case "document":
          top.value = token;
          break;
        case "block-scalar":
          top.props.push(token);
          break;
        case "block-map": {
          const it = top.items[top.items.length - 1];
          if (it.value) {
            top.items.push({ start: [], key: token, sep: [] });
            this.onKeyLine = true;
            return;
          } else if (it.sep) {
            it.value = token;
          } else {
            Object.assign(it, { key: token, sep: [] });
            this.onKeyLine = !it.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const it = top.items[top.items.length - 1];
          if (it.value)
            top.items.push({ start: [], value: token });
          else
            it.value = token;
          break;
        }
        case "flow-collection": {
          const it = top.items[top.items.length - 1];
          if (!it || it.value)
            top.items.push({ start: [], key: token, sep: [] });
          else if (it.sep)
            it.value = token;
          else
            Object.assign(it, { key: token, sep: [] });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop();
          yield* this.pop(token);
      }
      if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
        const last = token.items[token.items.length - 1];
        if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
          if (top.type === "document")
            top.end = last.start;
          else
            top.items.push({ start: last.start });
          token.items.splice(-1, 1);
        }
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const doc = {
          type: "document",
          offset: this.offset,
          start: []
        };
        if (this.type === "doc-start")
          doc.start.push(this.sourceToken);
        this.stack.push(doc);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(doc) {
    if (doc.value)
      return yield* this.lineEnd(doc);
    switch (this.type) {
      case "doc-start": {
        if (findNonEmptyIndex(doc.start) !== -1) {
          yield* this.pop();
          yield* this.step();
        } else
          doc.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        doc.start.push(this.sourceToken);
        return;
    }
    const bv = this.startBlockValue(doc);
    if (bv)
      this.stack.push(bv);
    else {
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML document`,
        source: this.source
      };
    }
  }
  *scalar(scalar) {
    if (this.type === "map-value-ind") {
      const prev = getPrevProps(this.peek(2));
      const start = getFirstKeyStartProps(prev);
      let sep;
      if (scalar.end) {
        sep = scalar.end;
        sep.push(this.sourceToken);
        delete scalar.end;
      } else
        sep = [this.sourceToken];
      const map2 = {
        type: "block-map",
        offset: scalar.offset,
        indent: scalar.indent,
        items: [{ start, key: scalar, sep }]
      };
      this.onKeyLine = true;
      this.stack[this.stack.length - 1] = map2;
    } else
      yield* this.lineEnd(scalar);
  }
  *blockScalar(scalar) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        scalar.props.push(this.sourceToken);
        return;
      case "scalar":
        scalar.source = this.source;
        this.atNewLine = true;
        this.indent = 0;
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop();
        yield* this.step();
    }
  }
  *blockMap(map2) {
    const it = map2.items[map2.items.length - 1];
    switch (this.type) {
      case "newline":
        this.onKeyLine = false;
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            map2.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          it.start.push(this.sourceToken);
        }
        return;
      case "space":
      case "comment":
        if (it.value) {
          map2.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          if (this.atIndentedComment(it.start, map2.indent)) {
            const prev = map2.items[map2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              arrayPushArray(end, it.start);
              end.push(this.sourceToken);
              map2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= map2.indent) {
      const atMapIndent = !this.onKeyLine && this.indent === map2.indent;
      const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
      let start = [];
      if (atNextItem && it.sep && !it.value) {
        const nl = [];
        for (let i = 0; i < it.sep.length; ++i) {
          const st = it.sep[i];
          switch (st.type) {
            case "newline":
              nl.push(i);
              break;
            case "space":
              break;
            case "comment":
              if (st.indent > map2.indent)
                nl.length = 0;
              break;
            default:
              nl.length = 0;
          }
        }
        if (nl.length >= 2)
          start = it.sep.splice(nl[1]);
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map2.items.push({ start });
            this.onKeyLine = true;
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "explicit-key-ind":
          if (!it.sep && !it.explicitKey) {
            it.start.push(this.sourceToken);
            it.explicitKey = true;
          } else if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map2.items.push({ start, explicitKey: true });
          } else {
            this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken], explicitKey: true }]
            });
          }
          this.onKeyLine = true;
          return;
        case "map-value-ind":
          if (it.explicitKey) {
            if (!it.sep) {
              if (includesToken(it.start, "newline")) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else {
                const start2 = getFirstKeyStartProps(it.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                });
              }
            } else if (it.value) {
              map2.items.push({ start: [], key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start, key: null, sep: [this.sourceToken] }]
              });
            } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
              const start2 = getFirstKeyStartProps(it.start);
              const key = it.key;
              const sep = it.sep;
              sep.push(this.sourceToken);
              delete it.key;
              delete it.sep;
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: start2, key, sep }]
              });
            } else if (start.length > 0) {
              it.sep = it.sep.concat(start, this.sourceToken);
            } else {
              it.sep.push(this.sourceToken);
            }
          } else {
            if (!it.sep) {
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            } else if (it.value || atNextItem) {
              map2.items.push({ start, key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [], key: null, sep: [this.sourceToken] }]
              });
            } else {
              it.sep.push(this.sourceToken);
            }
          }
          this.onKeyLine = true;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (atNextItem || it.value) {
            map2.items.push({ start, key: fs, sep: [] });
            this.onKeyLine = true;
          } else if (it.sep) {
            this.stack.push(fs);
          } else {
            Object.assign(it, { key: fs, sep: [] });
            this.onKeyLine = true;
          }
          return;
        }
        default: {
          const bv = this.startBlockValue(map2);
          if (bv) {
            if (bv.type === "block-seq") {
              if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else if (atMapIndent) {
              map2.items.push({ start });
            }
            this.stack.push(bv);
            return;
          }
        }
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *blockSequence(seq2) {
    const it = seq2.items[seq2.items.length - 1];
    switch (this.type) {
      case "newline":
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            seq2.items.push({ start: [this.sourceToken] });
        } else
          it.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (it.value)
          seq2.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(it.start, seq2.indent)) {
            const prev = seq2.items[seq2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              arrayPushArray(end, it.start);
              end.push(this.sourceToken);
              seq2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (it.value || this.indent <= seq2.indent)
          break;
        it.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== seq2.indent)
          break;
        if (it.value || includesToken(it.start, "seq-item-ind"))
          seq2.items.push({ start: [this.sourceToken] });
        else
          it.start.push(this.sourceToken);
        return;
    }
    if (this.indent > seq2.indent) {
      const bv = this.startBlockValue(seq2);
      if (bv) {
        this.stack.push(bv);
        return;
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *flowCollection(fc) {
    const it = fc.items[fc.items.length - 1];
    if (this.type === "flow-error-end") {
      let top;
      do {
        yield* this.pop();
        top = this.peek(1);
      } while (top?.type === "flow-collection");
    } else if (fc.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          if (!it || it.sep)
            fc.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          if (!it || it.value)
            fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            Object.assign(it, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          if (!it || it.value)
            fc.items.push({ start: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            it.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (!it || it.value)
            fc.items.push({ start: [], key: fs, sep: [] });
          else if (it.sep)
            this.stack.push(fs);
          else
            Object.assign(it, { key: fs, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          fc.end.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(fc);
      if (bv)
        this.stack.push(bv);
      else {
        yield* this.pop();
        yield* this.step();
      }
    } else {
      const parent = this.peek(2);
      if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
        yield* this.pop();
        yield* this.step();
      } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        fixFlowSeqItems(fc);
        const sep = fc.end.splice(1, fc.end.length);
        sep.push(this.sourceToken);
        const map2 = {
          type: "block-map",
          offset: fc.offset,
          indent: fc.indent,
          items: [{ start, key: fc, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map2;
      } else {
        yield* this.lineEnd(fc);
      }
    }
  }
  flowScalar(type) {
    if (this.onNewLine) {
      let nl = this.source.indexOf("\n") + 1;
      while (nl !== 0) {
        this.onNewLine(this.offset + nl);
        nl = this.source.indexOf("\n", nl) + 1;
      }
    }
    return {
      type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(parent) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        start.push(this.sourceToken);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, explicitKey: true }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(start, indent) {
    if (this.type !== "comment")
      return false;
    if (this.indent <= indent)
      return false;
    return start.every((st) => st.type === "newline" || st.type === "space");
  }
  *documentEnd(docEnd) {
    if (this.type !== "doc-mode") {
      if (docEnd.end)
        docEnd.end.push(this.sourceToken);
      else
        docEnd.end = [this.sourceToken];
      if (this.type === "newline")
        yield* this.pop();
    }
  }
  *lineEnd(token) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop();
        yield* this.step();
        break;
      case "newline":
        this.onKeyLine = false;
      // fallthrough
      case "space":
      case "comment":
      default:
        if (token.end)
          token.end.push(this.sourceToken);
        else
          token.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
    }
  }
};

// node_modules/yaml/browser/dist/public-api.js
function parseOptions(options) {
  const prettyErrors = options.prettyErrors !== false;
  const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
  return { lineCounter, prettyErrors };
}
function parseDocument(source, options = {}) {
  const { lineCounter, prettyErrors } = parseOptions(options);
  const parser = new Parser(lineCounter?.addNewLine);
  const composer = new Composer(options);
  let doc = null;
  for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
    if (!doc)
      doc = _doc;
    else if (doc.options.logLevel !== "silent") {
      doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  }
  if (prettyErrors && lineCounter) {
    doc.errors.forEach(prettifyError(source, lineCounter));
    doc.warnings.forEach(prettifyError(source, lineCounter));
  }
  return doc;
}
function parse(src, reviver, options) {
  let _reviver = void 0;
  if (typeof reviver === "function") {
    _reviver = reviver;
  } else if (options === void 0 && reviver && typeof reviver === "object") {
    options = reviver;
  }
  const doc = parseDocument(src, options);
  if (!doc)
    return null;
  doc.warnings.forEach((warning) => warn(doc.options.logLevel, warning));
  if (doc.errors.length > 0) {
    if (doc.options.logLevel !== "silent")
      throw doc.errors[0];
    else
      doc.errors = [];
  }
  return doc.toJS(Object.assign({ reviver: _reviver }, options));
}
function stringify3(value, replacer, options) {
  let _replacer = null;
  if (typeof replacer === "function" || Array.isArray(replacer)) {
    _replacer = replacer;
  } else if (options === void 0 && replacer) {
    options = replacer;
  }
  if (typeof options === "string")
    options = options.length;
  if (typeof options === "number") {
    const indent = Math.round(options);
    options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
  }
  if (value === void 0) {
    const { keepUndefined } = options ?? replacer ?? {};
    if (!keepUndefined)
      return void 0;
  }
  if (isDocument(value) && !_replacer)
    return value.toString(options);
  return new Document(value, _replacer, options).toString(options);
}

// src/model.ts
var SCHEMA = 1;
var GEAR_SLOTS = [
  { id: "hat", label: "Hat", short: "Hat" },
  { id: "glasses", label: "Glasses", short: "Glasses" },
  { id: "neck", label: "Neck", short: "Neck" },
  { id: "base", label: "Layer 0 \xB7 under", short: "Layer 0" },
  { id: "shirt", label: "Layer 1 \xB7 shirt", short: "Layer 1" },
  { id: "outer", label: "Layer 2 \xB7 overshirt / jacket", short: "Layer 2" },
  { id: "wrist", label: "Wrist", short: "Wrist" },
  { id: "lower", label: "Lower body", short: "Lower body" },
  { id: "accessories", label: "Accessories", short: "Accessory" },
  { id: "socks", label: "Socks", short: "Socks" },
  { id: "shoes", label: "Shoes", short: "Shoes" }
];
var COLORS = {
  navy: "#25395b",
  blue: "#7c9fca",
  cream: "#ede9d9",
  brown: "#79543b",
  black: "#22252b",
  gray: "#8b8e98",
  olive: "#687354",
  burgundy: "#863e54",
  white: "#ffffff",
  plum: "#76527f",
  petrol: "#347779",
  red: "#ca5149",
  stone: "#bbb5a8",
  gold: "#c2a054",
  copper: "#b97e5a",
  yellow: "#d7a126",
  mustard: "#b2934c",
  green: "#315b45",
  teal: "#269fa6",
  coral: "#dd8c7b",
  pink: "#ce94b2"
};
function safePath(path) {
  if (!path || path.includes("\\") || path.startsWith("/") || path.includes(":") || path.split("/").some((p) => p === ".." || p === "." || !p)) throw Error("Use a relative path inside the wardrobe folder.");
  return path;
}
function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
function pieceSlots(piece) {
  const slots = new Set(GEAR_SLOTS.map((s) => s.id));
  return [.../* @__PURE__ */ new Set([...piece.compatible_slots ?? [], ...piece.slot ? [piece.slot] : []])].filter((s) => slots.has(s));
}
function isProduct(piece) {
  return Boolean(piece.availability === "available" && piece.product_checked_at && (piece.product_id || piece.sku) && safeUrl(piece.product_url) && (piece.image || safeUrl(piece.image_source_url ?? "")) && piece.price !== null);
}
function reconcileProductEdit(previous, next) {
  if (previous && ["title", "store", "product_url", "image", "image_source_url", "product_id", "sku", "variant_color"].some((key) => previous[key] !== next[key])) return { ...next, availability: "unverified", product_checked_at: "", image_source_url: "" };
  return next;
}
function equipmentFor(outfit, pieces) {
  const explicit = Object.fromEntries(GEAR_SLOTS.filter((s) => typeof outfit.equipment?.[s.id] === "string" && outfit.equipment[s.id]).map((s) => [s.id, outfit.equipment[s.id]]));
  if (Object.keys(explicit).length) return explicit;
  const result = {};
  for (const id of outfit.piece_ids) {
    const p = pieces.find((x) => x.id === id);
    const slot = p && pieceSlots(p).find((s) => !result[s]);
    if (slot) result[slot] = id;
  }
  return result;
}
function slotOptions(pieces, slot) {
  return pieces.filter((p) => isProduct(p) && pieceSlots(p).includes(slot)).sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || a.title.localeCompare(b.title));
}
function equipmentSignature(outfit, pieces) {
  const eq = equipmentFor(outfit, pieces);
  return JSON.stringify(GEAR_SLOTS.flatMap((slot) => {
    const id = eq[slot.id];
    if (!id) return [];
    const p = pieces.find((p2) => p2.id === id);
    return [[slot.id, id, p?.title ?? "", p?.product_id ?? "", p?.sku ?? "", p?.variant_color ?? "", p?.product_url ?? "", p?.image_source_url ?? "", p?.image ?? "", p?.colors ?? []]];
  }));
}
function currentPreview(outfit, pieces) {
  const p = outfit.style_preview;
  if (!p || p.kind !== "ai-styling-preview" || typeof p.image !== "string" || !p.image || p.signature !== equipmentSignature(outfit, pieces) || !Number.isFinite(Date.parse(p.generated_at))) return;
  try {
    safePath(p.image);
  } catch {
    return;
  }
  const ids = Object.values(equipmentFor(outfit, pieces));
  if (!ids.length || ids.some((id) => !outfit.piece_ids.includes(id) || !pieces.some((piece) => piece.id === id && isProduct(piece)))) return;
  return p;
}
function createVariation(outfit, equipment, pieces, title) {
  const ids = [...new Set(Object.values(equipment).filter((id) => Boolean(id)))];
  if (!ids.length) throw Error("Equip at least one product.");
  for (const slot of GEAR_SLOTS) {
    const id = equipment[slot.id];
    if (!id) continue;
    const piece = pieces.find((p) => p.id === id);
    if (!piece || !isProduct(piece) || !pieceSlots(piece).includes(slot.id)) throw Error(`Choose a verified product for ${slot.label}.`);
  }
  return { ...outfit, id: `outfit-${crypto.randomUUID()}`, path: void 0, originalText: void 0, style_preview: void 0, title: title.trim() || `${outfit.title} / Remix`, piece_ids: ids, equipment: { ...equipment }, colors: [...new Set(ids.flatMap((id) => pieces.find((p) => p.id === id)?.colors ?? []))], image: "", image_credit: "", source_urls: ids.map((id) => pieces.find((p) => p.id === id).product_url), notes: `Variation of ${outfit.title}. Exact products are tagged by equipment slot.` };
}
var array = (value) => Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
function parseRecord(text, path = "") {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw Error("Missing YAML frontmatter");
  const raw = parse(match[1]);
  if (!raw || raw.schema !== SCHEMA || !["outfit", "piece"].includes(raw.type) || typeof raw.id !== "string" || !/^[a-z0-9][a-z0-9-]{0,100}$/.test(raw.id) || typeof raw.title !== "string" || !raw.title.trim()) throw Error("Invalid record identity or schema");
  const base = { ...raw, colors: array(raw.colors), notes: text.slice(match[0].length).replace(/^# [^\n]*\r?\n/, "").trim(), path, originalText: text };
  if (raw.type === "outfit") return { ...base, styles: array(raw.styles), occasions: array(raw.occasions), piece_ids: array(raw.piece_ids), source_urls: array(raw.source_urls), image: typeof raw.image === "string" ? raw.image : "", image_credit: typeof raw.image_credit === "string" ? raw.image_credit : "", season: typeof raw.season === "string" ? raw.season : "" };
  if (raw.price !== null && raw.price !== void 0 && (typeof raw.price !== "number" || !Number.isFinite(raw.price) || raw.price < 0)) throw Error("Invalid price");
  return { ...base, price: raw.price ?? null, ownership: ["owned", "wishlist", "reference"].includes(raw.ownership) ? raw.ownership : "reference", currency: raw.currency ?? "USD", category: raw.category ?? "other", store: raw.store ?? "", product_url: raw.product_url ?? "", price_checked_at: raw.price_checked_at ?? "", price_note: raw.price_note ?? "", image: raw.image ?? "" };
}
function serializeRecord(record, previous = "") {
  const { notes, path, originalText, ...properties } = record;
  const old = previous.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const existing = old ? parse(old[1]) : {};
  if (previous && !old) throw Error("Cannot overwrite a note without valid frontmatter.");
  const body = old ? previous.slice(old[0].length) : `# ${record.title}

${notes}
`;
  return `---
${stringify3({ ...existing, ...properties }, { lineWidth: 0 }).trim()}
---
${body}`;
}
function validateRating(raw) {
  const x = raw;
  if (!x || x.schema !== 1 || x.type !== "rating" || typeof x.id !== "string" || !/^[a-zA-Z0-9-]{10,100}$/.test(x.id) || typeof x.outfit_id !== "string" || !Number.isInteger(x.rating) || x.rating < 1 || x.rating > 5 || typeof x.created_at !== "string" || !Number.isFinite(Date.parse(x.created_at)) || typeof x.note !== "string" || !Array.isArray(x.reasons) || !x.reasons.every((v) => typeof v === "string") || !x.snapshot || typeof x.snapshot.title !== "string" || !Array.isArray(x.snapshot.styles) || !Array.isArray(x.snapshot.colors) || !Array.isArray(x.snapshot.occasions) || ![...x.snapshot.styles, ...x.snapshot.colors, ...x.snapshot.occasions].every((v) => typeof v === "string")) throw Error("Invalid rating event");
  return x;
}
function serializeRating(event) {
  return `---
${stringify3(validateRating(event), { lineWidth: 0 }).trim()}
---
# Outfit rating

${event.rating} / 5 for ${event.snapshot.title}

${event.note}
`;
}
function parseRating(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw Error("Missing rating frontmatter");
  return validateRating(parse(match[1]));
}
function newRating(outfit, rating, note = "", reasons = []) {
  return validateRating({ schema: 1, type: "rating", id: crypto.randomUUID(), outfit_id: outfit.id, rating, created_at: (/* @__PURE__ */ new Date()).toISOString(), note, reasons, snapshot: { title: outfit.title, styles: [...outfit.styles], colors: [...outfit.colors], occasions: [...outfit.occasions], piece_ids: [...outfit.piece_ids], ...outfit.equipment ? { equipment: { ...outfit.equipment } } : {} } });
}
function latestRatings(events) {
  const result = /* @__PURE__ */ new Map();
  for (const e of events) {
    const prior = result.get(e.outfit_id);
    if (!prior || `${e.created_at}|${e.id}` > `${prior.created_at}|${prior.id}`) result.set(e.outfit_id, e);
  }
  return result;
}
function cost(outfit, pieces) {
  const byId = new Map(pieces.map((p) => [p.id, p]));
  let known = 0, unknown = 0, owned = 0, stale = 0;
  for (const id of new Set(outfit.piece_ids)) {
    const p = byId.get(id);
    if (p?.ownership === "owned") {
      owned++;
      continue;
    }
    if (!p || p.price === null || p.currency !== "USD") {
      unknown++;
      continue;
    }
    known += p.price;
    if (!p.price_checked_at || !Number.isFinite(Date.parse(p.price_checked_at)) || Date.now() - Date.parse(p.price_checked_at) > 30 * 864e5) stale++;
  }
  return { known: Math.round(known * 100) / 100, unknown, owned, stale, complete: unknown === 0 };
}
var DEFAULT_FILTERS = { search: "", style: "", color: "", store: "", occasion: "", rating: "", maxPrice: "", includeUnknown: false, ownedOnly: false, sort: "recommended", collection: "" };
function taste(events) {
  const latest = [...latestRatings(events).values()];
  const features = /* @__PURE__ */ new Map();
  for (const e of latest) for (const kind of ["styles", "colors", "occasions"]) for (const label2 of new Set(e.snapshot[kind])) {
    const key = `${kind}:${label2}`, f = features.get(key) ?? { sum: 0, count: 0, label: label2, kind };
    f.sum += e.rating - 3;
    f.count++;
    features.set(key, f);
  }
  const list = [...features.values()].map((f) => ({ ...f, score: f.sum / (f.count + 3), average: 3 + f.sum / f.count })).sort((a, b) => b.score - a.score || b.count - a.count || a.label.localeCompare(b.label));
  return { rated: latest.length, events: events.length, liked: latest.filter((e) => e.rating >= 4).length, features: list };
}
function recommendation(outfit, events) {
  const profile = taste(events), matches = profile.features.filter((f) => f.kind === "styles" ? outfit.styles.includes(f.label) : f.kind === "colors" ? outfit.colors.includes(f.label) : outfit.occasions.includes(f.label));
  const score = matches.length ? matches.reduce((s, f) => s + f.score, 0) / Math.sqrt(matches.length) : 0;
  return { score, reasons: matches.filter((f) => f.score > 0).sort((a, b) => b.score - a.score).slice(0, 2).map((f) => `${f.label} (${f.count} rated look${f.count === 1 ? "" : "s"})`) };
}
function filterOutfits(catalog, filters) {
  const latest = latestRatings(catalog.ratings), byId = new Map(catalog.pieces.map((p) => [p.id, p]));
  return catalog.outfits.filter((o) => {
    const c = cost(o, catalog.pieces), r = latest.get(o.id)?.rating;
    return (!filters.search || `${o.title} ${o.notes} ${o.styles.join(" ")}`.toLowerCase().includes(filters.search.toLowerCase())) && (!filters.style || o.styles.includes(filters.style)) && (!filters.color || o.colors.includes(filters.color)) && (!filters.collection || o.collection === filters.collection) && (!filters.occasion || o.occasions.includes(filters.occasion)) && (!filters.store || o.piece_ids.some((id) => byId.get(id)?.store === filters.store)) && (!filters.rating || (filters.rating === "unrated" ? !r : filters.rating === "liked" ? (r ?? 0) >= 4 : r === Number(filters.rating))) && (!filters.ownedOnly || o.piece_ids.length > 0 && o.piece_ids.every((id) => byId.get(id)?.ownership === "owned")) && (filters.maxPrice === "" || (c.complete || filters.includeUnknown) && c.known <= Number(filters.maxPrice));
  }).sort((a, b) => {
    if (filters.sort === "price") {
      const ac = cost(a, catalog.pieces), bc = cost(b, catalog.pieces);
      return Number(!ac.complete) - Number(!bc.complete) || ac.known - bc.known;
    }
    if (filters.sort === "rating") return (latest.get(b.id)?.rating ?? 0) - (latest.get(a.id)?.rating ?? 0) || a.title.localeCompare(b.title);
    if (filters.sort === "title") return a.title.localeCompare(b.title);
    return recommendation(b, catalog.ratings).score - recommendation(a, catalog.ratings).score || Number(Boolean(currentPreview(b, catalog.pieces))) - Number(Boolean(currentPreview(a, catalog.pieces))) || a.title.localeCompare(b.title);
  });
}

// src/equipment.ts
var node = (tag, cls = "", text = "") => {
  const e = document.createElement(tag);
  e.className = cls;
  e.textContent = text;
  return e;
};
var usd = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
function slotIcon(slot) {
  const paths = { hat: "M3 16h18M6 16V9a6 6 0 0 1 12 0v7", glasses: "M2 12h3m5 0h4m5 0h3M5 8h5v7H5zM14 8h5v7h-5z", neck: "m6 3 6 8 6-8M6 3l-2 8 7 10 4-3-3-7", base: "m8 4-6 4 3 5 3-2v10h8V11l3 2 3-5-6-4-4 3z", shirt: "m8 4-6 4 3 5 3-2v10h8V11l3 2 3-5-6-4-4 3zM12 8v13", outer: "M8 3 3 7v14h5V10l4 4 4-4v11h5V7l-5-4-4 7z", wrist: "M9 2h6v5H9zM9 17h6v5H9zM7 7h10v10H7z", lower: "M6 3h12l2 18h-6l-2-10-2 10H4zM6 7h12", accessories: "M5 8h14v13H5zM8 8V5a4 4 0 0 1 8 0v3", socks: "M8 3h8v11l-7 7H4v-6l4-4zM8 7h8", shoes: "M3 10h5l3 5 9 2 1 4H3zM3 17h10" };
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const p = document.createElementNS(svg.namespaceURI, "path");
  p.setAttribute("d", paths[slot] ?? paths.accessories);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", "currentColor");
  p.setAttribute("stroke-width", "1.5");
  p.setAttribute("stroke-linejoin", "round");
  svg.append(p);
  return svg;
}
function productPhoto(piece, store, eager = false) {
  const frame = node("div", "sz-product-photo");
  if (!isProduct(piece)) {
    frame.append(node("span", "sz-muted", "Exact product needed"));
    return frame;
  }
  const img = document.createElement("img");
  img.alt = piece.title;
  img.loading = eager ? "eager" : "lazy";
  let fallback = safeUrl(piece.image_source_url ?? "");
  img.onerror = () => {
    if (fallback && img.src !== fallback) {
      img.src = fallback;
      fallback = "";
    } else {
      img.remove();
      frame.append(node("span", "sz-muted", "Photo unavailable"));
    }
  };
  try {
    if (piece.image) img.src = store.imageUrl(piece.image);
    else img.src = fallback;
  } catch {
    img.src = fallback;
    fallback = "";
  }
  frame.append(img);
  return frame;
}
function fitPreview(outfit, pieces, store, onSlot) {
  const eq = equipmentFor(outfit, pieces), box = node("section", "sz-fit-preview");
  box.setAttribute("aria-label", `Whole fit: ${outfit.title}`);
  const equipped = GEAR_SLOTS.flatMap((slot) => {
    const piece = pieces.find((p) => p.id === eq[slot.id]);
    return piece && isProduct(piece) ? [{ slot, piece }] : [];
  });
  if (!equipped.length) {
    box.append(node("p", "sz-fit-unready", "This inspiration has no verified products equipped yet. Open the set to choose exact items from the slot database."));
    return box;
  }
  const preview = currentPreview(outfit, pieces);
  box.classList.toggle("sz-has-preview", Boolean(preview));
  const controls = node("div", "sz-fit-controls"), label2 = node("span", "sz-eyebrow", outfit.title);
  if (preview) {
    const total = cost(outfit, pieces);
    label2.append(node("span", "sz-preview-cost", `${usd(total.known)}${total.unknown ? " + unpriced" : " to buy"}`));
  }
  controls.append(label2);
  box.append(controls);
  const stage = node("div", `sz-flat-lay ${eq.base || eq.outer ? "has-layers" : ""} ${eq.outer && !eq.base ? "has-two-layers" : ""}`);
  stage.setAttribute("aria-label", "Head-to-toe flat lay of exact product photos");
  for (const { slot, piece } of equipped) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `sz-fit-item sz-fit-${slot.id}`;
    item.dataset.slot = slot.id;
    item.setAttribute("aria-label", `${slot.label}: ${piece.title}`);
    item.title = `${piece.title} \xB7 ${piece.store} \xB7 ${usd(piece.price)}`;
    item.onclick = () => onSlot(slot.id);
    item.append(productPhoto(piece, store, true), node("span", "sz-fit-tag", slot.short));
    stage.append(item);
  }
  const grid = gearBoard(outfit, pieces, store, onSlot, true), render = node("div", "sz-render-stage"), tags = node("div", "sz-render-products"), caption = node("p", "sz-fit-caption");
  for (const { slot, piece } of equipped) {
    const tag = document.createElement("button");
    tag.type = "button";
    tag.className = "sz-render-product";
    tag.setAttribute("aria-label", `Inspect exact ${slot.label}: ${piece.title}`);
    tag.onclick = () => onSlot(slot.id);
    tag.append(productPhoto(piece, store, true), node("span", "", slot.short));
    tags.append(tag);
  }
  let mode = preview ? "render" : "flat";
  const buttons = /* @__PURE__ */ new Map();
  const show = (next) => {
    mode = next;
    render.hidden = mode !== "render";
    tags.hidden = mode !== "render";
    stage.hidden = mode !== "flat";
    grid.hidden = mode !== "slots";
    for (const [id, b] of buttons) b.setAttribute("aria-pressed", String(id === mode));
    caption.textContent = mode === "render" ? "AI styling preview \xB7 fit and details may differ. Exact products below." : "Exact product photos \xB7 tap an item to inspect or swap";
    if (mode === "render" && preview) {
      const img = document.createElement("img");
      img.alt = `AI styling preview of ${outfit.title}. See exact photos for product details.`;
      img.loading = "eager";
      img.onerror = () => {
        show("flat");
        caption.textContent = "Preview image is unavailable. Exact photos shown; retry Render after vault assets sync.";
      };
      render.replaceChildren(img, node("span", "sz-render-badge", "AI styling preview"));
      try {
        img.src = store.imageUrl(preview.image);
      } catch {
        img.onerror(new Event("error"));
      }
    }
  };
  const tabs = node("div", "sz-view-tabs");
  tabs.setAttribute("role", "group");
  tabs.setAttribute("aria-label", `View ${outfit.title}`);
  for (const [id, title] of [...preview ? [["render", "Render"]] : [], ["flat", "Exact photos"], ["slots", "Slots"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sz-view-tab";
    b.textContent = title;
    b.onclick = () => show(id);
    buttons.set(id, b);
    tabs.append(b);
  }
  controls.append(tabs);
  box.append(render, stage, grid, tags, caption);
  show(mode);
  return box;
}
function gearBoard(outfit, pieces, store, onSlot, compact = false) {
  const eq = equipmentFor(outfit, pieces), board = node("div", `sz-gear-board ${compact ? "sz-gear-compact" : ""}`);
  board.setAttribute("aria-label", `Tagged products in ${outfit.title}`);
  for (const slot of GEAR_SLOTS) {
    const id = eq[slot.id], piece = pieces.find((p) => p.id === id);
    if (compact && !piece) continue;
    const button2 = document.createElement("button");
    button2.type = "button";
    button2.className = `sz-gear-slot ${piece && isProduct(piece) ? "is-equipped" : "is-empty"}`;
    button2.dataset.slot = slot.id;
    button2.setAttribute("aria-label", `${slot.label}: ${piece?.title ?? "Empty slot"}`);
    button2.onclick = () => onSlot(slot.id);
    if (piece && isProduct(piece)) button2.append(productPhoto(piece, store));
    else button2.append(slotIcon(slot.id));
    const tag = node("span", "sz-slot-tag", slot.short);
    tag.prepend(slotIcon(slot.id));
    button2.append(tag);
    if (piece && isProduct(piece)) {
      button2.append(node("span", "sz-slot-price", usd(piece.price)));
      button2.title = `${slot.label} \xB7 ${piece.title} \xB7 ${usd(piece.price)} \xB7 ${piece.store}`;
    } else button2.append(node("span", "sz-empty-label", piece ? "Product link needed" : "Optional"));
    board.append(button2);
  }
  return board;
}
function productInfo(piece, store) {
  const box = node("section", "sz-product-info");
  box.append(productPhoto(piece, store), node("p", "sz-eyebrow", piece.store), node("h3", "", piece.title), node("strong", "sz-product-price", piece.price === null ? "Unpriced" : `${piece.currency} ${piece.price.toFixed(2)}`));
  if (isProduct(piece)) {
    const a = document.createElement("a");
    a.className = "sz-button sz-primary";
    a.href = safeUrl(piece.product_url);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "View exact product";
    box.append(a, node("p", "sz-stock", `Available when checked ${piece.product_checked_at}`));
    const sizes = piece.available_sizes ?? [];
    if (sizes.length) {
      const details = node("details", "sz-available-sizes");
      details.append(node("summary", "", `${sizes.length} available size options`), node("p", "sz-muted", sizes.join(", ")));
      box.append(details);
    } else box.append(node("p", "sz-muted", "Choose your size at the retailer."));
  } else box.append(node("p", "sz-muted", "This item needs a verified product link and photograph before it can appear in a shoppable set."));
  box.append(node("p", "sz-muted", piece.price_note), node("p", "sz-credit", piece.image_credit ?? ""));
  return box;
}
function loadoutEditor(parent, outfit, catalog, store, onSave, initialSlot) {
  let eq = { ...equipmentFor(outfit, catalog.pieces) }, selected = initialSlot ?? "shirt", name = `${outfit.title} / Remix`, dirty = false;
  const draw = () => {
    parent.replaceChildren();
    const current = { ...outfit, equipment: eq, piece_ids: [...new Set(Object.values(eq).filter((x) => Boolean(x)))] };
    const summary = cost(current, catalog.pieces);
    const header = node("div", "sz-loadout-summary");
    header.append(node("span", "sz-loadout-pill", `${Object.keys(eq).length} / ${GEAR_SLOTS.length} slots equipped`), node("strong", "", summary.unknown ? `${usd(summary.known)} + unpriced` : usd(summary.known)), node("p", "sz-muted", "Exact products shown. Optional slots can stay empty. Prices and stock are dated observations, before tax and shipping."));
    parent.append(header);
    const selectSlot = (slot) => {
      selected = slot;
      draw();
      if (typeof matchMedia === "function" && matchMedia("(max-width:760px)").matches) parent.querySelector(".sz-slot-options")?.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    const columns = node("div", "sz-equipment-editor"), visual = node("div", "sz-equipment-visual");
    visual.append(fitPreview(current, catalog.pieces, store, selectSlot));
    const slots = document.createElement("details");
    slots.className = "sz-all-slots";
    slots.append(node("summary", "", "All equipment slots"));
    const board = gearBoard(current, catalog.pieces, store, selectSlot);
    board.querySelector(`[data-slot="${selected}"]`)?.setAttribute("aria-pressed", "true");
    slots.append(board);
    visual.append(slots);
    const selectedSlot = GEAR_SLOTS.find((s) => s.id === selected);
    const panel = node("section", "sz-slot-options");
    panel.append(node("p", "sz-eyebrow", "EQUIPMENT SLOT"), node("h3", "", selectedSlot.label));
    const equipped = catalog.pieces.find((p) => p.id === eq[selected]);
    if (equipped) {
      panel.append(productInfo(equipped, store));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "sz-text-button";
      remove.textContent = "Leave this slot empty";
      remove.onclick = () => {
        delete eq[selected];
        dirty = true;
        draw();
      };
      panel.append(remove);
    } else panel.append(node("p", "sz-muted", "No item equipped. Choose a product below or keep this slot empty."));
    const options = slotOptions(catalog.pieces, selected);
    panel.append(node("h3", "sz-options-heading", `${options.length} researched options`));
    const list = node("div", "sz-options-list");
    for (const p of options) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = `sz-option-row ${eq[selected] === p.id ? "is-equipped" : ""}`;
      row.setAttribute("aria-label", `Equip ${p.title} in ${selectedSlot.label}`);
      row.append(productPhoto(p, store));
      const text = node("span", "sz-option-copy");
      text.append(node("strong", "", p.title), node("span", "sz-muted", `${p.store} \xB7 ${usd(p.price)}`), node("span", "sz-equip-label", eq[selected] === p.id ? "Equipped" : "Try this item"));
      row.append(text);
      row.onclick = () => {
        for (const slot of GEAR_SLOTS) if (eq[slot.id] === p.id) delete eq[slot.id];
        eq[selected] = p.id;
        dirty = true;
        draw();
      };
      list.append(row);
    }
    panel.append(list);
    columns.append(visual, panel);
    parent.append(columns);
    const savebar = node("div", "sz-save-variation");
    const input2 = document.createElement("input");
    input2.className = "sz-input";
    input2.value = name;
    input2.setAttribute("aria-label", "Variation name");
    input2.oninput = () => name = input2.value;
    const save = document.createElement("button");
    save.type = "button";
    save.className = "sz-button sz-primary";
    save.textContent = "Save as new set";
    save.disabled = !dirty;
    const status = node("p", "sz-muted");
    status.setAttribute("role", "status");
    save.onclick = () => {
      save.disabled = true;
      void (async () => {
        try {
          await onSave(createVariation(outfit, eq, catalog.pieces, name));
          dirty = false;
          status.textContent = "Variation saved. Original set preserved.";
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : String(error);
          save.disabled = false;
        }
      })();
    };
    savebar.append(input2, save, status);
    parent.append(savebar);
  };
  draw();
}

// src/app.ts
function el(tag, cls = "", text = "") {
  const x = document.createElement(tag);
  x.className = cls;
  x.textContent = text;
  return x;
}
function button(text, action, cls = "sz-button") {
  const b = el("button", cls, text);
  b.type = "button";
  b.addEventListener("click", action);
  return b;
}
function link(text, url) {
  const a = el("a", "sz-link", text);
  a.href = safeUrl(url);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}
function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
}
var unique = (values) => [...new Set(values)].sort();
function label(text, control) {
  const l = el("label", "sz-field");
  l.append(el("span", "sz-label", text), control);
  return l;
}
function input(name, value = "", type = "text") {
  const x = el("input", "sz-input");
  x.name = name;
  x.value = value;
  x.type = type;
  return x;
}
function select(name, options, value = "") {
  const s = el("select", "sz-select");
  s.name = name;
  for (const [v, t] of options) {
    const o = el("option", "", t);
    o.value = v;
    s.append(o);
  }
  s.value = value;
  return s;
}
var StyleZoneApp = class {
  constructor(root, store) {
    this.root = root;
    this.store = store;
    __publicField(this, "data", { outfits: [], pieces: [], ratings: [], warnings: [] });
    __publicField(this, "filters", { ...DEFAULT_FILTERS });
    __publicField(this, "page", "outfits");
    __publicField(this, "focusId", "");
    __publicField(this, "inventorySlot", "");
    __publicField(this, "detail", null);
    __publicField(this, "unsub");
    __publicField(this, "disposed", false);
    __publicField(this, "pending", /* @__PURE__ */ new Set());
    __publicField(this, "refreshTimer");
    __publicField(this, "refreshSequence", 0);
    __publicField(this, "hasLoaded", false);
    __publicField(this, "keyHandler", (event) => {
      if (this.page !== "rate" || this.detail?.open || event.ctrlKey || event.altKey || event.metaKey || event.target instanceof Element && event.target.closest("input,textarea,select,[contenteditable=true]")) return;
      const outfit = this.visible().find((o) => o.id === this.focusId);
      if (outfit && /^[1-5]$/.test(event.key)) {
        event.preventDefault();
        void this.rate(outfit, Number(event.key), true);
      }
    });
  }
  async start() {
    this.root.classList.add("style-zone-app");
    this.root.append(el("p", "sz-loading", "Opening your wardrobe\u2026"));
    document.addEventListener("keydown", this.keyHandler);
    await this.reload();
    this.unsub = this.store.subscribe?.(() => {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        if (!this.detail?.open) void this.reload();
      }, 250);
    });
  }
  dispose() {
    this.disposed = true;
    this.unsub?.();
    clearTimeout(this.refreshTimer);
    document.removeEventListener("keydown", this.keyHandler);
    this.detail?.remove();
    this.root.replaceChildren();
  }
  async reload() {
    const sequence = ++this.refreshSequence;
    try {
      const data = await this.store.load();
      if (this.disposed || sequence !== this.refreshSequence) return;
      const unchanged = this.hasLoaded && JSON.stringify(data) === JSON.stringify(this.data);
      this.data = data;
      this.hasLoaded = true;
      if (unchanged) return;
      const active = document.activeElement;
      if (active instanceof Element && this.root.contains(active) && active.matches("input,textarea,select")) return;
      this.render();
    } catch (error) {
      this.toast(error instanceof Error ? error.message : String(error), true);
    }
  }
  hasProducts(outfit) {
    return Object.values(equipmentFor(outfit, this.data.pieces)).some((id) => this.data.pieces.some((p) => p.id === id && isProduct(p)));
  }
  visible() {
    return filterOutfits(this.data, this.filters).filter((o) => this.hasProducts(o));
  }
  navigate(page) {
    this.page = page;
    const content = this.root.querySelector(".sz-content");
    if (content) content.scrollTop = 0;
    this.render();
  }
  toast(message, error = false) {
    const target = el("div", `sz-toast ${error ? "sz-error" : ""}`, message);
    target.setAttribute("role", error ? "alert" : "status");
    this.root.append(target);
    setTimeout(() => target.remove(), 6500);
  }
  render() {
    if (this.disposed || this.detail?.open) return;
    this.root.classList.toggle("sz-is-rate", this.page === "rate");
    const scroll = this.root.querySelector(".sz-content")?.scrollTop ?? 0;
    this.root.replaceChildren();
    const shell = el("div", "sz-shell");
    const rail = el("aside", "sz-rail");
    const brand = el("div", "sz-brand");
    brand.append(el("span", "sz-logo", "SZ"), el("div", "", "STYLE ZONE"));
    rail.append(brand, el("p", "sz-rail-caption", "A wardrobe that gets you."));
    const nav = el("nav", "sz-nav");
    nav.setAttribute("aria-label", "Style Zone");
    for (const [id, icon, title] of [["outfits", "\u25EB", "Loadouts"], ["rate", "\u2726", "Quick rate"], ["wardrobe", "\u25A4", "Item database"], ["profile", "\u25C9", "Your taste"]]) {
      const b = button(title, () => this.navigate(id), `sz-nav-button ${this.page === id ? "is-active" : ""}`);
      b.prepend(el("span", "sz-nav-icon", icon));
      b.setAttribute("aria-current", this.page === id ? "page" : "false");
      nav.append(b);
    }
    rail.append(nav);
    const progress = taste(this.data.ratings);
    const railFoot = el("div", "sz-rail-foot");
    railFoot.append(el("span", "sz-eyebrow", "GETTING TO KNOW YOU"), el("strong", "", `${progress.rated} looks rated`), el("p", "sz-muted", progress.rated ? "Every rating makes the next edit more personal." : "Start with five looks. Go with your first instinct."));
    const bar = el("div", "sz-progress");
    const fill = el("span");
    fill.style.width = `${Math.min(100, progress.rated / 5 * 100)}%`;
    bar.append(fill);
    railFoot.append(bar, button("Export for stylist", () => void this.export(), "sz-button sz-subtle"));
    rail.append(railFoot);
    const content = el("main", "sz-content");
    const top = el("div", "sz-topbar");
    top.append(el("span", "sz-eyebrow", "YOUR PERSONAL STYLE WORKSPACE"), el("span", "sz-season", "FALL / WINTER 2026"));
    content.append(top);
    if (this.page === "outfits" || this.page === "rate") this.renderOutfits(content);
    if (this.page === "wardrobe") this.renderPieces(content);
    if (this.page === "profile") this.renderProfile(content);
    if (this.data.warnings.length) {
      const warning = el("details", "sz-warning");
      warning.append(el("summary", "", `${this.data.warnings.length} data issue${this.data.warnings.length === 1 ? "" : "s"} to review`));
      for (const text of this.data.warnings) warning.append(el("p", "", text));
      content.append(warning);
    }
    shell.append(rail, content);
    this.root.append(shell);
    content.scrollTop = scroll;
  }
  heading(parent, eyebrow, title, description) {
    const h = el("header", "sz-heading");
    h.append(el("p", "sz-eyebrow", eyebrow), el("h1", "", title), el("p", "sz-intro", description));
    parent.append(h);
    return h;
  }
  renderOutfits(parent) {
    const focused = this.page === "rate";
    const heading = this.heading(parent, focused ? "TRUST YOUR FIRST INSTINCT" : "YOUR EQUIPMENT SETS", focused ? "Would you wear this?" : "Build your daily loadout.", focused ? "Rate from 1 to 5. The next look follows automatically." : "Real products, tagged by slot. Swap a piece, save a set, find your style.");
    if (!focused) heading.append(button("Create set", () => this.outfitForm(), "sz-button sz-primary"));
    const stats = el("div", "sz-stats");
    const profile = taste(this.data.ratings);
    for (const [n, t] of [[this.data.outfits.filter((o) => this.hasProducts(o)).length, "visualized sets"], [this.data.pieces.filter(isProduct).length, "shop options"], [profile.liked, "sets you love"]]) {
      const item = el("div");
      item.append(el("strong", "", String(n)), el("span", "", String(t)));
      stats.append(item);
    }
    if (!focused) parent.append(stats);
    if (focused) {
      const refine = el("details", "sz-session-filters");
      refine.append(el("summary", "", "Refine this session"));
      this.renderFilters(refine);
      parent.append(refine);
    } else this.renderFilters(parent);
    const outfits = this.visible();
    const ideas = filterOutfits(this.data, this.filters).filter((o) => !this.hasProducts(o));
    if (ideas.length && (!focused || !outfits.length)) {
      const research = el("details", "sz-unverified-items");
      research.append(el("summary", "", `${ideas.length} ideas needing exact products`), el("p", "sz-muted", "These earlier inspiration notes are preserved. Equip researched items before rating them as a complete visual set."));
      for (const idea of ideas) {
        const row = el("div", "sz-idea-row");
        row.append(el("span", "", idea.title), button("Equip exact items", () => this.openOutfit(idea), "sz-text-button"));
        research.append(row);
      }
      parent.append(research);
    }
    const count = el("div", "sz-results");
    count.append(el("p", "sz-muted", `${outfits.length} look${outfits.length === 1 ? "" : "s"} in this edit`));
    const sort = select("sort", [["recommended", "For you"], ["rating", "Highest rated"], ["price", "Lowest known cost"], ["title", "By name"]], this.filters.sort);
    sort.setAttribute("aria-label", "Sort outfits");
    sort.onchange = () => {
      this.filters.sort = sort.value;
      this.render();
    };
    count.append(sort);
    parent.append(count);
    if (!outfits.length) {
      const empty = el("div", "sz-empty");
      empty.append(el("h2", "", this.data.outfits.length ? "No visualized sets match this edit." : "Your outfit collection starts here."), el("p", "sz-muted", ideas.length ? "Open an idea above, equip exact products and save it as a new set." : this.data.outfits.length ? "Try a different palette or relax a filter. Unpriced looks stay out of a budget filter unless you include them." : "Create an outfit from your pieces, or add Markdown suggestions to the wardrobe folder."), button("Reset filters", () => {
        this.filters = { ...DEFAULT_FILTERS };
        this.render();
      }));
      parent.append(empty);
      return;
    }
    if (focused) {
      const latest = latestRatings(this.data.ratings);
      let current = outfits.find((o) => o.id === this.focusId) ?? outfits.find((o) => !latest.has(o.id)) ?? outfits[0];
      this.focusId = current.id;
      const stage = el("div", "sz-rate-stage");
      stage.append(this.outfitCard(current, true));
      const controls = el("div", "sz-rate-footer");
      controls.append(el("p", "sz-muted", latest.has(current.id) ? `Current rating: ${latest.get(current.id).rating}/5. You can change it.` : "Not rated yet. Keyboard: 1\u20135."), button("Skip this look", () => {
        this.focusId = outfits[(outfits.indexOf(current) + 1) % outfits.length].id;
        this.render();
      }, "sz-button sz-subtle"));
      stage.append(controls);
      parent.append(stage);
    } else {
      const grid = el("div", "sz-outfit-grid");
      for (const o of outfits) grid.append(this.outfitCard(o));
      parent.append(grid);
    }
  }
  renderFilters(parent) {
    const panel = el("section", "sz-filters");
    panel.setAttribute("aria-label", "Outfit filters");
    const search = input("search", this.filters.search, "search");
    search.placeholder = "Search looks, textures, ideas\u2026";
    search.setAttribute("aria-label", "Search outfits");
    let timer;
    search.oninput = () => {
      this.filters.search = search.value;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const position = search.selectionStart;
        this.render();
        const replacement = this.root.querySelector("input[name=search]");
        replacement?.focus();
        if (position !== null) replacement?.setSelectionRange(position, position);
      }, 350);
    };
    panel.append(search);
    const row = el("div", "sz-filter-row");
    for (const [key, title, values] of [
      ["style", "All directions", unique(this.data.outfits.flatMap((o) => o.styles))],
      ["store", "All stores", unique(this.data.pieces.map((p) => p.store).filter(Boolean))],
      ["occasion", "Any occasion", unique(this.data.outfits.flatMap((o) => o.occasions))]
    ]) {
      const s = select(key, [["", title], ...values.map((x) => [x, x])], this.filters[key]);
      s.setAttribute("aria-label", title);
      s.onchange = () => {
        this.filters[key] = s.value;
        this.render();
      };
      row.append(s);
    }
    const collections = unique(this.data.outfits.map((o) => o.collection ?? "").filter(Boolean));
    if (collections.length) {
      const s = select("collection", [["", "All collections"], ...collections.map((x) => [x, x])], this.filters.collection);
      s.setAttribute("aria-label", "Outfit collection");
      s.onchange = () => {
        this.filters.collection = s.value;
        this.render();
      };
      row.append(s);
    }
    const rating = select("rating", [["", "All ratings"], ["unrated", "Not rated"], ["liked", "Loved \xB7 4\u20135"], ...Array.from({ length: 5 }, (_, i) => [String(i + 1), `${i + 1} / 5`])], this.filters.rating);
    rating.setAttribute("aria-label", "Rating filter");
    rating.onchange = () => {
      this.filters.rating = rating.value;
      this.render();
    };
    row.append(rating);
    const budget = input("maxPrice", this.filters.maxPrice, "number");
    budget.min = "0";
    budget.step = "1";
    budget.placeholder = "Max to buy \xB7 $";
    budget.setAttribute("aria-label", "Maximum cost to buy in USD");
    let budgetTimer;
    budget.oninput = () => {
      this.filters.maxPrice = budget.value;
      clearTimeout(budgetTimer);
      budgetTimer = setTimeout(() => {
        const focused = document.activeElement === budget;
        this.render();
        if (focused) this.root.querySelector("input[name=maxPrice]")?.focus();
      }, 300);
    };
    budget.onchange = () => {
      clearTimeout(budgetTimer);
      this.filters.maxPrice = budget.value;
      this.render();
    };
    row.append(budget);
    panel.append(row);
    const palette = el("div", "sz-palettes");
    palette.append(el("span", "sz-label", "PALETTE"));
    const all = button("All", () => {
      this.filters.color = "";
      this.render();
    }, `sz-color-all ${!this.filters.color ? "is-active" : ""}`);
    all.setAttribute("aria-pressed", String(!this.filters.color));
    palette.append(all);
    for (const color of unique(this.data.outfits.flatMap((o) => o.colors))) {
      const sw = button("", () => {
        this.filters.color = this.filters.color === color ? "" : color;
        this.render();
      }, `sz-swatch ${this.filters.color === color ? "is-active" : ""}`);
      sw.style.setProperty("--swatch", COLORS[color] ?? "#888");
      sw.title = color;
      sw.setAttribute("aria-label", `Filter palette: ${color}`);
      sw.setAttribute("aria-pressed", String(this.filters.color === color));
      palette.append(sw);
    }
    panel.append(palette);
    const toggles = el("div", "sz-filter-toggles");
    for (const [key, title] of [["includeUnknown", "Include unpriced looks in budget"], ["ownedOnly", "Only pieces I own"]]) {
      const box = input(key, "", "checkbox");
      box.checked = this.filters[key];
      box.onchange = () => {
        this.filters[key] = box.checked;
        this.render();
      };
      const l = el("label", "sz-checkbox");
      l.append(box, el("span", "", title));
      toggles.append(l);
    }
    toggles.append(button("Clear", () => {
      this.filters = { ...DEFAULT_FILTERS };
      this.render();
    }, "sz-clear"));
    panel.append(toggles);
    parent.append(panel);
  }
  outfitCard(outfit, focus = false) {
    const card = el("article", `sz-outfit-card sz-loadout-card ${focus ? "sz-focused" : ""}`);
    card.dataset.outfitId = outfit.id;
    const visual = el("div", "sz-loadout-visual");
    visual.append(fitPreview(outfit, this.data.pieces, this.store, (slot) => this.openOutfit(outfit, slot)));
    card.append(visual);
    const body = el("div", "sz-card-body");
    const meta = el("div", "sz-card-meta");
    meta.append(el("span", "sz-eyebrow", outfit.styles[0] ?? "YOUR SET"), this.swatches(outfit.colors));
    body.append(meta, el("h2", "", outfit.title), el("p", "sz-card-description", outfit.notes.split("\n")[0] || outfit.season));
    const c = cost(outfit, this.data.pieces), price = el("div", "sz-cost");
    price.append(el("strong", "", c.unknown ? `${money(c.known)} known` : c.known ? `${money(c.known)} to buy` : "Already in your wardrobe"), el("span", "sz-muted", c.unknown ? `${c.unknown} unpriced \xB7 ${c.owned} owned` : `${outfit.piece_ids.length} tagged products \xB7 ${c.owned} owned`));
    body.append(price);
    const latest = latestRatings(this.data.ratings).get(outfit.id);
    body.append(this.ratingButtons(outfit, latest?.rating, focus));
    const footer = el("div", "sz-card-footer");
    footer.append(button("Inspect / swap gear", () => this.openOutfit(outfit), "sz-text-button"), el("span", "sz-muted", latest ? `Rated ${latest.rating}/5` : "Not rated"));
    body.append(footer);
    const match = recommendation(outfit, this.data.ratings);
    if (match.reasons.length) body.append(el("p", "sz-match", `Fits your interest in ${match.reasons.join(" + ")}`));
    card.append(body);
    return card;
  }
  swatches(colors) {
    const row = el("span", "sz-mini-swatches");
    for (const color of colors) {
      const s = el("span");
      s.style.background = COLORS[color] ?? "#888";
      s.title = color;
      row.append(s);
    }
    row.setAttribute("aria-label", colors.join(", "));
    return row;
  }
  ratingButtons(outfit, rating, advance = false) {
    const group = el("div", "sz-rating");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", `Rate ${outfit.title}`);
    for (let n = 1; n <= 5; n++) {
      const b = button(String(n), () => void this.rate(outfit, n, advance), `sz-rate-button ${rating === n ? "is-selected" : ""}`);
      b.setAttribute("aria-label", `Rate ${outfit.title} ${n} out of 5`);
      b.setAttribute("aria-pressed", String(rating === n));
      b.disabled = this.pending.has(outfit.id);
      group.append(b);
    }
    return group;
  }
  async rate(outfit, value, advance = false, note, reasons) {
    if (this.pending.has(outfit.id)) return false;
    this.pending.add(outfit.id);
    const before = this.visible(), at = before.findIndex((o) => o.id === outfit.id);
    try {
      const prior = latestRatings(this.data.ratings).get(outfit.id);
      const event = newRating({ ...outfit, equipment: equipmentFor(outfit, this.data.pieces) }, value, note ?? prior?.note ?? "", reasons ?? prior?.reasons ?? []);
      await this.store.rate(event);
      if (!this.data.ratings.some((r) => r.id === event.id)) this.data.ratings.push(event);
      if (advance) this.focusId = before[(at + 1) % before.length]?.id ?? "";
      this.render();
      this.toast(`Saved ${value}/5 for ${outfit.title}`);
      return true;
    } catch (error) {
      this.toast(`Rating not saved: ${error instanceof Error ? error.message : String(error)}`, true);
      return false;
    } finally {
      this.pending.delete(outfit.id);
      this.root.querySelectorAll(`article[data-outfit-id="${outfit.id}"] .sz-rate-button`).forEach((b) => b.disabled = false);
    }
  }
  dialog(title) {
    const previousFocus = document.activeElement;
    this.detail?.close();
    this.detail?.remove();
    const dialog = el("dialog", "sz-dialog");
    const top = el("div", "sz-dialog-header");
    const heading = el("h2", "", title);
    heading.id = "sz-dialog-title";
    dialog.setAttribute("aria-labelledby", heading.id);
    top.append(heading, button("Close", () => dialog.close(), "sz-button sz-subtle"));
    dialog.append(top);
    this.root.append(dialog);
    this.detail = dialog;
    dialog.addEventListener("close", () => {
      if (this.detail === dialog) this.detail = null;
      dialog.remove();
      previousFocus?.focus();
      void this.reload();
    }, { once: true });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.showModal();
    return dialog;
  }
  openOutfit(outfit, slot) {
    const dialog = this.dialog(outfit.title), editor = el("div", "sz-loadout-editor-host");
    loadoutEditor(editor, outfit, this.data, this.store, async (variation) => {
      await this.store.saveOutfit(variation);
      this.toast("New set saved. The original stays intact.");
    }, slot);
    dialog.append(editor);
    if (slot && typeof matchMedia === "function" && matchMedia("(max-width:760px)").matches) editor.querySelector(".sz-slot-options")?.scrollIntoView({ block: "start" });
    const feedback = el("section", "sz-detail-rate");
    feedback.append(el("h3", "", "Would you equip this set?"));
    const latest = latestRatings(this.data.ratings).get(outfit.id);
    const note = el("textarea", "sz-input");
    note.setAttribute("aria-label", "Reason for your outfit rating");
    note.placeholder = "What clicks? What would you change?";
    note.value = latest?.note ?? "";
    feedback.append(note);
    const chosen = new Set(latest?.reasons ?? []), tags = el("div", "sz-reason-tags");
    for (const reason of ["Love the palette", "Love the layers", "Too formal", "Too busy", "Wrong fit"]) {
      const b = button(reason, () => {
        chosen.has(reason) ? chosen.delete(reason) : chosen.add(reason);
        b.setAttribute("aria-pressed", String(chosen.has(reason)));
      }, "sz-reason");
      b.setAttribute("aria-pressed", String(chosen.has(reason)));
      tags.append(b);
    }
    feedback.append(tags);
    const ratings = el("div", "sz-rating");
    for (let n = 1; n <= 5; n++) {
      const b = button(String(n), () => {
        void this.rate(outfit, n, false, note.value, [...chosen]).then((saved) => {
          if (saved) ratings.querySelectorAll("button").forEach((x, i) => x.setAttribute("aria-pressed", String(i + 1 === n)));
        });
      }, "sz-rate-button");
      b.setAttribute("aria-label", `Save ${n} out of 5 with feedback`);
      b.setAttribute("aria-pressed", String(latest?.rating === n));
      ratings.append(b);
    }
    feedback.append(ratings);
    dialog.append(feedback);
    if (outfit.path && this.store.openNote) dialog.append(button("Open set note", () => {
      dialog.close();
      this.store.openNote(outfit.path);
    }, "sz-text-button"));
  }
  openProduct(piece) {
    const dialog = this.dialog(piece.title);
    dialog.append(productInfo(piece, this.store));
    dialog.append(button("Edit item record", () => this.pieceForm(piece), "sz-button sz-subtle"));
  }
  pieceRow(piece) {
    const row = el("div", "sz-piece-row");
    const text = el("div");
    text.append(el("strong", "", piece.title), el("p", "sz-muted", `${piece.store || "Store not selected"} \xB7 ${piece.ownership}${piece.price_checked_at ? ` \xB7 checked ${piece.price_checked_at}` : ""}`));
    if (piece.price_note) text.append(el("p", "sz-price-note", piece.price_note));
    const actions = el("div", "sz-piece-actions");
    actions.append(el("span", "", piece.ownership === "owned" ? "Owned" : piece.price === null ? "Price needed" : `${piece.currency} ${piece.price.toFixed(2)}`));
    if (safeUrl(piece.product_url)) actions.append(link("Shop / view", piece.product_url));
    actions.append(button("Edit item", () => this.pieceForm(piece), "sz-text-button"));
    row.append(text, actions);
    return row;
  }
  renderPieces(parent) {
    const h = this.heading(parent, "YOUR RESEARCHED ITEM DATABASE", "A good option for every slot.", "Exact products, colors, prices and buy links. Each slot keeps its own pool of alternatives.");
    h.append(button("Add a piece", () => this.pieceForm(), "sz-button sz-primary"));
    const slots = el("div", "sz-slot-tabs");
    const all = button("All slots", () => {
      this.inventorySlot = "";
      this.render();
    }, `sz-slot-filter ${!this.inventorySlot ? "is-active" : ""}`);
    slots.append(all);
    for (const slot of GEAR_SLOTS) {
      const n = slotOptions(this.data.pieces, slot.id).length;
      const b = button(`${slot.short} \xB7 ${n}`, () => {
        this.inventorySlot = slot.id;
        this.render();
      }, `sz-slot-filter ${this.inventorySlot === slot.id ? "is-active" : ""}`);
      b.prepend(slotIcon(slot.id));
      b.setAttribute("aria-label", `Item database slot: ${slot.label}`);
      slots.append(b);
    }
    parent.append(slots);
    const visible = this.inventorySlot ? slotOptions(this.data.pieces, this.inventorySlot) : this.data.pieces.filter(isProduct);
    parent.append(el("p", "sz-muted", `${visible.length} exact products \xB7 availability checked on each item record`));
    const grid = el("div", "sz-pieces-grid");
    for (const p of visible) {
      const card = el("article", "sz-piece-card sz-inventory-card");
      const photo = button("", () => this.openProduct(p), "sz-product-thumb-button");
      photo.setAttribute("aria-label", `Inspect product: ${p.title}`);
      photo.append(productPhoto(p, this.store));
      card.append(photo, this.swatches(p.colors), el("span", "sz-eyebrow", `${p.store} / ${pieceSlots(p).map((id) => GEAR_SLOTS.find((s) => s.id === id)?.short).join(" + ")}`), this.pieceRow(p));
      grid.append(card);
    }
    parent.append(grid);
    const pending = this.data.pieces.filter((p) => !isProduct(p));
    if (pending.length) {
      const more = el("details", "sz-unverified-items");
      more.append(el("summary", "", `${pending.length} personal / unverified records`), el("p", "sz-muted", "These records are preserved. They need an exact product link and verification before appearing in the shoppable item database."));
      for (const p of pending) more.append(this.pieceRow(p));
      parent.append(more);
    }
  }
  pieceForm(piece) {
    const dialog = this.dialog(piece ? "Edit your piece" : "Add a piece"), form = el("form", "sz-form");
    const title = input("title", piece?.title ?? "");
    title.required = true;
    form.append(label("Name", title));
    const category = select("category", ["top", "knitwear", "outerwear", "bottom", "shoes", "accessory", "other"].map((x) => [x, x]), piece?.category ?? "top");
    const ownership = select("ownership", [["owned", "I own this"], ["wishlist", "On my wishlist"], ["reference", "An idea / equivalent"]], piece?.ownership ?? "owned");
    form.append(label("Category", category), label("Status", ownership));
    const gearSlot = select("slot", GEAR_SLOTS.map((s) => [s.id, s.label]), piece?.slot ?? "shirt");
    form.append(label("Equipment slot", gearSlot));
    const colors = input("colors", piece?.colors.join(", ") ?? "");
    colors.placeholder = "navy, cream, brown";
    form.append(label("Colors separated by commas", colors));
    const price = input("price", piece?.price === null || piece?.price === void 0 ? "" : String(piece.price), "number");
    price.min = "0";
    price.step = "0.01";
    form.append(label("Price in USD \xB7 blank if unknown", price));
    const store = input("store", piece?.store ?? ""), url = input("product_url", piece?.product_url ?? "", "url");
    form.append(label("Store", store), label("Store or product link", url));
    const checked = input("price_checked_at", piece?.price_checked_at ?? "", "date");
    form.append(label("Date price was checked", checked));
    const priceNote = input("price_note", piece?.price_note ?? "");
    priceNote.placeholder = "Color, sale terms, sizing, or price caveats";
    form.append(label("Price notes", priceNote));
    const image = input("image", piece?.image ?? "");
    image.placeholder = "Assets/my-jacket.jpg";
    form.append(label("Image path in wardrobe folder", image));
    const upload = input("photo", "", "file");
    upload.accept = "image/jpeg,image/png,image/webp,image/gif";
    form.append(label("Or attach a photo", upload));
    const notes = el("textarea", "sz-input");
    notes.placeholder = "Fit, fabric, or other details";
    if (!piece) form.append(label("Notes", notes));
    else form.append(el("p", "sz-muted", "Existing handwritten notes are preserved. Edit the Markdown note for longer details."));
    const error = el("p", "sz-form-error");
    error.setAttribute("role", "alert");
    const save = el("button", "sz-button sz-primary", "Save piece");
    save.type = "submit";
    form.append(error, save);
    form.onsubmit = (event) => {
      event.preventDefault();
      save.disabled = true;
      void (async () => {
        try {
          const file = upload.files?.[0], imagePath = file ? await this.store.saveImage(file) : image.value.trim();
          const id = piece?.id ?? `piece-${crypto.randomUUID()}`;
          const record = { ...piece ?? {}, schema: 1, type: "piece", id, title: title.value.trim(), category: category.value, slot: gearSlot.value, compatible_slots: piece && piece.slot === gearSlot.value ? piece.compatible_slots ?? [gearSlot.value] : [gearSlot.value], ownership: ownership.value, colors: colors.value.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean), price: price.value === "" ? null : Number(price.value), currency: "USD", store: store.value.trim(), product_url: url.value.trim(), price_checked_at: checked.value, price_note: priceNote.value.trim(), image: imagePath, notes: piece?.notes ?? notes.value.trim() };
          await this.store.savePiece(reconcileProductEdit(piece, record));
          dialog.close();
          this.toast("Piece saved.");
          await this.reload();
        } catch (e) {
          error.textContent = e instanceof Error ? e.message : String(e);
          save.disabled = false;
        }
      })();
    };
    dialog.append(form);
  }
  outfitForm() {
    const dialog = this.dialog("Create an equipment set"), form = el("form", "sz-form");
    const title = input("title");
    title.required = true;
    form.append(label("Set name", title));
    const styles = input("styles");
    styles.placeholder = "retro sport, relaxed";
    form.append(label("Directions separated by commas", styles));
    const occasions = input("occasions");
    occasions.placeholder = "everyday, evening";
    form.append(label("Occasions separated by commas", occasions));
    const items = el("fieldset", "sz-piece-choices");
    items.append(el("legend", "", "Choose exact products"));
    for (const p of this.data.pieces.filter(isProduct)) {
      const checkbox = input("piece_ids", p.id, "checkbox");
      const l = el("label", "sz-checkbox");
      l.append(checkbox, el("span", "", `${p.title} \xB7 ${p.slot ?? "slot needed"} \xB7 ${money(p.price)}`));
      items.append(l);
    }
    form.append(items);
    const notes = el("textarea", "sz-input");
    form.append(label("Styling notes", notes));
    const error = el("p", "sz-form-error");
    error.setAttribute("role", "alert");
    const save = el("button", "sz-button sz-primary", "Save set");
    save.type = "submit";
    form.append(error, save);
    form.onsubmit = (e) => {
      e.preventDefault();
      save.disabled = true;
      void (async () => {
        try {
          const pieceIds = [...items.querySelectorAll("input:checked")].map((x) => x.value);
          if (!pieceIds.length) throw Error("Choose at least one exact product.");
          const equipment = {};
          for (const id of pieceIds) {
            const p = this.data.pieces.find((p2) => p2.id === id);
            const slot = pieceSlots(p).find((s) => !equipment[s]);
            if (!slot) throw Error(`One product per slot: ${p.title} has no free compatible slot.`);
            equipment[slot] = id;
          }
          const list = (text) => text.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
          const o = { schema: 1, type: "outfit", id: `outfit-${crypto.randomUUID()}`, title: title.value.trim(), season: "Fall Winter 2026", styles: list(styles.value), colors: unique(pieceIds.flatMap((id) => this.data.pieces.find((p) => p.id === id).colors)), occasions: list(occasions.value), piece_ids: pieceIds, equipment, image: "", image_credit: "", source_urls: pieceIds.map((id) => this.data.pieces.find((p) => p.id === id).product_url), notes: notes.value.trim() };
          await this.store.saveOutfit(o);
          dialog.close();
          this.page = "outfits";
          await this.reload();
          this.toast("Equipment set added.");
        } catch (e2) {
          error.textContent = e2 instanceof Error ? e2.message : String(e2);
          save.disabled = false;
        }
      })();
    };
    dialog.append(form);
  }
  renderProfile(parent) {
    const profile = taste(this.data.ratings);
    this.heading(parent, "A STYLE THAT EVOLVES WITH YOU", "A little more you, every time.", "Your ratings reveal patterns in the looks you enjoy. These are starting points for your next suggestions.");
    const overview = el("div", "sz-profile-summary");
    overview.append(el("strong", "", `${profile.rated}`), el("div", "", `distinct outfits rated \xB7 ${profile.events} rating events \xB7 ${profile.liked} rated 4 or 5`));
    parent.append(overview);
    if (!profile.rated) {
      const empty = el("div", "sz-empty");
      empty.append(el("h2", "", "Let\u2019s find what clicks."), el("p", "sz-muted", "Rate a few different outfits. A 1 or 2 is as useful as a 5."), button("Start quick rating", () => this.navigate("rate"), "sz-button sz-primary"));
      parent.append(empty);
      return;
    }
    parent.append(el("p", "sz-tip", profile.rated < 5 ? "Early impressions: a few ratings can suggest a direction, but don\u2019t define your style." : "Your latest rating for each outfit is used once. Changing a rating updates the signals without counting the same look twice."));
    const columns = el("div", "sz-profile-columns");
    for (const [title, features] of [["Leaning toward", profile.features.filter((f) => f.score > 0).slice(0, 8)], ["Less your thing", profile.features.filter((f) => f.score < 0).reverse().slice(0, 8)]]) {
      const section = el("section", "sz-profile-card");
      section.append(el("h2", "", title));
      if (!features.length) section.append(el("p", "sz-muted", "No clear signal yet."));
      for (const f of features) {
        const row = el("div", "sz-feature");
        row.append(el("strong", "", f.label), el("span", "sz-muted", `${f.average.toFixed(1)}/5 \xB7 ${f.count} look${f.count === 1 ? "" : "s"}`));
        section.append(row);
      }
      columns.append(section);
    }
    parent.append(columns);
    parent.append(el("p", "sz-muted", "Signals compare ratings with the neutral midpoint of 3 and soften patterns supported by few examples. Colors and styles appear together, so these are associations rather than proof of why you liked an outfit."));
    const history = el("section", "sz-profile-card");
    history.append(el("h2", "", "Your latest calls"));
    const latest = [...latestRatings(this.data.ratings).values()].sort((a, b) => b.created_at.localeCompare(a.created_at));
    for (const r of latest.slice(0, 30)) {
      const row = el("div", "sz-history");
      row.append(el("strong", "", `${r.rating}/5`), el("div", "", r.snapshot.title), el("span", "sz-muted", r.note || r.reasons.join(", ") || new Date(r.created_at).toLocaleDateString()));
      history.append(row);
    }
    parent.append(history, button("Export for stylist", () => void this.export(), "sz-button sz-primary"));
  }
  async export() {
    try {
      await this.store.export({ schema: 1, exported_at: (/* @__PURE__ */ new Date()).toISOString(), ...this.data, preference_summary: taste(this.data.ratings), latest_ratings: [...latestRatings(this.data.ratings).values()] });
      this.toast("Export saved with outfits, pieces, rating history and taste signals.");
    } catch (e) {
      this.toast(`Export failed: ${e instanceof Error ? e.message : String(e)}`, true);
    }
  }
};

// starter/catalog.json
var catalog_default = {
  schema: 1,
  outfits: [
    {
      schema: 1,
      type: "outfit",
      id: "set-low-key",
      title: "Low-key Loadout",
      season: "Fall Winter 2026",
      styles: [
        "textured minimalism"
      ],
      colors: [
        "white",
        "gray",
        "cream"
      ],
      occasions: [
        "everyday",
        "weekend"
      ],
      piece_ids: [
        "product-white-tee",
        "product-charcoal-apres",
        "product-natural-socks",
        "product-white-premier"
      ],
      equipment: {
        shirt: "product-white-tee",
        lower: "product-charcoal-apres",
        socks: "product-natural-socks",
        shoes: "product-white-premier"
      },
      image: "",
      image_credit: "",
      source_urls: [
        "https://www.taylorstitch.com/products/organic-cotton-tee-in-vintage-white-2304",
        "https://www.taylorstitch.com/products/apres-pant-in-charcoal-sashiko",
        "https://www.taylorstitch.com/products/waffle-sock-in-natural-2501",
        "https://thursdayboots.com/products/mens-premier-low-top-sneaker-white"
      ],
      notes: "A white tee, charcoal sashiko pants and clean white sneakers. Four actual products, with the optional slots left open."
    },
    {
      schema: 1,
      type: "outfit",
      id: "set-campus",
      title: "Campus Courier",
      season: "Fall Winter 2026",
      styles: [
        "retro sport"
      ],
      colors: [
        "white",
        "navy",
        "cream",
        "stone",
        "brown",
        "black",
        "gray"
      ],
      occasions: [
        "everyday",
        "weekend"
      ],
      piece_ids: [
        "product-white-tee",
        "product-navy-rugby",
        "product-khaki-deck-pants",
        "product-navy-socks",
        "product-white-premier",
        "product-black-glasses",
        "product-coal-cap"
      ],
      equipment: {
        base: "product-white-tee",
        shirt: "product-navy-rugby",
        lower: "product-khaki-deck-pants",
        socks: "product-navy-socks",
        shoes: "product-white-premier",
        glasses: "product-black-glasses",
        hat: "product-coal-cap"
      },
      image: "",
      image_credit: "",
      source_urls: [
        "https://www.taylorstitch.com/products/organic-cotton-tee-in-vintage-white-2304",
        "https://www.taylorstitch.com/products/rugby-shirt-in-navy-stripe-2610",
        "https://www.taylorstitch.com/products/deck-pant-in-khaki-bedford-cord-2512",
        "https://www.taylorstitch.com/products/the-merino-sock-in-navy",
        "https://thursdayboots.com/products/mens-premier-low-top-sneaker-white",
        "https://goodr.com/products/a-unicorns-calamity",
        "https://www.taylorstitch.com/products/mercer-cap-in-coal-herringbone-wool-2611"
      ],
      notes: "Navy stripes and khaki cord make a relaxed collegiate set. The white tee is the under layer; the rugby is layer one."
    },
    {
      schema: 1,
      type: "outfit",
      id: "set-forest",
      title: "Forest Sidequest",
      season: "Fall Winter 2026",
      styles: [
        "heritage prep"
      ],
      colors: [
        "white",
        "olive",
        "black",
        "navy",
        "brown",
        "cream"
      ],
      occasions: [
        "everyday",
        "weekend"
      ],
      piece_ids: [
        "product-white-tee",
        "product-forest-flannel",
        "product-olive-overshirt",
        "product-navy-deck-pants",
        "product-coffee-socks",
        "product-brown-captain",
        "product-natural-beanie"
      ],
      equipment: {
        base: "product-white-tee",
        shirt: "product-forest-flannel",
        outer: "product-olive-overshirt",
        lower: "product-navy-deck-pants",
        socks: "product-coffee-socks",
        shoes: "product-brown-captain",
        hat: "product-natural-beanie"
      },
      image: "",
      image_credit: "",
      source_urls: [
        "https://www.taylorstitch.com/products/organic-cotton-tee-in-vintage-white-2304",
        "https://www.taylorstitch.com/products/crater-shirt-in-dark-forest-2611",
        "https://www.taylorstitch.com/products/maritime-shirt-jacket-in-heather-olive-wool-2610",
        "https://www.taylorstitch.com/products/deck-pant-in-dark-navy-bedford-cord-2512",
        "https://www.taylorstitch.com/products/camp-sock-in-marled-coffee-2409",
        "https://thursdayboots.com/products/mens-brown-captain",
        "https://www.taylorstitch.com/products/seafarer-beanie-in-natural-donegal-2611"
      ],
      notes: "Forest flannel under an olive wool overshirt, grounded with navy pants and brown boots. Remove layer two for milder weather."
    },
    {
      schema: 1,
      type: "outfit",
      id: "set-night",
      title: "After-hours Charcoal",
      season: "Fall Winter 2026",
      styles: [
        "expressive evening"
      ],
      colors: [
        "burgundy",
        "black",
        "gray",
        "navy",
        "brown",
        "gold"
      ],
      occasions: [
        "evening",
        "creative work"
      ],
      piece_ids: [
        "product-port-tee",
        "product-black-trucker",
        "product-charcoal-apres",
        "product-navy-socks",
        "product-brown-captain",
        "product-brass-cuff",
        "product-amber-glasses"
      ],
      equipment: {
        shirt: "product-port-tee",
        outer: "product-black-trucker",
        lower: "product-charcoal-apres",
        socks: "product-navy-socks",
        shoes: "product-brown-captain",
        wrist: "product-brass-cuff",
        glasses: "product-amber-glasses"
      },
      image: "",
      image_credit: "",
      source_urls: [
        "https://www.taylorstitch.com/products/organic-cotton-shop-tee-in-port-twist-2610",
        "https://www.taylorstitch.com/products/long-haul-jacket-in-faded-black-washed-moleskin-2610",
        "https://www.taylorstitch.com/products/apres-pant-in-charcoal-sashiko",
        "https://www.taylorstitch.com/products/the-merino-sock-in-navy",
        "https://thursdayboots.com/products/mens-brown-captain",
        "https://www.taylorstitch.com/products/hammered-cuff-in-brass-2611",
        "https://goodr.com/products/whiskey-shots-with-satan"
      ],
      notes: "Port, faded black and charcoal with warm brown boots. Brass and amber are optional accents you can swap out."
    },
    {
      schema: 1,
      type: "outfit",
      id: "set-blue",
      title: "Everyday Blue",
      season: "Fall Winter 2026",
      styles: [
        "relaxed tailoring"
      ],
      colors: [
        "blue",
        "stone",
        "brown",
        "navy",
        "white"
      ],
      occasions: [
        "creative work",
        "dinner"
      ],
      piece_ids: [
        "product-blue-oxford",
        "product-khaki-deck-pants",
        "product-navy-socks",
        "product-white-premier",
        "product-brown-belt"
      ],
      equipment: {
        shirt: "product-blue-oxford",
        lower: "product-khaki-deck-pants",
        socks: "product-navy-socks",
        shoes: "product-white-premier",
        accessories: "product-brown-belt"
      },
      image: "",
      image_credit: "",
      source_urls: [
        "https://www.taylorstitch.com/products/jack-in-blue-everyday-oxford-2304",
        "https://www.taylorstitch.com/products/deck-pant-in-khaki-bedford-cord-2512",
        "https://www.taylorstitch.com/products/the-merino-sock-in-navy",
        "https://thursdayboots.com/products/mens-premier-low-top-sneaker-white",
        "https://www.taylorstitch.com/products/braided-belt-in-dark-brown-2402"
      ],
      notes: "A blue Oxford and khaki deck pants with white leather sneakers. A straightforward set for testing cleaner shapes."
    },
    {
      schema: 1,
      type: "outfit",
      id: "set-corduroy",
      title: "Corduroy Night",
      season: "Fall Winter 2026",
      styles: [
        "relaxed tailoring"
      ],
      colors: [
        "blue",
        "navy",
        "stone",
        "brown",
        "copper"
      ],
      occasions: [
        "dinner",
        "evening"
      ],
      piece_ids: [
        "product-blue-oxford",
        "product-navy-sportcoat",
        "product-khaki-deck-pants",
        "product-navy-socks",
        "product-brown-captain",
        "product-copper-cuff",
        "product-eddy-scarf",
        "product-brown-belt"
      ],
      equipment: {
        shirt: "product-blue-oxford",
        outer: "product-navy-sportcoat",
        lower: "product-khaki-deck-pants",
        socks: "product-navy-socks",
        shoes: "product-brown-captain",
        wrist: "product-copper-cuff",
        neck: "product-eddy-scarf",
        accessories: "product-brown-belt"
      },
      image: "",
      image_credit: "",
      source_urls: [
        "https://www.taylorstitch.com/products/jack-in-blue-everyday-oxford-2304",
        "https://www.taylorstitch.com/products/riley-sportcoat-in-dark-navy-corduroy-2611",
        "https://www.taylorstitch.com/products/deck-pant-in-khaki-bedford-cord-2512",
        "https://www.taylorstitch.com/products/the-merino-sock-in-navy",
        "https://thursdayboots.com/products/mens-brown-captain",
        "https://www.taylorstitch.com/products/twisted-cuff-in-copper-2701",
        "https://www.taylorstitch.com/products/fireside-scarf-in-eddy-plaid-2610",
        "https://www.taylorstitch.com/products/braided-belt-in-dark-brown-2402"
      ],
      notes: "Navy corduroy over a blue Oxford, with khaki pants and brown boots. The scarf, cuff and belt are optional slots, each linked to its exact product."
    }
  ],
  pieces: [
    {
      schema: 1,
      type: "piece",
      id: "product-white-tee",
      title: "The Organic Cotton Tee in Vintage White",
      category: "top",
      slot: "base",
      compatible_slots: [
        "base",
        "shirt"
      ],
      colors: [
        "white"
      ],
      ownership: "wishlist",
      price: 55,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/organic-cotton-tee-in-vintage-white-2304",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-white-tee.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/products/organic-cotton-tee-in-vintage-white-2304_001.jpg?v=1790611991",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "6821053497421",
      sku: "2304OCTB38",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-port-tee",
      title: "The Organic Cotton Shop Tee in Port Twist",
      category: "top",
      slot: "base",
      compatible_slots: [
        "base",
        "shirt"
      ],
      colors: [
        "burgundy"
      ],
      ownership: "wishlist",
      price: 65,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/organic-cotton-shop-tee-in-port-twist-2610",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-port-tee.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_TheOrganicCottonShopTee-PortTwist_PDP_001.jpg?v=1792077854",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759503753293",
      sku: "2610OCSTPT36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-blue-oxford",
      title: "The Jack in Blue Everyday Oxford",
      category: "top",
      slot: "shirt",
      compatible_slots: [
        "shirt"
      ],
      colors: [
        "blue"
      ],
      ownership: "wishlist",
      price: 118,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/jack-in-blue-everyday-oxford-2304",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-blue-oxford.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/jack-in-blue-everyday-oxford-2304_001.jpg?v=1790611605",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "6824013660237",
      sku: "2304JBEO36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-navy-rugby",
      title: "The Rugby Shirt in Navy Stripe",
      category: "top",
      slot: "shirt",
      compatible_slots: [
        "shirt"
      ],
      colors: [
        "navy",
        "cream"
      ],
      ownership: "wishlist",
      price: 128,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/rugby-shirt-in-navy-stripe-2610",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-navy-rugby.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Rugby_Shirt_in_Navy_Stripe_PDP_001.jpg?v=1790707363",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759505358925",
      sku: "2610RSNS36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-forest-flannel",
      title: "The Crater Shirt in Dark Forest",
      category: "top",
      slot: "shirt",
      compatible_slots: [
        "shirt",
        "outer"
      ],
      colors: [
        "olive",
        "black"
      ],
      ownership: "wishlist",
      price: 148,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/crater-shirt-in-dark-forest-2611",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-forest-flannel.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Crater_Shirt_in_Dark_Forest_PDP_001.jpg?v=1793832582",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759504801869",
      sku: "2611CSDF36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-navy-overshirt",
      title: "The Maritime Shirt Jacket in Heather Navy Wool",
      category: "outerwear",
      slot: "outer",
      compatible_slots: [
        "outer"
      ],
      colors: [
        "navy"
      ],
      ownership: "wishlist",
      price: 198,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/maritime-shirt-jacket-in-heather-navy-wool-2610",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-navy-overshirt.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Maritime_Shirt_Jacket_in_Heather_Navy_Wool_PDP_001.jpg?v=1790895632",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759502082125",
      sku: "2610MSJHNW36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-olive-overshirt",
      title: "The Maritime Shirt Jacket in Heather Olive Wool",
      category: "outerwear",
      slot: "outer",
      compatible_slots: [
        "outer"
      ],
      colors: [
        "olive"
      ],
      ownership: "wishlist",
      price: 198,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/maritime-shirt-jacket-in-heather-olive-wool-2610",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-olive-overshirt.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Maritime_Shirt_Jacket_in_Heather_Olive_Wool_PDP_001.jpg?v=1790895686",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759502114893",
      sku: "2610MSJHOW36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-black-trucker",
      title: "The Long Haul Jacket in Faded Black Washed Moleskin",
      category: "outerwear",
      slot: "outer",
      compatible_slots: [
        "outer"
      ],
      colors: [
        "black"
      ],
      ownership: "wishlist",
      price: 248,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/long-haul-jacket-in-faded-black-washed-moleskin-2610",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-black-trucker.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_productname_PDP_001_42fad0c6-bea0-4a47-be05-7f58e6e0aada.jpg?v=1792427224",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759502016589",
      sku: "2610LHJFBWM36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XL - 44",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-navy-sportcoat",
      title: "The Riley Sportcoat in Dark Navy Corduroy",
      category: "outerwear",
      slot: "outer",
      compatible_slots: [
        "outer"
      ],
      colors: [
        "navy"
      ],
      ownership: "wishlist",
      price: 238,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/riley-sportcoat-in-dark-navy-corduroy-2611",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-navy-sportcoat.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Riley_Sportcoat_in_Dark_Navy_Corduroy_PDP_001.jpg?v=1791822946",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759504080973",
      sku: "2611RSDNC36",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS - 36",
        "S - 38",
        "M - 40",
        "L - 42",
        "XXL - 46"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-khaki-deck-pants",
      title: "The Deck Pant in Khaki Bedford Cord",
      category: "bottom",
      slot: "lower",
      compatible_slots: [
        "lower"
      ],
      colors: [
        "stone",
        "brown"
      ],
      ownership: "wishlist",
      price: 148,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/deck-pant-in-khaki-bedford-cord-2512",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-khaki-deck-pants.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Deck_Pant_in_Khaki_Bedford_PDP_001.jpg?v=1792019167",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7454614028365",
      sku: "2512DPKBC2832",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "28 / 32",
        "29 / 32",
        "30 / 32",
        "31 / 32",
        "32 / 32",
        "33 / 32",
        "34 / 32",
        "35 / 32",
        "36 / 32",
        "38 / 32",
        "28 / 34",
        "29 / 34",
        "30 / 34",
        "31 / 34",
        "32 / 34",
        "33 / 34",
        "34 / 34",
        "35 / 34",
        "36 / 34",
        "38 / 34"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-navy-deck-pants",
      title: "The Deck Pant in Dark Navy Bedford Cord",
      category: "bottom",
      slot: "lower",
      compatible_slots: [
        "lower"
      ],
      colors: [
        "navy"
      ],
      ownership: "wishlist",
      price: 148,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/deck-pant-in-dark-navy-bedford-cord-2512",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-navy-deck-pants.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/instock_m_q425_The_Deck_Pant-DarkNavyBedfordCord_portrait_001.jpg?v=1793993552",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7454613995597",
      sku: "2512DPDNBC2832",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "28 / 32",
        "29 / 32",
        "30 / 32",
        "31 / 32",
        "32 / 32",
        "33 / 32",
        "34 / 32",
        "35 / 32",
        "36 / 32",
        "38 / 32",
        "28 / 34",
        "29 / 34",
        "30 / 34",
        "31 / 34",
        "32 / 34",
        "33 / 34",
        "34 / 34",
        "35 / 34",
        "36 / 34",
        "38 / 34"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-charcoal-apres",
      title: "The Apres Pant in Charcoal Sashiko",
      category: "bottom",
      slot: "lower",
      compatible_slots: [
        "lower"
      ],
      colors: [
        "gray"
      ],
      ownership: "wishlist",
      price: 128,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/apres-pant-in-charcoal-sashiko",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-charcoal-apres.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/products/apres-pant-in-charcoal-sashiko_001.jpg?v=1790611008",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "6549279834189",
      sku: "2109APCSXS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS / Regular",
        "XS / Long",
        "S / Long",
        "M / Regular",
        "M / Long",
        "L / Regular",
        "L / Long",
        "XL / Regular",
        "XL / Long",
        "XXL / Regular",
        "XXL / Long"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-olive-roamer",
      title: "The Roamer Pant in Smoked Olive Corduroy",
      category: "bottom",
      slot: "lower",
      compatible_slots: [
        "lower"
      ],
      colors: [
        "olive"
      ],
      ownership: "wishlist",
      price: 138,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/roamer-pant-in-smoked-olive-corduroy-2611",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-olive-roamer.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Roamer_Pant_in_Smoked_Olive_Corduroy_PDP_001.jpg?v=1793992458",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759506178125",
      sku: "2611RPSOCXS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-navy-socks",
      title: "The Merino Sock in Navy",
      category: "accessory",
      slot: "socks",
      compatible_slots: [
        "socks"
      ],
      colors: [
        "navy"
      ],
      ownership: "wishlist",
      price: 32,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/the-merino-sock-in-navy",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-navy-socks.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/products/the-merino-sock-in-navy_001.jpg?v=1790612365",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "4488163786829",
      sku: "2005MSNSM",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "S/M (7-9)",
        "L/XL (9.5-13)"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-natural-socks",
      title: "The Waffle Sock in Natural",
      category: "accessory",
      slot: "socks",
      compatible_slots: [
        "socks"
      ],
      colors: [
        "cream"
      ],
      ownership: "wishlist",
      price: 28,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/waffle-sock-in-natural-2501",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-natural-socks.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/waffle-sock-in-natural-2501_001.jpg?v=1790612434",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7307482792013",
      sku: "2501WSNSM",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "S/M",
        "L/XL"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-coffee-socks",
      title: "The Camp Sock in Marled Coffee",
      category: "accessory",
      slot: "socks",
      compatible_slots: [
        "socks"
      ],
      colors: [
        "brown"
      ],
      ownership: "wishlist",
      price: 30,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/camp-sock-in-marled-coffee-2409",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-coffee-socks.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/camp-sock-in-marled-coffee-2409_001.jpg?v=1790611176",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "6990292189261",
      sku: "2409CSMCOSM",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "S/M",
        "L/XL"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-natural-beanie",
      title: "The Seafarer Beanie in Natural Donegal",
      category: "accessory",
      slot: "hat",
      compatible_slots: [
        "hat"
      ],
      colors: [
        "cream"
      ],
      ownership: "wishlist",
      price: 48,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/seafarer-beanie-in-natural-donegal-2611",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-natural-beanie.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_TheSeafarerBeanie-NaturalDonegal_PDP_001.jpg?v=1791489893",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759505588301",
      sku: "2611SBNDOS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "One Size"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-coal-cap",
      title: "The Mercer Cap in Coal Herringbone Wool",
      category: "accessory",
      slot: "hat",
      compatible_slots: [
        "hat"
      ],
      colors: [
        "gray",
        "black"
      ],
      ownership: "wishlist",
      price: 68,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/mercer-cap-in-coal-herringbone-wool-2611",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-coal-cap.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_The_Mercer_Cap_in_Coal_Herringbone_PDP_001.jpg?v=1794247586",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759505752141",
      sku: "2611MCCHWOS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "One Size"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-eddy-scarf",
      title: "The Fireside Scarf in Eddy Plaid",
      category: "accessory",
      slot: "neck",
      compatible_slots: [
        "neck"
      ],
      colors: [
        "navy",
        "blue",
        "brown"
      ],
      ownership: "wishlist",
      price: 88,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/fireside-scarf-in-eddy-plaid-2610",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-eddy-scarf.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_TheFiresideScarf-EddyPlaid_PDP_001.jpg?v=1792177330",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7759504048205",
      sku: "2610FSEPOS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "One Size"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-butterscotch-scarf",
      title: "The Fireside Scarf in Butterscotch Plaid",
      category: "accessory",
      slot: "neck",
      compatible_slots: [
        "neck"
      ],
      colors: [
        "brown",
        "cream"
      ],
      ownership: "wishlist",
      price: 88,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/fireside-scarf-in-butterscotch-plaid-2510",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-butterscotch-scarf.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/instock_m_q425_The_Fireside_Scarf-ButterscotchPlaid_portrait_001.jpg?v=1792176559",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7454613012557",
      sku: "2510FSBPOS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "One Size"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-brass-cuff",
      title: "The Hammered Cuff in Brass",
      category: "accessory",
      slot: "wrist",
      compatible_slots: [
        "wrist"
      ],
      colors: [
        "gold"
      ],
      ownership: "wishlist",
      price: 80,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/hammered-cuff-in-brass-2611",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-brass-cuff.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_TheHammeredCuff-Brass_PDP_001.jpg?v=1793208241",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7949354598477",
      sku: "2611HCBOS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "One Size"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-copper-cuff",
      title: "The Twisted Cuff in Copper",
      category: "accessory",
      slot: "wrist",
      compatible_slots: [
        "wrist"
      ],
      colors: [
        "copper"
      ],
      ownership: "wishlist",
      price: 80,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/twisted-cuff-in-copper-2701",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-copper-cuff.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/Q426_TheTwistedCuff-Copper_PDP_001.jpg?v=1793216185",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "7909623038029",
      sku: "2611TCCOS",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "One Size"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-brown-belt",
      title: "The Braided Belt in Dark Brown",
      category: "accessory",
      slot: "accessories",
      compatible_slots: [
        "accessories"
      ],
      colors: [
        "brown"
      ],
      ownership: "wishlist",
      price: 98,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/braided-belt-in-dark-brown-2402",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-brown-belt.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/braided-belt-in-dark-brown-2402_001.jpg?v=1790611092",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "6967395516493",
      sku: "2402BBDB30",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "30",
        "32",
        "36",
        "38"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-black-belt",
      title: "The Foundation Belt in Black",
      category: "accessory",
      slot: "accessories",
      compatible_slots: [
        "accessories"
      ],
      colors: [
        "black"
      ],
      ownership: "wishlist",
      price: 88,
      currency: "USD",
      store: "Taylor Stitch",
      product_url: "https://www.taylorstitch.com/products/foundation-belt-in-black-2402",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-black-belt.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0070/1922/files/foundation-belt-in-black-2402_001.jpg?v=1790611493",
      image_credit: "Product photograph courtesy of Taylor Stitch",
      product_id: "6886867501133",
      sku: "2402FBBL28",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "28",
        "30",
        "32"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-brown-captain",
      title: "Captain | Brown",
      category: "shoes",
      slot: "shoes",
      compatible_slots: [
        "shoes"
      ],
      colors: [
        "brown"
      ],
      ownership: "wishlist",
      price: 199,
      currency: "USD",
      store: "Thursday Boot Company",
      product_url: "https://thursdayboots.com/products/mens-brown-captain",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-brown-captain.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0419/1525/files/1024x1024-Men-Captain-Brown-081226-3.4-d17ac2.jpg?v=1790357464",
      image_credit: "Product photograph courtesy of Thursday Boot Company",
      product_id: "2219740613",
      sku: "BRNCPN6",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "Standard / 6",
        "Standard / 6.5",
        "Standard / 7",
        "Standard / 7.5",
        "Standard / 8",
        "Standard / 8.5",
        "Standard / 9",
        "Standard / 9.5",
        "Standard / 10",
        "Standard / 10.5",
        "Standard / 11",
        "Standard / 11.5",
        "Standard / 12",
        "Standard / 12.5",
        "Standard / 13",
        "Standard / 13.5",
        "Standard / 14",
        "Standard / 15",
        "Standard / 16",
        "Wide / 6",
        "Wide / 6.5",
        "Wide / 7",
        "Wide / 7.5",
        "Wide / 8",
        "Wide / 8.5",
        "Wide / 9",
        "Wide / 9.5",
        "Wide / 10",
        "Wide / 10.5",
        "Wide / 11",
        "Wide / 11.5",
        "Wide / 12",
        "Wide / 12.5",
        "Wide / 13.5",
        "Wide / 14",
        "Wide / 15",
        "Wide / 16"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-white-premier",
      title: "Premier Low Top | White",
      category: "shoes",
      slot: "shoes",
      compatible_slots: [
        "shoes"
      ],
      colors: [
        "white"
      ],
      ownership: "wishlist",
      price: 135,
      currency: "USD",
      store: "Thursday Boot Company",
      product_url: "https://thursdayboots.com/products/mens-premier-low-top-sneaker-white",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-white-premier.jpg",
      image_source_url: "https://cdn.shopify.com/s/files/1/0419/1525/files/1024x1024-Men-Premier-LowTop-White-BlindEyelets-121423-3.4_2_3615bf9d-be8c-4f08-a54e-f6a5b91208ca.jpg?v=1705532975",
      image_credit: "Product photograph courtesy of Thursday Boot Company",
      product_id: "4797155410010",
      sku: "WHTPLOW6",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "Standard / 6",
        "Standard / 6.5",
        "Standard / 7",
        "Standard / 7.5",
        "Standard / 8",
        "Standard / 8.5",
        "Standard / 9",
        "Standard / 9.5",
        "Standard / 10",
        "Standard / 10.5",
        "Standard / 11",
        "Standard / 11.5",
        "Standard / 12",
        "Standard / 12.5",
        "Standard / 13",
        "Standard / 13.5",
        "Standard / 14",
        "Standard / 15",
        "Standard / 16",
        "Wide (EE) / 6",
        "Wide (EEE) / 6",
        "Wide (EE) / 6.5",
        "Wide (EEE) / 6.5",
        "Wide (EE) / 7",
        "Wide (EEE) / 7",
        "Wide (EE) / 7.5",
        "Wide (EEE) / 7.5",
        "Wide (EE) / 8",
        "Wide (EEE) / 8",
        "Wide (EE) / 8.5",
        "Wide (EEE) / 8.5",
        "Wide (EE) / 9",
        "Wide (EEE) / 9",
        "Wide (EE) / 9.5",
        "Wide (EEE) / 9.5",
        "Wide (EE) / 10",
        "Wide (EEE) / 10",
        "Wide (EE) / 10.5",
        "Wide (EEE) / 10.5",
        "Wide (EE) / 11",
        "Wide (EEE) / 11",
        "Wide (EE) / 11.5",
        "Wide (EEE) / 11.5",
        "Wide (EE) / 12",
        "Wide (EEE) / 12",
        "Wide (EE) / 12.5",
        "Wide (EEE) / 12.5",
        "Wide (EE) / 13",
        "Wide (EEE) / 13",
        "Wide (EE) / 13.5",
        "Wide (EEE) / 13.5",
        "Wide (EE) / 14",
        "Wide (EEE) / 14",
        "Wide (EE) / 15",
        "Wide (EEE) / 15",
        "Wide (EE) / 16",
        "Wide (EEE) / 16"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-amber-glasses",
      title: "Whiskey Shots With Satan",
      category: "accessory",
      slot: "glasses",
      compatible_slots: [
        "glasses"
      ],
      colors: [
        "black",
        "brown"
      ],
      ownership: "wishlist",
      price: 30,
      currency: "USD",
      store: "goodr",
      product_url: "https://goodr.com/products/whiskey-shots-with-satan",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-amber-glasses.png",
      image_source_url: "https://cdn.shopify.com/s/files/1/0084/1616/5946/files/1_WHISKEY_SHOTS_WITH_SATAN_Side_Transparent_e206cc51-8c34-46d1-956d-d4781ebf7b86.png?v=1689751008",
      image_credit: "Product photograph courtesy of goodr",
      product_id: "1461115584570",
      sku: "G00583-OG-02",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "Original",
        "Small",
        "Large"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    },
    {
      schema: 1,
      type: "piece",
      id: "product-black-glasses",
      title: "A Unicorn's Calamity",
      category: "accessory",
      slot: "glasses",
      compatible_slots: [
        "glasses"
      ],
      colors: [
        "black"
      ],
      ownership: "wishlist",
      price: 30,
      currency: "USD",
      store: "goodr",
      product_url: "https://goodr.com/products/a-unicorns-calamity",
      price_checked_at: "2026-11-22",
      price_note: "Displayed price for this exact product and color. Tax and shipping excluded; select your size at the retailer.",
      image: "Assets/Products/product-black-glasses.png",
      image_source_url: "https://cdn.shopify.com/s/files/1/0084/1616/5946/files/1_SideTransparent_ae333825-e7f4-49fa-821b-96803652ff47.png?v=1716912584",
      image_credit: "Product photograph courtesy of goodr",
      product_id: "7189749432378",
      sku: "G00352-OG-01",
      product_checked_at: "2026-11-22",
      availability: "available",
      available_sizes: [
        "Original",
        "Small",
        "Large"
      ],
      notes: "Exact product and color pictured. Retailer reported at least one variant available when checked. Your size and delivery date must be confirmed on the retailer page."
    }
  ]
};

// src/main.ts
var VIEW = "style-zone-view";
var WardrobeStore = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  full(path) {
    return (0, import_obsidian.normalizePath)(`${this.plugin.settings.folder}/${safePath(path)}`);
  }
  async ensureDirectory(path) {
    const parts = (0, import_obsidian.normalizePath)(path).split("/");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!this.plugin.app.vault.getAbstractFileByPath(current)) {
        try {
          await this.plugin.app.vault.createFolder(current);
        } catch (error) {
          if (!this.plugin.app.vault.getAbstractFileByPath(current)) throw error;
        }
      }
    }
  }
  async load() {
    const data = { outfits: [], pieces: [], ratings: [], warnings: [] }, base = `${this.plugin.settings.folder}/`;
    const files = this.plugin.app.vault.getFiles().filter((f) => f.path.startsWith(base) && f.extension === "md").sort((a, b) => a.path.localeCompare(b.path));
    const ids = /* @__PURE__ */ new Set();
    await Promise.all(files.map(async (file) => {
      const relative = file.path.slice(base.length);
      try {
        if (relative.startsWith("Ratings/")) {
          data.ratings.push(parseRating(await this.plugin.app.vault.read(file)));
          return;
        }
        if (!relative.startsWith("Outfits/") && !relative.startsWith("Pieces/")) return;
        const record = parseRecord(await this.plugin.app.vault.read(file), relative);
        if (ids.has(record.id)) throw Error(`Duplicate ID ${record.id}`);
        ids.add(record.id);
        if (record.type === "outfit") data.outfits.push(record);
        else data.pieces.push(record);
      } catch (error) {
        data.warnings.push(`${relative}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }));
    data.outfits.sort((a, b) => a.title.localeCompare(b.title));
    data.pieces.sort((a, b) => a.title.localeCompare(b.title));
    return data;
  }
  async ensureStarter() {
    const data = await this.load(), ids = new Set([...data.outfits, ...data.pieces].map((x) => x.id));
    for (const record of [...catalog_default.pieces, ...catalog_default.outfits]) {
      if (ids.has(record.id)) continue;
      const path = this.full(`${record.type === "piece" ? "Pieces" : "Outfits"}/${record.id}.md`);
      await this.ensureDirectory(path.slice(0, path.lastIndexOf("/")));
      if (this.plugin.app.vault.getAbstractFileByPath(path)) continue;
      try {
        await this.plugin.app.vault.create(path, serializeRecord(record));
      } catch (error) {
        if (!this.plugin.app.vault.getAbstractFileByPath(path)) throw error;
      }
      ids.add(record.id);
    }
  }
  async rate(event) {
    const path = this.full(`Ratings/${event.id}.md`);
    await this.ensureDirectory(this.full("Ratings"));
    await this.plugin.app.vault.create(path, serializeRating(event));
  }
  async save(record) {
    const directory = record.type === "piece" ? "Pieces" : "Outfits";
    const relative = record.path ?? `${directory}/${record.id}.md`;
    safePath(relative);
    if (!relative.startsWith(directory + "/") || !relative.endsWith(".md")) throw Error("Unexpected record location.");
    if (record.image) safePath(record.image);
    if (record.type === "piece" && record.product_url && !safeUrl(record.product_url)) throw Error("Use an http or https product URL.");
    parseRecord(serializeRecord(record));
    const path = this.full(relative);
    await this.ensureDirectory(path.slice(0, path.lastIndexOf("/")));
    const file = this.plugin.app.vault.getAbstractFileByPath(path);
    if (file instanceof import_obsidian.TFile) await this.plugin.app.vault.process(file, (current) => {
      if (parseRecord(current).id !== record.id) throw Error("The note identity changed. Reload before editing.");
      if (record.originalText && record.originalText !== current) throw Error("This note changed since you opened it. Reopen the item editor.");
      return serializeRecord(record, current);
    });
    else if (file) throw Error("A folder occupies this note path.");
    else await this.plugin.app.vault.create(path, serializeRecord(record));
  }
  savePiece(record) {
    return this.save(record);
  }
  saveOutfit(record) {
    return this.save(record);
  }
  async saveImage(file) {
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) || file.size > 20 * 1024 * 1024) throw Error("Choose a JPG, PNG, WebP or GIF under 20 MB.");
    const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[file.type];
    const relative = `Assets/Uploads/${crypto.randomUUID()}.${ext}`;
    await this.ensureDirectory(this.full("Assets/Uploads"));
    await this.plugin.app.vault.createBinary(this.full(relative), await file.arrayBuffer());
    return relative;
  }
  imageUrl(path) {
    const file = this.plugin.app.vault.getAbstractFileByPath(this.full(path));
    if (!(file instanceof import_obsidian.TFile)) throw Error("Image not found");
    return this.plugin.app.vault.getResourcePath(file);
  }
  async export(data) {
    await this.ensureDirectory(this.full("Exports"));
    const name = `Exports/style-zone-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.json`;
    await this.plugin.app.vault.create(this.full(name), JSON.stringify(data, null, 2));
    new import_obsidian.Notice(`Saved ${this.plugin.settings.folder}/${name}`);
  }
  openNote(path) {
    void this.plugin.app.workspace.openLinkText(this.full(path), "", true);
  }
  subscribe(callback) {
    const vault = this.plugin.app.vault;
    const relevant = (file) => {
      if (file.path.startsWith(this.plugin.settings.folder + "/")) callback();
    };
    const refs = [vault.on("modify", relevant), vault.on("create", relevant), vault.on("delete", relevant), vault.on("rename", relevant)];
    return () => refs.forEach((ref) => vault.offref(ref));
  }
};
var StyleZoneView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    __publicField(this, "ui");
  }
  getViewType() {
    return VIEW;
  }
  getDisplayText() {
    return "Style Zone";
  }
  getIcon() {
    return "shirt";
  }
  async onOpen() {
    this.contentEl.empty();
    const store = new WardrobeStore(this.plugin);
    try {
      await this.plugin.prepareStarter(store);
    } catch (error) {
      new import_obsidian.Notice(`Starter items could not be added: ${error instanceof Error ? error.message : String(error)}`);
    }
    this.ui = new StyleZoneApp(this.contentEl, store);
    await this.ui.start();
  }
  async onClose() {
    this.ui?.dispose();
  }
};
var StyleZoneSettings = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Style Zone" });
    new import_obsidian.Setting(this.containerEl).setName("Wardrobe folder").setDesc("A folder inside this vault. Your outfits, pieces and rating notes live here.").addText((text) => text.setValue(this.plugin.settings.folder).onChange((value) => {
      try {
        safePath(value);
        this.plugin.settings.folder = value;
      } catch {
      }
    }));
    new import_obsidian.Setting(this.containerEl).setName("Save folder").setDesc("Close and reopen Style Zone after changing folders.").addButton((button2) => button2.setButtonText("Save").onClick(async () => {
      try {
        safePath(this.plugin.settings.folder);
        await this.plugin.saveData(this.plugin.settings);
        new import_obsidian.Notice("Wardrobe folder saved.");
      } catch {
        new import_obsidian.Notice("Enter a relative vault folder, such as Sync/Style Zone.");
      }
    }));
    new import_obsidian.Setting(this.containerEl).setName("Starter outfit ideas").setDesc("Adds missing Fall 2026 outfit and item notes. Existing records and ratings are preserved. Research photos arrive through your vault sync.").addButton((button2) => button2.setButtonText("Add starter ideas").onClick(() => void this.plugin.initialize()));
  }
};
var StyleZonePlugin = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    __publicField(this, "settings", { folder: "Sync/Style Zone" });
  }
  async onload() {
    const saved = await this.loadData();
    if (saved?.folder) {
      try {
        safePath(saved.folder);
        this.settings.folder = saved.folder;
      } catch {
        new import_obsidian.Notice("Style Zone ignored an invalid folder setting.");
      }
    }
    if (saved?.starterCatalogVersion === 1 && saved.starterFolder === this.settings.folder) {
      this.settings.starterCatalogVersion = 1;
      this.settings.starterFolder = saved.starterFolder;
    }
    this.registerView(VIEW, (leaf) => new StyleZoneView(leaf, this));
    this.registerObsidianProtocolHandler("style-zone", () => void this.open());
    this.addRibbonIcon("shirt", "Open Style Zone", () => void this.open());
    this.addCommand({ id: "open", name: "Open wardrobe", callback: () => void this.open() });
    this.addCommand({ id: "initialize", name: "Add starter outfit ideas", callback: () => void this.initialize() });
    this.addSettingTab(new StyleZoneSettings(this.app, this));
  }
  async open() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
  }
  async prepareStarter(store) {
    if (this.settings.starterCatalogVersion === 1 && this.settings.starterFolder === this.settings.folder) return;
    await store.ensureStarter();
    this.settings.starterCatalogVersion = 1;
    this.settings.starterFolder = this.settings.folder;
    await this.saveData(this.settings);
  }
  async initialize() {
    try {
      const store = new WardrobeStore(this);
      await store.ensureStarter();
      await this.prepareStarter(store);
      new import_obsidian.Notice("Starter ideas added. Existing notes and ratings preserved.");
      await this.open();
    } catch (error) {
      new import_obsidian.Notice(`Could not add starter ideas: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};
