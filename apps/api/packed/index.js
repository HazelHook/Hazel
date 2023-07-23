var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/memoirist/dist/index.js
class Memoirist {
  root = {};
  history = [];
  static regex = { static: /:.+?(?=\/|$)/, params: /:.+?(?=\/|$)/g };
  add(a, l, i) {
    let s;
    if (typeof l != "string")
      throw TypeError("Route path must be a string");
    l === "" ? l = "/" : l[0] !== "/" && (l = `/${l}`), this.history.push([a, l, i]);
    let n = l[l.length - 1] === "*";
    n && (l = l.slice(0, -1));
    let o = l.split(Memoirist.regex.static), u = l.match(Memoirist.regex.params) || [];
    o[o.length - 1] === "" && o.pop(), s = this.root[a] ? this.root[a] : this.root[a] = e("/");
    let p = 0;
    for (let a2 = 0;a2 < o.length; ++a2) {
      let i2 = o[a2];
      if (a2 > 0) {
        let t2 = u[p++].slice(1);
        if (s.params === null)
          s.params = r(t2);
        else if (s.params.paramName !== t2)
          throw Error(`Cannot create route "${l}" with parameter "${t2}" because a route already exists with a different parameter name ("${s.params.paramName}") in the same location`);
        let a3 = s.params;
        if (a3.inert === null) {
          s = a3.inert = e(i2);
          continue;
        }
        s = a3.inert;
      }
      for (let r2 = 0;; ) {
        if (r2 === i2.length) {
          if (r2 < s.part.length) {
            let a3 = t(s, s.part.slice(r2));
            Object.assign(s, e(i2, [a3]));
          }
          break;
        }
        if (r2 === s.part.length) {
          if (s.inert === null)
            s.inert = new Map;
          else if (s.inert.has(i2.charCodeAt(r2))) {
            s = s.inert.get(i2.charCodeAt(r2)), i2 = i2.slice(r2), r2 = 0;
            continue;
          }
          let t2 = e(i2.slice(r2));
          s.inert.set(i2.charCodeAt(r2), t2), s = t2;
          break;
        }
        if (i2[r2] !== s.part[r2]) {
          let a3 = t(s, s.part.slice(r2)), l2 = e(i2.slice(r2));
          Object.assign(s, e(s.part.slice(0, r2), [a3, l2])), s = l2;
          break;
        }
        ++r2;
      }
    }
    if (p < u.length) {
      let e2 = u[p], t2 = e2.slice(1);
      if (s.params === null)
        s.params = r(t2);
      else if (s.params.paramName !== t2)
        throw Error(`Cannot create route "${l}" with parameter "${t2}" because a route already exists with a different parameter name ("${s.params.paramName}") in the same location`);
      return s.params.store === null && (s.params.store = i), s.params.store;
    }
    return n ? (s.wildcardStore === null && (s.wildcardStore = i), s.wildcardStore) : (s.store === null && (s.store = i), s.store);
  }
  find(e2, t2) {
    let r2 = this.root[e2];
    return r2 ? a(t2, t2.length, r2, 0) : null;
  }
}
var e, t, r, a;
var init_dist = __esm(() => {
  e = (e2, t) => ({ part: e2, store: null, inert: t !== undefined ? new Map(t.map((e3) => [e3.part.charCodeAt(0), e3])) : null, params: null, wildcardStore: null });
  t = (e2, t2) => ({ ...e2, part: t2 });
  r = (e2) => ({ paramName: e2, store: null, inert: null });
  a = (e2, t2, r2, l) => {
    let i = r2?.part, s = l + i.length;
    if (i.length > 1) {
      if (s > t2)
        return null;
      if (i.length < 15) {
        for (let t3 = 1, r3 = l + 1;t3 < i.length; ++t3, ++r3)
          if (i.charCodeAt(t3) !== e2.charCodeAt(r3))
            return null;
      } else if (e2.substring(l, s) !== i)
        return null;
    }
    if (s === t2)
      return r2.store !== null ? { store: r2.store, params: {} } : r2.wildcardStore !== null ? { store: r2.wildcardStore, params: { "*": "" } } : null;
    if (r2.inert !== null) {
      let l2 = r2.inert.get(e2.charCodeAt(s));
      if (l2 !== undefined) {
        let r3 = a(e2, t2, l2, s);
        if (r3 !== null)
          return r3;
      }
    }
    if (r2.params !== null) {
      let l2 = r2.params, i2 = e2.indexOf("/", s);
      if (i2 !== s) {
        if (i2 === -1 || i2 >= t2) {
          if (l2.store !== null) {
            let r3 = {};
            return r3[l2.paramName] = e2.substring(s, t2), { store: l2.store, params: r3 };
          }
        } else if (l2.inert !== null) {
          let r3 = a(e2, t2, l2.inert, i2);
          if (r3 !== null)
            return r3.params[l2.paramName] = e2.substring(s, i2), r3;
        }
      }
    }
    return r2.wildcardStore !== null ? { store: r2.wildcardStore, params: { "*": e2.substring(s, t2) } } : null;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/node_modules/@sinclair/typebox/typebox.js
var require_typebox = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Type = exports.StandardType = exports.ExtendedTypeBuilder = exports.StandardTypeBuilder = exports.TypeBuilder = exports.TemplateLiteralDslParser = exports.TemplateLiteralGenerator = exports.TemplateLiteralFinite = exports.TemplateLiteralParser = exports.TemplateLiteralParserError = exports.TemplateLiteralResolver = exports.TemplateLiteralPattern = exports.UnionResolver = exports.KeyArrayResolver = exports.KeyResolver = exports.ObjectMap = exports.IndexedAccessor = exports.TypeClone = exports.TypeExtends = exports.TypeExtendsResult = exports.ExtendsUndefined = exports.TypeGuard = exports.TypeGuardUnknownTypeError = exports.FormatRegistry = exports.TypeRegistry = exports.PatternStringExact = exports.PatternNumberExact = exports.PatternBooleanExact = exports.PatternString = exports.PatternNumber = exports.PatternBoolean = exports.Kind = exports.Hint = exports.Modifier = undefined;
  exports.Modifier = Symbol.for("TypeBox.Modifier");
  exports.Hint = Symbol.for("TypeBox.Hint");
  exports.Kind = Symbol.for("TypeBox.Kind");
  exports.PatternBoolean = "(true|false)";
  exports.PatternNumber = "(0|[1-9][0-9]*)";
  exports.PatternString = "(.*)";
  exports.PatternBooleanExact = `^${exports.PatternBoolean}\$`;
  exports.PatternNumberExact = `^${exports.PatternNumber}\$`;
  exports.PatternStringExact = `^${exports.PatternString}\$`;
  var TypeRegistry;
  (function(TypeRegistry2) {
    const map = new Map;
    function Entries() {
      return new Map(map);
    }
    TypeRegistry2.Entries = Entries;
    function Clear() {
      return map.clear();
    }
    TypeRegistry2.Clear = Clear;
    function Has(kind) {
      return map.has(kind);
    }
    TypeRegistry2.Has = Has;
    function Set2(kind, func) {
      map.set(kind, func);
    }
    TypeRegistry2.Set = Set2;
    function Get(kind) {
      return map.get(kind);
    }
    TypeRegistry2.Get = Get;
  })(TypeRegistry || (exports.TypeRegistry = TypeRegistry = {}));
  var FormatRegistry;
  (function(FormatRegistry2) {
    const map = new Map;
    function Entries() {
      return new Map(map);
    }
    FormatRegistry2.Entries = Entries;
    function Clear() {
      return map.clear();
    }
    FormatRegistry2.Clear = Clear;
    function Has(format) {
      return map.has(format);
    }
    FormatRegistry2.Has = Has;
    function Set2(format, func) {
      map.set(format, func);
    }
    FormatRegistry2.Set = Set2;
    function Get(format) {
      return map.get(format);
    }
    FormatRegistry2.Get = Get;
  })(FormatRegistry || (exports.FormatRegistry = FormatRegistry = {}));

  class TypeGuardUnknownTypeError extends Error {
    constructor(schema) {
      super("TypeGuard: Unknown type");
      this.schema = schema;
    }
  }
  exports.TypeGuardUnknownTypeError = TypeGuardUnknownTypeError;
  var TypeGuard;
  (function(TypeGuard2) {
    function IsObject(value) {
      return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    function IsArray(value) {
      return typeof value === "object" && value !== null && Array.isArray(value);
    }
    function IsPattern(value) {
      try {
        new RegExp(value);
        return true;
      } catch {
        return false;
      }
    }
    function IsControlCharacterFree(value) {
      if (typeof value !== "string")
        return false;
      for (let i = 0;i < value.length; i++) {
        const code = value.charCodeAt(i);
        if (code >= 7 && code <= 13 || code === 27 || code === 127) {
          return false;
        }
      }
      return true;
    }
    function IsAdditionalProperties(value) {
      return IsOptionalBoolean(value) || TSchema(value);
    }
    function IsBigInt(value) {
      return typeof value === "bigint";
    }
    function IsString(value) {
      return typeof value === "string";
    }
    function IsNumber(value) {
      return typeof value === "number" && globalThis.Number.isFinite(value);
    }
    function IsBoolean(value) {
      return typeof value === "boolean";
    }
    function IsOptionalBigInt(value) {
      return value === undefined || value !== undefined && IsBigInt(value);
    }
    function IsOptionalNumber(value) {
      return value === undefined || value !== undefined && IsNumber(value);
    }
    function IsOptionalBoolean(value) {
      return value === undefined || value !== undefined && IsBoolean(value);
    }
    function IsOptionalString(value) {
      return value === undefined || value !== undefined && IsString(value);
    }
    function IsOptionalPattern(value) {
      return value === undefined || value !== undefined && IsString(value) && IsControlCharacterFree(value) && IsPattern(value);
    }
    function IsOptionalFormat(value) {
      return value === undefined || value !== undefined && IsString(value) && IsControlCharacterFree(value);
    }
    function IsOptionalSchema(value) {
      return value === undefined || TSchema(value);
    }
    function TAny(schema) {
      return TKind(schema) && schema[exports.Kind] === "Any" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TAny = TAny;
    function TArray(schema) {
      return TKind(schema) && schema[exports.Kind] === "Array" && schema.type === "array" && IsOptionalString(schema.$id) && TSchema(schema.items) && IsOptionalNumber(schema.minItems) && IsOptionalNumber(schema.maxItems) && IsOptionalBoolean(schema.uniqueItems);
    }
    TypeGuard2.TArray = TArray;
    function TBigInt(schema) {
      return TKind(schema) && schema[exports.Kind] === "BigInt" && schema.type === "null" && schema.typeOf === "BigInt" && IsOptionalString(schema.$id) && IsOptionalBigInt(schema.multipleOf) && IsOptionalBigInt(schema.minimum) && IsOptionalBigInt(schema.maximum) && IsOptionalBigInt(schema.exclusiveMinimum) && IsOptionalBigInt(schema.exclusiveMaximum);
    }
    TypeGuard2.TBigInt = TBigInt;
    function TBoolean(schema) {
      return TKind(schema) && schema[exports.Kind] === "Boolean" && schema.type === "boolean" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TBoolean = TBoolean;
    function TConstructor(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Constructor" && schema.type === "object" && schema.instanceOf === "Constructor" && IsOptionalString(schema.$id) && IsArray(schema.parameters) && TSchema(schema.returns))) {
        return false;
      }
      for (const parameter of schema.parameters) {
        if (!TSchema(parameter))
          return false;
      }
      return true;
    }
    TypeGuard2.TConstructor = TConstructor;
    function TDate(schema) {
      return TKind(schema) && schema[exports.Kind] === "Date" && schema.type === "object" && schema.instanceOf === "Date" && IsOptionalString(schema.$id) && IsOptionalNumber(schema.minimumTimestamp) && IsOptionalNumber(schema.maximumTimestamp) && IsOptionalNumber(schema.exclusiveMinimumTimestamp) && IsOptionalNumber(schema.exclusiveMaximumTimestamp);
    }
    TypeGuard2.TDate = TDate;
    function TFunction(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Function" && schema.type === "object" && schema.instanceOf === "Function" && IsOptionalString(schema.$id) && IsArray(schema.parameters) && TSchema(schema.returns))) {
        return false;
      }
      for (const parameter of schema.parameters) {
        if (!TSchema(parameter))
          return false;
      }
      return true;
    }
    TypeGuard2.TFunction = TFunction;
    function TInteger(schema) {
      return TKind(schema) && schema[exports.Kind] === "Integer" && schema.type === "integer" && IsOptionalString(schema.$id) && IsOptionalNumber(schema.multipleOf) && IsOptionalNumber(schema.minimum) && IsOptionalNumber(schema.maximum) && IsOptionalNumber(schema.exclusiveMinimum) && IsOptionalNumber(schema.exclusiveMaximum);
    }
    TypeGuard2.TInteger = TInteger;
    function TIntersect(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Intersect" && IsArray(schema.allOf) && IsOptionalString(schema.type) && (IsOptionalBoolean(schema.unevaluatedProperties) || IsOptionalSchema(schema.unevaluatedProperties)) && IsOptionalString(schema.$id))) {
        return false;
      }
      if (("type" in schema) && schema.type !== "object") {
        return false;
      }
      for (const inner of schema.allOf) {
        if (!TSchema(inner))
          return false;
      }
      return true;
    }
    TypeGuard2.TIntersect = TIntersect;
    function TKind(schema) {
      return IsObject(schema) && (exports.Kind in schema) && typeof schema[exports.Kind] === "string";
    }
    TypeGuard2.TKind = TKind;
    function TLiteralString(schema) {
      return TKind(schema) && schema[exports.Kind] === "Literal" && IsOptionalString(schema.$id) && typeof schema.const === "string";
    }
    TypeGuard2.TLiteralString = TLiteralString;
    function TLiteralNumber(schema) {
      return TKind(schema) && schema[exports.Kind] === "Literal" && IsOptionalString(schema.$id) && typeof schema.const === "number";
    }
    TypeGuard2.TLiteralNumber = TLiteralNumber;
    function TLiteralBoolean(schema) {
      return TKind(schema) && schema[exports.Kind] === "Literal" && IsOptionalString(schema.$id) && typeof schema.const === "boolean";
    }
    TypeGuard2.TLiteralBoolean = TLiteralBoolean;
    function TLiteral(schema) {
      return TLiteralString(schema) || TLiteralNumber(schema) || TLiteralBoolean(schema);
    }
    TypeGuard2.TLiteral = TLiteral;
    function TNever(schema) {
      return TKind(schema) && schema[exports.Kind] === "Never" && IsObject(schema.not) && globalThis.Object.getOwnPropertyNames(schema.not).length === 0;
    }
    TypeGuard2.TNever = TNever;
    function TNot(schema) {
      return TKind(schema) && schema[exports.Kind] === "Not" && TSchema(schema.not);
    }
    TypeGuard2.TNot = TNot;
    function TNull(schema) {
      return TKind(schema) && schema[exports.Kind] === "Null" && schema.type === "null" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TNull = TNull;
    function TNumber(schema) {
      return TKind(schema) && schema[exports.Kind] === "Number" && schema.type === "number" && IsOptionalString(schema.$id) && IsOptionalNumber(schema.multipleOf) && IsOptionalNumber(schema.minimum) && IsOptionalNumber(schema.maximum) && IsOptionalNumber(schema.exclusiveMinimum) && IsOptionalNumber(schema.exclusiveMaximum);
    }
    TypeGuard2.TNumber = TNumber;
    function TObject(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Object" && schema.type === "object" && IsOptionalString(schema.$id) && IsObject(schema.properties) && IsAdditionalProperties(schema.additionalProperties) && IsOptionalNumber(schema.minProperties) && IsOptionalNumber(schema.maxProperties))) {
        return false;
      }
      for (const [key, value] of Object.entries(schema.properties)) {
        if (!IsControlCharacterFree(key))
          return false;
        if (!TSchema(value))
          return false;
      }
      return true;
    }
    TypeGuard2.TObject = TObject;
    function TPromise(schema) {
      return TKind(schema) && schema[exports.Kind] === "Promise" && schema.type === "object" && schema.instanceOf === "Promise" && IsOptionalString(schema.$id) && TSchema(schema.item);
    }
    TypeGuard2.TPromise = TPromise;
    function TRecord(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Record" && schema.type === "object" && IsOptionalString(schema.$id) && IsAdditionalProperties(schema.additionalProperties) && IsObject(schema.patternProperties))) {
        return false;
      }
      const keys = Object.keys(schema.patternProperties);
      if (keys.length !== 1) {
        return false;
      }
      if (!IsPattern(keys[0])) {
        return false;
      }
      if (!TSchema(schema.patternProperties[keys[0]])) {
        return false;
      }
      return true;
    }
    TypeGuard2.TRecord = TRecord;
    function TRef(schema) {
      return TKind(schema) && schema[exports.Kind] === "Ref" && IsOptionalString(schema.$id) && IsString(schema.$ref);
    }
    TypeGuard2.TRef = TRef;
    function TString(schema) {
      return TKind(schema) && schema[exports.Kind] === "String" && schema.type === "string" && IsOptionalString(schema.$id) && IsOptionalNumber(schema.minLength) && IsOptionalNumber(schema.maxLength) && IsOptionalPattern(schema.pattern) && IsOptionalFormat(schema.format);
    }
    TypeGuard2.TString = TString;
    function TSymbol(schema) {
      return TKind(schema) && schema[exports.Kind] === "Symbol" && schema.type === "null" && schema.typeOf === "Symbol" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TSymbol = TSymbol;
    function TTemplateLiteral(schema) {
      return TKind(schema) && schema[exports.Kind] === "TemplateLiteral" && schema.type === "string" && IsString(schema.pattern) && schema.pattern[0] === "^" && schema.pattern[schema.pattern.length - 1] === "$";
    }
    TypeGuard2.TTemplateLiteral = TTemplateLiteral;
    function TThis(schema) {
      return TKind(schema) && schema[exports.Kind] === "This" && IsOptionalString(schema.$id) && IsString(schema.$ref);
    }
    TypeGuard2.TThis = TThis;
    function TTuple(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Tuple" && schema.type === "array" && IsOptionalString(schema.$id) && IsNumber(schema.minItems) && IsNumber(schema.maxItems) && schema.minItems === schema.maxItems)) {
        return false;
      }
      if (schema.items === undefined && schema.additionalItems === undefined && schema.minItems === 0) {
        return true;
      }
      if (!IsArray(schema.items)) {
        return false;
      }
      for (const inner of schema.items) {
        if (!TSchema(inner))
          return false;
      }
      return true;
    }
    TypeGuard2.TTuple = TTuple;
    function TUndefined(schema) {
      return TKind(schema) && schema[exports.Kind] === "Undefined" && schema.type === "null" && schema.typeOf === "Undefined" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TUndefined = TUndefined;
    function TUnionLiteral(schema) {
      return TUnion(schema) && schema.anyOf.every((schema2) => TLiteralString(schema2) || TLiteralNumber(schema2));
    }
    TypeGuard2.TUnionLiteral = TUnionLiteral;
    function TUnion(schema) {
      if (!(TKind(schema) && schema[exports.Kind] === "Union" && IsArray(schema.anyOf) && IsOptionalString(schema.$id))) {
        return false;
      }
      for (const inner of schema.anyOf) {
        if (!TSchema(inner))
          return false;
      }
      return true;
    }
    TypeGuard2.TUnion = TUnion;
    function TUint8Array(schema) {
      return TKind(schema) && schema[exports.Kind] === "Uint8Array" && schema.type === "object" && IsOptionalString(schema.$id) && schema.instanceOf === "Uint8Array" && IsOptionalNumber(schema.minByteLength) && IsOptionalNumber(schema.maxByteLength);
    }
    TypeGuard2.TUint8Array = TUint8Array;
    function TUnknown(schema) {
      return TKind(schema) && schema[exports.Kind] === "Unknown" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TUnknown = TUnknown;
    function TUnsafe(schema) {
      return TKind(schema) && schema[exports.Kind] === "Unsafe";
    }
    TypeGuard2.TUnsafe = TUnsafe;
    function TVoid(schema) {
      return TKind(schema) && schema[exports.Kind] === "Void" && schema.type === "null" && schema.typeOf === "Void" && IsOptionalString(schema.$id);
    }
    TypeGuard2.TVoid = TVoid;
    function TReadonlyOptional(schema) {
      return IsObject(schema) && schema[exports.Modifier] === "ReadonlyOptional";
    }
    TypeGuard2.TReadonlyOptional = TReadonlyOptional;
    function TReadonly(schema) {
      return IsObject(schema) && schema[exports.Modifier] === "Readonly";
    }
    TypeGuard2.TReadonly = TReadonly;
    function TOptional(schema) {
      return IsObject(schema) && schema[exports.Modifier] === "Optional";
    }
    TypeGuard2.TOptional = TOptional;
    function TSchema(schema) {
      return typeof schema === "object" && (TAny(schema) || TArray(schema) || TBoolean(schema) || TBigInt(schema) || TConstructor(schema) || TDate(schema) || TFunction(schema) || TInteger(schema) || TIntersect(schema) || TLiteral(schema) || TNever(schema) || TNot(schema) || TNull(schema) || TNumber(schema) || TObject(schema) || TPromise(schema) || TRecord(schema) || TRef(schema) || TString(schema) || TSymbol(schema) || TTemplateLiteral(schema) || TThis(schema) || TTuple(schema) || TUndefined(schema) || TUnion(schema) || TUint8Array(schema) || TUnknown(schema) || TUnsafe(schema) || TVoid(schema) || TKind(schema) && TypeRegistry.Has(schema[exports.Kind]));
    }
    TypeGuard2.TSchema = TSchema;
  })(TypeGuard || (exports.TypeGuard = TypeGuard = {}));
  var ExtendsUndefined;
  (function(ExtendsUndefined2) {
    function Check(schema) {
      if (schema[exports.Kind] === "Undefined")
        return true;
      if (schema[exports.Kind] === "Not") {
        return !Check(schema.not);
      }
      if (schema[exports.Kind] === "Intersect") {
        const intersect = schema;
        return intersect.allOf.every((schema2) => Check(schema2));
      }
      if (schema[exports.Kind] === "Union") {
        const union = schema;
        return union.anyOf.some((schema2) => Check(schema2));
      }
      return false;
    }
    ExtendsUndefined2.Check = Check;
  })(ExtendsUndefined || (exports.ExtendsUndefined = ExtendsUndefined = {}));
  var TypeExtendsResult;
  (function(TypeExtendsResult2) {
    TypeExtendsResult2[TypeExtendsResult2["Union"] = 0] = "Union";
    TypeExtendsResult2[TypeExtendsResult2["True"] = 1] = "True";
    TypeExtendsResult2[TypeExtendsResult2["False"] = 2] = "False";
  })(TypeExtendsResult || (exports.TypeExtendsResult = TypeExtendsResult = {}));
  var TypeExtends;
  (function(TypeExtends2) {
    function IntoBooleanResult(result) {
      return result === TypeExtendsResult.False ? TypeExtendsResult.False : TypeExtendsResult.True;
    }
    function AnyRight(left, right) {
      return TypeExtendsResult.True;
    }
    function Any(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right) && right.anyOf.some((schema) => TypeGuard.TAny(schema) || TypeGuard.TUnknown(schema)))
        return TypeExtendsResult.True;
      if (TypeGuard.TUnion(right))
        return TypeExtendsResult.Union;
      if (TypeGuard.TUnknown(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TAny(right))
        return TypeExtendsResult.True;
      return TypeExtendsResult.Union;
    }
    function ArrayRight(left, right) {
      if (TypeGuard.TUnknown(left))
        return TypeExtendsResult.False;
      if (TypeGuard.TAny(left))
        return TypeExtendsResult.Union;
      if (TypeGuard.TNever(left))
        return TypeExtendsResult.True;
      return TypeExtendsResult.False;
    }
    function Array2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right) && IsObjectArrayLike(right))
        return TypeExtendsResult.True;
      if (!TypeGuard.TArray(right))
        return TypeExtendsResult.False;
      return IntoBooleanResult(Visit(left.items, right.items));
    }
    function BigInt2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TBigInt(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function BooleanRight(left, right) {
      if (TypeGuard.TLiteral(left) && typeof left.const === "boolean")
        return TypeExtendsResult.True;
      return TypeGuard.TBoolean(left) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Boolean2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TBoolean(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Constructor(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (!TypeGuard.TConstructor(right))
        return TypeExtendsResult.False;
      if (left.parameters.length > right.parameters.length)
        return TypeExtendsResult.False;
      if (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === TypeExtendsResult.True)) {
        return TypeExtendsResult.False;
      }
      return IntoBooleanResult(Visit(left.returns, right.returns));
    }
    function Date2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TDate(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Function2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (!TypeGuard.TFunction(right))
        return TypeExtendsResult.False;
      if (left.parameters.length > right.parameters.length)
        return TypeExtendsResult.False;
      if (!left.parameters.every((schema, index) => IntoBooleanResult(Visit(right.parameters[index], schema)) === TypeExtendsResult.True)) {
        return TypeExtendsResult.False;
      }
      return IntoBooleanResult(Visit(left.returns, right.returns));
    }
    function IntegerRight(left, right) {
      if (TypeGuard.TLiteral(left) && typeof left.const === "number")
        return TypeExtendsResult.True;
      return TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Integer(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function IntersectRight(left, right) {
      return right.allOf.every((schema) => Visit(left, schema) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Intersect(left, right) {
      return left.allOf.some((schema) => Visit(schema, right) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function IsLiteralString(schema) {
      return typeof schema.const === "string";
    }
    function IsLiteralNumber(schema) {
      return typeof schema.const === "number";
    }
    function IsLiteralBoolean(schema) {
      return typeof schema.const === "boolean";
    }
    function Literal(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      if (TypeGuard.TString(right))
        return StringRight(left, right);
      if (TypeGuard.TNumber(right))
        return NumberRight(left, right);
      if (TypeGuard.TInteger(right))
        return IntegerRight(left, right);
      if (TypeGuard.TBoolean(right))
        return BooleanRight(left, right);
      return TypeGuard.TLiteral(right) && right.const === left.const ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function NeverRight(left, right) {
      return TypeExtendsResult.False;
    }
    function Never(left, right) {
      return TypeExtendsResult.True;
    }
    function UnwrapNot(schema) {
      let [current, depth] = [schema, 0];
      while (true) {
        if (!TypeGuard.TNot(current))
          break;
        current = current.not;
        depth += 1;
      }
      return depth % 2 === 0 ? current : exports.Type.Unknown();
    }
    function Not(left, right) {
      if (TypeGuard.TNot(left))
        return Visit(UnwrapNot(left), right);
      if (TypeGuard.TNot(right))
        return Visit(left, UnwrapNot(right));
      throw new Error(`TypeExtends: Invalid fallthrough for Not`);
    }
    function Null(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TNull(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function NumberRight(left, right) {
      if (TypeGuard.TLiteral(left) && IsLiteralNumber(left))
        return TypeExtendsResult.True;
      return TypeGuard.TNumber(left) || TypeGuard.TInteger(left) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Number2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TInteger(right) || TypeGuard.TNumber(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function IsObjectPropertyCount(schema, count) {
      return globalThis.Object.keys(schema.properties).length === count;
    }
    function IsObjectStringLike(schema) {
      return IsObjectArrayLike(schema);
    }
    function IsObjectSymbolLike(schema) {
      return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && ("description" in schema.properties) && TypeGuard.TUnion(schema.properties.description) && schema.properties.description.anyOf.length === 2 && (TypeGuard.TString(schema.properties.description.anyOf[0]) && TypeGuard.TUndefined(schema.properties.description.anyOf[1]) || TypeGuard.TString(schema.properties.description.anyOf[1]) && TypeGuard.TUndefined(schema.properties.description.anyOf[0]));
    }
    function IsObjectNumberLike(schema) {
      return IsObjectPropertyCount(schema, 0);
    }
    function IsObjectBooleanLike(schema) {
      return IsObjectPropertyCount(schema, 0);
    }
    function IsObjectBigIntLike(schema) {
      return IsObjectPropertyCount(schema, 0);
    }
    function IsObjectDateLike(schema) {
      return IsObjectPropertyCount(schema, 0);
    }
    function IsObjectUint8ArrayLike(schema) {
      return IsObjectArrayLike(schema);
    }
    function IsObjectFunctionLike(schema) {
      const length = exports.Type.Number();
      return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && ("length" in schema.properties) && IntoBooleanResult(Visit(schema.properties["length"], length)) === TypeExtendsResult.True;
    }
    function IsObjectConstructorLike(schema) {
      return IsObjectPropertyCount(schema, 0);
    }
    function IsObjectArrayLike(schema) {
      const length = exports.Type.Number();
      return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && ("length" in schema.properties) && IntoBooleanResult(Visit(schema.properties["length"], length)) === TypeExtendsResult.True;
    }
    function IsObjectPromiseLike(schema) {
      const then = exports.Type.Function([exports.Type.Any()], exports.Type.Any());
      return IsObjectPropertyCount(schema, 0) || IsObjectPropertyCount(schema, 1) && ("then" in schema.properties) && IntoBooleanResult(Visit(schema.properties["then"], then)) === TypeExtendsResult.True;
    }
    function Property(left, right) {
      if (Visit(left, right) === TypeExtendsResult.False)
        return TypeExtendsResult.False;
      if (TypeGuard.TOptional(left) && !TypeGuard.TOptional(right))
        return TypeExtendsResult.False;
      return TypeExtendsResult.True;
    }
    function ObjectRight(left, right) {
      if (TypeGuard.TUnknown(left))
        return TypeExtendsResult.False;
      if (TypeGuard.TAny(left))
        return TypeExtendsResult.Union;
      if (TypeGuard.TNever(left))
        return TypeExtendsResult.True;
      if (TypeGuard.TLiteral(left) && IsLiteralString(left) && IsObjectStringLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TLiteral(left) && IsLiteralNumber(left) && IsObjectNumberLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TLiteral(left) && IsLiteralBoolean(left) && IsObjectBooleanLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TBigInt(left) && IsObjectBigIntLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TString(left) && IsObjectStringLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TSymbol(left) && IsObjectSymbolLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TNumber(left) && IsObjectNumberLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TInteger(left) && IsObjectNumberLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TBoolean(left) && IsObjectBooleanLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TUint8Array(left) && IsObjectUint8ArrayLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TDate(left) && IsObjectDateLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TConstructor(left) && IsObjectConstructorLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TFunction(left) && IsObjectFunctionLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TRecord(left) && TypeGuard.TString(RecordKey(left))) {
        return right[exports.Hint] === "Record" ? TypeExtendsResult.True : TypeExtendsResult.False;
      }
      if (TypeGuard.TRecord(left) && TypeGuard.TNumber(RecordKey(left))) {
        return IsObjectPropertyCount(right, 0) ? TypeExtendsResult.True : TypeExtendsResult.False;
      }
      return TypeExtendsResult.False;
    }
    function Object2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      if (!TypeGuard.TObject(right))
        return TypeExtendsResult.False;
      for (const key of globalThis.Object.keys(right.properties)) {
        if (!(key in left.properties))
          return TypeExtendsResult.False;
        if (Property(left.properties[key], right.properties[key]) === TypeExtendsResult.False) {
          return TypeExtendsResult.False;
        }
      }
      return TypeExtendsResult.True;
    }
    function Promise2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right) && IsObjectPromiseLike(right))
        return TypeExtendsResult.True;
      if (!TypeGuard.TPromise(right))
        return TypeExtendsResult.False;
      return IntoBooleanResult(Visit(left.item, right.item));
    }
    function RecordKey(schema) {
      if (exports.PatternNumberExact in schema.patternProperties)
        return exports.Type.Number();
      if (exports.PatternStringExact in schema.patternProperties)
        return exports.Type.String();
      throw Error("TypeExtends: Cannot get record key");
    }
    function RecordValue(schema) {
      if (exports.PatternNumberExact in schema.patternProperties)
        return schema.patternProperties[exports.PatternNumberExact];
      if (exports.PatternStringExact in schema.patternProperties)
        return schema.patternProperties[exports.PatternStringExact];
      throw Error("TypeExtends: Cannot get record value");
    }
    function RecordRight(left, right) {
      const Key = RecordKey(right);
      const Value = RecordValue(right);
      if (TypeGuard.TLiteral(left) && IsLiteralString(left) && TypeGuard.TNumber(Key) && IntoBooleanResult(Visit(left, Value)) === TypeExtendsResult.True)
        return TypeExtendsResult.True;
      if (TypeGuard.TUint8Array(left) && TypeGuard.TNumber(Key))
        return Visit(left, Value);
      if (TypeGuard.TString(left) && TypeGuard.TNumber(Key))
        return Visit(left, Value);
      if (TypeGuard.TArray(left) && TypeGuard.TNumber(Key))
        return Visit(left, Value);
      if (TypeGuard.TObject(left)) {
        for (const key of globalThis.Object.keys(left.properties)) {
          if (Property(Value, left.properties[key]) === TypeExtendsResult.False) {
            return TypeExtendsResult.False;
          }
        }
        return TypeExtendsResult.True;
      }
      return TypeExtendsResult.False;
    }
    function Record(left, right) {
      const Value = RecordValue(left);
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (!TypeGuard.TRecord(right))
        return TypeExtendsResult.False;
      return Visit(Value, RecordValue(right));
    }
    function StringRight(left, right) {
      if (TypeGuard.TLiteral(left) && typeof left.const === "string")
        return TypeExtendsResult.True;
      return TypeGuard.TString(left) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function String2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TString(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Symbol2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TSymbol(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function TemplateLiteral(left, right) {
      if (TypeGuard.TTemplateLiteral(left))
        return Visit(TemplateLiteralResolver.Resolve(left), right);
      if (TypeGuard.TTemplateLiteral(right))
        return Visit(left, TemplateLiteralResolver.Resolve(right));
      throw new Error(`TypeExtends: Invalid fallthrough for TemplateLiteral`);
    }
    function TupleRight(left, right) {
      if (TypeGuard.TUnknown(left))
        return TypeExtendsResult.False;
      if (TypeGuard.TAny(left))
        return TypeExtendsResult.Union;
      if (TypeGuard.TNever(left))
        return TypeExtendsResult.True;
      return TypeExtendsResult.False;
    }
    function IsArrayOfTuple(left, right) {
      return TypeGuard.TArray(right) && left.items !== undefined && left.items.every((schema) => Visit(schema, right.items) === TypeExtendsResult.True);
    }
    function Tuple(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right) && IsObjectArrayLike(right))
        return TypeExtendsResult.True;
      if (TypeGuard.TArray(right) && IsArrayOfTuple(left, right))
        return TypeExtendsResult.True;
      if (!TypeGuard.TTuple(right))
        return TypeExtendsResult.False;
      if (left.items === undefined && right.items !== undefined || left.items !== undefined && right.items === undefined)
        return TypeExtendsResult.False;
      if (left.items === undefined && right.items === undefined)
        return TypeExtendsResult.True;
      return left.items.every((schema, index) => Visit(schema, right.items[index]) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Uint8Array2(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      return TypeGuard.TUint8Array(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Undefined(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TNever(right))
        return NeverRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      if (TypeGuard.TRecord(right))
        return RecordRight(left, right);
      if (TypeGuard.TVoid(right))
        return VoidRight(left, right);
      return TypeGuard.TUndefined(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function UnionRight(left, right) {
      return right.anyOf.some((schema) => Visit(left, schema) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Union(left, right) {
      return left.anyOf.every((schema) => Visit(schema, right) === TypeExtendsResult.True) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function UnknownRight(left, right) {
      return TypeExtendsResult.True;
    }
    function Unknown(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TString(right))
        return StringRight(left, right);
      if (TypeGuard.TNumber(right))
        return NumberRight(left, right);
      if (TypeGuard.TInteger(right))
        return IntegerRight(left, right);
      if (TypeGuard.TBoolean(right))
        return BooleanRight(left, right);
      if (TypeGuard.TArray(right))
        return ArrayRight(left, right);
      if (TypeGuard.TTuple(right))
        return TupleRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      return TypeGuard.TUnknown(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function VoidRight(left, right) {
      if (TypeGuard.TUndefined(left))
        return TypeExtendsResult.True;
      return TypeGuard.TUndefined(left) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Void(left, right) {
      if (TypeGuard.TIntersect(right))
        return IntersectRight(left, right);
      if (TypeGuard.TUnion(right))
        return UnionRight(left, right);
      if (TypeGuard.TUnknown(right))
        return UnknownRight(left, right);
      if (TypeGuard.TAny(right))
        return AnyRight(left, right);
      if (TypeGuard.TObject(right))
        return ObjectRight(left, right);
      return TypeGuard.TVoid(right) ? TypeExtendsResult.True : TypeExtendsResult.False;
    }
    function Visit(left, right) {
      if (TypeGuard.TTemplateLiteral(left) || TypeGuard.TTemplateLiteral(right))
        return TemplateLiteral(left, right);
      if (TypeGuard.TNot(left) || TypeGuard.TNot(right))
        return Not(left, right);
      if (TypeGuard.TAny(left))
        return Any(left, right);
      if (TypeGuard.TArray(left))
        return Array2(left, right);
      if (TypeGuard.TBigInt(left))
        return BigInt2(left, right);
      if (TypeGuard.TBoolean(left))
        return Boolean2(left, right);
      if (TypeGuard.TConstructor(left))
        return Constructor(left, right);
      if (TypeGuard.TDate(left))
        return Date2(left, right);
      if (TypeGuard.TFunction(left))
        return Function2(left, right);
      if (TypeGuard.TInteger(left))
        return Integer(left, right);
      if (TypeGuard.TIntersect(left))
        return Intersect(left, right);
      if (TypeGuard.TLiteral(left))
        return Literal(left, right);
      if (TypeGuard.TNever(left))
        return Never(left, right);
      if (TypeGuard.TNull(left))
        return Null(left, right);
      if (TypeGuard.TNumber(left))
        return Number2(left, right);
      if (TypeGuard.TObject(left))
        return Object2(left, right);
      if (TypeGuard.TRecord(left))
        return Record(left, right);
      if (TypeGuard.TString(left))
        return String2(left, right);
      if (TypeGuard.TSymbol(left))
        return Symbol2(left, right);
      if (TypeGuard.TTuple(left))
        return Tuple(left, right);
      if (TypeGuard.TPromise(left))
        return Promise2(left, right);
      if (TypeGuard.TUint8Array(left))
        return Uint8Array2(left, right);
      if (TypeGuard.TUndefined(left))
        return Undefined(left, right);
      if (TypeGuard.TUnion(left))
        return Union(left, right);
      if (TypeGuard.TUnknown(left))
        return Unknown(left, right);
      if (TypeGuard.TVoid(left))
        return Void(left, right);
      throw Error(`TypeExtends: Unknown left type operand '${left[exports.Kind]}'`);
    }
    function Extends(left, right) {
      return Visit(left, right);
    }
    TypeExtends2.Extends = Extends;
  })(TypeExtends || (exports.TypeExtends = TypeExtends = {}));
  var TypeClone;
  (function(TypeClone2) {
    function IsObject(value) {
      return typeof value === "object" && value !== null;
    }
    function IsArray(value) {
      return globalThis.Array.isArray(value);
    }
    function Array2(value) {
      return value.map((value2) => Visit(value2));
    }
    function Object2(value) {
      const clonedProperties = globalThis.Object.getOwnPropertyNames(value).reduce((acc, key) => {
        return { ...acc, [key]: Visit(value[key]) };
      }, {});
      const clonedSymbols = globalThis.Object.getOwnPropertySymbols(value).reduce((acc, key) => {
        return { ...acc, [key]: Visit(value[key]) };
      }, {});
      return { ...clonedProperties, ...clonedSymbols };
    }
    function Visit(value) {
      if (IsArray(value))
        return Array2(value);
      if (IsObject(value))
        return Object2(value);
      return value;
    }
    function Clone(schema, options) {
      return { ...Visit(schema), ...options };
    }
    TypeClone2.Clone = Clone;
  })(TypeClone || (exports.TypeClone = TypeClone = {}));
  var IndexedAccessor;
  (function(IndexedAccessor2) {
    function OptionalUnwrap(schema) {
      return schema.map((schema2) => {
        const { [exports.Modifier]: _, ...clone } = TypeClone.Clone(schema2, {});
        return clone;
      });
    }
    function IsIntersectOptional(schema) {
      return schema.every((schema2) => TypeGuard.TOptional(schema2));
    }
    function IsUnionOptional(schema) {
      return schema.some((schema2) => TypeGuard.TOptional(schema2));
    }
    function ResolveIntersect(schema) {
      const optional = IsIntersectOptional(schema.allOf);
      return optional ? exports.Type.Optional(exports.Type.Intersect(OptionalUnwrap(schema.allOf))) : schema;
    }
    function ResolveUnion(schema) {
      const optional = IsUnionOptional(schema.anyOf);
      return optional ? exports.Type.Optional(exports.Type.Union(OptionalUnwrap(schema.anyOf))) : schema;
    }
    function ResolveOptional(schema) {
      if (schema[exports.Kind] === "Intersect")
        return ResolveIntersect(schema);
      if (schema[exports.Kind] === "Union")
        return ResolveUnion(schema);
      return schema;
    }
    function Intersect(schema, key) {
      const resolved = schema.allOf.reduce((acc, schema2) => {
        const indexed = Visit(schema2, key);
        return indexed[exports.Kind] === "Never" ? acc : [...acc, indexed];
      }, []);
      return ResolveOptional(exports.Type.Intersect(resolved));
    }
    function Union(schema, key) {
      const resolved = schema.anyOf.map((schema2) => Visit(schema2, key));
      return ResolveOptional(exports.Type.Union(resolved));
    }
    function Object2(schema, key) {
      const property = schema.properties[key];
      return property === undefined ? exports.Type.Never() : exports.Type.Union([property]);
    }
    function Tuple(schema, key) {
      const items = schema.items;
      if (items === undefined)
        return exports.Type.Never();
      const element = items[key];
      if (element === undefined)
        return exports.Type.Never();
      return element;
    }
    function Visit(schema, key) {
      if (schema[exports.Kind] === "Intersect")
        return Intersect(schema, key);
      if (schema[exports.Kind] === "Union")
        return Union(schema, key);
      if (schema[exports.Kind] === "Object")
        return Object2(schema, key);
      if (schema[exports.Kind] === "Tuple")
        return Tuple(schema, key);
      return exports.Type.Never();
    }
    function Resolve(schema, keys, options = {}) {
      const resolved = keys.map((key) => Visit(schema, key.toString()));
      return ResolveOptional(exports.Type.Union(resolved, options));
    }
    IndexedAccessor2.Resolve = Resolve;
  })(IndexedAccessor || (exports.IndexedAccessor = IndexedAccessor = {}));
  var ObjectMap;
  (function(ObjectMap2) {
    function Intersect(schema, callback) {
      return exports.Type.Intersect(schema.allOf.map((inner) => Visit(inner, callback)), { ...schema });
    }
    function Union(schema, callback) {
      return exports.Type.Union(schema.anyOf.map((inner) => Visit(inner, callback)), { ...schema });
    }
    function Object2(schema, callback) {
      return callback(schema);
    }
    function Visit(schema, callback) {
      if (schema[exports.Kind] === "Intersect")
        return Intersect(schema, callback);
      if (schema[exports.Kind] === "Union")
        return Union(schema, callback);
      if (schema[exports.Kind] === "Object")
        return Object2(schema, callback);
      return schema;
    }
    function Map2(schema, callback, options) {
      return { ...Visit(TypeClone.Clone(schema, {}), callback), ...options };
    }
    ObjectMap2.Map = Map2;
  })(ObjectMap || (exports.ObjectMap = ObjectMap = {}));
  var KeyResolver;
  (function(KeyResolver2) {
    function UnwrapPattern(key) {
      return key[0] === "^" && key[key.length - 1] === "$" ? key.slice(1, key.length - 1) : key;
    }
    function Intersect(schema, options) {
      return schema.allOf.reduce((acc, schema2) => [...acc, ...Visit(schema2, options)], []);
    }
    function Union(schema, options) {
      const sets = schema.anyOf.map((inner) => Visit(inner, options));
      return [...sets.reduce((set, outer) => outer.map((key) => sets.every((inner) => inner.includes(key)) ? set.add(key) : set)[0], new Set)];
    }
    function Object2(schema, options) {
      return globalThis.Object.keys(schema.properties);
    }
    function Record(schema, options) {
      return options.includePatterns ? globalThis.Object.keys(schema.patternProperties) : [];
    }
    function Visit(schema, options) {
      if (TypeGuard.TIntersect(schema))
        return Intersect(schema, options);
      if (TypeGuard.TUnion(schema))
        return Union(schema, options);
      if (TypeGuard.TObject(schema))
        return Object2(schema, options);
      if (TypeGuard.TRecord(schema))
        return Record(schema, options);
      return [];
    }
    function ResolveKeys(schema, options) {
      return [...new Set(Visit(schema, options))];
    }
    KeyResolver2.ResolveKeys = ResolveKeys;
    function ResolvePattern(schema) {
      const keys = ResolveKeys(schema, { includePatterns: true });
      const pattern = keys.map((key) => `(${UnwrapPattern(key)})`);
      return `^(${pattern.join("|")})\$`;
    }
    KeyResolver2.ResolvePattern = ResolvePattern;
  })(KeyResolver || (exports.KeyResolver = KeyResolver = {}));
  var KeyArrayResolver;
  (function(KeyArrayResolver2) {
    function Resolve(schema) {
      if (globalThis.Array.isArray(schema))
        return schema;
      if (TypeGuard.TUnionLiteral(schema))
        return schema.anyOf.map((schema2) => schema2.const.toString());
      if (TypeGuard.TLiteral(schema))
        return [schema.const];
      if (TypeGuard.TTemplateLiteral(schema)) {
        const expression = TemplateLiteralParser.ParseExact(schema.pattern);
        if (!TemplateLiteralFinite.Check(expression))
          throw Error("KeyArrayResolver: Cannot resolve keys from infinite template expression");
        return [...TemplateLiteralGenerator.Generate(expression)];
      }
      return [];
    }
    KeyArrayResolver2.Resolve = Resolve;
  })(KeyArrayResolver || (exports.KeyArrayResolver = KeyArrayResolver = {}));
  var UnionResolver;
  (function(UnionResolver2) {
    function* Union(union) {
      for (const schema of union.anyOf) {
        if (schema[exports.Kind] === "Union") {
          yield* Union(schema);
        } else {
          yield schema;
        }
      }
    }
    function Resolve(union) {
      return exports.Type.Union([...Union(union)], { ...union });
    }
    UnionResolver2.Resolve = Resolve;
  })(UnionResolver || (exports.UnionResolver = UnionResolver = {}));
  var TemplateLiteralPattern;
  (function(TemplateLiteralPattern2) {
    function Escape(value) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    function Visit(schema, acc) {
      if (TypeGuard.TTemplateLiteral(schema)) {
        const pattern = schema.pattern.slice(1, schema.pattern.length - 1);
        return pattern;
      } else if (TypeGuard.TUnion(schema)) {
        const tokens = schema.anyOf.map((schema2) => Visit(schema2, acc)).join("|");
        return `(${tokens})`;
      } else if (TypeGuard.TNumber(schema)) {
        return `${acc}${exports.PatternNumber}`;
      } else if (TypeGuard.TInteger(schema)) {
        return `${acc}${exports.PatternNumber}`;
      } else if (TypeGuard.TBigInt(schema)) {
        return `${acc}${exports.PatternNumber}`;
      } else if (TypeGuard.TString(schema)) {
        return `${acc}${exports.PatternString}`;
      } else if (TypeGuard.TLiteral(schema)) {
        return `${acc}${Escape(schema.const.toString())}`;
      } else if (TypeGuard.TBoolean(schema)) {
        return `${acc}${exports.PatternBoolean}`;
      } else if (TypeGuard.TNever(schema)) {
        throw Error("TemplateLiteralPattern: TemplateLiteral cannot operate on types of TNever");
      } else {
        throw Error(`TemplateLiteralPattern: Unexpected Kind '${schema[exports.Kind]}'`);
      }
    }
    function Create(kinds) {
      return `^${kinds.map((schema) => Visit(schema, "")).join("")}$`;
    }
    TemplateLiteralPattern2.Create = Create;
  })(TemplateLiteralPattern || (exports.TemplateLiteralPattern = TemplateLiteralPattern = {}));
  var TemplateLiteralResolver;
  (function(TemplateLiteralResolver2) {
    function Resolve(template) {
      const expression = TemplateLiteralParser.ParseExact(template.pattern);
      if (!TemplateLiteralFinite.Check(expression))
        return exports.Type.String();
      const literals = [...TemplateLiteralGenerator.Generate(expression)].map((value) => exports.Type.Literal(value));
      return exports.Type.Union(literals);
    }
    TemplateLiteralResolver2.Resolve = Resolve;
  })(TemplateLiteralResolver || (exports.TemplateLiteralResolver = TemplateLiteralResolver = {}));

  class TemplateLiteralParserError extends Error {
    constructor(message) {
      super(message);
    }
  }
  exports.TemplateLiteralParserError = TemplateLiteralParserError;
  var TemplateLiteralParser;
  (function(TemplateLiteralParser2) {
    function IsNonEscaped(pattern, index, char) {
      return pattern[index] === char && pattern.charCodeAt(index - 1) !== 92;
    }
    function IsOpenParen(pattern, index) {
      return IsNonEscaped(pattern, index, "(");
    }
    function IsCloseParen(pattern, index) {
      return IsNonEscaped(pattern, index, ")");
    }
    function IsSeparator(pattern, index) {
      return IsNonEscaped(pattern, index, "|");
    }
    function IsGroup(pattern) {
      if (!(IsOpenParen(pattern, 0) && IsCloseParen(pattern, pattern.length - 1)))
        return false;
      let count = 0;
      for (let index = 0;index < pattern.length; index++) {
        if (IsOpenParen(pattern, index))
          count += 1;
        if (IsCloseParen(pattern, index))
          count -= 1;
        if (count === 0 && index !== pattern.length - 1)
          return false;
      }
      return true;
    }
    function InGroup(pattern) {
      return pattern.slice(1, pattern.length - 1);
    }
    function IsPrecedenceOr(pattern) {
      let count = 0;
      for (let index = 0;index < pattern.length; index++) {
        if (IsOpenParen(pattern, index))
          count += 1;
        if (IsCloseParen(pattern, index))
          count -= 1;
        if (IsSeparator(pattern, index) && count === 0)
          return true;
      }
      return false;
    }
    function IsPrecedenceAnd(pattern) {
      for (let index = 0;index < pattern.length; index++) {
        if (IsOpenParen(pattern, index))
          return true;
      }
      return false;
    }
    function Or(pattern) {
      let [count, start] = [0, 0];
      const expressions = [];
      for (let index = 0;index < pattern.length; index++) {
        if (IsOpenParen(pattern, index))
          count += 1;
        if (IsCloseParen(pattern, index))
          count -= 1;
        if (IsSeparator(pattern, index) && count === 0) {
          const range2 = pattern.slice(start, index);
          if (range2.length > 0)
            expressions.push(Parse(range2));
          start = index + 1;
        }
      }
      const range = pattern.slice(start);
      if (range.length > 0)
        expressions.push(Parse(range));
      if (expressions.length === 0)
        return { type: "const", const: "" };
      if (expressions.length === 1)
        return expressions[0];
      return { type: "or", expr: expressions };
    }
    function And(pattern) {
      function Group(value, index) {
        if (!IsOpenParen(value, index))
          throw new TemplateLiteralParserError(`TemplateLiteralParser: Index must point to open parens`);
        let count = 0;
        for (let scan = index;scan < value.length; scan++) {
          if (IsOpenParen(value, scan))
            count += 1;
          if (IsCloseParen(value, scan))
            count -= 1;
          if (count === 0)
            return [index, scan];
        }
        throw new TemplateLiteralParserError(`TemplateLiteralParser: Unclosed group parens in expression`);
      }
      function Range(pattern2, index) {
        for (let scan = index;scan < pattern2.length; scan++) {
          if (IsOpenParen(pattern2, scan))
            return [index, scan];
        }
        return [index, pattern2.length];
      }
      const expressions = [];
      for (let index = 0;index < pattern.length; index++) {
        if (IsOpenParen(pattern, index)) {
          const [start, end] = Group(pattern, index);
          const range = pattern.slice(start, end + 1);
          expressions.push(Parse(range));
          index = end;
        } else {
          const [start, end] = Range(pattern, index);
          const range = pattern.slice(start, end);
          if (range.length > 0)
            expressions.push(Parse(range));
          index = end - 1;
        }
      }
      if (expressions.length === 0)
        return { type: "const", const: "" };
      if (expressions.length === 1)
        return expressions[0];
      return { type: "and", expr: expressions };
    }
    function Parse(pattern) {
      if (IsGroup(pattern))
        return Parse(InGroup(pattern));
      if (IsPrecedenceOr(pattern))
        return Or(pattern);
      if (IsPrecedenceAnd(pattern))
        return And(pattern);
      return { type: "const", const: pattern };
    }
    TemplateLiteralParser2.Parse = Parse;
    function ParseExact(pattern) {
      return Parse(pattern.slice(1, pattern.length - 1));
    }
    TemplateLiteralParser2.ParseExact = ParseExact;
  })(TemplateLiteralParser || (exports.TemplateLiteralParser = TemplateLiteralParser = {}));
  var TemplateLiteralFinite;
  (function(TemplateLiteralFinite2) {
    function IsNumber(expression) {
      return expression.type === "or" && expression.expr.length === 2 && expression.expr[0].type === "const" && expression.expr[0].const === "0" && expression.expr[1].type === "const" && expression.expr[1].const === "[1-9][0-9]*";
    }
    function IsBoolean(expression) {
      return expression.type === "or" && expression.expr.length === 2 && expression.expr[0].type === "const" && expression.expr[0].const === "true" && expression.expr[1].type === "const" && expression.expr[1].const === "false";
    }
    function IsString(expression) {
      return expression.type === "const" && expression.const === ".*";
    }
    function Check(expression) {
      if (IsBoolean(expression))
        return true;
      if (IsNumber(expression) || IsString(expression))
        return false;
      if (expression.type === "and")
        return expression.expr.every((expr) => Check(expr));
      if (expression.type === "or")
        return expression.expr.every((expr) => Check(expr));
      if (expression.type === "const")
        return true;
      throw Error(`TemplateLiteralFinite: Unknown expression type`);
    }
    TemplateLiteralFinite2.Check = Check;
  })(TemplateLiteralFinite || (exports.TemplateLiteralFinite = TemplateLiteralFinite = {}));
  var TemplateLiteralGenerator;
  (function(TemplateLiteralGenerator2) {
    function* Reduce(buffer) {
      if (buffer.length === 1)
        return yield* buffer[0];
      for (const left of buffer[0]) {
        for (const right of Reduce(buffer.slice(1))) {
          yield `${left}${right}`;
        }
      }
    }
    function* And(expression) {
      return yield* Reduce(expression.expr.map((expr) => [...Generate(expr)]));
    }
    function* Or(expression) {
      for (const expr of expression.expr)
        yield* Generate(expr);
    }
    function* Const(expression) {
      return yield expression.const;
    }
    function* Generate(expression) {
      if (expression.type === "and")
        return yield* And(expression);
      if (expression.type === "or")
        return yield* Or(expression);
      if (expression.type === "const")
        return yield* Const(expression);
      throw Error("TemplateLiteralGenerator: Unknown expression");
    }
    TemplateLiteralGenerator2.Generate = Generate;
  })(TemplateLiteralGenerator || (exports.TemplateLiteralGenerator = TemplateLiteralGenerator = {}));
  var TemplateLiteralDslParser;
  (function(TemplateLiteralDslParser2) {
    function* ParseUnion(template) {
      const trim = template.trim().replace(/"|'/g, "");
      if (trim === "boolean")
        return yield exports.Type.Boolean();
      if (trim === "number")
        return yield exports.Type.Number();
      if (trim === "bigint")
        return yield exports.Type.BigInt();
      if (trim === "string")
        return yield exports.Type.String();
      const literals = trim.split("|").map((literal) => exports.Type.Literal(literal.trim()));
      return yield literals.length === 0 ? exports.Type.Never() : literals.length === 1 ? literals[0] : exports.Type.Union(literals);
    }
    function* ParseTerminal(template) {
      if (template[1] !== "{") {
        const L = exports.Type.Literal("$");
        const R = ParseLiteral(template.slice(1));
        return yield* [L, ...R];
      }
      for (let i = 2;i < template.length; i++) {
        if (template[i] === "}") {
          const L = ParseUnion(template.slice(2, i));
          const R = ParseLiteral(template.slice(i + 1));
          return yield* [...L, ...R];
        }
      }
      yield exports.Type.Literal(template);
    }
    function* ParseLiteral(template) {
      for (let i = 0;i < template.length; i++) {
        if (template[i] === "$") {
          const L = exports.Type.Literal(template.slice(0, i));
          const R = ParseTerminal(template.slice(i));
          return yield* [L, ...R];
        }
      }
      yield exports.Type.Literal(template);
    }
    function Parse(template_dsl) {
      return [...ParseLiteral(template_dsl)];
    }
    TemplateLiteralDslParser2.Parse = Parse;
  })(TemplateLiteralDslParser || (exports.TemplateLiteralDslParser = TemplateLiteralDslParser = {}));
  var TypeOrdinal = 0;

  class TypeBuilder {
    Create(schema) {
      return schema;
    }
    Strict(schema) {
      return JSON.parse(JSON.stringify(schema));
    }
  }
  exports.TypeBuilder = TypeBuilder;

  class StandardTypeBuilder extends TypeBuilder {
    Optional(schema) {
      return { [exports.Modifier]: "Optional", ...TypeClone.Clone(schema, {}) };
    }
    ReadonlyOptional(schema) {
      return { [exports.Modifier]: "ReadonlyOptional", ...TypeClone.Clone(schema, {}) };
    }
    Readonly(schema) {
      return { [exports.Modifier]: "Readonly", ...schema };
    }
    Any(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Any" });
    }
    Array(items, options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Array", type: "array", items: TypeClone.Clone(items, {}) });
    }
    Boolean(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Boolean", type: "boolean" });
    }
    Composite(objects, options) {
      const intersect = exports.Type.Intersect(objects, {});
      const keys = KeyResolver.ResolveKeys(intersect, { includePatterns: false });
      const properties = keys.reduce((acc, key) => ({ ...acc, [key]: exports.Type.Index(intersect, [key]) }), {});
      return exports.Type.Object(properties, options);
    }
    Enum(item, options = {}) {
      const values = globalThis.Object.keys(item).filter((key) => isNaN(key)).map((key) => item[key]);
      const anyOf = values.map((value) => typeof value === "string" ? { [exports.Kind]: "Literal", type: "string", const: value } : { [exports.Kind]: "Literal", type: "number", const: value });
      return this.Create({ ...options, [exports.Kind]: "Union", anyOf });
    }
    Extends(left, right, trueType, falseType, options = {}) {
      switch (TypeExtends.Extends(left, right)) {
        case TypeExtendsResult.Union:
          return this.Union([TypeClone.Clone(trueType, options), TypeClone.Clone(falseType, options)]);
        case TypeExtendsResult.True:
          return TypeClone.Clone(trueType, options);
        case TypeExtendsResult.False:
          return TypeClone.Clone(falseType, options);
      }
    }
    Exclude(left, right, options = {}) {
      if (TypeGuard.TTemplateLiteral(left))
        return this.Exclude(TemplateLiteralResolver.Resolve(left), right, options);
      if (TypeGuard.TTemplateLiteral(right))
        return this.Exclude(left, TemplateLiteralResolver.Resolve(right), options);
      if (TypeGuard.TUnion(left)) {
        const narrowed = left.anyOf.filter((inner) => TypeExtends.Extends(inner, right) === TypeExtendsResult.False);
        return narrowed.length === 1 ? TypeClone.Clone(narrowed[0], options) : this.Union(narrowed, options);
      } else {
        return TypeExtends.Extends(left, right) !== TypeExtendsResult.False ? this.Never(options) : TypeClone.Clone(left, options);
      }
    }
    Extract(left, right, options = {}) {
      if (TypeGuard.TTemplateLiteral(left))
        return this.Extract(TemplateLiteralResolver.Resolve(left), right, options);
      if (TypeGuard.TTemplateLiteral(right))
        return this.Extract(left, TemplateLiteralResolver.Resolve(right), options);
      if (TypeGuard.TUnion(left)) {
        const narrowed = left.anyOf.filter((inner) => TypeExtends.Extends(inner, right) !== TypeExtendsResult.False);
        return narrowed.length === 1 ? TypeClone.Clone(narrowed[0], options) : this.Union(narrowed, options);
      } else {
        return TypeExtends.Extends(left, right) !== TypeExtendsResult.False ? TypeClone.Clone(left, options) : this.Never(options);
      }
    }
    Index(schema, unresolved, options = {}) {
      if (TypeGuard.TArray(schema) && TypeGuard.TNumber(unresolved)) {
        return TypeClone.Clone(schema.items, options);
      } else if (TypeGuard.TTuple(schema) && TypeGuard.TNumber(unresolved)) {
        const items = schema.items === undefined ? [] : schema.items;
        const cloned = items.map((schema2) => TypeClone.Clone(schema2, {}));
        return this.Union(cloned, options);
      } else {
        const keys = KeyArrayResolver.Resolve(unresolved);
        const clone = TypeClone.Clone(schema, {});
        return IndexedAccessor.Resolve(clone, keys, options);
      }
    }
    Integer(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Integer", type: "integer" });
    }
    Intersect(allOf, options = {}) {
      if (allOf.length === 0)
        return exports.Type.Never();
      if (allOf.length === 1)
        return TypeClone.Clone(allOf[0], options);
      const objects = allOf.every((schema) => TypeGuard.TObject(schema));
      const cloned = allOf.map((schema) => TypeClone.Clone(schema, {}));
      const clonedUnevaluatedProperties = TypeGuard.TSchema(options.unevaluatedProperties) ? { unevaluatedProperties: TypeClone.Clone(options.unevaluatedProperties, {}) } : {};
      if (options.unevaluatedProperties === false || TypeGuard.TSchema(options.unevaluatedProperties) || objects) {
        return this.Create({ ...options, ...clonedUnevaluatedProperties, [exports.Kind]: "Intersect", type: "object", allOf: cloned });
      } else {
        return this.Create({ ...options, ...clonedUnevaluatedProperties, [exports.Kind]: "Intersect", allOf: cloned });
      }
    }
    KeyOf(schema, options = {}) {
      if (TypeGuard.TRecord(schema)) {
        const pattern = Object.getOwnPropertyNames(schema.patternProperties)[0];
        if (pattern === exports.PatternNumberExact)
          return this.Number(options);
        if (pattern === exports.PatternStringExact)
          return this.String(options);
        throw Error("StandardTypeBuilder: Unable to resolve key type from Record key pattern");
      } else if (TypeGuard.TTuple(schema)) {
        const items = schema.items === undefined ? [] : schema.items;
        const literals = items.map((_, index) => exports.Type.Literal(index));
        return this.Union(literals, options);
      } else if (TypeGuard.TArray(schema)) {
        return this.Number(options);
      } else {
        const keys = KeyResolver.ResolveKeys(schema, { includePatterns: false });
        if (keys.length === 0)
          return this.Never(options);
        const literals = keys.map((key) => this.Literal(key));
        return this.Union(literals, options);
      }
    }
    Literal(value, options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Literal", const: value, type: typeof value });
    }
    Never(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Never", not: {} });
    }
    Not(not, options) {
      return this.Create({ ...options, [exports.Kind]: "Not", not });
    }
    Null(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Null", type: "null" });
    }
    Number(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Number", type: "number" });
    }
    Object(properties, options = {}) {
      const propertyKeys = globalThis.Object.getOwnPropertyNames(properties);
      const optionalKeys = propertyKeys.filter((key) => TypeGuard.TOptional(properties[key]) || TypeGuard.TReadonlyOptional(properties[key]));
      const requiredKeys = propertyKeys.filter((name) => !optionalKeys.includes(name));
      const clonedAdditionalProperties = TypeGuard.TSchema(options.additionalProperties) ? { additionalProperties: TypeClone.Clone(options.additionalProperties, {}) } : {};
      const clonedProperties = propertyKeys.reduce((acc, key) => ({ ...acc, [key]: TypeClone.Clone(properties[key], {}) }), {});
      if (requiredKeys.length > 0) {
        return this.Create({ ...options, ...clonedAdditionalProperties, [exports.Kind]: "Object", type: "object", properties: clonedProperties, required: requiredKeys });
      } else {
        return this.Create({ ...options, ...clonedAdditionalProperties, [exports.Kind]: "Object", type: "object", properties: clonedProperties });
      }
    }
    Omit(schema, unresolved, options = {}) {
      const keys = KeyArrayResolver.Resolve(unresolved);
      return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema2) => {
        if (schema2.required) {
          schema2.required = schema2.required.filter((key) => !keys.includes(key));
          if (schema2.required.length === 0)
            delete schema2.required;
        }
        for (const key of globalThis.Object.keys(schema2.properties)) {
          if (keys.includes(key))
            delete schema2.properties[key];
        }
        return this.Create(schema2);
      }, options);
    }
    Partial(schema, options = {}) {
      function Apply(schema2) {
        switch (schema2[exports.Modifier]) {
          case "ReadonlyOptional":
            schema2[exports.Modifier] = "ReadonlyOptional";
            break;
          case "Readonly":
            schema2[exports.Modifier] = "ReadonlyOptional";
            break;
          case "Optional":
            schema2[exports.Modifier] = "Optional";
            break;
          default:
            schema2[exports.Modifier] = "Optional";
            break;
        }
      }
      return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema2) => {
        delete schema2.required;
        globalThis.Object.keys(schema2.properties).forEach((key) => Apply(schema2.properties[key]));
        return schema2;
      }, options);
    }
    Pick(schema, unresolved, options = {}) {
      const keys = KeyArrayResolver.Resolve(unresolved);
      return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema2) => {
        if (schema2.required) {
          schema2.required = schema2.required.filter((key) => keys.includes(key));
          if (schema2.required.length === 0)
            delete schema2.required;
        }
        for (const key of globalThis.Object.keys(schema2.properties)) {
          if (!keys.includes(key))
            delete schema2.properties[key];
        }
        return this.Create(schema2);
      }, options);
    }
    Record(key, schema, options = {}) {
      if (TypeGuard.TTemplateLiteral(key)) {
        const expression = TemplateLiteralParser.ParseExact(key.pattern);
        return TemplateLiteralFinite.Check(expression) ? this.Object([...TemplateLiteralGenerator.Generate(expression)].reduce((acc, key2) => ({ ...acc, [key2]: TypeClone.Clone(schema, {}) }), {}), options) : this.Create({ ...options, [exports.Kind]: "Record", type: "object", patternProperties: { [key.pattern]: TypeClone.Clone(schema, {}) } });
      } else if (TypeGuard.TUnion(key)) {
        const union = UnionResolver.Resolve(key);
        if (TypeGuard.TUnionLiteral(union)) {
          const properties = union.anyOf.reduce((acc, literal) => ({ ...acc, [literal.const]: TypeClone.Clone(schema, {}) }), {});
          return this.Object(properties, { ...options, [exports.Hint]: "Record" });
        } else
          throw Error("TypeBuilder: Record key of type union contains non-literal types");
      } else if (TypeGuard.TLiteral(key)) {
        if (typeof key.const === "string" || typeof key.const === "number") {
          return this.Object({ [key.const]: TypeClone.Clone(schema, {}) }, options);
        } else
          throw Error("TypeBuilder: Record key of type literal is not of type string or number");
      } else if (TypeGuard.TInteger(key) || TypeGuard.TNumber(key)) {
        const pattern = exports.PatternNumberExact;
        return this.Create({ ...options, [exports.Kind]: "Record", type: "object", patternProperties: { [pattern]: TypeClone.Clone(schema, {}) } });
      } else if (TypeGuard.TString(key)) {
        const pattern = key.pattern === undefined ? exports.PatternStringExact : key.pattern;
        return this.Create({ ...options, [exports.Kind]: "Record", type: "object", patternProperties: { [pattern]: TypeClone.Clone(schema, {}) } });
      } else {
        throw Error(`StandardTypeBuilder: Record key is an invalid type`);
      }
    }
    Recursive(callback, options = {}) {
      if (options.$id === undefined)
        options.$id = `T${TypeOrdinal++}`;
      const thisType = callback({ [exports.Kind]: "This", $ref: `${options.$id}` });
      thisType.$id = options.$id;
      return this.Create({ ...options, [exports.Hint]: "Recursive", ...thisType });
    }
    Ref(schema, options = {}) {
      if (schema.$id === undefined)
        throw Error("StandardTypeBuilder.Ref: Target type must specify an $id");
      return this.Create({ ...options, [exports.Kind]: "Ref", $ref: schema.$id });
    }
    Required(schema, options = {}) {
      function Apply(schema2) {
        switch (schema2[exports.Modifier]) {
          case "ReadonlyOptional":
            schema2[exports.Modifier] = "Readonly";
            break;
          case "Readonly":
            schema2[exports.Modifier] = "Readonly";
            break;
          case "Optional":
            delete schema2[exports.Modifier];
            break;
          default:
            delete schema2[exports.Modifier];
            break;
        }
      }
      return ObjectMap.Map(TypeClone.Clone(schema, {}), (schema2) => {
        schema2.required = globalThis.Object.keys(schema2.properties);
        globalThis.Object.keys(schema2.properties).forEach((key) => Apply(schema2.properties[key]));
        return schema2;
      }, options);
    }
    Rest(schema) {
      if (TypeGuard.TTuple(schema)) {
        if (schema.items === undefined)
          return [];
        return schema.items.map((schema2) => TypeClone.Clone(schema2, {}));
      } else {
        return [TypeClone.Clone(schema, {})];
      }
    }
    String(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "String", type: "string" });
    }
    TemplateLiteral(unresolved, options = {}) {
      const pattern = typeof unresolved === "string" ? TemplateLiteralPattern.Create(TemplateLiteralDslParser.Parse(unresolved)) : TemplateLiteralPattern.Create(unresolved);
      return this.Create({ ...options, [exports.Kind]: "TemplateLiteral", type: "string", pattern });
    }
    Tuple(items, options = {}) {
      const [additionalItems, minItems, maxItems] = [false, items.length, items.length];
      const clonedItems = items.map((item) => TypeClone.Clone(item, {}));
      const schema = items.length > 0 ? { ...options, [exports.Kind]: "Tuple", type: "array", items: clonedItems, additionalItems, minItems, maxItems } : { ...options, [exports.Kind]: "Tuple", type: "array", minItems, maxItems };
      return this.Create(schema);
    }
    Union(union, options = {}) {
      if (TypeGuard.TTemplateLiteral(union)) {
        return TemplateLiteralResolver.Resolve(union);
      } else {
        const anyOf = union;
        if (anyOf.length === 0)
          return this.Never(options);
        if (anyOf.length === 1)
          return this.Create(TypeClone.Clone(anyOf[0], options));
        const clonedAnyOf = anyOf.map((schema) => TypeClone.Clone(schema, {}));
        return this.Create({ ...options, [exports.Kind]: "Union", anyOf: clonedAnyOf });
      }
    }
    Unknown(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Unknown" });
    }
    Unsafe(options = {}) {
      return this.Create({ ...options, [exports.Kind]: options[exports.Kind] || "Unsafe" });
    }
  }
  exports.StandardTypeBuilder = StandardTypeBuilder;

  class ExtendedTypeBuilder extends StandardTypeBuilder {
    BigInt(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "BigInt", type: "null", typeOf: "BigInt" });
    }
    ConstructorParameters(schema, options = {}) {
      return this.Tuple([...schema.parameters], { ...options });
    }
    Constructor(parameters, returns, options) {
      const clonedReturns = TypeClone.Clone(returns, {});
      const clonedParameters = parameters.map((parameter) => TypeClone.Clone(parameter, {}));
      return this.Create({ ...options, [exports.Kind]: "Constructor", type: "object", instanceOf: "Constructor", parameters: clonedParameters, returns: clonedReturns });
    }
    Date(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Date", type: "object", instanceOf: "Date" });
    }
    Function(parameters, returns, options) {
      const clonedReturns = TypeClone.Clone(returns, {});
      const clonedParameters = parameters.map((parameter) => TypeClone.Clone(parameter, {}));
      return this.Create({ ...options, [exports.Kind]: "Function", type: "object", instanceOf: "Function", parameters: clonedParameters, returns: clonedReturns });
    }
    InstanceType(schema, options = {}) {
      return TypeClone.Clone(schema.returns, options);
    }
    Parameters(schema, options = {}) {
      return this.Tuple(schema.parameters, { ...options });
    }
    Promise(item, options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Promise", type: "object", instanceOf: "Promise", item: TypeClone.Clone(item, {}) });
    }
    RegEx(regex, options = {}) {
      return this.Create({ ...options, [exports.Kind]: "String", type: "string", pattern: regex.source });
    }
    ReturnType(schema, options = {}) {
      return TypeClone.Clone(schema.returns, options);
    }
    Symbol(options) {
      return this.Create({ ...options, [exports.Kind]: "Symbol", type: "null", typeOf: "Symbol" });
    }
    Undefined(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Undefined", type: "null", typeOf: "Undefined" });
    }
    Uint8Array(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Uint8Array", type: "object", instanceOf: "Uint8Array" });
    }
    Void(options = {}) {
      return this.Create({ ...options, [exports.Kind]: "Void", type: "null", typeOf: "Void" });
    }
  }
  exports.ExtendedTypeBuilder = ExtendedTypeBuilder;
  exports.StandardType = new StandardTypeBuilder;
  exports.Type = new ExtendedTypeBuilder;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@sinclair+typebox@0.29.4/node_modules/@sinclair/typebox/system/system.js
var require_system = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TypeSystem = exports.TypeSystemDuplicateFormat = exports.TypeSystemDuplicateTypeKind = undefined;
  var Types = require_typebox();

  class TypeSystemDuplicateTypeKind extends Error {
    constructor(kind) {
      super(`Duplicate type kind '${kind}' detected`);
    }
  }
  exports.TypeSystemDuplicateTypeKind = TypeSystemDuplicateTypeKind;

  class TypeSystemDuplicateFormat extends Error {
    constructor(kind) {
      super(`Duplicate string format '${kind}' detected`);
    }
  }
  exports.TypeSystemDuplicateFormat = TypeSystemDuplicateFormat;
  var TypeSystem;
  (function(TypeSystem2) {
    TypeSystem2.ExactOptionalPropertyTypes = false;
    TypeSystem2.AllowArrayObjects = false;
    TypeSystem2.AllowNaN = false;
    TypeSystem2.AllowVoidNull = false;
    function Type(kind, check) {
      if (Types.TypeRegistry.Has(kind))
        throw new TypeSystemDuplicateTypeKind(kind);
      Types.TypeRegistry.Set(kind, check);
      return (options = {}) => Types.Type.Unsafe({ ...options, [Types.Kind]: kind });
    }
    TypeSystem2.Type = Type;
    function Format(format, check) {
      if (Types.FormatRegistry.Has(format))
        throw new TypeSystemDuplicateFormat(format);
      Types.FormatRegistry.Set(format, check);
      return format;
    }
    TypeSystem2.Format = Format;
  })(TypeSystem || (exports.TypeSystem = TypeSystem = {}));
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/node_modules/@sinclair/typebox/system/index.js
var require_system2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(require_system(), exports);
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@sinclair+typebox@0.29.4/node_modules/@sinclair/typebox/value/hash.js
var require_hash = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ValueHash = exports.ValueHashError = undefined;

  class ValueHashError extends Error {
    constructor(value) {
      super(`Hash: Unable to hash value`);
      this.value = value;
    }
  }
  exports.ValueHashError = ValueHashError;
  var ValueHash;
  (function(ValueHash2) {
    let ByteMarker;
    (function(ByteMarker2) {
      ByteMarker2[ByteMarker2["Undefined"] = 0] = "Undefined";
      ByteMarker2[ByteMarker2["Null"] = 1] = "Null";
      ByteMarker2[ByteMarker2["Boolean"] = 2] = "Boolean";
      ByteMarker2[ByteMarker2["Number"] = 3] = "Number";
      ByteMarker2[ByteMarker2["String"] = 4] = "String";
      ByteMarker2[ByteMarker2["Object"] = 5] = "Object";
      ByteMarker2[ByteMarker2["Array"] = 6] = "Array";
      ByteMarker2[ByteMarker2["Date"] = 7] = "Date";
      ByteMarker2[ByteMarker2["Uint8Array"] = 8] = "Uint8Array";
      ByteMarker2[ByteMarker2["Symbol"] = 9] = "Symbol";
      ByteMarker2[ByteMarker2["BigInt"] = 10] = "BigInt";
    })(ByteMarker || (ByteMarker = {}));
    let Hash = globalThis.BigInt("14695981039346656037");
    const [Prime, Size] = [globalThis.BigInt("1099511628211"), globalThis.BigInt("2") ** globalThis.BigInt("64")];
    const Bytes = globalThis.Array.from({ length: 256 }).map((_, i) => globalThis.BigInt(i));
    const F64 = new globalThis.Float64Array(1);
    const F64In = new globalThis.DataView(F64.buffer);
    const F64Out = new globalThis.Uint8Array(F64.buffer);
    function IsDate(value) {
      return value instanceof globalThis.Date;
    }
    function IsUint8Array(value) {
      return value instanceof globalThis.Uint8Array;
    }
    function IsArray(value) {
      return globalThis.Array.isArray(value);
    }
    function IsBoolean(value) {
      return typeof value === "boolean";
    }
    function IsNull(value) {
      return value === null;
    }
    function IsNumber(value) {
      return typeof value === "number";
    }
    function IsSymbol(value) {
      return typeof value === "symbol";
    }
    function IsBigInt(value) {
      return typeof value === "bigint";
    }
    function IsObject(value) {
      return typeof value === "object" && value !== null && !IsArray(value) && !IsDate(value) && !IsUint8Array(value);
    }
    function IsString(value) {
      return typeof value === "string";
    }
    function IsUndefined(value) {
      return value === undefined;
    }
    function Array2(value) {
      FNV1A64(ByteMarker.Array);
      for (const item of value) {
        Visit(item);
      }
    }
    function Boolean2(value) {
      FNV1A64(ByteMarker.Boolean);
      FNV1A64(value ? 1 : 0);
    }
    function BigInt2(value) {
      FNV1A64(ByteMarker.BigInt);
      F64In.setBigInt64(0, value);
      for (const byte of F64Out) {
        FNV1A64(byte);
      }
    }
    function Date2(value) {
      FNV1A64(ByteMarker.Date);
      Visit(value.getTime());
    }
    function Null(value) {
      FNV1A64(ByteMarker.Null);
    }
    function Number2(value) {
      FNV1A64(ByteMarker.Number);
      F64In.setFloat64(0, value);
      for (const byte of F64Out) {
        FNV1A64(byte);
      }
    }
    function Object2(value) {
      FNV1A64(ByteMarker.Object);
      for (const key of globalThis.Object.keys(value).sort()) {
        Visit(key);
        Visit(value[key]);
      }
    }
    function String2(value) {
      FNV1A64(ByteMarker.String);
      for (let i = 0;i < value.length; i++) {
        FNV1A64(value.charCodeAt(i));
      }
    }
    function Symbol2(value) {
      FNV1A64(ByteMarker.Symbol);
      Visit(value.description);
    }
    function Uint8Array2(value) {
      FNV1A64(ByteMarker.Uint8Array);
      for (let i = 0;i < value.length; i++) {
        FNV1A64(value[i]);
      }
    }
    function Undefined(value) {
      return FNV1A64(ByteMarker.Undefined);
    }
    function Visit(value) {
      if (IsArray(value)) {
        Array2(value);
      } else if (IsBoolean(value)) {
        Boolean2(value);
      } else if (IsBigInt(value)) {
        BigInt2(value);
      } else if (IsDate(value)) {
        Date2(value);
      } else if (IsNull(value)) {
        Null(value);
      } else if (IsNumber(value)) {
        Number2(value);
      } else if (IsObject(value)) {
        Object2(value);
      } else if (IsString(value)) {
        String2(value);
      } else if (IsSymbol(value)) {
        Symbol2(value);
      } else if (IsUint8Array(value)) {
        Uint8Array2(value);
      } else if (IsUndefined(value)) {
        Undefined(value);
      } else {
        throw new ValueHashError(value);
      }
    }
    function FNV1A64(byte) {
      Hash = Hash ^ Bytes[byte];
      Hash = Hash * Prime % Size;
    }
    function Create(value) {
      Hash = globalThis.BigInt("14695981039346656037");
      Visit(value);
      return Hash;
    }
    ValueHash2.Create = Create;
  })(ValueHash || (exports.ValueHash = ValueHash = {}));
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@sinclair+typebox@0.29.4/node_modules/@sinclair/typebox/errors/errors.js
var require_errors = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ValueErrors = exports.ValueErrorsDereferenceError = exports.ValueErrorsUnknownTypeError = exports.ValueErrorIterator = exports.ValueErrorType = undefined;
  var Types = require_typebox();
  var index_1 = require_system2();
  var hash_1 = require_hash();
  var ValueErrorType;
  (function(ValueErrorType2) {
    ValueErrorType2[ValueErrorType2["Array"] = 0] = "Array";
    ValueErrorType2[ValueErrorType2["ArrayMinItems"] = 1] = "ArrayMinItems";
    ValueErrorType2[ValueErrorType2["ArrayMaxItems"] = 2] = "ArrayMaxItems";
    ValueErrorType2[ValueErrorType2["ArrayUniqueItems"] = 3] = "ArrayUniqueItems";
    ValueErrorType2[ValueErrorType2["BigInt"] = 4] = "BigInt";
    ValueErrorType2[ValueErrorType2["BigIntMultipleOf"] = 5] = "BigIntMultipleOf";
    ValueErrorType2[ValueErrorType2["BigIntExclusiveMinimum"] = 6] = "BigIntExclusiveMinimum";
    ValueErrorType2[ValueErrorType2["BigIntExclusiveMaximum"] = 7] = "BigIntExclusiveMaximum";
    ValueErrorType2[ValueErrorType2["BigIntMinimum"] = 8] = "BigIntMinimum";
    ValueErrorType2[ValueErrorType2["BigIntMaximum"] = 9] = "BigIntMaximum";
    ValueErrorType2[ValueErrorType2["Boolean"] = 10] = "Boolean";
    ValueErrorType2[ValueErrorType2["Date"] = 11] = "Date";
    ValueErrorType2[ValueErrorType2["DateExclusiveMinimumTimestamp"] = 12] = "DateExclusiveMinimumTimestamp";
    ValueErrorType2[ValueErrorType2["DateExclusiveMaximumTimestamp"] = 13] = "DateExclusiveMaximumTimestamp";
    ValueErrorType2[ValueErrorType2["DateMinimumTimestamp"] = 14] = "DateMinimumTimestamp";
    ValueErrorType2[ValueErrorType2["DateMaximumTimestamp"] = 15] = "DateMaximumTimestamp";
    ValueErrorType2[ValueErrorType2["Function"] = 16] = "Function";
    ValueErrorType2[ValueErrorType2["Integer"] = 17] = "Integer";
    ValueErrorType2[ValueErrorType2["IntegerMultipleOf"] = 18] = "IntegerMultipleOf";
    ValueErrorType2[ValueErrorType2["IntegerExclusiveMinimum"] = 19] = "IntegerExclusiveMinimum";
    ValueErrorType2[ValueErrorType2["IntegerExclusiveMaximum"] = 20] = "IntegerExclusiveMaximum";
    ValueErrorType2[ValueErrorType2["IntegerMinimum"] = 21] = "IntegerMinimum";
    ValueErrorType2[ValueErrorType2["IntegerMaximum"] = 22] = "IntegerMaximum";
    ValueErrorType2[ValueErrorType2["Intersect"] = 23] = "Intersect";
    ValueErrorType2[ValueErrorType2["IntersectUnevaluatedProperties"] = 24] = "IntersectUnevaluatedProperties";
    ValueErrorType2[ValueErrorType2["Literal"] = 25] = "Literal";
    ValueErrorType2[ValueErrorType2["Never"] = 26] = "Never";
    ValueErrorType2[ValueErrorType2["Not"] = 27] = "Not";
    ValueErrorType2[ValueErrorType2["Null"] = 28] = "Null";
    ValueErrorType2[ValueErrorType2["Number"] = 29] = "Number";
    ValueErrorType2[ValueErrorType2["NumberMultipleOf"] = 30] = "NumberMultipleOf";
    ValueErrorType2[ValueErrorType2["NumberExclusiveMinimum"] = 31] = "NumberExclusiveMinimum";
    ValueErrorType2[ValueErrorType2["NumberExclusiveMaximum"] = 32] = "NumberExclusiveMaximum";
    ValueErrorType2[ValueErrorType2["NumberMinimum"] = 33] = "NumberMinimum";
    ValueErrorType2[ValueErrorType2["NumberMaximum"] = 34] = "NumberMaximum";
    ValueErrorType2[ValueErrorType2["Object"] = 35] = "Object";
    ValueErrorType2[ValueErrorType2["ObjectMinProperties"] = 36] = "ObjectMinProperties";
    ValueErrorType2[ValueErrorType2["ObjectMaxProperties"] = 37] = "ObjectMaxProperties";
    ValueErrorType2[ValueErrorType2["ObjectAdditionalProperties"] = 38] = "ObjectAdditionalProperties";
    ValueErrorType2[ValueErrorType2["ObjectRequiredProperties"] = 39] = "ObjectRequiredProperties";
    ValueErrorType2[ValueErrorType2["Promise"] = 40] = "Promise";
    ValueErrorType2[ValueErrorType2["RecordKeyNumeric"] = 41] = "RecordKeyNumeric";
    ValueErrorType2[ValueErrorType2["RecordKeyString"] = 42] = "RecordKeyString";
    ValueErrorType2[ValueErrorType2["String"] = 43] = "String";
    ValueErrorType2[ValueErrorType2["StringMinLength"] = 44] = "StringMinLength";
    ValueErrorType2[ValueErrorType2["StringMaxLength"] = 45] = "StringMaxLength";
    ValueErrorType2[ValueErrorType2["StringPattern"] = 46] = "StringPattern";
    ValueErrorType2[ValueErrorType2["StringFormatUnknown"] = 47] = "StringFormatUnknown";
    ValueErrorType2[ValueErrorType2["StringFormat"] = 48] = "StringFormat";
    ValueErrorType2[ValueErrorType2["Symbol"] = 49] = "Symbol";
    ValueErrorType2[ValueErrorType2["TupleZeroLength"] = 50] = "TupleZeroLength";
    ValueErrorType2[ValueErrorType2["TupleLength"] = 51] = "TupleLength";
    ValueErrorType2[ValueErrorType2["Undefined"] = 52] = "Undefined";
    ValueErrorType2[ValueErrorType2["Union"] = 53] = "Union";
    ValueErrorType2[ValueErrorType2["Uint8Array"] = 54] = "Uint8Array";
    ValueErrorType2[ValueErrorType2["Uint8ArrayMinByteLength"] = 55] = "Uint8ArrayMinByteLength";
    ValueErrorType2[ValueErrorType2["Uint8ArrayMaxByteLength"] = 56] = "Uint8ArrayMaxByteLength";
    ValueErrorType2[ValueErrorType2["Void"] = 57] = "Void";
    ValueErrorType2[ValueErrorType2["Custom"] = 58] = "Custom";
  })(ValueErrorType || (exports.ValueErrorType = ValueErrorType = {}));

  class ValueErrorIterator {
    constructor(iterator) {
      this.iterator = iterator;
    }
    [Symbol.iterator]() {
      return this.iterator;
    }
    First() {
      const next = this.iterator.next();
      return next.done ? undefined : next.value;
    }
  }
  exports.ValueErrorIterator = ValueErrorIterator;

  class ValueErrorsUnknownTypeError extends Error {
    constructor(schema) {
      super("ValueErrors: Unknown type");
      this.schema = schema;
    }
  }
  exports.ValueErrorsUnknownTypeError = ValueErrorsUnknownTypeError;

  class ValueErrorsDereferenceError extends Error {
    constructor(schema) {
      super(`ValueErrors: Unable to dereference schema with \$id '${schema.$ref}'`);
      this.schema = schema;
    }
  }
  exports.ValueErrorsDereferenceError = ValueErrorsDereferenceError;
  var ValueErrors;
  (function(ValueErrors2) {
    function IsBigInt(value) {
      return typeof value === "bigint";
    }
    function IsInteger(value) {
      return globalThis.Number.isInteger(value);
    }
    function IsString(value) {
      return typeof value === "string";
    }
    function IsDefined(value) {
      return value !== undefined;
    }
    function IsExactOptionalProperty(value, key) {
      return index_1.TypeSystem.ExactOptionalPropertyTypes ? key in value : value[key] !== undefined;
    }
    function IsObject(value) {
      const result = typeof value === "object" && value !== null;
      return index_1.TypeSystem.AllowArrayObjects ? result : result && !globalThis.Array.isArray(value);
    }
    function IsRecordObject(value) {
      return IsObject(value) && !(value instanceof globalThis.Date) && !(value instanceof globalThis.Uint8Array);
    }
    function IsNumber(value) {
      const result = typeof value === "number";
      return index_1.TypeSystem.AllowNaN ? result : result && globalThis.Number.isFinite(value);
    }
    function IsVoid(value) {
      const result = value === undefined;
      return index_1.TypeSystem.AllowVoidNull ? result || value === null : result;
    }
    function* Any(schema, references, path, value) {
    }
    function* Array2(schema, references, path, value) {
      if (!globalThis.Array.isArray(value)) {
        return yield { type: ValueErrorType.Array, schema, path, value, message: `Expected array` };
      }
      if (IsDefined(schema.minItems) && !(value.length >= schema.minItems)) {
        yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be greater or equal to ${schema.minItems}` };
      }
      if (IsDefined(schema.maxItems) && !(value.length <= schema.maxItems)) {
        yield { type: ValueErrorType.ArrayMinItems, schema, path, value, message: `Expected array length to be less or equal to ${schema.maxItems}` };
      }
      if (schema.uniqueItems === true && !function() {
        const set = new Set;
        for (const element of value) {
          const hashed = hash_1.ValueHash.Create(element);
          if (set.has(hashed)) {
            return false;
          } else {
            set.add(hashed);
          }
        }
        return true;
      }()) {
        yield { type: ValueErrorType.ArrayUniqueItems, schema, path, value, message: `Expected array elements to be unique` };
      }
      for (let i = 0;i < value.length; i++) {
        yield* Visit(schema.items, references, `${path}/${i}`, value[i]);
      }
    }
    function* BigInt2(schema, references, path, value) {
      if (!IsBigInt(value)) {
        return yield { type: ValueErrorType.BigInt, schema, path, value, message: `Expected bigint` };
      }
      if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === globalThis.BigInt(0))) {
        yield { type: ValueErrorType.BigIntMultipleOf, schema, path, value, message: `Expected bigint to be a multiple of ${schema.multipleOf}` };
      }
      if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
        yield { type: ValueErrorType.BigIntExclusiveMinimum, schema, path, value, message: `Expected bigint to be greater than ${schema.exclusiveMinimum}` };
      }
      if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
        yield { type: ValueErrorType.BigIntExclusiveMaximum, schema, path, value, message: `Expected bigint to be less than ${schema.exclusiveMaximum}` };
      }
      if (IsDefined(schema.minimum) && !(value >= schema.minimum)) {
        yield { type: ValueErrorType.BigIntMinimum, schema, path, value, message: `Expected bigint to be greater or equal to ${schema.minimum}` };
      }
      if (IsDefined(schema.maximum) && !(value <= schema.maximum)) {
        yield { type: ValueErrorType.BigIntMaximum, schema, path, value, message: `Expected bigint to be less or equal to ${schema.maximum}` };
      }
    }
    function* Boolean2(schema, references, path, value) {
      if (!(typeof value === "boolean")) {
        return yield { type: ValueErrorType.Boolean, schema, path, value, message: `Expected boolean` };
      }
    }
    function* Constructor(schema, references, path, value) {
      yield* Visit(schema.returns, references, path, value.prototype);
    }
    function* Date2(schema, references, path, value) {
      if (!(value instanceof globalThis.Date)) {
        return yield { type: ValueErrorType.Date, schema, path, value, message: `Expected Date object` };
      }
      if (!globalThis.isFinite(value.getTime())) {
        return yield { type: ValueErrorType.Date, schema, path, value, message: `Invalid Date` };
      }
      if (IsDefined(schema.exclusiveMinimumTimestamp) && !(value.getTime() > schema.exclusiveMinimumTimestamp)) {
        yield { type: ValueErrorType.DateExclusiveMinimumTimestamp, schema, path, value, message: `Expected Date timestamp to be greater than ${schema.exclusiveMinimum}` };
      }
      if (IsDefined(schema.exclusiveMaximumTimestamp) && !(value.getTime() < schema.exclusiveMaximumTimestamp)) {
        yield { type: ValueErrorType.DateExclusiveMaximumTimestamp, schema, path, value, message: `Expected Date timestamp to be less than ${schema.exclusiveMaximum}` };
      }
      if (IsDefined(schema.minimumTimestamp) && !(value.getTime() >= schema.minimumTimestamp)) {
        yield { type: ValueErrorType.DateMinimumTimestamp, schema, path, value, message: `Expected Date timestamp to be greater or equal to ${schema.minimum}` };
      }
      if (IsDefined(schema.maximumTimestamp) && !(value.getTime() <= schema.maximumTimestamp)) {
        yield { type: ValueErrorType.DateMaximumTimestamp, schema, path, value, message: `Expected Date timestamp to be less or equal to ${schema.maximum}` };
      }
    }
    function* Function2(schema, references, path, value) {
      if (!(typeof value === "function")) {
        return yield { type: ValueErrorType.Function, schema, path, value, message: `Expected function` };
      }
    }
    function* Integer(schema, references, path, value) {
      if (!IsInteger(value)) {
        return yield { type: ValueErrorType.Integer, schema, path, value, message: `Expected integer` };
      }
      if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
        yield { type: ValueErrorType.IntegerMultipleOf, schema, path, value, message: `Expected integer to be a multiple of ${schema.multipleOf}` };
      }
      if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
        yield { type: ValueErrorType.IntegerExclusiveMinimum, schema, path, value, message: `Expected integer to be greater than ${schema.exclusiveMinimum}` };
      }
      if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
        yield { type: ValueErrorType.IntegerExclusiveMaximum, schema, path, value, message: `Expected integer to be less than ${schema.exclusiveMaximum}` };
      }
      if (IsDefined(schema.minimum) && !(value >= schema.minimum)) {
        yield { type: ValueErrorType.IntegerMinimum, schema, path, value, message: `Expected integer to be greater or equal to ${schema.minimum}` };
      }
      if (IsDefined(schema.maximum) && !(value <= schema.maximum)) {
        yield { type: ValueErrorType.IntegerMaximum, schema, path, value, message: `Expected integer to be less or equal to ${schema.maximum}` };
      }
    }
    function* Intersect(schema, references, path, value) {
      for (const inner of schema.allOf) {
        const next = Visit(inner, references, path, value).next();
        if (!next.done) {
          yield next.value;
          yield { type: ValueErrorType.Intersect, schema, path, value, message: `Expected all sub schemas to be valid` };
          return;
        }
      }
      if (schema.unevaluatedProperties === false) {
        const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema));
        for (const valueKey of globalThis.Object.getOwnPropertyNames(value)) {
          if (!keyCheck.test(valueKey)) {
            yield { type: ValueErrorType.IntersectUnevaluatedProperties, schema, path: `${path}/${valueKey}`, value, message: `Unexpected property` };
          }
        }
      }
      if (typeof schema.unevaluatedProperties === "object") {
        const keyCheck = new RegExp(Types.KeyResolver.ResolvePattern(schema));
        for (const valueKey of globalThis.Object.getOwnPropertyNames(value)) {
          if (!keyCheck.test(valueKey)) {
            const next = Visit(schema.unevaluatedProperties, references, `${path}/${valueKey}`, value[valueKey]).next();
            if (!next.done) {
              yield next.value;
              yield { type: ValueErrorType.IntersectUnevaluatedProperties, schema, path: `${path}/${valueKey}`, value, message: `Invalid additional property` };
              return;
            }
          }
        }
      }
    }
    function* Literal(schema, references, path, value) {
      if (!(value === schema.const)) {
        const error = typeof schema.const === "string" ? `'${schema.const}'` : schema.const;
        return yield { type: ValueErrorType.Literal, schema, path, value, message: `Expected ${error}` };
      }
    }
    function* Never(schema, references, path, value) {
      yield { type: ValueErrorType.Never, schema, path, value, message: `Value cannot be validated` };
    }
    function* Not(schema, references, path, value) {
      if (Visit(schema.not, references, path, value).next().done === true) {
        yield { type: ValueErrorType.Not, schema, path, value, message: `Value should not validate` };
      }
    }
    function* Null(schema, references, path, value) {
      if (!(value === null)) {
        return yield { type: ValueErrorType.Null, schema, path, value, message: `Expected null` };
      }
    }
    function* Number2(schema, references, path, value) {
      if (!IsNumber(value)) {
        return yield { type: ValueErrorType.Number, schema, path, value, message: `Expected number` };
      }
      if (IsDefined(schema.multipleOf) && !(value % schema.multipleOf === 0)) {
        yield { type: ValueErrorType.NumberMultipleOf, schema, path, value, message: `Expected number to be a multiple of ${schema.multipleOf}` };
      }
      if (IsDefined(schema.exclusiveMinimum) && !(value > schema.exclusiveMinimum)) {
        yield { type: ValueErrorType.NumberExclusiveMinimum, schema, path, value, message: `Expected number to be greater than ${schema.exclusiveMinimum}` };
      }
      if (IsDefined(schema.exclusiveMaximum) && !(value < schema.exclusiveMaximum)) {
        yield { type: ValueErrorType.NumberExclusiveMaximum, schema, path, value, message: `Expected number to be less than ${schema.exclusiveMaximum}` };
      }
      if (IsDefined(schema.minimum) && !(value >= schema.minimum)) {
        yield { type: ValueErrorType.NumberMinimum, schema, path, value, message: `Expected number to be greater or equal to ${schema.minimum}` };
      }
      if (IsDefined(schema.maximum) && !(value <= schema.maximum)) {
        yield { type: ValueErrorType.NumberMaximum, schema, path, value, message: `Expected number to be less or equal to ${schema.maximum}` };
      }
    }
    function* Object2(schema, references, path, value) {
      if (!IsObject(value)) {
        return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected object` };
      }
      if (IsDefined(schema.minProperties) && !(globalThis.Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
        yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` };
      }
      if (IsDefined(schema.maxProperties) && !(globalThis.Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
        yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have less than ${schema.minProperties} properties` };
      }
      const requiredKeys = globalThis.Array.isArray(schema.required) ? schema.required : [];
      const knownKeys = globalThis.Object.getOwnPropertyNames(schema.properties);
      const unknownKeys = globalThis.Object.getOwnPropertyNames(value);
      for (const knownKey of knownKeys) {
        const property = schema.properties[knownKey];
        if (schema.required && schema.required.includes(knownKey)) {
          yield* Visit(property, references, `${path}/${knownKey}`, value[knownKey]);
          if (Types.ExtendsUndefined.Check(schema) && !(knownKey in value)) {
            yield { type: ValueErrorType.ObjectRequiredProperties, schema: property, path: `${path}/${knownKey}`, value: undefined, message: `Expected required property` };
          }
        } else {
          if (IsExactOptionalProperty(value, knownKey)) {
            yield* Visit(property, references, `${path}/${knownKey}`, value[knownKey]);
          }
        }
      }
      for (const requiredKey of requiredKeys) {
        if (unknownKeys.includes(requiredKey))
          continue;
        yield { type: ValueErrorType.ObjectRequiredProperties, schema: schema.properties[requiredKey], path: `${path}/${requiredKey}`, value: undefined, message: `Expected required property` };
      }
      if (schema.additionalProperties === false) {
        for (const valueKey of unknownKeys) {
          if (!knownKeys.includes(valueKey)) {
            yield { type: ValueErrorType.ObjectAdditionalProperties, schema, path: `${path}/${valueKey}`, value: value[valueKey], message: `Unexpected property` };
          }
        }
      }
      if (typeof schema.additionalProperties === "object") {
        for (const valueKey of unknownKeys) {
          if (knownKeys.includes(valueKey))
            continue;
          yield* Visit(schema.additionalProperties, references, `${path}/${valueKey}`, value[valueKey]);
        }
      }
    }
    function* Promise2(schema, references, path, value) {
      if (!(typeof value === "object" && typeof value.then === "function")) {
        yield { type: ValueErrorType.Promise, schema, path, value, message: `Expected Promise` };
      }
    }
    function* Record(schema, references, path, value) {
      if (!IsRecordObject(value)) {
        return yield { type: ValueErrorType.Object, schema, path, value, message: `Expected record object` };
      }
      if (IsDefined(schema.minProperties) && !(globalThis.Object.getOwnPropertyNames(value).length >= schema.minProperties)) {
        yield { type: ValueErrorType.ObjectMinProperties, schema, path, value, message: `Expected object to have at least ${schema.minProperties} properties` };
      }
      if (IsDefined(schema.maxProperties) && !(globalThis.Object.getOwnPropertyNames(value).length <= schema.maxProperties)) {
        yield { type: ValueErrorType.ObjectMaxProperties, schema, path, value, message: `Expected object to have less than ${schema.minProperties} properties` };
      }
      const [patternKey, patternSchema] = globalThis.Object.entries(schema.patternProperties)[0];
      const regex = new RegExp(patternKey);
      for (const [propertyKey, propertyValue] of globalThis.Object.entries(value)) {
        if (regex.test(propertyKey)) {
          yield* Visit(patternSchema, references, `${path}/${propertyKey}`, propertyValue);
          continue;
        }
        if (typeof schema.additionalProperties === "object") {
          yield* Visit(schema.additionalProperties, references, `${path}/${propertyKey}`, propertyValue);
        }
        if (schema.additionalProperties === false) {
          const propertyPath = `${path}/${propertyKey}`;
          const message = `Unexpected property '${propertyPath}'`;
          return yield { type: ValueErrorType.ObjectAdditionalProperties, schema, path: propertyPath, value: propertyValue, message };
        }
      }
    }
    function* Ref(schema, references, path, value) {
      const index = references.findIndex((foreign) => foreign.$id === schema.$ref);
      if (index === -1)
        throw new ValueErrorsDereferenceError(schema);
      const target = references[index];
      yield* Visit(target, references, path, value);
    }
    function* String2(schema, references, path, value) {
      if (!IsString(value)) {
        return yield { type: ValueErrorType.String, schema, path, value, message: "Expected string" };
      }
      if (IsDefined(schema.minLength) && !(value.length >= schema.minLength)) {
        yield { type: ValueErrorType.StringMinLength, schema, path, value, message: `Expected string length greater or equal to ${schema.minLength}` };
      }
      if (IsDefined(schema.maxLength) && !(value.length <= schema.maxLength)) {
        yield { type: ValueErrorType.StringMaxLength, schema, path, value, message: `Expected string length less or equal to ${schema.maxLength}` };
      }
      if (schema.pattern !== undefined) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(value)) {
          yield { type: ValueErrorType.StringPattern, schema, path, value, message: `Expected string to match pattern ${schema.pattern}` };
        }
      }
      if (schema.format !== undefined) {
        if (!Types.FormatRegistry.Has(schema.format)) {
          yield { type: ValueErrorType.StringFormatUnknown, schema, path, value, message: `Unknown string format '${schema.format}'` };
        } else {
          const format = Types.FormatRegistry.Get(schema.format);
          if (!format(value)) {
            yield { type: ValueErrorType.StringFormat, schema, path, value, message: `Expected string to match format '${schema.format}'` };
          }
        }
      }
    }
    function* Symbol2(schema, references, path, value) {
      if (!(typeof value === "symbol")) {
        return yield { type: ValueErrorType.Symbol, schema, path, value, message: "Expected symbol" };
      }
    }
    function* TemplateLiteral(schema, references, path, value) {
      if (!IsString(value)) {
        return yield { type: ValueErrorType.String, schema, path, value, message: "Expected string" };
      }
      const regex = new RegExp(schema.pattern);
      if (!regex.test(value)) {
        yield { type: ValueErrorType.StringPattern, schema, path, value, message: `Expected string to match pattern ${schema.pattern}` };
      }
    }
    function* This(schema, references, path, value) {
      const index = references.findIndex((foreign) => foreign.$id === schema.$ref);
      if (index === -1)
        throw new ValueErrorsDereferenceError(schema);
      const target = references[index];
      yield* Visit(target, references, path, value);
    }
    function* Tuple(schema, references, path, value) {
      if (!globalThis.Array.isArray(value)) {
        return yield { type: ValueErrorType.Array, schema, path, value, message: "Expected Array" };
      }
      if (schema.items === undefined && !(value.length === 0)) {
        return yield { type: ValueErrorType.TupleZeroLength, schema, path, value, message: "Expected tuple to have 0 elements" };
      }
      if (!(value.length === schema.maxItems)) {
        yield { type: ValueErrorType.TupleLength, schema, path, value, message: `Expected tuple to have ${schema.maxItems} elements` };
      }
      if (!schema.items) {
        return;
      }
      for (let i = 0;i < schema.items.length; i++) {
        yield* Visit(schema.items[i], references, `${path}/${i}`, value[i]);
      }
    }
    function* Undefined(schema, references, path, value) {
      if (!(value === undefined)) {
        yield { type: ValueErrorType.Undefined, schema, path, value, message: `Expected undefined` };
      }
    }
    function* Union(schema, references, path, value) {
      const errors = [];
      for (const inner of schema.anyOf) {
        const variantErrors = [...Visit(inner, references, path, value)];
        if (variantErrors.length === 0)
          return;
        errors.push(...variantErrors);
      }
      if (errors.length > 0) {
        yield { type: ValueErrorType.Union, schema, path, value, message: "Expected value of union" };
      }
      for (const error of errors) {
        yield error;
      }
    }
    function* Uint8Array2(schema, references, path, value) {
      if (!(value instanceof globalThis.Uint8Array)) {
        return yield { type: ValueErrorType.Uint8Array, schema, path, value, message: `Expected Uint8Array` };
      }
      if (IsDefined(schema.maxByteLength) && !(value.length <= schema.maxByteLength)) {
        yield { type: ValueErrorType.Uint8ArrayMaxByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length less or equal to ${schema.maxByteLength}` };
      }
      if (IsDefined(schema.minByteLength) && !(value.length >= schema.minByteLength)) {
        yield { type: ValueErrorType.Uint8ArrayMinByteLength, schema, path, value, message: `Expected Uint8Array to have a byte length greater or equal to ${schema.maxByteLength}` };
      }
    }
    function* Unknown(schema, references, path, value) {
    }
    function* Void(schema, references, path, value) {
      if (!IsVoid(value)) {
        return yield { type: ValueErrorType.Void, schema, path, value, message: `Expected void` };
      }
    }
    function* UserDefined(schema, references, path, value) {
      const check = Types.TypeRegistry.Get(schema[Types.Kind]);
      if (!check(schema, value)) {
        return yield { type: ValueErrorType.Custom, schema, path, value, message: `Expected kind ${schema[Types.Kind]}` };
      }
    }
    function* Visit(schema, references, path, value) {
      const references_ = IsDefined(schema.$id) ? [...references, schema] : references;
      const schema_ = schema;
      switch (schema_[Types.Kind]) {
        case "Any":
          return yield* Any(schema_, references_, path, value);
        case "Array":
          return yield* Array2(schema_, references_, path, value);
        case "BigInt":
          return yield* BigInt2(schema_, references_, path, value);
        case "Boolean":
          return yield* Boolean2(schema_, references_, path, value);
        case "Constructor":
          return yield* Constructor(schema_, references_, path, value);
        case "Date":
          return yield* Date2(schema_, references_, path, value);
        case "Function":
          return yield* Function2(schema_, references_, path, value);
        case "Integer":
          return yield* Integer(schema_, references_, path, value);
        case "Intersect":
          return yield* Intersect(schema_, references_, path, value);
        case "Literal":
          return yield* Literal(schema_, references_, path, value);
        case "Never":
          return yield* Never(schema_, references_, path, value);
        case "Not":
          return yield* Not(schema_, references_, path, value);
        case "Null":
          return yield* Null(schema_, references_, path, value);
        case "Number":
          return yield* Number2(schema_, references_, path, value);
        case "Object":
          return yield* Object2(schema_, references_, path, value);
        case "Promise":
          return yield* Promise2(schema_, references_, path, value);
        case "Record":
          return yield* Record(schema_, references_, path, value);
        case "Ref":
          return yield* Ref(schema_, references_, path, value);
        case "String":
          return yield* String2(schema_, references_, path, value);
        case "Symbol":
          return yield* Symbol2(schema_, references_, path, value);
        case "TemplateLiteral":
          return yield* TemplateLiteral(schema_, references_, path, value);
        case "This":
          return yield* This(schema_, references_, path, value);
        case "Tuple":
          return yield* Tuple(schema_, references_, path, value);
        case "Undefined":
          return yield* Undefined(schema_, references_, path, value);
        case "Union":
          return yield* Union(schema_, references_, path, value);
        case "Uint8Array":
          return yield* Uint8Array2(schema_, references_, path, value);
        case "Unknown":
          return yield* Unknown(schema_, references_, path, value);
        case "Void":
          return yield* Void(schema_, references_, path, value);
        default:
          if (!Types.TypeRegistry.Has(schema_[Types.Kind]))
            throw new ValueErrorsUnknownTypeError(schema);
          return yield* UserDefined(schema_, references_, path, value);
      }
    }
    function Errors(schema, references, value) {
      const iterator = Visit(schema, references, "", value);
      return new ValueErrorIterator(iterator);
    }
    ValueErrors2.Errors = Errors;
  })(ValueErrors || (exports.ValueErrors = ValueErrors = {}));
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@sinclair+typebox@0.29.4/node_modules/@sinclair/typebox/errors/index.js
var require_errors2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  __exportStar(require_errors(), exports);
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@sinclair+typebox@0.29.4/node_modules/@sinclair/typebox/compiler/compiler.js
var require_compiler = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TypeCompiler = exports.TypeCompilerTypeGuardError = exports.TypeCompilerDereferenceError = exports.TypeCompilerUnknownTypeError = exports.TypeCheck = undefined;
  var Types = require_typebox();
  var index_1 = require_errors2();
  var index_2 = require_system2();
  var hash_1 = require_hash();

  class TypeCheck {
    constructor(schema, references, checkFunc, code) {
      this.schema = schema;
      this.references = references;
      this.checkFunc = checkFunc;
      this.code = code;
    }
    Code() {
      return this.code;
    }
    Errors(value) {
      return index_1.ValueErrors.Errors(this.schema, this.references, value);
    }
    Check(value) {
      return this.checkFunc(value);
    }
  }
  exports.TypeCheck = TypeCheck;
  var Character;
  (function(Character2) {
    function DollarSign(code) {
      return code === 36;
    }
    Character2.DollarSign = DollarSign;
    function IsUnderscore(code) {
      return code === 95;
    }
    Character2.IsUnderscore = IsUnderscore;
    function IsAlpha(code) {
      return code >= 65 && code <= 90 || code >= 97 && code <= 122;
    }
    Character2.IsAlpha = IsAlpha;
    function IsNumeric(code) {
      return code >= 48 && code <= 57;
    }
    Character2.IsNumeric = IsNumeric;
  })(Character || (Character = {}));
  var MemberExpression;
  (function(MemberExpression2) {
    function IsFirstCharacterNumeric(value) {
      if (value.length === 0)
        return false;
      return Character.IsNumeric(value.charCodeAt(0));
    }
    function IsAccessor(value) {
      if (IsFirstCharacterNumeric(value))
        return false;
      for (let i = 0;i < value.length; i++) {
        const code = value.charCodeAt(i);
        const check = Character.IsAlpha(code) || Character.IsNumeric(code) || Character.DollarSign(code) || Character.IsUnderscore(code);
        if (!check)
          return false;
      }
      return true;
    }
    function EscapeHyphen(key) {
      return key.replace(/'/g, "\\'");
    }
    function Encode(object, key) {
      return IsAccessor(key) ? `${object}.${key}` : `${object}['${EscapeHyphen(key)}']`;
    }
    MemberExpression2.Encode = Encode;
  })(MemberExpression || (MemberExpression = {}));
  var Identifier;
  (function(Identifier2) {
    function Encode($id) {
      const buffer = [];
      for (let i = 0;i < $id.length; i++) {
        const code = $id.charCodeAt(i);
        if (Character.IsNumeric(code) || Character.IsAlpha(code)) {
          buffer.push($id.charAt(i));
        } else {
          buffer.push(`_${code}_`);
        }
      }
      return buffer.join("").replace(/__/g, "_");
    }
    Identifier2.Encode = Encode;
  })(Identifier || (Identifier = {}));

  class TypeCompilerUnknownTypeError extends Error {
    constructor(schema) {
      super("TypeCompiler: Unknown type");
      this.schema = schema;
    }
  }
  exports.TypeCompilerUnknownTypeError = TypeCompilerUnknownTypeError;

  class TypeCompilerDereferenceError extends Error {
    constructor(schema) {
      super(`TypeCompiler: Unable to dereference schema with \$id '${schema.$ref}'`);
      this.schema = schema;
    }
  }
  exports.TypeCompilerDereferenceError = TypeCompilerDereferenceError;

  class TypeCompilerTypeGuardError extends Error {
    constructor(schema) {
      super("TypeCompiler: Preflight validation check failed to guard for the given schema");
      this.schema = schema;
    }
  }
  exports.TypeCompilerTypeGuardError = TypeCompilerTypeGuardError;
  var TypeCompiler;
  (function(TypeCompiler2) {
    function IsBigInt(value) {
      return typeof value === "bigint";
    }
    function IsNumber(value) {
      return typeof value === "number" && globalThis.Number.isFinite(value);
    }
    function IsString(value) {
      return typeof value === "string";
    }
    function IsAnyOrUnknown(schema) {
      return schema[Types.Kind] === "Any" || schema[Types.Kind] === "Unknown";
    }
    function IsExactOptionalProperty(value, key, expression) {
      return index_2.TypeSystem.ExactOptionalPropertyTypes ? `('${key}' in ${value} ? ${expression} : true)` : `(${MemberExpression.Encode(value, key)} !== undefined ? ${expression} : true)`;
    }
    function IsObjectCheck(value) {
      return !index_2.TypeSystem.AllowArrayObjects ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}))` : `(typeof ${value} === 'object' && ${value} !== null)`;
    }
    function IsRecordCheck(value) {
      return !index_2.TypeSystem.AllowArrayObjects ? `(typeof ${value} === 'object' && ${value} !== null && !Array.isArray(${value}) && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))` : `(typeof ${value} === 'object' && ${value} !== null && !(${value} instanceof Date) && !(${value} instanceof Uint8Array))`;
    }
    function IsNumberCheck(value) {
      return !index_2.TypeSystem.AllowNaN ? `(typeof ${value} === 'number' && Number.isFinite(${value}))` : `typeof ${value} === 'number'`;
    }
    function IsVoidCheck(value) {
      return index_2.TypeSystem.AllowVoidNull ? `(${value} === undefined || ${value} === null)` : `${value} === undefined`;
    }
    function* Any(schema, references, value) {
      yield "true";
    }
    function* Array2(schema, references, value) {
      yield `Array.isArray(${value})`;
      if (IsNumber(schema.minItems))
        yield `${value}.length >= ${schema.minItems}`;
      if (IsNumber(schema.maxItems))
        yield `${value}.length <= ${schema.maxItems}`;
      if (schema.uniqueItems === true)
        yield `((function() { const set = new Set(); for(const element of ${value}) { const hashed = hash(element); if(set.has(hashed)) { return false } else { set.add(hashed) } } return true })())`;
      const expression = CreateExpression(schema.items, references, "value");
      const parameter = CreateParameter("value", "any");
      yield `${value}.every((${parameter}) => ${expression})`;
    }
    function* BigInt2(schema, references, value) {
      yield `(typeof ${value} === 'bigint')`;
      if (IsBigInt(schema.multipleOf))
        yield `(${value} % BigInt(${schema.multipleOf})) === 0`;
      if (IsBigInt(schema.exclusiveMinimum))
        yield `${value} > BigInt(${schema.exclusiveMinimum})`;
      if (IsBigInt(schema.exclusiveMaximum))
        yield `${value} < BigInt(${schema.exclusiveMaximum})`;
      if (IsBigInt(schema.minimum))
        yield `${value} >= BigInt(${schema.minimum})`;
      if (IsBigInt(schema.maximum))
        yield `${value} <= BigInt(${schema.maximum})`;
    }
    function* Boolean2(schema, references, value) {
      yield `(typeof ${value} === 'boolean')`;
    }
    function* Constructor(schema, references, value) {
      yield* Visit(schema.returns, references, `${value}.prototype`);
    }
    function* Date2(schema, references, value) {
      yield `(${value} instanceof Date) && Number.isFinite(${value}.getTime())`;
      if (IsNumber(schema.exclusiveMinimumTimestamp))
        yield `${value}.getTime() > ${schema.exclusiveMinimumTimestamp}`;
      if (IsNumber(schema.exclusiveMaximumTimestamp))
        yield `${value}.getTime() < ${schema.exclusiveMaximumTimestamp}`;
      if (IsNumber(schema.minimumTimestamp))
        yield `${value}.getTime() >= ${schema.minimumTimestamp}`;
      if (IsNumber(schema.maximumTimestamp))
        yield `${value}.getTime() <= ${schema.maximumTimestamp}`;
    }
    function* Function2(schema, references, value) {
      yield `(typeof ${value} === 'function')`;
    }
    function* Integer(schema, references, value) {
      yield `(typeof ${value} === 'number' && Number.isInteger(${value}))`;
      if (IsNumber(schema.multipleOf))
        yield `(${value} % ${schema.multipleOf}) === 0`;
      if (IsNumber(schema.exclusiveMinimum))
        yield `${value} > ${schema.exclusiveMinimum}`;
      if (IsNumber(schema.exclusiveMaximum))
        yield `${value} < ${schema.exclusiveMaximum}`;
      if (IsNumber(schema.minimum))
        yield `${value} >= ${schema.minimum}`;
      if (IsNumber(schema.maximum))
        yield `${value} <= ${schema.maximum}`;
    }
    function* Intersect(schema, references, value) {
      const check1 = schema.allOf.map((schema2) => CreateExpression(schema2, references, value)).join(" && ");
      if (schema.unevaluatedProperties === false) {
        const keyCheck = PushLocal(`${new RegExp(Types.KeyResolver.ResolvePattern(schema))};`);
        const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key))`;
        yield `(${check1} && ${check2})`;
      } else if (Types.TypeGuard.TSchema(schema.unevaluatedProperties)) {
        const keyCheck = PushLocal(`${new RegExp(Types.KeyResolver.ResolvePattern(schema))};`);
        const check2 = `Object.getOwnPropertyNames(${value}).every(key => ${keyCheck}.test(key) || ${CreateExpression(schema.unevaluatedProperties, references, `${value}[key]`)})`;
        yield `(${check1} && ${check2})`;
      } else {
        yield `(${check1})`;
      }
    }
    function* Literal(schema, references, value) {
      if (typeof schema.const === "number" || typeof schema.const === "boolean") {
        yield `(${value} === ${schema.const})`;
      } else {
        yield `(${value} === '${schema.const}')`;
      }
    }
    function* Never(schema, references, value) {
      yield `false`;
    }
    function* Not(schema, references, value) {
      const expression = CreateExpression(schema.not, references, value);
      yield `(!${expression})`;
    }
    function* Null(schema, references, value) {
      yield `(${value} === null)`;
    }
    function* Number2(schema, references, value) {
      yield IsNumberCheck(value);
      if (IsNumber(schema.multipleOf))
        yield `(${value} % ${schema.multipleOf}) === 0`;
      if (IsNumber(schema.exclusiveMinimum))
        yield `${value} > ${schema.exclusiveMinimum}`;
      if (IsNumber(schema.exclusiveMaximum))
        yield `${value} < ${schema.exclusiveMaximum}`;
      if (IsNumber(schema.minimum))
        yield `${value} >= ${schema.minimum}`;
      if (IsNumber(schema.maximum))
        yield `${value} <= ${schema.maximum}`;
    }
    function* Object2(schema, references, value) {
      yield IsObjectCheck(value);
      if (IsNumber(schema.minProperties))
        yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`;
      if (IsNumber(schema.maxProperties))
        yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`;
      const knownKeys = globalThis.Object.getOwnPropertyNames(schema.properties);
      for (const knownKey of knownKeys) {
        const memberExpression = MemberExpression.Encode(value, knownKey);
        const property = schema.properties[knownKey];
        if (schema.required && schema.required.includes(knownKey)) {
          yield* Visit(property, references, memberExpression);
          if (Types.ExtendsUndefined.Check(property) || IsAnyOrUnknown(property))
            yield `('${knownKey}' in ${value})`;
        } else {
          const expression = CreateExpression(property, references, memberExpression);
          yield IsExactOptionalProperty(value, knownKey, expression);
        }
      }
      if (schema.additionalProperties === false) {
        if (schema.required && schema.required.length === knownKeys.length) {
          yield `Object.getOwnPropertyNames(${value}).length === ${knownKeys.length}`;
        } else {
          const keys = `[${knownKeys.map((key) => `'${key}'`).join(", ")}]`;
          yield `Object.getOwnPropertyNames(${value}).every(key => ${keys}.includes(key))`;
        }
      }
      if (typeof schema.additionalProperties === "object") {
        const expression = CreateExpression(schema.additionalProperties, references, `${value}[key]`);
        const keys = `[${knownKeys.map((key) => `'${key}'`).join(", ")}]`;
        yield `(Object.getOwnPropertyNames(${value}).every(key => ${keys}.includes(key) || ${expression}))`;
      }
    }
    function* Promise2(schema, references, value) {
      yield `(typeof value === 'object' && typeof ${value}.then === 'function')`;
    }
    function* Record(schema, references, value) {
      yield IsRecordCheck(value);
      if (IsNumber(schema.minProperties))
        yield `Object.getOwnPropertyNames(${value}).length >= ${schema.minProperties}`;
      if (IsNumber(schema.maxProperties))
        yield `Object.getOwnPropertyNames(${value}).length <= ${schema.maxProperties}`;
      const [patternKey, patternSchema] = globalThis.Object.entries(schema.patternProperties)[0];
      const local = PushLocal(`new RegExp(/${patternKey}/)`);
      const check1 = CreateExpression(patternSchema, references, "value");
      const check2 = Types.TypeGuard.TSchema(schema.additionalProperties) ? CreateExpression(schema.additionalProperties, references, value) : schema.additionalProperties === false ? "false" : "true";
      const expression = `(${local}.test(key) ? ${check1} : ${check2})`;
      yield `(Object.entries(${value}).every(([key, value]) => ${expression}))`;
    }
    function* Ref(schema, references, value) {
      const index = references.findIndex((foreign) => foreign.$id === schema.$ref);
      if (index === -1)
        throw new TypeCompilerDereferenceError(schema);
      const target = references[index];
      if (state.functions.has(schema.$ref))
        return yield `${CreateFunctionName(schema.$ref)}(${value})`;
      yield* Visit(target, references, value);
    }
    function* String2(schema, references, value) {
      yield `(typeof ${value} === 'string')`;
      if (IsNumber(schema.minLength))
        yield `${value}.length >= ${schema.minLength}`;
      if (IsNumber(schema.maxLength))
        yield `${value}.length <= ${schema.maxLength}`;
      if (schema.pattern !== undefined) {
        const local = PushLocal(`${new RegExp(schema.pattern)};`);
        yield `${local}.test(${value})`;
      }
      if (schema.format !== undefined) {
        yield `format('${schema.format}', ${value})`;
      }
    }
    function* Symbol2(schema, references, value) {
      yield `(typeof ${value} === 'symbol')`;
    }
    function* TemplateLiteral(schema, references, value) {
      yield `(typeof ${value} === 'string')`;
      const local = PushLocal(`${new RegExp(schema.pattern)};`);
      yield `${local}.test(${value})`;
    }
    function* This(schema, references, value) {
      const func = CreateFunctionName(schema.$ref);
      yield `${func}(${value})`;
    }
    function* Tuple(schema, references, value) {
      yield `Array.isArray(${value})`;
      if (schema.items === undefined)
        return yield `${value}.length === 0`;
      yield `(${value}.length === ${schema.maxItems})`;
      for (let i = 0;i < schema.items.length; i++) {
        const expression = CreateExpression(schema.items[i], references, `${value}[${i}]`);
        yield `${expression}`;
      }
    }
    function* Undefined(schema, references, value) {
      yield `${value} === undefined`;
    }
    function* Union(schema, references, value) {
      const expressions = schema.anyOf.map((schema2) => CreateExpression(schema2, references, value));
      yield `(${expressions.join(" || ")})`;
    }
    function* Uint8Array2(schema, references, value) {
      yield `${value} instanceof Uint8Array`;
      if (IsNumber(schema.maxByteLength))
        yield `(${value}.length <= ${schema.maxByteLength})`;
      if (IsNumber(schema.minByteLength))
        yield `(${value}.length >= ${schema.minByteLength})`;
    }
    function* Unknown(schema, references, value) {
      yield "true";
    }
    function* Void(schema, references, value) {
      yield IsVoidCheck(value);
    }
    function* UserDefined(schema, references, value) {
      const schema_key = `schema_key_${state.customs.size}`;
      state.customs.set(schema_key, schema);
      yield `custom('${schema[Types.Kind]}', '${schema_key}', ${value})`;
    }
    function* Visit(schema, references, value, root = false) {
      const references_ = IsString(schema.$id) ? [...references, schema] : references;
      const schema_ = schema;
      if (IsString(schema.$id)) {
        const name = CreateFunctionName(schema.$id);
        if (!state.functions.has(schema.$id)) {
          state.functions.add(schema.$id);
          const body = CreateFunction(name, schema, references, "value");
          PushFunction(body);
        }
        if (!root)
          return yield `${name}(${value})`;
      }
      switch (schema_[Types.Kind]) {
        case "Any":
          return yield* Any(schema_, references_, value);
        case "Array":
          return yield* Array2(schema_, references_, value);
        case "BigInt":
          return yield* BigInt2(schema_, references_, value);
        case "Boolean":
          return yield* Boolean2(schema_, references_, value);
        case "Constructor":
          return yield* Constructor(schema_, references_, value);
        case "Date":
          return yield* Date2(schema_, references_, value);
        case "Function":
          return yield* Function2(schema_, references_, value);
        case "Integer":
          return yield* Integer(schema_, references_, value);
        case "Intersect":
          return yield* Intersect(schema_, references_, value);
        case "Literal":
          return yield* Literal(schema_, references_, value);
        case "Never":
          return yield* Never(schema_, references_, value);
        case "Not":
          return yield* Not(schema_, references_, value);
        case "Null":
          return yield* Null(schema_, references_, value);
        case "Number":
          return yield* Number2(schema_, references_, value);
        case "Object":
          return yield* Object2(schema_, references_, value);
        case "Promise":
          return yield* Promise2(schema_, references_, value);
        case "Record":
          return yield* Record(schema_, references_, value);
        case "Ref":
          return yield* Ref(schema_, references_, value);
        case "String":
          return yield* String2(schema_, references_, value);
        case "Symbol":
          return yield* Symbol2(schema_, references_, value);
        case "TemplateLiteral":
          return yield* TemplateLiteral(schema_, references_, value);
        case "This":
          return yield* This(schema_, references_, value);
        case "Tuple":
          return yield* Tuple(schema_, references_, value);
        case "Undefined":
          return yield* Undefined(schema_, references_, value);
        case "Union":
          return yield* Union(schema_, references_, value);
        case "Uint8Array":
          return yield* Uint8Array2(schema_, references_, value);
        case "Unknown":
          return yield* Unknown(schema_, references_, value);
        case "Void":
          return yield* Void(schema_, references_, value);
        default:
          if (!Types.TypeRegistry.Has(schema_[Types.Kind]))
            throw new TypeCompilerUnknownTypeError(schema);
          return yield* UserDefined(schema_, references_, value);
      }
    }
    const state = {
      language: "javascript",
      variables: new Set,
      functions: new Set,
      customs: new Map
    };
    function CreateFunctionName($id) {
      return `check_${Identifier.Encode($id)}`;
    }
    function CreateExpression(schema, references, value) {
      return `(${[...Visit(schema, references, value)].join(" && ")})`;
    }
    function CreateParameter(name, type) {
      const annotation = state.language === "typescript" ? `: ${type}` : "";
      return `${name}${annotation}`;
    }
    function CreateReturns(type) {
      return state.language === "typescript" ? `: ${type}` : "";
    }
    function CreateFunction(name, schema, references, value) {
      const expression = [...Visit(schema, references, value, true)].map((condition) => `    ${condition}`).join(" &&\n");
      const parameter = CreateParameter("value", "any");
      const returns = CreateReturns("boolean");
      return `function ${name}(${parameter})${returns} {\n  return (\n${expression}\n )\n}`;
    }
    function PushFunction(functionBody) {
      state.variables.add(functionBody);
    }
    function PushLocal(expression) {
      const local = `local_${state.variables.size}`;
      state.variables.add(`const ${local} = ${expression}`);
      return local;
    }
    function GetLocals() {
      return [...state.variables.values()];
    }
    function Build(schema, references) {
      const check = CreateFunction("check", schema, references, "value");
      const locals = GetLocals();
      const parameter = CreateParameter("value", "any");
      const returns = CreateReturns("boolean");
      return IsString(schema.$id) ? `${locals.join("\n")}\nreturn function check(${parameter})${returns} {\n  return ${CreateFunctionName(schema.$id)}(value)\n}` : `${locals.join("\n")}\nreturn ${check}`;
    }
    function Code(schema, references = [], options = { language: "javascript" }) {
      state.language = options.language;
      state.variables.clear();
      state.functions.clear();
      state.customs.clear();
      if (!Types.TypeGuard.TSchema(schema))
        throw new TypeCompilerTypeGuardError(schema);
      for (const schema2 of references)
        if (!Types.TypeGuard.TSchema(schema2))
          throw new TypeCompilerTypeGuardError(schema2);
      return Build(schema, references);
    }
    TypeCompiler2.Code = Code;
    function Compile(schema, references = []) {
      const code = Code(schema, references, { language: "javascript" });
      const customs = new Map(state.customs);
      const compiledFunction = globalThis.Function("custom", "format", "hash", code);
      const checkFunction = compiledFunction((kind, schema_key, value) => {
        if (!Types.TypeRegistry.Has(kind) || !customs.has(schema_key))
          return false;
        const schema2 = customs.get(schema_key);
        const func = Types.TypeRegistry.Get(kind);
        return func(schema2, value);
      }, (format, value) => {
        if (!Types.FormatRegistry.Has(format))
          return false;
        const func = Types.FormatRegistry.Get(format);
        return func(value);
      }, (value) => {
        return hash_1.ValueHash.Create(value);
      });
      return new TypeCheck(schema, references, checkFunction, code);
    }
    TypeCompiler2.Compile = Compile;
  })(TypeCompiler || (exports.TypeCompiler = TypeCompiler = {}));
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/node_modules/@sinclair/typebox/compiler/index.js
var require_compiler2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.ValueErrorType = undefined;
  var index_1 = require_errors2();
  Object.defineProperty(exports, "ValueErrorType", { enumerable: true, get: function() {
    return index_1.ValueErrorType;
  } });
  __exportStar(require_compiler(), exports);
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/utils.js
var typebox, compiler, SCHEMA, DEFS, EXPOSED, mergeObjectArray, mergeHook, t2, mergeDeep, getSchemaValidator, getResponseSchemaValidator;
var init_utils = __esm(() => {
  typebox = __toESM(require_typebox(), 1);
  compiler = __toESM(require_compiler2(), 1);
  SCHEMA = Symbol("schema");
  DEFS = Symbol("definitions");
  EXPOSED = Symbol("exposed");
  mergeObjectArray = (e3, r3) => [...Array.isArray(e3) ? e3 : [e3], ...Array.isArray(r3) ? r3 : [r3]];
  mergeHook = (e3, r3) => ({ body: r3?.body ?? e3?.body, headers: r3?.headers ?? e3?.headers, params: r3?.params ?? e3?.params, query: r3?.query ?? e3?.query, response: r3?.response ?? e3?.response, detail: mergeDeep(r3?.detail ?? {}, e3?.detail ?? {}), transform: mergeObjectArray(e3.transform ?? [], r3?.transform ?? []), beforeHandle: mergeObjectArray(e3.beforeHandle ?? [], r3?.beforeHandle ?? []), parse: mergeObjectArray(e3.parse ?? [], r3?.parse ?? []), afterHandle: mergeObjectArray(e3.afterHandle ?? [], r3?.afterHandle ?? []), error: mergeObjectArray(e3.error ?? [], r3?.error ?? []), type: e3?.type || r3?.type });
  t2 = (e3) => e3 && typeof e3 == "object" && !Array.isArray(e3);
  mergeDeep = (e3, r3) => {
    let o = Object.assign({}, e3);
    return t2(e3) && t2(r3) && Object.keys(r3).forEach((a2) => {
      t2(r3[a2]) && (a2 in e3) ? o[a2] = mergeDeep(e3[a2], r3[a2]) : Object.assign(o, { [a2]: r3[a2] });
    }), o;
  };
  getSchemaValidator = (e3, t3, o = false) => {
    if (!e3 || typeof e3 == "string" && !(e3 in t3))
      return;
    let a2 = typeof e3 == "string" ? t3[e3] : e3;
    return a2.type === "object" && ("additionalProperties" in a2) == false && (a2.additionalProperties = o), compiler.TypeCompiler.Compile(a2);
  };
  getResponseSchemaValidator = (t3, o, a2 = false) => {
    if (!t3 || typeof t3 == "string" && !(t3 in o))
      return;
    let i = typeof t3 == "string" ? o[t3] : t3;
    if (typebox.Kind in i)
      return { 200: compiler.TypeCompiler.Compile(i) };
    let n = {};
    return Object.keys(i).forEach((t4) => {
      let s = i[t4];
      if (typeof s == "string") {
        if (s in o) {
          let a3 = o[s];
          a3.type, n[+t4] = (typebox.Kind in a3) ? compiler.TypeCompiler.Compile(a3) : a3;
        }
        return;
      }
      s.type === "object" && ("additionalProperties" in s) == false && (s.additionalProperties = a2), n[+t4] = (typebox.Kind in s) ? compiler.TypeCompiler.Compile(s) : s;
    }), n;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/lodash.clonedeep/index.js
var require_lodash = __commonJS((exports, module) => {
  var addMapEntry = function(map, pair) {
    map.set(pair[0], pair[1]);
    return map;
  };
  var addSetEntry = function(set, value) {
    set.add(value);
    return set;
  };
  var arrayEach = function(array, iteratee) {
    var index = -1, length = array ? array.length : 0;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  };
  var arrayPush = function(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  };
  var arrayReduce = function(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array ? array.length : 0;
    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  };
  var baseTimes = function(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  };
  var getValue = function(object, key) {
    return object == null ? undefined : object[key];
  };
  var isHostObject = function(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e3) {
      }
    }
    return result;
  };
  var mapToArray = function(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  };
  var overArg = function(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  };
  var setToArray = function(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  };
  var Hash = function(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  var hashClear = function() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  };
  var hashDelete = function(key) {
    return this.has(key) && delete this.__data__[key];
  };
  var hashGet = function(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  };
  var hashHas = function(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
  };
  var hashSet = function(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  };
  var ListCache = function(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  var listCacheClear = function() {
    this.__data__ = [];
  };
  var listCacheDelete = function(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  };
  var listCacheGet = function(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
  };
  var listCacheHas = function(key) {
    return assocIndexOf(this.__data__, key) > -1;
  };
  var listCacheSet = function(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  };
  var MapCache = function(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  };
  var mapCacheClear = function() {
    this.__data__ = {
      hash: new Hash,
      map: new (Map2 || ListCache),
      string: new Hash
    };
  };
  var mapCacheDelete = function(key) {
    return getMapData(this, key)["delete"](key);
  };
  var mapCacheGet = function(key) {
    return getMapData(this, key).get(key);
  };
  var mapCacheHas = function(key) {
    return getMapData(this, key).has(key);
  };
  var mapCacheSet = function(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  };
  var Stack = function(entries) {
    this.__data__ = new ListCache(entries);
  };
  var stackClear = function() {
    this.__data__ = new ListCache;
  };
  var stackDelete = function(key) {
    return this.__data__["delete"](key);
  };
  var stackGet = function(key) {
    return this.__data__.get(key);
  };
  var stackHas = function(key) {
    return this.__data__.has(key);
  };
  var stackSet = function(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
      var pairs = cache.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
  };
  var arrayLikeKeys = function(value, inherited) {
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for (var key in value) {
      if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  };
  var assignValue = function(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
      object[key] = value;
    }
  };
  var assocIndexOf = function(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  };
  var baseAssign = function(object, source) {
    return object && copyObject(source, keys(source), object);
  };
  var baseClone = function(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== undefined) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag || tag == argsTag || isFunc && !object) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, baseClone, isDeep);
      }
    }
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (!isArr) {
      var props = isFull ? getAllKeys(value) : keys(value);
    }
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone(subValue, isDeep, isFull, customizer, key2, value, stack));
    });
    return result;
  };
  var baseCreate = function(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
  };
  var baseGetAllKeys = function(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  };
  var baseGetTag = function(value) {
    return objectToString.call(value);
  };
  var baseIsNative = function(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  };
  var baseKeys = function(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  };
  var cloneBuffer = function(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
  };
  var cloneArrayBuffer = function(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
    return result;
  };
  var cloneDataView = function(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  };
  var cloneMap = function(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor);
  };
  var cloneRegExp = function(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  };
  var cloneSet = function(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor);
  };
  var cloneSymbol = function(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
  };
  var cloneTypedArray = function(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  };
  var copyArray = function(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  };
  var copyObject = function(source, props, object, customizer) {
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
      assignValue(object, key, newValue === undefined ? source[key] : newValue);
    }
    return object;
  };
  var copySymbols = function(source, object) {
    return copyObject(source, getSymbols(source), object);
  };
  var getAllKeys = function(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  };
  var getMapData = function(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  };
  var getNative = function(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  };
  var initCloneArray = function(array) {
    var length = array.length, result = array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  };
  var initCloneObject = function(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  };
  var initCloneByTag = function(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return cloneArrayBuffer(object);
      case boolTag:
      case dateTag:
        return new Ctor(+object);
      case dataViewTag:
        return cloneDataView(object, isDeep);
      case float32Tag:
      case float64Tag:
      case int8Tag:
      case int16Tag:
      case int32Tag:
      case uint8Tag:
      case uint8ClampedTag:
      case uint16Tag:
      case uint32Tag:
        return cloneTypedArray(object, isDeep);
      case mapTag:
        return cloneMap(object, isDeep, cloneFunc);
      case numberTag:
      case stringTag:
        return new Ctor(object);
      case regexpTag:
        return cloneRegExp(object);
      case setTag:
        return cloneSet(object, isDeep, cloneFunc);
      case symbolTag:
        return cloneSymbol(object);
    }
  };
  var isIndex = function(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  };
  var isKeyable = function(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  };
  var isMasked = function(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  };
  var isPrototype = function(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
  };
  var toSource = function(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e3) {
      }
      try {
        return func + "";
      } catch (e3) {
      }
    }
    return "";
  };
  var cloneDeep = function(value) {
    return baseClone(value, true, true);
  };
  var eq = function(value, other) {
    return value === other || value !== value && other !== other;
  };
  var isArguments = function(value) {
    return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
  };
  var isArrayLike = function(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  };
  var isArrayLikeObject = function(value) {
    return isObjectLike(value) && isArrayLike(value);
  };
  var isFunction = function(value) {
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  };
  var isLength = function(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  };
  var isObject = function(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  };
  var isObjectLike = function(value) {
    return !!value && typeof value == "object";
  };
  var keys = function(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  };
  var stubArray = function() {
    return [];
  };
  var stubFalse = function() {
    return false;
  };
  var LARGE_ARRAY_SIZE = 200;
  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  var MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var boolTag = "[object Boolean]";
  var dateTag = "[object Date]";
  var errorTag = "[object Error]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var mapTag = "[object Map]";
  var numberTag = "[object Number]";
  var objectTag = "[object Object]";
  var promiseTag = "[object Promise]";
  var regexpTag = "[object RegExp]";
  var setTag = "[object Set]";
  var stringTag = "[object String]";
  var symbolTag = "[object Symbol]";
  var weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reFlags = /\w*$/;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var arrayProto = Array.prototype;
  var funcProto = Function.prototype;
  var objectProto = Object.prototype;
  var coreJsData = root["__core-js_shared__"];
  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString = funcProto.toString;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var objectToString = objectProto.toString;
  var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  var Buffer2 = moduleExports ? root.Buffer : undefined;
  var Symbol2 = root.Symbol;
  var Uint8Array2 = root.Uint8Array;
  var getPrototype = overArg(Object.getPrototypeOf, Object);
  var objectCreate = Object.create;
  var propertyIsEnumerable = objectProto.propertyIsEnumerable;
  var splice = arrayProto.splice;
  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined;
  var nativeKeys = overArg(Object.keys, Object);
  var DataView2 = getNative(root, "DataView");
  var Map2 = getNative(root, "Map");
  var Promise2 = getNative(root, "Promise");
  var Set2 = getNative(root, "Set");
  var WeakMap2 = getNative(root, "WeakMap");
  var nativeCreate = getNative(Object, "create");
  var dataViewCtorString = toSource(DataView2);
  var mapCtorString = toSource(Map2);
  var promiseCtorString = toSource(Promise2);
  var setCtorString = toSource(Set2);
  var weakMapCtorString = toSource(WeakMap2);
  var symbolProto = Symbol2 ? Symbol2.prototype : undefined;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
  var getTag = baseGetTag;
  if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2) != setTag || WeakMap2 && getTag(new WeakMap2) != weakMapTag) {
    getTag = function(value) {
      var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : undefined;
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  var isArray = Array.isArray;
  var isBuffer = nativeIsBuffer || stubFalse;
  module.exports = cloneDeep;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/schema.js
var typebox2, import_lodash, toOpenAPIPath, mapProperties, r3, capitalize, generateOperationId, registerSchemaPath;
var init_schema = __esm(() => {
  typebox2 = __toESM(require_typebox(), 1);
  import_lodash = __toESM(require_lodash(), 1);
  toOpenAPIPath = (e4) => e4.split("/").map((e5) => e5.startsWith(":") ? `{${e5.slice(1, e5.length)}}` : e5).join("/");
  mapProperties = (e4, t4, r3) => {
    if (t4 === undefined)
      return [];
    if (typeof t4 == "string") {
      if (t4 in r3)
        t4 = r3[t4];
      else
        throw Error(`Can't find model ${t4}`);
    }
    return Object.entries(t4?.properties ?? []).map(([r4, o]) => ({ ...o, in: e4, name: r4, type: o?.type, required: t4.required?.includes(r4) ?? false }));
  };
  r3 = (e4, t4) => {
    let r4 = {};
    for (let o of e4)
      r4[o] = { schema: typeof t4 == "string" ? { $ref: `#/components/schemas/${t4}` } : { ...t4 } };
    return r4;
  };
  capitalize = (e4) => e4.charAt(0).toUpperCase() + e4.slice(1);
  generateOperationId = (e4, t4) => {
    let r4 = e4.toLowerCase();
    if (t4 === "/")
      return r4 + "Index";
    for (let e5 of t4.split("/"))
      e5.charCodeAt(0) === 123 ? r4 += "By" + capitalize(e5.slice(1, -1)) : r4 += capitalize(e5);
    return r4;
  };
  registerSchemaPath = ({ schema: o, contentType: i = ["application/json", "multipart/form-data", "text/plain"], path: n, method: p, hook: s, models: a2 }) => {
    s && (s = import_lodash.default(s)), n = toOpenAPIPath(n);
    let c = typeof i == "string" ? [i] : i ?? ["application/json"], l = s?.body, d = s?.params, f = s?.headers, m = s?.query, h = s?.response;
    if (typeof h == "object") {
      if (typebox2.Kind in h) {
        let { type: e4, properties: t4, required: o2, ...i2 } = h;
        h = { 200: { ...i2, description: i2.description, content: r3(c, e4 === "object" || e4 === "array" ? { type: e4, properties: t4, required: o2 } : h) } };
      } else
        Object.entries(h).forEach(([e4, t4]) => {
          if (typeof t4 == "string") {
            let { type: o2, properties: i2, required: n2, ...p2 } = a2[t4];
            h[e4] = { ...p2, description: p2.description, content: r3(c, t4) };
          } else {
            let { type: o2, properties: i2, required: n2, ...p2 } = t4;
            h[e4] = { ...p2, description: p2.description, content: r3(c, { type: o2, properties: i2, required: n2 }) };
          }
        });
    } else if (typeof h == "string") {
      let { type: e4, properties: t4, required: o2, ...i2 } = a2[h];
      h = { 200: { ...i2, content: r3(c, h) } };
    }
    let y = [...mapProperties("header", f, a2), ...mapProperties("path", d, a2), ...mapProperties("query", m, a2)];
    o[n] = { ...o[n] ? o[n] : {}, [p.toLowerCase()]: { ...f || d || m || l ? { parameters: y } : {}, ...h ? { responses: h } : {}, operationId: s?.detail?.operationId ?? generateOperationId(p, n), ...s?.detail, ...l ? { requestBody: { content: r3(c, typeof l == "string" ? { $ref: `#/components/schemas/${l}` } : l) } } : null } };
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/fast-querystring@1.1.2/node_modules/fast-decode-uri-component/index.js
var require_fast_decode_uri_component = __commonJS((exports, module) => {
  var decodeURIComponent = function(uri) {
    var percentPosition = uri.indexOf("%");
    if (percentPosition === -1)
      return uri;
    var length = uri.length;
    var decoded = "";
    var last = 0;
    var codepoint = 0;
    var startOfOctets = percentPosition;
    var state = UTF8_ACCEPT;
    while (percentPosition > -1 && percentPosition < length) {
      var high = hexCodeToInt(uri[percentPosition + 1], 4);
      var low = hexCodeToInt(uri[percentPosition + 2], 0);
      var byte = high | low;
      var type = UTF8_DATA[byte];
      state = UTF8_DATA[256 + state + type];
      codepoint = codepoint << 6 | byte & UTF8_DATA[364 + type];
      if (state === UTF8_ACCEPT) {
        decoded += uri.slice(last, startOfOctets);
        decoded += codepoint <= 65535 ? String.fromCharCode(codepoint) : String.fromCharCode(55232 + (codepoint >> 10), 56320 + (codepoint & 1023));
        codepoint = 0;
        last = percentPosition + 3;
        percentPosition = startOfOctets = uri.indexOf("%", last);
      } else if (state === UTF8_REJECT) {
        return null;
      } else {
        percentPosition += 3;
        if (percentPosition < length && uri.charCodeAt(percentPosition) === 37)
          continue;
        return null;
      }
    }
    return decoded + uri.slice(last);
  };
  var hexCodeToInt = function(c, shift) {
    var i = HEX[c];
    return i === undefined ? 255 : i << shift;
  };
  var UTF8_ACCEPT = 12;
  var UTF8_REJECT = 0;
  var UTF8_DATA = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    3,
    4,
    4,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    5,
    6,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    7,
    8,
    7,
    7,
    10,
    9,
    9,
    9,
    11,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    12,
    0,
    0,
    0,
    0,
    24,
    36,
    48,
    60,
    72,
    84,
    96,
    0,
    12,
    12,
    12,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    24,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    24,
    24,
    24,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    24,
    24,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    48,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    127,
    63,
    63,
    63,
    0,
    31,
    15,
    15,
    15,
    7,
    7,
    7
  ];
  var HEX = {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    a: 10,
    A: 10,
    b: 11,
    B: 11,
    c: 12,
    C: 12,
    d: 13,
    D: 13,
    e: 14,
    E: 14,
    f: 15,
    F: 15
  };
  module.exports = decodeURIComponent;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/fast-querystring@1.1.2/node_modules/fast-querystring/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var parse = function(input) {
    const result = new Empty;
    if (typeof input !== "string") {
      return result;
    }
    let inputLength = input.length;
    let key = "";
    let value = "";
    let startingIndex = -1;
    let equalityIndex = -1;
    let shouldDecodeKey = false;
    let shouldDecodeValue = false;
    let keyHasPlus = false;
    let valueHasPlus = false;
    let hasBothKeyValuePair = false;
    let c = 0;
    for (let i = 0;i < inputLength + 1; i++) {
      c = i !== inputLength ? input.charCodeAt(i) : 38;
      if (c === 38) {
        hasBothKeyValuePair = equalityIndex > startingIndex;
        if (!hasBothKeyValuePair) {
          equalityIndex = i;
        }
        key = input.slice(startingIndex + 1, equalityIndex);
        if (hasBothKeyValuePair || key.length > 0) {
          if (keyHasPlus) {
            key = key.replace(plusRegex, " ");
          }
          if (shouldDecodeKey) {
            key = fastDecode(key) || key;
          }
          if (hasBothKeyValuePair) {
            value = input.slice(equalityIndex + 1, i);
            if (valueHasPlus) {
              value = value.replace(plusRegex, " ");
            }
            if (shouldDecodeValue) {
              value = fastDecode(value) || value;
            }
          }
          const currentValue = result[key];
          if (currentValue === undefined) {
            result[key] = value;
          } else {
            if (currentValue.pop) {
              currentValue.push(value);
            } else {
              result[key] = [currentValue, value];
            }
          }
        }
        value = "";
        startingIndex = i;
        equalityIndex = i;
        shouldDecodeKey = false;
        shouldDecodeValue = false;
        keyHasPlus = false;
        valueHasPlus = false;
      } else if (c === 61) {
        if (equalityIndex <= startingIndex) {
          equalityIndex = i;
        } else {
          shouldDecodeValue = true;
        }
      } else if (c === 43) {
        if (equalityIndex > startingIndex) {
          valueHasPlus = true;
        } else {
          keyHasPlus = true;
        }
      } else if (c === 37) {
        if (equalityIndex > startingIndex) {
          shouldDecodeValue = true;
        } else {
          shouldDecodeKey = true;
        }
      }
    }
    return result;
  };
  var fastDecode = require_fast_decode_uri_component();
  var plusRegex = /\+/g;
  var Empty = function() {
  };
  Empty.prototype = Object.create(null);
  module.exports = parse;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/fast-querystring@1.1.2/node_modules/fast-querystring/lib/internals/querystring.js
var require_querystring = __commonJS((exports, module) => {
  var encodeString = function(str) {
    const len = str.length;
    if (len === 0)
      return "";
    let out = "";
    let lastPos = 0;
    let i = 0;
    outer:
      for (;i < len; i++) {
        let c = str.charCodeAt(i);
        while (c < 128) {
          if (noEscape[c] !== 1) {
            if (lastPos < i)
              out += str.slice(lastPos, i);
            lastPos = i + 1;
            out += hexTable[c];
          }
          if (++i === len)
            break outer;
          c = str.charCodeAt(i);
        }
        if (lastPos < i)
          out += str.slice(lastPos, i);
        if (c < 2048) {
          lastPos = i + 1;
          out += hexTable[192 | c >> 6] + hexTable[128 | c & 63];
          continue;
        }
        if (c < 55296 || c >= 57344) {
          lastPos = i + 1;
          out += hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
          continue;
        }
        ++i;
        if (i >= len) {
          throw new Error("URI malformed");
        }
        const c2 = str.charCodeAt(i) & 1023;
        lastPos = i + 1;
        c = 65536 + ((c & 1023) << 10 | c2);
        out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
      }
    if (lastPos === 0)
      return str;
    if (lastPos < len)
      return out + str.slice(lastPos);
    return out;
  };
  var hexTable = Array.from({ length: 256 }, (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  var noEscape = new Int8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0,
    1,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    1,
    0
  ]);
  module.exports = { encodeString };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/fast-querystring@1.1.2/node_modules/fast-querystring/lib/stringify.js
var require_stringify = __commonJS((exports, module) => {
  var getAsPrimitive = function(value) {
    const type = typeof value;
    if (type === "string") {
      return encodeString(value);
    } else if (type === "bigint") {
      return value.toString();
    } else if (type === "boolean") {
      return value ? "true" : "false";
    } else if (type === "number" && Number.isFinite(value)) {
      return value < 1000000000000000000000 ? "" + value : encodeString("" + value);
    }
    return "";
  };
  var stringify = function(input) {
    let result = "";
    if (input === null || typeof input !== "object") {
      return result;
    }
    const separator = "&";
    const keys = Object.keys(input);
    const keyLength = keys.length;
    let valueLength = 0;
    for (let i = 0;i < keyLength; i++) {
      const key = keys[i];
      const value = input[key];
      const encodedKey = encodeString(key) + "=";
      if (i) {
        result += separator;
      }
      if (Array.isArray(value)) {
        valueLength = value.length;
        for (let j = 0;j < valueLength; j++) {
          if (j) {
            result += separator;
          }
          result += encodedKey;
          result += getAsPrimitive(value[j]);
        }
      } else {
        result += encodedKey;
        result += getAsPrimitive(value);
      }
    }
    return result;
  };
  var { encodeString } = require_querystring();
  module.exports = stringify;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/fast-querystring/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var parse = require_parse();
  var stringify = require_stringify();
  var fastQuerystring = {
    parse,
    stringify
  };
  module.exports = fastQuerystring;
  module.exports.default = fastQuerystring;
  module.exports.parse = parse;
  module.exports.stringify = stringify;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/handler.js
var isNotEmpty, e4, mapEarlyResponse, mapResponse, mapCompactResponse, errorToResponse;
var init_handler = __esm(() => {
  isNotEmpty = (e4) => {
    for (let s in e4)
      return true;
    return false;
  };
  e4 = (e5, s) => {
    e5.delete("Set-Cookie");
    for (let r4 = 0;r4 < s.length; r4++) {
      let n = s[r4].indexOf("=");
      e5.append("Set-Cookie", `${s[r4].slice(0, n)}=${s[r4].slice(n + 1)}`);
    }
    return e5;
  };
  mapEarlyResponse = (s, r4) => {
    if (isNotEmpty(r4.headers) || r4.status !== 200 || r4.redirect)
      switch (r4.redirect && (r4.headers.Location = r4.redirect, r4.status = 302), r4.headers["Set-Cookie"] && Array.isArray(r4.headers["Set-Cookie"]) && (r4.headers = e4(new Headers(r4.headers), r4.headers["Set-Cookie"])), s?.constructor?.name) {
        case "String":
        case "Blob":
          return new Response(s, r4);
        case "Object":
        case "Array":
          return Response.json(s, r4);
        case undefined:
          if (!s)
            return;
          return Response.json(s, r4);
        case "Response":
          for (let e5 in r4.headers)
            s.headers.append(e5, r4.headers[e5]);
          return s;
        case "Promise":
          return s.then((e5) => {
            let s2 = mapEarlyResponse(e5, r4);
            if (s2 !== undefined)
              return s2;
          });
        case "Error":
          return errorToResponse(s, r4.headers);
        case "Function":
          return s();
        case "Number":
        case "Boolean":
          return new Response(s.toString(), r4);
        default:
          if (s instanceof Response)
            return s;
          let n = JSON.stringify(s);
          if (n.charCodeAt(0) === 123)
            return r4.headers["Content-Type"] || (r4.headers["Content-Type"] = "application/json"), new Response(JSON.stringify(s), r4);
          return new Response(n, r4);
      }
    else
      switch (s?.constructor?.name) {
        case "String":
        case "Blob":
          return new Response(s);
        case "Object":
        case "Array":
          return new Response(JSON.stringify(s), { headers: { "content-type": "application/json" } });
        case undefined:
          if (!s)
            return new Response("");
          return new Response(JSON.stringify(s), { headers: { "content-type": "application/json" } });
        case "Response":
          return s;
        case "Promise":
          return s.then((e5) => {
            let s2 = mapEarlyResponse(e5, r4);
            if (s2 !== undefined)
              return s2;
          });
        case "Error":
          return errorToResponse(s, r4.headers);
        case "Function":
          return s();
        case "Number":
        case "Boolean":
          return new Response(s.toString());
        default:
          if (s instanceof Response)
            return s;
          let t4 = JSON.stringify(s);
          if (t4.charCodeAt(0) === 123)
            return new Response(JSON.stringify(s), { headers: { "Content-Type": "application/json" } });
          return new Response(t4);
      }
  };
  mapResponse = (s, r4) => {
    if (isNotEmpty(r4.headers) || r4.status !== 200 || r4.redirect)
      switch (r4.redirect && (r4.headers.Location = r4.redirect, r4.status = 302), r4.headers["Set-Cookie"] && Array.isArray(r4.headers["Set-Cookie"]) && (r4.headers = e4(new Headers(r4.headers), r4.headers["Set-Cookie"])), s?.constructor?.name) {
        case "String":
        case "Blob":
          return new Response(s, { status: r4.status, headers: r4.headers });
        case "Object":
        case "Array":
          return Response.json(s, r4);
        case undefined:
          if (!s)
            return new Response("", r4);
          return Response.json(s, r4);
        case "Response":
          for (let e5 in r4.headers)
            s.headers.append(e5, r4.headers[e5]);
          return s;
        case "Error":
          return errorToResponse(s, r4.headers);
        case "Promise":
          return s.then((e5) => mapResponse(e5, r4));
        case "Function":
          return s();
        case "Number":
        case "Boolean":
          return new Response(s.toString(), r4);
        default:
          if (s instanceof Response)
            return s;
          let n = JSON.stringify(s);
          if (n.charCodeAt(0) === 123)
            return r4.headers["Content-Type"] || (r4.headers["Content-Type"] = "application/json"), new Response(JSON.stringify(s), r4);
          return new Response(n, r4);
      }
    else
      switch (s?.constructor?.name) {
        case "String":
        case "Blob":
          return new Response(s);
        case "Object":
        case "Array":
          return new Response(JSON.stringify(s), { headers: { "content-type": "application/json" } });
        case undefined:
          if (!s)
            return new Response("");
          return new Response(JSON.stringify(s), { headers: { "content-type": "application/json" } });
        case "Response":
          return s;
        case "Error":
          return errorToResponse(s);
        case "Promise":
          return s.then((e5) => {
            let s2 = mapResponse(e5, r4);
            return s2 !== undefined ? s2 : new Response("");
          });
        case "Function":
          return s();
        case "Number":
        case "Boolean":
          return new Response(s.toString());
        default:
          if (s instanceof Response)
            return s;
          let t4 = JSON.stringify(s);
          if (t4.charCodeAt(0) === 123)
            return new Response(JSON.stringify(s), { headers: { "Content-Type": "application/json" } });
          return new Response(t4);
      }
  };
  mapCompactResponse = (e5) => {
    switch (e5?.constructor?.name) {
      case "String":
      case "Blob":
        return new Response(e5);
      case "Object":
      case "Array":
        return new Response(JSON.stringify(e5), { headers: { "content-type": "application/json" } });
      case undefined:
        if (!e5)
          return new Response("");
        return new Response(JSON.stringify(e5), { headers: { "content-type": "application/json" } });
      case "Response":
        return e5;
      case "Error":
        return errorToResponse(e5);
      case "Promise":
        return e5.then((e6) => {
          let s2 = mapCompactResponse(e6);
          return s2 !== undefined ? s2 : new Response("");
        });
      case "Function":
        return e5();
      case "Number":
      case "Boolean":
        return new Response(e5.toString());
      default:
        if (e5 instanceof Response)
          return e5;
        let s = JSON.stringify(e5);
        if (s.charCodeAt(0) === 123)
          return new Response(JSON.stringify(e5), { headers: { "Content-Type": "application/json" } });
        return new Response(s);
    }
  };
  errorToResponse = (e5, s) => new Response(JSON.stringify({ name: e5?.name, message: e5?.message, cause: e5?.cause }), { status: 500, headers: s });
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/error.js
class InternalServerError extends Error {
  code = "NOT_FOUND";
  status = 500;
  constructor() {
    super("INTERNAL_SERVER_ERROR");
  }
}

class NotFoundError extends Error {
  code = "NOT_FOUND";
  status = 404;
  constructor() {
    super("NOT_FOUND");
  }
}

class ValidationError extends Error {
  validator;
  value;
  code;
  status;
  constructor(r4, s, t4) {
    let e5 = s.Errors(t4).First();
    super(`Invalid ${r4}: '${e5?.path?.slice(1) || "root"}'. ${e5?.message}`), this.validator = s, this.value = t4, this.code = "VALIDATION", this.status = 400;
  }
  get all() {
    return [...this.validator.Errors(this.value)];
  }
  toResponse(r4) {
    return new Response(this.message, { status: 400, headers: r4 });
  }
}
var init_error = __esm(() => {
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/compose.js
var import_fast_querystring, i, f, u, d, hasReturn, p, isFnUse, findElysiaMeta, y, composeHandler, composeGeneralHandler, composeErrorHandler;
var init_compose = __esm(() => {
  import_fast_querystring = __toESM(require_lib(), 1);
  init_handler();
  init_utils();
  init_error();
  i = "AsyncFunction";
  f = (e6) => e6.constructor.name === i;
  u = new Headers;
  d = RegExp(" (\\w+) = context", "g");
  hasReturn = (e6) => {
    let r4 = e6.indexOf(")");
    return e6.charCodeAt(r4 + 2) === 61 && e6.charCodeAt(r4 + 5) !== 123 || e6.includes("return");
  };
  p = (e6) => ({ composeValidation: (r4, t4 = `c.${r4}`) => e6 ? `throw new ValidationError(
'${r4}',
${r4},
${t4}
)` : `return new ValidationError(
	'${r4}',
	${r4},
	${t4}
).toResponse(c.set.headers)`, composeResponseValidation: (r4 = "r") => e6 ? `throw new ValidationError(
'response',
response[c.set.status],
${r4}
)` : `return new ValidationError(
'response',
response[c.set.status],
${r4}
).toResponse(c.set.headers)` });
  isFnUse = (e6, r4) => {
    r4 = (r4 = r4.trimStart()).replaceAll(/^async /g, "");
    let t4 = r4.charCodeAt(0) === 40 || r4.startsWith("function") ? r4.slice(r4.indexOf("(") + 1, r4.indexOf(")")) : r4.slice(0, r4.indexOf("=") - 1);
    if (t4 === "")
      return false;
    if (t4.charCodeAt(0) === 123)
      return !!t4.includes(e6);
    if (r4.match(RegExp(`${t4}(.${e6}|\\["${e6}"\\])`)))
      return true;
    let s = [t4];
    for (let e7 of r4.matchAll(d))
      s.push(e7[1]);
    let n = RegExp(`{.*?} = (${s.join("|")})`, "g");
    for (let [t5] of r4.matchAll(n))
      if (t5.includes(`{ ${e6}`) || t5.includes(`, ${e6}`))
        return true;
    return false;
  };
  findElysiaMeta = (e6, r4, t4 = [], s = "") => {
    if (r4.type === "object") {
      let n = r4.properties;
      for (let r5 in n) {
        let o = n[r5], a2 = s ? s + "." + r5 : r5;
        if (o.type === "object") {
          findElysiaMeta(e6, o, t4, a2);
          continue;
        }
        if (o.anyOf) {
          for (let r6 of o.anyOf)
            findElysiaMeta(e6, r6, t4, a2);
          continue;
        }
        o.elysiaMeta === e6 && t4.push(a2);
      }
      return t4.length === 0 ? null : t4;
    }
    return r4?.elysiaMeta === e6 ? (s && t4.push(s), "root") : null;
  };
  y = (e6) => {
    if (!e6)
      return;
    let r4 = e6?.schema;
    if (r4 && ("anyOf" in r4)) {
      let e7 = false, t4 = r4.anyOf[0].type;
      for (let s of r4.anyOf)
        if (s.type !== t4) {
          e7 = true;
          break;
        }
      if (!e7)
        return t4;
    }
  };
  composeHandler = ({ method: d2, hooks: m, validator: h, handler: $, handleError: b, meta: q, onRequest: E, config: g }) => {
    let w = g.forceErrorEncapsulation || m.error.length > 0 || typeof Bun == "undefined", { composeValidation: x, composeResponseValidation: k } = p(w), H = w ? "try {\n" : "", R = h || d2 !== "GET" ? [$, ...m.transform, ...m.beforeHandle, ...m.afterHandle].map((e6) => e6.toString()) : [], v = d2 !== "GET" && m.type !== "none" && (h.body || m.type || R.some((e6) => isFnUse("body", e6))), O = h.headers || R.some((e6) => isFnUse("headers", e6));
    O && (H += u.toJSON ? `c.headers = c.request.headers.toJSON()
` : `c.headers = {}
                for (const [key, value] of c.request.headers.entries())
					c.headers[key] = value
				`);
    let S = h.query || R.some((e6) => isFnUse("query", e6));
    S && (H += `const url = c.request.url

		if(c.query !== -1) {
			c.query = parseQuery(url.substring(c.query + 1))
		} else {
			c.query = {}
		}
		`);
    let C = R.some((e6) => isFnUse("set", e6)) || E.some((e6) => isFnUse("set", e6.toString())), F = v || $.constructor.name === i || m.parse.length || m.afterHandle.find(f) || m.beforeHandle.find(f) || m.transform.find(f);
    if (v) {
      let e6 = y(h?.body);
      if (m.type || e6) {
        if (m.type)
          switch (m.type) {
            case "application/json":
              H += "c.body = JSON.parse(await c.request.text());";
              break;
            case "text/plain":
              H += "c.body = await c.request.text();";
              break;
            case "application/x-www-form-urlencoded":
              H += "c.body = parseQuery(await c.request.text());";
              break;
            case "application/octet-stream":
              H += "c.body = await c.request.arrayBuffer();";
              break;
            case "multipart/form-data":
              H += `c.body = {}

					const form = await c.request.formData()
					for (const key of form.keys()) {
						if (c.body[key])
							continue

						const value = form.getAll(key)
						if (value.length === 1)
							c.body[key] = value[0]
						else c.body[key] = value
					}`;
          }
        else if (e6) {
          let r4 = h?.body?.schema;
          e6 === "object" ? r4.elysiaMeta === "URLEncoded" ? H += "c.body = parseQuery(await c.request.text())" : h.body.Code().includes("custom('File") ? H += `c.body = {}

							const form = await c.request.formData()
							for (const key of form.keys()) {
								if (c.body[key])
									continue
		
								const value = form.getAll(key)
								if (value.length === 1)
									c.body[key] = value[0]
								else c.body[key] = value
							}` : H += "c.body = JSON.parse(await c.request.text())" : H += "c.body = await c.request.text()";
        }
        m.parse.length && (H += "}}");
      } else {
        if (H += "\n" + (O ? "let contentType = c.headers['content-type']" : "let contentType = c.request.headers.get('content-type')") + `
            if (contentType) {
				const index = contentType.indexOf(';')
				if (index !== -1) contentType = contentType.substring(0, index)
`, m.parse.length) {
          H += `let used = false
`;
          for (let e7 = 0;e7 < m.parse.length; e7++) {
            let r4 = `bo${e7}`;
            e7 !== 0 && (H += `if(!used) {
`), H += `let ${r4} = parse[${e7}](c, contentType);if(${r4} instanceof Promise) ${r4} = await ${r4};
						if(${r4} !== undefined) { c.body = ${r4}; used = true }
`, e7 !== 0 && (H += "}");
          }
          H += "if (!used)";
        }
        H += `switch (contentType) {
			case 'application/json':
				c.body = JSON.parse(await c.request.text())
				break

			case 'text/plain':
				c.body = await c.request.text()
				break

			case 'application/x-www-form-urlencoded':
				c.body = parseQuery(await c.request.text())
				break

			case 'application/octet-stream':
				c.body = await c.request.arrayBuffer();
				break

			case 'multipart/form-data':
				c.body = {}

				const form = await c.request.formData()
				for (const key of form.keys()) {
					if (c.body[key])
						continue

					const value = form.getAll(key)
					if (value.length === 1)
						c.body[key] = value[0]
					else c.body[key] = value
				}

				break
			}
		}
`;
      }
      H += "\n";
    }
    if (h.params) {
      let e6 = findElysiaMeta("Numeric", h.params.schema);
      if (e6) {
        if (typeof e6 == "object")
          for (let r4 of e6)
            H += `if(c.query.${r4}) c.params.${r4} = +c.params.${r4};`;
        H += "\n";
      }
    }
    if (h.query) {
      let e6 = findElysiaMeta("Numeric", h.query.schema);
      if (e6) {
        if (typeof e6 == "object")
          for (let r4 of e6)
            H += `if(c.query.${r4}) c.query.${r4} = +c.query.${r4};`;
        H += "\n";
      }
    }
    if (h.headers) {
      let e6 = findElysiaMeta("Numeric", h.headers.schema);
      if (e6) {
        if (typeof e6 == "object")
          for (let r4 of e6)
            H += `c.headers.${r4} = +c.headers.${r4};`;
        H += "\n";
      }
    }
    if (h.body) {
      let e6 = findElysiaMeta("Numeric", h.body.schema);
      if (e6) {
        switch (typeof e6) {
          case "string":
            H += "c.body = +c.body;";
            break;
          case "object":
            for (let r4 of e6)
              H += `c.body.${r4} = +c.body.${r4};`;
        }
        H += "\n";
      }
    }
    if (m?.transform)
      for (let e6 = 0;e6 < m.transform.length; e6++) {
        let r4 = m.transform[e6];
        r4.$elysia === "derive" ? H += m.transform[e6].constructor.name === i ? `Object.assign(c, await transform[${e6}](c));` : `Object.assign(c, transform[${e6}](c));` : H += m.transform[e6].constructor.name === i ? `await transform[${e6}](c);` : `transform[${e6}](c);`;
      }
    if (h && (h.headers && (H += `
                if (headers.Check(c.headers) === false) {
                    ${x("headers")}
				}
        `), h.params && (H += `if(params.Check(c.params) === false) { ${x("params")} }`), h.query && (H += `if(query.Check(c.query) === false) { ${x("query")} }`), h.body && (H += `if(body.Check(c.body) === false) { ${x("body")} }`)), m?.beforeHandle)
      for (let e6 = 0;e6 < m.beforeHandle.length; e6++) {
        let r4 = `be${e6}`, t4 = hasReturn(m.beforeHandle[e6].toString());
        if (t4) {
          if (H += (m.beforeHandle[e6].constructor.name === i ? `let ${r4} = await beforeHandle[${e6}](c);
` : `let ${r4} = beforeHandle[${e6}](c);
`) + `if(${r4} !== undefined) {
`, m?.afterHandle)
            for (let e7 = 0;e7 < m.afterHandle.length; e7++) {
              let t5 = hasReturn(m.afterHandle[e7].toString());
              if (t5) {
                let t6 = `af${e7}`;
                H += (m.afterHandle[e7].constructor.name === i ? `const ${t6} = await afterHandle[${e7}](c, ${r4});
` : `const ${t6} = afterHandle[${e7}](c, ${r4});
`) + `if(${t6} !== undefined) { ${r4} = ${t6} }
`;
              } else
                H += m.afterHandle[e7].constructor.name === i ? `await afterHandle[${e7}](c, ${r4});
` : `afterHandle[${e7}](c, ${r4});
`;
            }
          h.response && (H += `if(response[c.set.status]?.Check(${r4}) === false) { 
						if(!(response instanceof Error))
							${k(r4)}
					}
`), H += `return mapEarlyResponse(${r4}, c.set)}
`;
        } else
          H += m.beforeHandle[e6].constructor.name === i ? `await beforeHandle[${e6}](c);
` : `beforeHandle[${e6}](c);
`;
      }
    if (m?.afterHandle.length) {
      H += $.constructor.name === i ? `let r = await handler(c);
` : `let r = handler(c);
`;
      for (let e6 = 0;e6 < m.afterHandle.length; e6++) {
        let r4 = `af${e6}`, t4 = hasReturn(m.afterHandle[e6].toString());
        t4 ? (H += m.afterHandle[e6].constructor.name === i ? `let ${r4} = await afterHandle[${e6}](c, r)
` : `let ${r4} = afterHandle[${e6}](c, r)
`, h.response ? H += `if(${r4} !== undefined) {if(response[c.set.status]?.Check(${r4}) === false) { 
						if(!(response instanceof Error))
						${k(r4)}
					}
${r4} = mapEarlyResponse(${r4}, c.set)
if(${r4}) return ${r4};
}` : H += `if(${r4}) return ${r4};
`) : H += m.afterHandle[e6].constructor.name === i ? `await afterHandle[${e6}](c, r)
` : `afterHandle[${e6}](c, r)
`;
      }
      h.response && (H += `if(response[c.set.status]?.Check(r) === false) { 
				if(!(response instanceof Error))
					${k()}
			}
`), C ? H += `return mapResponse(r, c.set)
` : H += `return mapCompactResponse(r)
`;
    } else if (h.response)
      H += ($.constructor.name === i ? `const r = await handler(c);
` : `const r = handler(c);
`) + `if(response[c.set.status]?.Check(r) === false) { 
				if(!(response instanceof Error))
					${k()}
			}
`, C ? H += `return mapResponse(r, c.set)
` : H += `return mapCompactResponse(r)
`;
    else {
      let e6 = $.constructor.name === i ? "await handler(c) " : "handler(c)";
      C ? H += `return mapResponse(${e6}, c.set)
` : H += `return mapCompactResponse(${e6})
`;
    }
    w && (H += `
} catch(error) {
	

	${F ? "" : "return (async () => {"}
		const set = c.set

		if (!set.status || set.status < 300) set.status = 500

		${m.error.length ? `for (let i = 0; i < handleErrors.length; i++) {
				let handled = handleErrors[i]({
					request: c.request,
					error: error,
					set,
					code: error.code ?? "UNKNOWN"
				})
				if (handled instanceof Promise) handled = await handled

				const response = mapEarlyResponse(handled, set)
				if (response) return response
			}` : ""}

		return handleError(c.request, error, set)
	${F ? "" : "})()"}
}`), H = `const { 
		handler,
		handleError,
		hooks: {
			transform,
			beforeHandle,
			afterHandle,
			parse,
			error: handleErrors
		},
		validator: {
			body,
			headers,
			params,
			query,
			response
		},
		utils: {
			mapResponse,
			mapCompactResponse,
			mapEarlyResponse,
			parseQuery
		},
		error: {
			NotFoundError,
			ValidationError,
			InternalServerError
		},
		${q ? `
			meta,
			SCHEMA,
			DEFS,` : ""}
	} = hooks

	return ${F ? "async" : ""} function(c) {
		${q ? "c[SCHEMA] = meta[SCHEMA]; c[DEFS] = meta[DEFS];" : ""}
		${H}
	}`;
    let N = Function("hooks", H);
    return N({ handler: $, hooks: m, validator: h, handleError: b, utils: { mapResponse, mapCompactResponse, mapEarlyResponse, parseQuery: import_fast_querystring.parse }, error: { NotFoundError, ValidationError, InternalServerError }, meta: q, SCHEMA: q ? SCHEMA : undefined, DEFS: q ? DEFS : undefined });
  };
  composeGeneralHandler = (e6) => {
    let t4 = "";
    for (let r4 of Object.keys(e6.decorators))
      t4 += `,${r4}: app.decorators.${r4}`;
    let { router: s, staticRouter: n } = e6, o = `
	const route = find(request.method, path) ${s.root.ALL ? '?? find("ALL", path)' : ""}
	if (route === null)
		return ${e6.event.error.length ? `handleError(
			request,
			notFound,
			ctx.set
		)` : `new Response(error404, {
					status: 404
				})`}

	ctx.params = route.params

	return route.store(ctx)`, c = "";
    for (let [e7, { code: r4, all: t5 }] of Object.entries(n.map))
      c += `case '${e7}':
switch(request.method) {
${r4}
${t5 ?? `default: ${o}`}}

`;
    let l = `const {
		app,
		app: { store, router, staticRouter },
		mapEarlyResponse,
		NotFoundError
	} = data

	const notFound = new NotFoundError()

	${e6.event.request.length ? "const onRequest = app.event.request" : ""}

	${n.variables}

	const find = router.find.bind(router)
	const handleError = app.handleError.bind(this)

	${e6.event.error.length ? "" : "const error404 = notFound.message.toString()"}

	return function(request) {
	`;
    if (e6.event.request.length) {
      l += `
			const ctx = {
				request,
				store,
				set: {
					headers: {},
					status: 200
				}
				${t4}
			}

			try {
`;
      for (let r4 = 0;r4 < e6.event.request.length; r4++) {
        let t5 = hasReturn(e6.event.request[r4].toString());
        l += t5 ? `const response = mapEarlyResponse(
					onRequest[${r4}](ctx),
					ctx.set
				)
				if (response) return response
` : `mapEarlyResponse(onRequest[${r4}](ctx), ctx.set);`;
      }
      l += `} catch (error) {
			return handleError(request, error, ctx.set)
		}
		
		const url = request.url,
		s = url.indexOf('/', 12),
		i = ctx.query = url.indexOf('?', s + 1),
		path = i === -1 ? url.substring(s) : url.substring(s, i);`;
    } else
      l += `
			const url = request.url,
			s = url.indexOf('/', 12)

		const ctx = {
			request,
			store,
			query: url.indexOf('?', s + 1),
			set: {
				headers: {},
				status: 200
			}
			${t4}
		}

		const path =
			ctx.query === -1
				? url.substring(s)
				: url.substring(s, ctx.query);`;
    return l += `
		switch(path) {
			${c}

			default:
				${o}
		}
	}`, e6.handleError = composeErrorHandler(e6), Function("data", l)({ app: e6, mapEarlyResponse, NotFoundError });
  };
  composeErrorHandler = (e6) => {
    let r4 = `const {
		app: { event: { error: onError } },
		mapResponse
	} = inject
	
	return ${e6.event.error.find((e7) => e7.constructor.name === i) ? "async" : ""} function(request, error, set) {`;
    for (let t4 = 0;t4 < e6.event.error.length; t4++) {
      let s = e6.event.error[t4], n = `${s.constructor.name === i ? "await " : ""}onError[${t4}]({
			request,
			code: error.code ?? 'UNKNOWN',
			error,
			set
		})`;
      hasReturn(s.toString()) ? r4 += `const r${t4} = ${n}; if(r${t4} !== null) return mapResponse(r${t4}, set)
` : r4 += n + "\n";
    }
    return Function("inject", r4 += `return new Response(error.message, { headers: set.headers, status: error.status ?? 500 })
}`)({ app: e6, mapResponse });
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/ws/index.js
class ElysiaWS {
  raw;
  data;
  isSubscribed;
  constructor(e6) {
    this.raw = e6, this.data = e6.data, this.isSubscribed = e6.isSubscribed;
  }
  publish(e6, r4, s2) {
    return typeof r4 == "object" && (r4 = JSON.stringify(r4)), this.raw.publish(e6, r4, s2), this;
  }
  publishToSelf(e6, r4, s2) {
    return typeof r4 == "object" && (r4 = JSON.stringify(r4)), this.raw.publish(e6, r4, s2), this;
  }
  send(e6) {
    return typeof e6 == "object" && (e6 = JSON.stringify(e6)), this.raw.send(e6), this;
  }
  subscribe(e6) {
    return this.raw.subscribe(e6), this;
  }
  unsubscribe(e6) {
    return this.raw.unsubscribe(e6), this;
  }
  cork(e6) {
    return this.raw.cork(e6), this;
  }
  close() {
    return this.raw.close(), this;
  }
}
var s, ws;
var init_ws = __esm(() => {
  init_dist();
  init_error();
  s = (e6) => {
    let r4 = e6.indexOf("/", 10), s2 = e6.indexOf("?", r4);
    return s2 === -1 ? e6.slice(r4) : e6.slice(r4, s2);
  };
  ws = (t4) => (i2) => {
    i2.wsRouter || (i2.wsRouter = new Memoirist);
    let a2 = i2.wsRouter;
    return i2.config.serve || (i2.config.serve = { websocket: { ...t4, open(e6) {
      if (!e6.data)
        return;
      let r4 = s(e6?.data.request.url);
      if (!r4)
        return;
      let t5 = a2.find("subscribe", r4)?.store;
      t5 && t5.open && t5.open(new ElysiaWS(e6));
    }, message(e6, t5) {
      if (!e6.data)
        return;
      let i3 = s(e6?.data.request.url);
      if (!i3)
        return;
      let n = a2.find("subscribe", i3)?.store;
      if (!n?.message)
        return;
      t5 = t5.toString();
      let u2 = t5.charCodeAt(0);
      if (u2 === 47 || u2 === 123)
        try {
          t5 = JSON.parse(t5);
        } catch (e7) {
        }
      else
        Number.isNaN(+t5) || (t5 = +t5);
      for (let r4 = 0;r4 < e6.data.transformMessage.length; r4++) {
        let s2 = e6.data.transformMessage[r4](t5);
        s2 !== undefined && (t5 = s2);
      }
      if (e6.data.message?.Check(t5) === false)
        return void e6.send(new ValidationError("message", e6.data.message, t5).cause);
      n.message(new ElysiaWS(e6), t5);
    }, close(e6, r4, t5) {
      if (!e6.data)
        return;
      let i3 = s(e6?.data.request.url);
      if (!i3)
        return;
      let n = a2.find("subscribe", i3)?.store;
      n && n.close && n.close(new ElysiaWS(e6), r4, t5);
    }, drain(e6) {
      if (!e6.data)
        return;
      let r4 = s(e6?.data.request.url);
      if (!r4)
        return;
      let t5 = a2.find("subscribe", r4)?.store;
      t5 && t5.drain && t5.drain(new ElysiaWS(e6));
    } } }), i2.decorate("publish", i2.server?.publish).onStart((e6) => {
      e6.decorators.publish = e6.server?.publish;
    });
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/elysia/dist/custom-types.js
var typebox3, system, i2, r4, ElysiaType;
var init_custom_types = __esm(() => {
  typebox3 = __toESM(require_typebox(), 1);
  system = __toESM(require_system2(), 1);
  try {
    system.TypeSystem.Format("email", (e7) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(e7)), system.TypeSystem.Format("uuid", (e7) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e7)), system.TypeSystem.Format("date", (e7) => !Number.isNaN(new Date(e7).getTime())), system.TypeSystem.Format("date-time", (e7) => !Number.isNaN(new Date(e7).getTime()));
  } catch (e7) {
  }
  i2 = (e7) => {
    if (typeof e7 == "string")
      switch (e7.slice(-1)) {
        case "k":
          return 1024 * +e7.slice(0, e7.length - 1);
        case "m":
          return 1048576 * +e7.slice(0, e7.length - 1);
        default:
          return +e7;
      }
    return e7;
  };
  r4 = (e7, t5) => {
    if (!(t5 instanceof Blob) || e7.minSize && t5.size < i2(e7.minSize) || e7.maxSize && t5.size > i2(e7.maxSize))
      return false;
    if (e7.extension) {
      if (typeof e7.extension == "string") {
        if (!t5.type.startsWith(e7.extension))
          return false;
      } else {
        for (let i3 = 0;i3 < e7.extension.length; i3++)
          if (t5.type.startsWith(e7.extension[i3]))
            return true;
        return false;
      }
    }
    return true;
  };
  ElysiaType = { Numeric: system.TypeSystem.Type("Numeric", {}), File: system.TypeSystem.Type("File", r4), Files: system.TypeSystem.Type("Files", (e7, t5) => {
    if (!Array.isArray(t5) || e7.minItems && t5.length < e7.minItems || e7.maxItems && t5.length > e7.maxItems)
      return false;
    for (let i3 = 0;i3 < t5.length; i3++)
      if (!r4(e7, t5[i3]))
        return false;
    return true;
  }) };
  typebox3.Type.Numeric = (t5) => typebox3.Type.Number({ ...t5, elysiaMeta: "Numeric" }), typebox3.Type.URLEncoded = (t5, i3) => typebox3.Type.Object(t5, { ...i3, elysiaMeta: "URLEncoded" }), typebox3.Type.File = (e7) => ElysiaType.File({ elysiaMeta: "File", default: "File", ...e7, extension: e7?.type, type: "string", format: "binary" }), typebox3.Type.Files = (e7) => ElysiaType.Files({ ...e7, elysiaMeta: "Files", default: "Files", extension: e7?.type, type: "array", items: { ...e7, default: "Files", type: "string", format: "binary" } });
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/double-indexed-kv.js
var DoubleIndexedKV;
var init_double_indexed_kv = __esm(() => {
  DoubleIndexedKV = function() {
    function DoubleIndexedKV2() {
      this.keyToValue = new Map;
      this.valueToKey = new Map;
    }
    DoubleIndexedKV2.prototype.set = function(key, value) {
      this.keyToValue.set(key, value);
      this.valueToKey.set(value, key);
    };
    DoubleIndexedKV2.prototype.getByKey = function(key) {
      return this.keyToValue.get(key);
    };
    DoubleIndexedKV2.prototype.getByValue = function(value) {
      return this.valueToKey.get(value);
    };
    DoubleIndexedKV2.prototype.clear = function() {
      this.keyToValue.clear();
      this.valueToKey.clear();
    };
    return DoubleIndexedKV2;
  }();
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/registry.js
var Registry;
var init_registry = __esm(() => {
  init_double_indexed_kv();
  Registry = function() {
    function Registry2(generateIdentifier) {
      this.generateIdentifier = generateIdentifier;
      this.kv = new DoubleIndexedKV;
    }
    Registry2.prototype.register = function(value, identifier) {
      if (this.kv.getByValue(value)) {
        return;
      }
      if (!identifier) {
        identifier = this.generateIdentifier(value);
      }
      this.kv.set(identifier, value);
    };
    Registry2.prototype.clear = function() {
      this.kv.clear();
    };
    Registry2.prototype.getIdentifier = function(value) {
      return this.kv.getByValue(value);
    };
    Registry2.prototype.getValue = function(identifier) {
      return this.kv.getByKey(identifier);
    };
    return Registry2;
  }();
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/class-registry.js
var __extends, ClassRegistry;
var init_class_registry = __esm(() => {
  init_registry();
  __extends = function() {
    var extendStatics = function(d2, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b2) {
        d3.__proto__ = b2;
      } || function(d3, b2) {
        for (var p2 in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p2))
            d3[p2] = b2[p2];
      };
      return extendStatics(d2, b);
    };
    return function(d2, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d2, b);
      function __() {
        this.constructor = d2;
      }
      d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
    };
  }();
  ClassRegistry = function(_super) {
    __extends(ClassRegistry2, _super);
    function ClassRegistry2() {
      var _this = _super.call(this, function(c) {
        return c.name;
      }) || this;
      _this.classToAllowedProps = new Map;
      return _this;
    }
    ClassRegistry2.prototype.register = function(value, options) {
      if (typeof options === "object") {
        if (options.allowProps) {
          this.classToAllowedProps.set(value, options.allowProps);
        }
        _super.prototype.register.call(this, value, options.identifier);
      } else {
        _super.prototype.register.call(this, value, options);
      }
    };
    ClassRegistry2.prototype.getAllowedProps = function(value) {
      return this.classToAllowedProps.get(value);
    };
    return ClassRegistry2;
  }(Registry);
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/util.js
function find(record, predicate) {
  var values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  var valuesNotNever = values;
  for (var i3 = 0;i3 < valuesNotNever.length; i3++) {
    var value = valuesNotNever[i3];
    if (predicate(value)) {
      return value;
    }
  }
  return;
}
function forEach(record, run) {
  Object.entries(record).forEach(function(_a) {
    var _b = __read(_a, 2), key = _b[0], value = _b[1];
    return run(value, key);
  });
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (var i3 = 0;i3 < record.length; i3++) {
    var value = record[i3];
    if (predicate(value)) {
      return value;
    }
  }
  return;
}
var valuesOfObj, __read;
var init_util = __esm(() => {
  valuesOfObj = function(record) {
    if ("values" in Object) {
      return Object.values(record);
    }
    var values = [];
    for (var key in record) {
      if (record.hasOwnProperty(key)) {
        values.push(record[key]);
      }
    }
    return values;
  };
  __read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i3 = m.call(o), r5, ar = [], e7;
    try {
      while ((n === undefined || n-- > 0) && !(r5 = i3.next()).done)
        ar.push(r5.value);
    } catch (error3) {
      e7 = { error: error3 };
    } finally {
      try {
        if (r5 && !r5.done && (m = i3["return"]))
          m.call(i3);
      } finally {
        if (e7)
          throw e7.error;
      }
    }
    return ar;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/custom-transformer-registry.js
var CustomTransformerRegistry;
var init_custom_transformer_registry = __esm(() => {
  init_util();
  CustomTransformerRegistry = function() {
    function CustomTransformerRegistry2() {
      this.transfomers = {};
    }
    CustomTransformerRegistry2.prototype.register = function(transformer) {
      this.transfomers[transformer.name] = transformer;
    };
    CustomTransformerRegistry2.prototype.findApplicable = function(v) {
      return find(this.transfomers, function(transformer) {
        return transformer.isApplicable(v);
      });
    };
    CustomTransformerRegistry2.prototype.findByName = function(name) {
      return this.transfomers[name];
    };
    return CustomTransformerRegistry2;
  }();
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/is.js
var getType, isUndefined, isNull, isPlainObject, isEmptyObject, isArray, isString, isNumber, isBoolean, isRegExp, isMap, isSet, isSymbol, isDate, isError, isNaNValue, isPrimitive, isBigint, isInfinite, isTypedArray, isURL;
var init_is = __esm(() => {
  getType = function(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
  };
  isUndefined = function(payload) {
    return typeof payload === "undefined";
  };
  isNull = function(payload) {
    return payload === null;
  };
  isPlainObject = function(payload) {
    if (typeof payload !== "object" || payload === null)
      return false;
    if (payload === Object.prototype)
      return false;
    if (Object.getPrototypeOf(payload) === null)
      return true;
    return Object.getPrototypeOf(payload) === Object.prototype;
  };
  isEmptyObject = function(payload) {
    return isPlainObject(payload) && Object.keys(payload).length === 0;
  };
  isArray = function(payload) {
    return Array.isArray(payload);
  };
  isString = function(payload) {
    return typeof payload === "string";
  };
  isNumber = function(payload) {
    return typeof payload === "number" && !isNaN(payload);
  };
  isBoolean = function(payload) {
    return typeof payload === "boolean";
  };
  isRegExp = function(payload) {
    return payload instanceof RegExp;
  };
  isMap = function(payload) {
    return payload instanceof Map;
  };
  isSet = function(payload) {
    return payload instanceof Set;
  };
  isSymbol = function(payload) {
    return getType(payload) === "Symbol";
  };
  isDate = function(payload) {
    return payload instanceof Date && !isNaN(payload.valueOf());
  };
  isError = function(payload) {
    return payload instanceof Error;
  };
  isNaNValue = function(payload) {
    return typeof payload === "number" && isNaN(payload);
  };
  isPrimitive = function(payload) {
    return isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
  };
  isBigint = function(payload) {
    return typeof payload === "bigint";
  };
  isInfinite = function(payload) {
    return payload === Infinity || payload === (-Infinity);
  };
  isTypedArray = function(payload) {
    return ArrayBuffer.isView(payload) && !(payload instanceof DataView);
  };
  isURL = function(payload) {
    return payload instanceof URL;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/pathstringifier.js
var escapeKey, stringifyPath, parsePath;
var init_pathstringifier = __esm(() => {
  escapeKey = function(key) {
    return key.replace(/\./g, "\\.");
  };
  stringifyPath = function(path) {
    return path.map(String).map(escapeKey).join(".");
  };
  parsePath = function(string) {
    var result = [];
    var segment = "";
    for (var i3 = 0;i3 < string.length; i3++) {
      var char = string.charAt(i3);
      var isEscapedDot = char === "\\" && string.charAt(i3 + 1) === ".";
      if (isEscapedDot) {
        segment += ".";
        i3++;
        continue;
      }
      var isEndOfSegment = char === ".";
      if (isEndOfSegment) {
        result.push(segment);
        segment = "";
        continue;
      }
      segment += char;
    }
    var lastSegment = segment;
    result.push(lastSegment);
    return result;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/transformer.js
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass === null || potentialClass === undefined ? undefined : potentialClass.constructor) {
    var isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var simpleTransformation, compositeTransformation, __assign, __read2, __spreadArray, simpleRules, symbolRule, constructorToName, typedArrayRule, classRule, customRule, compositeRules, transformValue, simpleRulesByAnnotation, untransformValue;
var init_transformer = __esm(() => {
  init_is();
  init_util();
  simpleTransformation = function(isApplicable, annotation, transform, untransform) {
    return {
      isApplicable,
      annotation,
      transform,
      untransform
    };
  };
  compositeTransformation = function(isApplicable, annotation, transform, untransform) {
    return {
      isApplicable,
      annotation,
      transform,
      untransform
    };
  };
  __assign = function() {
    __assign = Object.assign || function(t5) {
      for (var s2, i3 = 1, n = arguments.length;i3 < n; i3++) {
        s2 = arguments[i3];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t5[p2] = s2[p2];
      }
      return t5;
    };
    return __assign.apply(this, arguments);
  };
  __read2 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i3 = m.call(o), r5, ar = [], e7;
    try {
      while ((n === undefined || n-- > 0) && !(r5 = i3.next()).done)
        ar.push(r5.value);
    } catch (error3) {
      e7 = { error: error3 };
    } finally {
      try {
        if (r5 && !r5.done && (m = i3["return"]))
          m.call(i3);
      } finally {
        if (e7)
          throw e7.error;
      }
    }
    return ar;
  };
  __spreadArray = function(to, from) {
    for (var i3 = 0, il = from.length, j = to.length;i3 < il; i3++, j++)
      to[j] = from[i3];
    return to;
  };
  simpleRules = [
    simpleTransformation(isUndefined, "undefined", function() {
      return null;
    }, function() {
      return;
    }),
    simpleTransformation(isBigint, "bigint", function(v) {
      return v.toString();
    }, function(v) {
      if (typeof BigInt !== "undefined") {
        return BigInt(v);
      }
      console.error("Please add a BigInt polyfill.");
      return v;
    }),
    simpleTransformation(isDate, "Date", function(v) {
      return v.toISOString();
    }, function(v) {
      return new Date(v);
    }),
    simpleTransformation(isError, "Error", function(v, superJson) {
      var baseError = {
        name: v.name,
        message: v.message
      };
      superJson.allowedErrorProps.forEach(function(prop) {
        baseError[prop] = v[prop];
      });
      return baseError;
    }, function(v, superJson) {
      var e7 = new Error(v.message);
      e7.name = v.name;
      e7.stack = v.stack;
      superJson.allowedErrorProps.forEach(function(prop) {
        e7[prop] = v[prop];
      });
      return e7;
    }),
    simpleTransformation(isRegExp, "regexp", function(v) {
      return "" + v;
    }, function(regex) {
      var body = regex.slice(1, regex.lastIndexOf("/"));
      var flags = regex.slice(regex.lastIndexOf("/") + 1);
      return new RegExp(body, flags);
    }),
    simpleTransformation(isSet, "set", function(v) {
      return __spreadArray([], __read2(v.values()));
    }, function(v) {
      return new Set(v);
    }),
    simpleTransformation(isMap, "map", function(v) {
      return __spreadArray([], __read2(v.entries()));
    }, function(v) {
      return new Map(v);
    }),
    simpleTransformation(function(v) {
      return isNaNValue(v) || isInfinite(v);
    }, "number", function(v) {
      if (isNaNValue(v)) {
        return "NaN";
      }
      if (v > 0) {
        return "Infinity";
      } else {
        return "-Infinity";
      }
    }, Number),
    simpleTransformation(function(v) {
      return v === 0 && 1 / v === (-Infinity);
    }, "number", function() {
      return "-0";
    }, Number),
    simpleTransformation(isURL, "URL", function(v) {
      return v.toString();
    }, function(v) {
      return new URL(v);
    })
  ];
  symbolRule = compositeTransformation(function(s2, superJson) {
    if (isSymbol(s2)) {
      var isRegistered = !!superJson.symbolRegistry.getIdentifier(s2);
      return isRegistered;
    }
    return false;
  }, function(s2, superJson) {
    var identifier = superJson.symbolRegistry.getIdentifier(s2);
    return ["symbol", identifier];
  }, function(v) {
    return v.description;
  }, function(_, a2, superJson) {
    var value = superJson.symbolRegistry.getValue(a2[1]);
    if (!value) {
      throw new Error("Trying to deserialize unknown symbol");
    }
    return value;
  });
  constructorToName = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    Uint8ClampedArray
  ].reduce(function(obj, ctor) {
    obj[ctor.name] = ctor;
    return obj;
  }, {});
  typedArrayRule = compositeTransformation(isTypedArray, function(v) {
    return ["typed-array", v.constructor.name];
  }, function(v) {
    return __spreadArray([], __read2(v));
  }, function(v, a2) {
    var ctor = constructorToName[a2[1]];
    if (!ctor) {
      throw new Error("Trying to deserialize unknown typed array");
    }
    return new ctor(v);
  });
  classRule = compositeTransformation(isInstanceOfRegisteredClass, function(clazz, superJson) {
    var identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
    return ["class", identifier];
  }, function(clazz, superJson) {
    var allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
    if (!allowedProps) {
      return __assign({}, clazz);
    }
    var result = {};
    allowedProps.forEach(function(prop) {
      result[prop] = clazz[prop];
    });
    return result;
  }, function(v, a2, superJson) {
    var clazz = superJson.classRegistry.getValue(a2[1]);
    if (!clazz) {
      throw new Error("Trying to deserialize unknown class - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564");
    }
    return Object.assign(Object.create(clazz.prototype), v);
  });
  customRule = compositeTransformation(function(value, superJson) {
    return !!superJson.customTransformerRegistry.findApplicable(value);
  }, function(value, superJson) {
    var transformer = superJson.customTransformerRegistry.findApplicable(value);
    return ["custom", transformer.name];
  }, function(value, superJson) {
    var transformer = superJson.customTransformerRegistry.findApplicable(value);
    return transformer.serialize(value);
  }, function(v, a2, superJson) {
    var transformer = superJson.customTransformerRegistry.findByName(a2[1]);
    if (!transformer) {
      throw new Error("Trying to deserialize unknown custom value");
    }
    return transformer.deserialize(v);
  });
  compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
  transformValue = function(value, superJson) {
    var applicableCompositeRule = findArr(compositeRules, function(rule) {
      return rule.isApplicable(value, superJson);
    });
    if (applicableCompositeRule) {
      return {
        value: applicableCompositeRule.transform(value, superJson),
        type: applicableCompositeRule.annotation(value, superJson)
      };
    }
    var applicableSimpleRule = findArr(simpleRules, function(rule) {
      return rule.isApplicable(value, superJson);
    });
    if (applicableSimpleRule) {
      return {
        value: applicableSimpleRule.transform(value, superJson),
        type: applicableSimpleRule.annotation
      };
    }
    return;
  };
  simpleRulesByAnnotation = {};
  simpleRules.forEach(function(rule) {
    simpleRulesByAnnotation[rule.annotation] = rule;
  });
  untransformValue = function(json, type, superJson) {
    if (isArray(type)) {
      switch (type[0]) {
        case "symbol":
          return symbolRule.untransform(json, type, superJson);
        case "class":
          return classRule.untransform(json, type, superJson);
        case "custom":
          return customRule.untransform(json, type, superJson);
        case "typed-array":
          return typedArrayRule.untransform(json, type, superJson);
        default:
          throw new Error("Unknown transformation: " + type);
      }
    } else {
      var transformation = simpleRulesByAnnotation[type];
      if (!transformation) {
        throw new Error("Unknown transformation: " + type);
      }
      return transformation.untransform(json, superJson);
    }
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/accessDeep.js
var validatePath, getNthKey, getDeep, setDeep;
var init_accessDeep = __esm(() => {
  init_is();
  init_util();
  validatePath = function(path) {
    if (includes(path, "__proto__")) {
      throw new Error("__proto__ is not allowed as a property");
    }
    if (includes(path, "prototype")) {
      throw new Error("prototype is not allowed as a property");
    }
    if (includes(path, "constructor")) {
      throw new Error("constructor is not allowed as a property");
    }
  };
  getNthKey = function(value, n) {
    var keys = value.keys();
    while (n > 0) {
      keys.next();
      n--;
    }
    return keys.next().value;
  };
  getDeep = function(object, path) {
    validatePath(path);
    for (var i3 = 0;i3 < path.length; i3++) {
      var key = path[i3];
      if (isSet(object)) {
        object = getNthKey(object, +key);
      } else if (isMap(object)) {
        var row = +key;
        var type = +path[++i3] === 0 ? "key" : "value";
        var keyOfRow = getNthKey(object, row);
        switch (type) {
          case "key":
            object = keyOfRow;
            break;
          case "value":
            object = object.get(keyOfRow);
            break;
        }
      } else {
        object = object[key];
      }
    }
    return object;
  };
  setDeep = function(object, path, mapper) {
    validatePath(path);
    if (path.length === 0) {
      return mapper(object);
    }
    var parent = object;
    for (var i3 = 0;i3 < path.length - 1; i3++) {
      var key = path[i3];
      if (isArray(parent)) {
        var index = +key;
        parent = parent[index];
      } else if (isPlainObject(parent)) {
        parent = parent[key];
      } else if (isSet(parent)) {
        var row = +key;
        parent = getNthKey(parent, row);
      } else if (isMap(parent)) {
        var isEnd = i3 === path.length - 2;
        if (isEnd) {
          break;
        }
        var row = +key;
        var type = +path[++i3] === 0 ? "key" : "value";
        var keyOfRow = getNthKey(parent, row);
        switch (type) {
          case "key":
            parent = keyOfRow;
            break;
          case "value":
            parent = parent.get(keyOfRow);
            break;
        }
      }
    }
    var lastKey = path[path.length - 1];
    if (isArray(parent)) {
      parent[+lastKey] = mapper(parent[+lastKey]);
    } else if (isPlainObject(parent)) {
      parent[lastKey] = mapper(parent[lastKey]);
    }
    if (isSet(parent)) {
      var oldValue = getNthKey(parent, +lastKey);
      var newValue = mapper(oldValue);
      if (oldValue !== newValue) {
        parent["delete"](oldValue);
        parent.add(newValue);
      }
    }
    if (isMap(parent)) {
      var row = +path[path.length - 2];
      var keyToRow = getNthKey(parent, row);
      var type = +lastKey === 0 ? "key" : "value";
      switch (type) {
        case "key": {
          var newKey = mapper(keyToRow);
          parent.set(newKey, parent.get(keyToRow));
          if (newKey !== keyToRow) {
            parent["delete"](keyToRow);
          }
          break;
        }
        case "value": {
          parent.set(keyToRow, mapper(parent.get(keyToRow)));
          break;
        }
      }
    }
    return object;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/superjson/dist/esm/plainer.js
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, function(type, path) {
    plain = setDeep(plain, path, function(v) {
      return untransformValue(v, type, superJson);
    });
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    var object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach(function(identicalObjectPath) {
      plain = setDeep(plain, identicalObjectPath, function() {
        return object;
      });
    });
  }
  if (isArray(annotations)) {
    var _a = __read3(annotations, 2), root = _a[0], other = _a[1];
    root.forEach(function(identicalPath) {
      plain = setDeep(plain, parsePath(identicalPath), function() {
        return plain;
      });
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
function generateReferentialEqualityAnnotations(identitites) {
  var result = {};
  var rootEqualityPaths = undefined;
  identitites.forEach(function(paths) {
    if (paths.length <= 1) {
      return;
    }
    var _a = __read3(paths.map(function(path) {
      return path.map(String);
    }).sort(function(a2, b) {
      return a2.length - b.length;
    })), shortestPath = _a[0], identicalPaths = _a.slice(1);
    if (shortestPath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(shortestPath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? undefined : result;
  }
}
var traverse, addIdentity, __read3, __spreadArray2, isDeep, walker;
var init_plainer = __esm(() => {
  init_is();
  init_pathstringifier();
  init_transformer();
  init_util();
  init_pathstringifier();
  init_accessDeep();
  traverse = function(tree, walker, origin) {
    if (origin === undefined) {
      origin = [];
    }
    if (!tree) {
      return;
    }
    if (!isArray(tree)) {
      forEach(tree, function(subtree, key) {
        return traverse(subtree, walker, __spreadArray2(__spreadArray2([], __read3(origin)), __read3(parsePath(key))));
      });
      return;
    }
    var _a = __read3(tree, 2), nodeValue = _a[0], children = _a[1];
    if (children) {
      forEach(children, function(child, key) {
        traverse(child, walker, __spreadArray2(__spreadArray2([], __read3(origin)), __read3(parsePath(key))));
      });
    }
    walker(nodeValue, origin);
  };
  addIdentity = function(object, path, identities) {
    var existingSet = identities.get(object);
    if (existingSet) {
      existingSet.push(path);
    } else {
      identities.set(object, [path]);
    }
  };
  __read3 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i3 = m.call(o), r5, ar = [], e7;
    try {
      while ((n === undefined || n-- > 0) && !(r5 = i3.next()).done)
        ar.push(r5.value);
    } catch (error3) {
      e7 = { error: error3 };
    } finally {
      try {
        if (r5 && !r5.done && (m = i3["return"]))
          m.call(i3);
      } finally {
        if (e7)
          throw e7.error;
      }
    }
    return ar;
  };
  __spreadArray2 = function(to, from) {
    for (var i3 = 0, il = from.length, j = to.length;i3 < il; i3++, j++)
      to[j] = from[i3];
    return to;
  };
  isDeep = function(object, superJson) {
    return isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
  };
  walker = function(object, identities, superJson, dedupe, path, objectsInThisPath, seenObjects) {
    var _a;
    if (path === undefined) {
      path = [];
    }
    if (objectsInThisPath === undefined) {
      objectsInThisPath = [];
    }
    if (seenObjects === undefined) {
      seenObjects = new Map;
    }
    var primitive = isPrimitive(object);
    if (!primitive) {
      addIdentity(object, path, identities);
      var seen = seenObjects.get(object);
      if (seen) {
        return dedupe ? {
          transformedValue: null
        } : seen;
      }
    }
    if (!isDeep(object, superJson)) {
      var transformed_1 = transformValue(object, superJson);
      var result_1 = transformed_1 ? {
        transformedValue: transformed_1.value,
        annotations: [transformed_1.type]
      } : {
        transformedValue: object
      };
      if (!primitive) {
        seenObjects.set(object, result_1);
      }
      return result_1;
    }
    if (includes(objectsInThisPath, object)) {
      return {
        transformedValue: null
      };
    }
    var transformationResult = transformValue(object, superJson);
    var transformed = (_a = transformationResult === null || transformationResult === undefined ? undefined : transformationResult.value) !== null && _a !== undefined ? _a : object;
    var transformedValue = isArray(transformed) ? [] : {};
    var innerAnnotations = {};
    forEach(transformed, function(value, index) {
      var recursiveResult = walker(value, identities, superJson, dedupe, __spreadArray2(__spreadArray2([], __read3(path)), [index]), __spreadArray2(__spreadArray2([], __read3(objectsInThisPath)), [object]), seenObjects);
      transformedValue[index] = recursiveResult.transformedValue;
      if (isArray(recursiveResult.annotations)) {
        innerAnnotations[index] = recursiveResult.annotations;
      } else if (isPlainObject(recursiveResult.annotations)) {
        forEach(recursiveResult.annotations, function(tree, key) {
          innerAnnotations[escapeKey(index) + "." + key] = tree;
        });
      }
    });
    var result = isEmptyObject(innerAnnotations) ? {
      transformedValue,
      annotations: transformationResult ? [transformationResult.type] : undefined
    } : {
      transformedValue,
      annotations: transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
    };
    if (!primitive) {
      seenObjects.set(object, result);
    }
    return result;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/copy-anything@3.0.5/node_modules/is-what/dist/index.js
var getType2, isUndefined2, isNull2, isPlainObject2, isArray2, isOneOf, isNullOrUndefined;
var init_dist2 = __esm(() => {
  getType2 = function(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
  };
  isUndefined2 = function(payload) {
    return getType2(payload) === "Undefined";
  };
  isNull2 = function(payload) {
    return getType2(payload) === "Null";
  };
  isPlainObject2 = function(payload) {
    if (getType2(payload) !== "Object")
      return false;
    const prototype = Object.getPrototypeOf(payload);
    return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
  };
  isArray2 = function(payload) {
    return getType2(payload) === "Array";
  };
  isOneOf = function(a2, b, c, d2, e7) {
    return (value) => a2(value) || b(value) || !!c && c(value) || !!d2 && d2(value) || !!e7 && e7(value);
  };
  isNullOrUndefined = isOneOf(isNull2, isUndefined2);
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/superjson@1.13.1/node_modules/copy-anything/dist/index.js
var assignProp, copy;
var init_dist3 = __esm(() => {
  init_dist2();
  assignProp = function(carry, key, newVal, originalObject, includeNonenumerable) {
    const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
    if (propType === "enumerable")
      carry[key] = newVal;
    if (includeNonenumerable && propType === "nonenumerable") {
      Object.defineProperty(carry, key, {
        value: newVal,
        enumerable: false,
        writable: true,
        configurable: true
      });
    }
  };
  copy = function(target, options = {}) {
    if (isArray2(target)) {
      return target.map((item) => copy(item, options));
    }
    if (!isPlainObject2(target)) {
      return target;
    }
    const props = Object.getOwnPropertyNames(target);
    const symbols = Object.getOwnPropertySymbols(target);
    return [...props, ...symbols].reduce((carry, key) => {
      if (isArray2(options.props) && !options.props.includes(key)) {
        return carry;
      }
      const val = target[key];
      const newVal = copy(val, options);
      assignProp(carry, key, newVal, target, options.nonenumerable);
      return carry;
    }, {});
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/node_modules/superjson/dist/esm/index.js
var __assign2, __read4, __spreadArray3, SuperJSON, serialize, deserialize, stringify, parse, registerClass, registerCustom, registerSymbol, allowErrorProps;
var init_esm = __esm(() => {
  init_class_registry();
  init_registry();
  init_custom_transformer_registry();
  init_plainer();
  init_dist3();
  __assign2 = function() {
    __assign2 = Object.assign || function(t5) {
      for (var s2, i3 = 1, n = arguments.length;i3 < n; i3++) {
        s2 = arguments[i3];
        for (var p2 in s2)
          if (Object.prototype.hasOwnProperty.call(s2, p2))
            t5[p2] = s2[p2];
      }
      return t5;
    };
    return __assign2.apply(this, arguments);
  };
  __read4 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m)
      return o;
    var i3 = m.call(o), r5, ar = [], e7;
    try {
      while ((n === undefined || n-- > 0) && !(r5 = i3.next()).done)
        ar.push(r5.value);
    } catch (error3) {
      e7 = { error: error3 };
    } finally {
      try {
        if (r5 && !r5.done && (m = i3["return"]))
          m.call(i3);
      } finally {
        if (e7)
          throw e7.error;
      }
    }
    return ar;
  };
  __spreadArray3 = function(to, from) {
    for (var i3 = 0, il = from.length, j = to.length;i3 < il; i3++, j++)
      to[j] = from[i3];
    return to;
  };
  SuperJSON = function() {
    function SuperJSON2(_a) {
      var _b = _a === undefined ? {} : _a, _c = _b.dedupe, dedupe = _c === undefined ? false : _c;
      this.classRegistry = new ClassRegistry;
      this.symbolRegistry = new Registry(function(s2) {
        var _a2;
        return (_a2 = s2.description) !== null && _a2 !== undefined ? _a2 : "";
      });
      this.customTransformerRegistry = new CustomTransformerRegistry;
      this.allowedErrorProps = [];
      this.dedupe = dedupe;
    }
    SuperJSON2.prototype.serialize = function(object) {
      var identities = new Map;
      var output = walker(object, identities, this, this.dedupe);
      var res = {
        json: output.transformedValue
      };
      if (output.annotations) {
        res.meta = __assign2(__assign2({}, res.meta), { values: output.annotations });
      }
      var equalityAnnotations = generateReferentialEqualityAnnotations(identities);
      if (equalityAnnotations) {
        res.meta = __assign2(__assign2({}, res.meta), { referentialEqualities: equalityAnnotations });
      }
      return res;
    };
    SuperJSON2.prototype.deserialize = function(payload) {
      var { json, meta } = payload;
      var result = copy(json);
      if (meta === null || meta === undefined ? undefined : meta.values) {
        result = applyValueAnnotations(result, meta.values, this);
      }
      if (meta === null || meta === undefined ? undefined : meta.referentialEqualities) {
        result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
      }
      return result;
    };
    SuperJSON2.prototype.stringify = function(object) {
      return JSON.stringify(this.serialize(object));
    };
    SuperJSON2.prototype.parse = function(string) {
      return this.deserialize(JSON.parse(string));
    };
    SuperJSON2.prototype.registerClass = function(v, options) {
      this.classRegistry.register(v, options);
    };
    SuperJSON2.prototype.registerSymbol = function(v, identifier) {
      this.symbolRegistry.register(v, identifier);
    };
    SuperJSON2.prototype.registerCustom = function(transformer2, name) {
      this.customTransformerRegistry.register(__assign2({ name }, transformer2));
    };
    SuperJSON2.prototype.allowErrorProps = function() {
      var _a;
      var props = [];
      for (var _i = 0;_i < arguments.length; _i++) {
        props[_i] = arguments[_i];
      }
      (_a = this.allowedErrorProps).push.apply(_a, __spreadArray3([], __read4(props)));
    };
    SuperJSON2.defaultInstance = new SuperJSON2;
    SuperJSON2.serialize = SuperJSON2.defaultInstance.serialize.bind(SuperJSON2.defaultInstance);
    SuperJSON2.deserialize = SuperJSON2.defaultInstance.deserialize.bind(SuperJSON2.defaultInstance);
    SuperJSON2.stringify = SuperJSON2.defaultInstance.stringify.bind(SuperJSON2.defaultInstance);
    SuperJSON2.parse = SuperJSON2.defaultInstance.parse.bind(SuperJSON2.defaultInstance);
    SuperJSON2.registerClass = SuperJSON2.defaultInstance.registerClass.bind(SuperJSON2.defaultInstance);
    SuperJSON2.registerSymbol = SuperJSON2.defaultInstance.registerSymbol.bind(SuperJSON2.defaultInstance);
    SuperJSON2.registerCustom = SuperJSON2.defaultInstance.registerCustom.bind(SuperJSON2.defaultInstance);
    SuperJSON2.allowErrorProps = SuperJSON2.defaultInstance.allowErrorProps.bind(SuperJSON2.defaultInstance);
    return SuperJSON2;
  }();
  serialize = SuperJSON.serialize;
  deserialize = SuperJSON.deserialize;
  stringify = SuperJSON.stringify;
  parse = SuperJSON.parse;
  registerClass = SuperJSON.registerClass;
  registerCustom = SuperJSON.registerCustom;
  registerSymbol = SuperJSON.registerSymbol;
  allowErrorProps = SuperJSON.allowErrorProps;
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@elysiajs+fn@0.5.2_elysia@0.5.23/node_modules/@elysiajs/fn/dist/utils.js
var permission, runFn, isObject, mergeDeep2;
var init_utils2 = __esm(() => {
  init_dist5();
  init_esm();
  permission = ({ value, allow, deny, check = true }) => ({
    [EXPOSED]: true,
    value,
    check,
    allow,
    deny
  });
  runFn = async (context, exposed) => {
    const results = [];
    const body = context.body ?? [];
    if (!body)
      return [];
    batch:
      for (let i3 = 0;i3 < body.length; i3++) {
        const procedure = body[i3];
        let method = exposed;
        const names = procedure.n;
        if (!Array.isArray(procedure.n)) {
          results.push(new Error("Invalid procedure"));
          continue batch;
        }
        let caller = names[names.length - 1];
        if (names.length === 1) {
          if ((caller in method) && (EXPOSED in method[caller])) {
            if (method[caller].check == false) {
              results.push(new Error("Forbidden"));
              continue batch;
            } else if (method[caller].check !== true) {
              try {
                const allowance = method[caller].check({
                  ...context,
                  key: caller,
                  params: procedure.p ?? null,
                  match(_) {
                  }
                });
                if (allowance instanceof Error) {
                  results.push(allowance);
                  continue batch;
                }
              } catch (error3) {
                results.push(error3);
                continue batch;
              }
              method = method[caller];
              caller = "value";
            }
          }
        } else
          for (let j = 0;j < names.length - 1; j++) {
            method = method[names[j]];
            if (!method) {
              results.push(new Error("Invalid procedure"));
              continue batch;
            }
            if (EXPOSED in method) {
              const key = names.slice(j + 1).join(".");
              const hasCheckFn = typeof method.check === "function";
              if (method.allow?.includes(key) === true && !hasCheckFn) {
                method = method.value;
                continue;
              }
              if (method.check == false || method.deny?.includes(key) === true || method.allow?.includes(key) === false && !method.deny && !hasCheckFn) {
                results.push(new Error("Forbidden"));
                continue batch;
              } else if (method.check !== true)
                try {
                  let cases;
                  const allowance = method.check({
                    ...context,
                    key,
                    params: procedure.p ?? null,
                    match(innerCases) {
                      cases = innerCases;
                    }
                  });
                  if (cases)
                    try {
                      const response = (cases[key] ?? cases.default)?.(procedure.p ?? null);
                      if (response instanceof Error)
                        throw response;
                    } catch (error3) {
                      if (!(key in cases) && method.allow?.includes(key)) {
                        method = method.value;
                        continue;
                      }
                      results.push(error3);
                      continue batch;
                    }
                  if (allowance instanceof Error) {
                    results.push(allowance);
                    continue batch;
                  }
                } catch (error3) {
                  results.push(error3);
                  continue batch;
                }
              method = method.value;
            }
          }
        try {
          if (typeof method[caller] !== "function")
            results.push(new Error("Invalid procedure"));
          else if (procedure.p === undefined)
            results.push(method[caller]());
          else if (procedure.p.length === 1)
            results.push(method[caller](procedure.p[0]));
          else
            results.push(method[caller](...procedure.p));
        } catch (error3) {
          results.push(error3);
        }
      }
    const responses = await Promise.allSettled(results);
    const ops = [];
    for (let i3 = 0;i3 < responses.length; i3++) {
      const op = responses[i3];
      if (op.status === "fulfilled")
        ops.push(op.value);
      else
        ops.push(op.reason);
    }
    return serialize(ops);
  };
  isObject = (item) => item && typeof item === "object" && !Array.isArray(item);
  mergeDeep2 = (target, source) => {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = mergeDeep2(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/elysia@0.5.23_@elysiajs+fn@0.5.2_typescript@5.1.6/node_modules/@elysiajs/fn/dist/index.js
var exports_dist = {};
__export(exports_dist, {
  permission: () => {
    {
      return permission;
    }
  },
  fn: () => {
    {
      return fn;
    }
  },
  default: () => {
    {
      return dist_default;
    }
  }
});
var fn, dist_default;
var init_dist4 = __esm(() => {
  init_dist5();
  init_esm();
  init_utils2();
  fn = ({ app, value, path = "/~fn" } = {}) => {
    const isInitial = Object.keys(app.meta[EXPOSED]).length === 0;
    app.meta[EXPOSED] = mergeDeep2(app.meta[EXPOSED], typeof value === "function" ? value({
      ...app.decorators,
      store: app.store,
      permission
    }) : value);
    if (isInitial) {
      app.post(path, async (context) => {
        context.body = deserialize(context.body);
        context.query = context.query;
        context.headers = context.headers;
        return runFn(context, app.meta[EXPOSED]);
      }, {
        type: "json"
      });
    }
    return app;
  };
  dist_default = fn;
});

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/elysia/dist/index.js
class p2 {
  config;
  store = {};
  meta = { [SCHEMA]: Object.create(null), [DEFS]: Object.create(null), [EXPOSED]: Object.create(null) };
  decorators = {};
  event = { start: [], request: [], parse: [], transform: [], beforeHandle: [], afterHandle: [], error: [], stop: [] };
  server = null;
  $schema = null;
  router = new Memoirist;
  routes = [];
  staticRouter = { handlers: [], variables: "", map: {}, all: "" };
  wsRouter;
  lazyLoadModules = [];
  constructor(e7) {
    this.config = { fn: "/~fn", forceErrorEncapsulation: false, basePath: "", ...e7 };
  }
  add(e7, r5, h, u2, { allowMeta: d2 = false } = { allowMeta: false }) {
    r5 = r5 === "" ? r5 : r5.charCodeAt(0) === 47 ? r5 : `/${r5}`, this.config.basePath && this.config.basePath, this.routes.push({ method: e7, path: r5, handler: h, hooks: mergeHook({ ...this.event }, u2) });
    let c = this.meta[DEFS];
    if (u2?.type)
      switch (u2.type) {
        case "text":
          u2.type = "text/plain";
          break;
        case "json":
          u2.type = "application/json";
          break;
        case "formdata":
          u2.type = "multipart/form-data";
          break;
        case "urlencoded":
          u2.type = "application/x-www-form-urlencoded";
          break;
        case "arrayBuffer":
          u2.type = "application/octet-stream";
      }
    registerSchemaPath({ schema: this.meta[SCHEMA], contentType: u2?.type, hook: u2, method: e7, path: r5, models: this.meta[DEFS] });
    let p3 = { body: getSchemaValidator(u2?.body ?? this.$schema?.body, c), headers: getSchemaValidator(u2?.headers ?? this.$schema?.headers, c, true), params: getSchemaValidator(u2?.params ?? this.$schema?.params, c), query: getSchemaValidator(u2?.query ?? this.$schema?.query, c), response: getResponseSchemaValidator(u2?.response ?? this.$schema?.response, c) }, f2 = mergeHook(this.event, u2), m = composeHandler({ path: r5, method: e7, hooks: f2, validator: p3, handler: h, handleError: this.handleError, meta: d2 ? this.meta : undefined, onRequest: this.event.request, config: this.config });
    if (r5.indexOf(":") === -1 && r5.indexOf("*") === -1) {
      let t5 = this.staticRouter.handlers.length;
      this.staticRouter.handlers.push(m), this.staticRouter.variables += `const st${t5} = staticRouter.handlers[${t5}]
`, this.staticRouter.map[r5] || (this.staticRouter.map[r5] = { code: "" }), e7 === "ALL" ? this.staticRouter.map[r5].all = `default: return st${t5}(ctx)
` : this.staticRouter.map[r5].code += `case '${e7}': return st${t5}(ctx)
`;
    } else
      this.router.add(e7, r5, m);
  }
  onStart(e7) {
    return this.event.start.push(e7), this;
  }
  onRequest(e7) {
    return this.event.request.push(e7), this;
  }
  onParse(e7) {
    return this.event.parse.splice(this.event.parse.length - 1, 0, e7), this;
  }
  onTransform(e7) {
    return this.event.transform.push(e7), this;
  }
  onBeforeHandle(e7) {
    return this.event.beforeHandle.push(e7), this;
  }
  onAfterHandle(e7) {
    return this.event.afterHandle.push(e7), this;
  }
  onError(e7) {
    return this.event.error.push(e7), this;
  }
  onStop(e7) {
    return this.event.stop.push(e7), this;
  }
  on(e7, t5) {
    switch (e7) {
      case "start":
        this.event.start.push(t5);
        break;
      case "request":
        this.event.request.push(t5);
        break;
      case "parse":
        this.event.parse.push(t5);
        break;
      case "transform":
        this.event.transform.push(t5);
        break;
      case "beforeHandle":
        this.event.beforeHandle.push(t5);
        break;
      case "afterHandle":
        this.event.afterHandle.push(t5);
        break;
      case "error":
        this.event.error.push(t5);
        break;
      case "stop":
        this.event.stop.push(t5);
    }
    return this;
  }
  group(e7, t5, r5) {
    let a2 = new p2;
    a2.store = this.store, this.wsRouter && a2.use(ws());
    let i3 = typeof t5 == "object", n = (i3 ? r5 : t5)(a2);
    return this.decorators = mergeDeep(this.decorators, a2.decorators), n.event.request.length && (this.event.request = [...this.event.request, ...n.event.request]), this.model(n.meta[DEFS]), Object.values(a2.routes).forEach(({ method: r6, path: s2, handler: h, hooks: u2 }) => {
      if (i3) {
        let i4 = `${e7}${s2}`, d2 = a2.wsRouter?.find("subscribe", i4);
        if (d2) {
          let e8 = a2.wsRouter.history.find(([e9, t6]) => i4 === t6);
          if (!e8)
            return;
          return this.ws(i4, e8[2]);
        }
        this.add(r6, i4, h, mergeHook(t5, { ...u2, error: u2.error ? Array.isArray(u2.error) ? [...u2.error, ...n.event.error] : [u2.error, ...n.event.error] : n.event.error }));
      } else {
        let t6 = `${e7}${s2}`, i4 = a2.wsRouter?.find("subscribe", t6);
        if (i4) {
          let e8 = a2.wsRouter.history.find(([e9, t7]) => s2 === t7);
          if (!e8)
            return;
          return this.ws(t6, e8[2]);
        }
        this.add(r6, t6, h, mergeHook(u2, { error: n.event.error }));
      }
    }), a2.wsRouter && this.wsRouter && a2.wsRouter.history.forEach(([t6, r6, s2]) => {
      r6 === "/" ? this.wsRouter?.add(t6, e7, s2) : this.wsRouter?.add(t6, `${e7}${r6}`, s2);
    }), this;
  }
  guard(e7, t5) {
    let r5 = new p2;
    r5.store = this.store, this.wsRouter && r5.use(ws());
    let a2 = t5(r5);
    return this.decorators = mergeDeep(this.decorators, r5.decorators), a2.event.request.length && (this.event.request = [...this.event.request, ...a2.event.request]), this.model(a2.meta[DEFS]), Object.values(r5.routes).forEach(({ method: t6, path: s2, handler: i3, hooks: h }) => {
      let n = r5.wsRouter?.find("subscribe", s2);
      if (n) {
        let e8 = r5.wsRouter.history.find(([e9, t7]) => s2 === t7);
        if (!e8)
          return;
        return this.ws(s2, e8[2]);
      }
      this.add(t6, s2, i3, mergeHook(e7, { ...h, error: h.error ? Array.isArray(h.error) ? [...h.error, ...a2.event.error] : [h.error, ...a2.event.error] : a2.event.error }));
    }), r5.wsRouter && this.wsRouter && r5.wsRouter.history.forEach(([e8, t6, r6]) => {
      this.wsRouter?.add(e8, t6, r6);
    }), this;
  }
  use(e7) {
    if (e7 instanceof Promise)
      return this.lazyLoadModules.push(e7.then((e8) => typeof e8 == "function" ? e8(this) : e8.default(this)).then((e8) => e8.compile())), this;
    let t5 = e7(this);
    return t5 instanceof Promise ? (this.lazyLoadModules.push(t5.then((e8) => e8.compile())), this) : t5;
  }
  if(e7, t5) {
    return e7 ? this.use(t5) : this;
  }
  get(e7, t5, r5) {
    return this.add("GET", e7, t5, r5), this;
  }
  post(e7, t5, r5) {
    return this.add("POST", e7, t5, r5), this;
  }
  put(e7, t5, r5) {
    return this.add("PUT", e7, t5, r5), this;
  }
  patch(e7, t5, r5) {
    return this.add("PATCH", e7, t5, r5), this;
  }
  delete(e7, t5, r5) {
    return this.add("DELETE", e7, t5, r5), this;
  }
  options(e7, t5, r5) {
    return this.add("OPTIONS", e7, t5, r5), this;
  }
  all(e7, t5, r5) {
    return this.add("ALL", e7, t5, r5), this;
  }
  head(e7, t5, r5) {
    return this.add("HEAD", e7, t5, r5), this;
  }
  trace(e7, t5, r5) {
    return this.add("TRACE", e7, t5, r5), this;
  }
  connect(e7, t5, r5) {
    return this.add("CONNECT", e7, t5, r5), this;
  }
  ws(e7, t5) {
    if (!this.wsRouter)
      throw Error("Can't find WebSocket. Please register WebSocket plugin first by importing 'elysia/ws'");
    return this.wsRouter.add("subscribe", e7, t5), this.get(e7, (e8) => {
      if (!this.server?.upgrade(e8.request, { headers: typeof t5.upgrade == "function" ? t5.upgrade(e8) : t5.upgrade, data: { ...e8, id: Date.now(), headers: e8.request.headers.toJSON(), message: getSchemaValidator(t5?.body, this.meta[DEFS]), transformMessage: t5.transform ? Array.isArray(t5.transformMessage) ? t5.transformMessage : [t5.transformMessage] : [] } }))
        return e8.set.status = 400, "Expected a websocket connection";
    }, { beforeHandle: t5.beforeHandle, transform: t5.transform, headers: t5?.headers, params: t5?.params, query: t5?.query }), this;
  }
  route(e7, t5, r5, { config: s2, ...o } = { config: { allowMeta: false } }) {
    return this.add(e7, t5, r5, o, s2), this;
  }
  state(e7, t5) {
    return typeof e7 == "object" ? (this.store = mergeDeep(this.store, e7), this) : ((e7 in this.store) || (this.store[e7] = t5), this);
  }
  decorate(e7, t5) {
    return typeof e7 == "object" ? (this.decorators = mergeDeep(this.decorators, e7), this) : ((e7 in this.decorators) || (this.decorators[e7] = t5), this);
  }
  derive(e7) {
    return e7.$elysia = "derive", this.onTransform(e7);
  }
  fn(e7) {
    return this.use(async (t5) => {
      let { fn: r5 } = await Promise.resolve().then(() => (init_dist4(), exports_dist));
      return r5({ app: t5, value: e7, path: t5.config.fn });
    });
  }
  schema(e7) {
    let t5 = this.meta[DEFS];
    return this.$schema = { body: getSchemaValidator(e7.body, t5), headers: getSchemaValidator(e7?.headers, t5, true), params: getSchemaValidator(e7?.params, t5), query: getSchemaValidator(e7?.query, t5), response: getSchemaValidator(e7?.response, t5) }, this;
  }
  compile() {
    return this.fetch = composeGeneralHandler(this), this.server && this.server.reload({ ...this.server, fetch: this.fetch }), this;
  }
  handle = async (e7) => this.fetch(e7);
  fetch = (e7) => (this.fetch = composeGeneralHandler(this))(e7);
  handleError = async (e7, t5, r5) => (this.handleError = composeErrorHandler(this))(e7, t5, r5);
  outerErrorHandler = (e7) => new Response(e7.message, { status: e7?.status ?? 500 });
  listen = (e7, t5) => {
    if (!Bun)
      throw Error("Bun to run");
    if (this.compile(), typeof e7 == "string" && Number.isNaN(e7 = +e7))
      throw Error("Port must be a numeric value");
    let r5 = this.fetch, s2 = (process.env.ENV ?? "development") !== "production", o = typeof e7 == "object" ? { ...this.config.serve, ...e7, development: s2, fetch: r5, error: this.outerErrorHandler } : { ...this.config.serve, port: e7, fetch: r5, error: this.outerErrorHandler };
    if (s2) {
      let e8 = `\$\$Elysia:${o.port}`;
      globalThis[e8] ? (this.server = globalThis[e8], this.server.reload(o)) : globalThis[e8] = this.server = Bun.serve(o);
    } else
      this.server = Bun.serve(o);
    for (let e8 = 0;e8 < this.event.start.length; e8++)
      this.event.start[e8](this);
    return t5 && t5(this.server), Promise.all(this.lazyLoadModules).then(() => {
      Bun.gc(true);
    }), this;
  };
  stop = async () => {
    if (!this.server)
      throw Error("Elysia isn't running. Call `app.listen` to start the server.");
    this.server.stop();
    for (let e7 = 0;e7 < this.event.stop.length; e7++)
      await this.event.stop[e7](this);
  };
  get modules() {
    return Promise.all(this.lazyLoadModules);
  }
  model(e7, t5) {
    return typeof e7 == "object" ? Object.entries(e7).forEach(([e8, t6]) => {
      (e8 in this.meta[DEFS]) || (this.meta[DEFS][e8] = t6);
    }) : this.meta[DEFS][e7] = t5, this;
  }
}
var init_dist5 = __esm(() => {
  init_dist();
  init_utils();
  init_schema();
  init_compose();
  init_ws();
  init_custom_types();
  init_ws();
  init_utils();
  init_error();
});

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+ratelimit@0.4.3/node_modules/@upstash/core-analytics/dist/index.js
var require_dist = __commonJS((exports, module) => {
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name3 in all)
      __defProp2(target, name3, { get: all[name3], enumerable: true });
  };
  var __copyProps = (to, from, except, desc2) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var src_exports = {};
  __export2(src_exports, {
    Analytics: () => Analytics
  });
  module.exports = __toCommonJS(src_exports);
  var Key = class {
    constructor(prefix, table, bucket) {
      this.prefix = prefix;
      this.table = table;
      this.bucket = bucket;
    }
    toString() {
      return [this.prefix, this.table, this.bucket].join(":");
    }
    static fromString(key) {
      const [prefix, table, bucket] = key.split(":");
      return new Key(prefix, table, parseInt(bucket));
    }
  };
  var Cache = class {
    cache;
    ttl;
    constructor(ttl) {
      this.cache = new Map;
      this.ttl = ttl;
      setInterval(() => {
        const now = Date.now();
        for (const [key, { createdAt }] of this.cache) {
          if (now - createdAt > this.ttl) {
            this.cache.delete(key);
          }
        }
      }, this.ttl * 10);
    }
    get(key) {
      const data2 = this.cache.get(key);
      if (!data2) {
        return null;
      }
      if (Date.now() - data2.createdAt > this.ttl) {
        this.cache.delete(key);
        return null;
      }
      return data2.value;
    }
    set(key, value) {
      this.cache.set(key, { createdAt: Date.now(), value });
    }
  };
  var Analytics = class {
    redis;
    prefix;
    bucketSize;
    retention;
    cache = new Cache(60000);
    constructor(config) {
      this.redis = config.redis;
      this.prefix = config.prefix ?? "@upstash/analytics";
      this.bucketSize = this.parseWindow(config.window);
      this.retention = config.retention ? this.parseWindow(config.retention) : undefined;
    }
    validateTableName(table) {
      const regex = /^[a-zA-Z0-9_-]+$/;
      if (!regex.test(table)) {
        throw new Error(`Invalid table name: ${table}. Table names can only contain letters, numbers, dashes and underscores.`);
      }
    }
    parseWindow(window) {
      if (typeof window === "number") {
        if (window <= 0) {
          throw new Error(`Invalid window: ${window}`);
        }
        return window;
      }
      const regex = /^(\d+)([smhd])$/;
      if (!regex.test(window)) {
        throw new Error(`Invalid window: ${window}`);
      }
      const [, valueStr, unit] = window.match(regex);
      const value = parseInt(valueStr);
      switch (unit) {
        case "s":
          return value * 1000;
        case "m":
          return value * 1000 * 60;
        case "h":
          return value * 1000 * 60 * 60;
        case "d":
          return value * 1000 * 60 * 60 * 24;
        default:
          throw new Error(`Invalid window unit: ${unit}`);
      }
    }
    async ingest(table, ...events) {
      this.validateTableName(table);
      await Promise.all(events.map(async (event) => {
        const time = event.time ?? Date.now();
        const bucket = Math.floor(time / this.bucketSize) * this.bucketSize;
        const key = [this.prefix, table, bucket].join(":");
        await this.redis.hincrby(key, JSON.stringify({
          ...event,
          time: undefined
        }), 1);
      }));
    }
    async loadBuckets(table, opts) {
      this.validateTableName(table);
      const now = Date.now();
      const keys = [];
      if (opts.scan) {
        let cursor = 0;
        const match = [this.prefix, table, "*"].join(":");
        do {
          const [nextCursor, found] = await this.redis.scan(cursor, {
            match
          });
          cursor = nextCursor;
          for (const key of found) {
            const timestamp2 = parseInt(key.split(":").pop());
            if (this.retention && timestamp2 < now - this.retention) {
              await this.redis.del(key);
              continue;
            }
            if (timestamp2 >= opts.range[0] || timestamp2 <= opts.range[1]) {
              keys.push(key);
            }
          }
        } while (cursor !== 0);
      } else {
        let t5 = Math.floor(now / this.bucketSize) * this.bucketSize;
        while (t5 > opts.range[1]) {
          t5 -= this.bucketSize;
        }
        while (t5 >= opts.range[0]) {
          keys.push([this.prefix, table, t5].join(":"));
          t5 -= this.bucketSize;
        }
      }
      const loadKeys = [];
      const buckets = [];
      for (const key of keys) {
        const cached = this.cache.get(key);
        if (cached) {
          buckets.push({
            key,
            hash: cached
          });
        } else {
          loadKeys.push(key);
        }
      }
      const p3 = this.redis.pipeline();
      for (const key of loadKeys) {
        p3.hgetall(key);
      }
      const res = loadKeys.length > 0 ? await p3.exec() : [];
      for (let i3 = 0;i3 < loadKeys.length; i3++) {
        const key = loadKeys[i3];
        const hash = res[i3];
        if (hash) {
          this.cache.set(key, hash);
        }
        buckets.push({
          key,
          hash: hash ?? {}
        });
      }
      return buckets.sort((a2, b) => a2.hash.time - b.hash.time);
    }
    async count(table, opts) {
      this.validateTableName(table);
      const buckets = await this.loadBuckets(table, { range: opts.range });
      return await Promise.all(buckets.map(async ({ key, hash }) => {
        const timestamp2 = parseInt(key.split(":").pop());
        return {
          time: timestamp2,
          count: Object.values(hash).reduce((acc, curr) => acc + curr, 0)
        };
      }));
    }
    async aggregateBy(table, aggregateBy, opts) {
      this.validateTableName(table);
      const buckets = await this.loadBuckets(table, { range: opts.range });
      const days = await Promise.all(buckets.map(async ({ key, hash }) => {
        const day = { time: Key.fromString(key).bucket };
        for (const [field, count] of Object.entries(hash)) {
          const r5 = JSON.parse(field);
          for (const [k, v] of Object.entries(r5)) {
            const agg = r5[aggregateBy];
            if (!day[agg]) {
              day[agg] = {};
            }
            if (k === aggregateBy) {
              continue;
            }
            if (!day[agg][v]) {
              day[agg][v] = 0;
            }
            day[agg][v] += count;
          }
        }
        return day;
      }));
      return days;
    }
    async query(table, opts) {
      this.validateTableName(table);
      const buckets = await this.loadBuckets(table, { range: opts.range });
      const days = await Promise.all(buckets.map(async ({ key, hash }) => {
        const day = { time: Key.fromString(key).bucket };
        for (const [field, count] of Object.entries(hash)) {
          const r5 = JSON.parse(field);
          let skip = false;
          if (opts?.where) {
            for (const [requiredKey, requiredValue] of Object.entries(opts.where)) {
              if (!(requiredKey in r5)) {
                skip = true;
                break;
              }
              if (r5[requiredKey] !== requiredValue) {
                skip = true;
                break;
              }
            }
          }
          if (skip) {
            continue;
          }
          for (const [k, v] of Object.entries(r5)) {
            if (opts?.filter && !opts.filter.includes(k)) {
              continue;
            }
            if (!day[k]) {
              day[k] = {};
            }
            if (!day[k][v]) {
              day[k][v] = 0;
            }
            day[k][v] += count;
          }
        }
        return day;
      }));
      return days;
    }
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/@upstash/ratelimit/dist/index.js
var require_dist2 = __commonJS((exports, module) => {
  var ms = function(d2) {
    const match = d2.match(/^(\d+)\s?(ms|s|m|h|d)$/);
    if (!match) {
      throw new Error(`Unable to parse window size: ${d2}`);
    }
    const time = parseInt(match[1]);
    const unit = match[2];
    switch (unit) {
      case "ms":
        return time;
      case "s":
        return time * 1000;
      case "m":
        return time * 1000 * 60;
      case "h":
        return time * 1000 * 60 * 60;
      case "d":
        return time * 1000 * 60 * 60 * 24;
      default:
        throw new Error(`Unable to parse window size: ${d2}`);
    }
  };
  var randomId = function() {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i3 = 0;i3 < 16; i3++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = (target, all) => {
    for (var name3 in all)
      __defProp2(target, name3, { get: all[name3], enumerable: true });
  };
  var __copyProps = (to, from, except, desc2) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod);
  var src_exports = {};
  __export2(src_exports, {
    Analytics: () => Analytics,
    MultiRegionRatelimit: () => MultiRegionRatelimit,
    Ratelimit: () => RegionRatelimit
  });
  module.exports = __toCommonJS(src_exports);
  var import_core_analytics = require_dist();
  var Analytics = class {
    analytics;
    table = "events";
    constructor(config) {
      this.analytics = new import_core_analytics.Analytics({
        redis: config.redis,
        window: "1h",
        prefix: config.prefix ?? "@upstash/ratelimit",
        retention: "90d"
      });
    }
    extractGeo(req) {
      if (typeof req.geo !== "undefined") {
        return req.geo;
      }
      if (typeof req.cf !== "undefined") {
        return req.cf;
      }
      return {};
    }
    async record(event) {
      await this.analytics.ingest(this.table, event);
    }
    async series(filter, cutoff) {
      const records = await this.analytics.query(this.table, {
        filter: [filter],
        range: [cutoff, Date.now()]
      });
      return records;
    }
    async getUsage(cutoff = 0) {
      const records = await this.analytics.aggregateBy(this.table, "identifier", {
        range: [cutoff, Date.now()]
      });
      const usage = {};
      for (const bucket of records) {
        for (const [k, v] of Object.entries(bucket)) {
          if (k === "time") {
            continue;
          }
          if (!usage[k]) {
            usage[k] = { success: 0, blocked: 0 };
          }
          usage[k].success += v["true"] ?? 0;
          usage[k].blocked += v["false"] ?? 0;
        }
      }
      return usage;
    }
  };
  var Cache = class {
    cache;
    constructor(cache) {
      this.cache = cache;
    }
    isBlocked(identifier) {
      if (!this.cache.has(identifier)) {
        return { blocked: false, reset: 0 };
      }
      const reset = this.cache.get(identifier);
      if (reset < Date.now()) {
        this.cache.delete(identifier);
        return { blocked: false, reset: 0 };
      }
      return { blocked: true, reset };
    }
    blockUntil(identifier, reset) {
      this.cache.set(identifier, reset);
    }
    set(key, value) {
      this.cache.set(key, value);
    }
    get(key) {
      return this.cache.get(key) || null;
    }
    incr(key) {
      let value = this.cache.get(key) ?? 0;
      value += 1;
      this.cache.set(key, value);
      return value;
    }
  };
  var Ratelimit = class {
    limiter;
    ctx;
    prefix;
    timeout;
    analytics;
    constructor(config) {
      this.ctx = config.ctx;
      this.limiter = config.limiter;
      this.timeout = config.timeout ?? 5000;
      this.prefix = config.prefix ?? "@upstash/ratelimit";
      this.analytics = config.analytics ? new Analytics({
        redis: Array.isArray(this.ctx.redis) ? this.ctx.redis[0] : this.ctx.redis,
        prefix: this.prefix
      }) : undefined;
      if (config.ephemeralCache instanceof Map) {
        this.ctx.cache = new Cache(config.ephemeralCache);
      } else if (typeof config.ephemeralCache === "undefined") {
        this.ctx.cache = new Cache(new Map);
      }
    }
    limit = async (identifier, req) => {
      const key = [this.prefix, identifier].join(":");
      let timeoutId = null;
      try {
        const arr = [this.limiter(this.ctx, key)];
        if (this.timeout > 0) {
          arr.push(new Promise((resolve) => {
            timeoutId = setTimeout(() => {
              resolve({
                success: true,
                limit: 0,
                remaining: 0,
                reset: 0,
                pending: Promise.resolve()
              });
            }, this.timeout);
          }));
        }
        const res = await Promise.race(arr);
        if (this.analytics) {
          try {
            const geo = req ? this.analytics.extractGeo(req) : undefined;
            const analyticsP = this.analytics.record({
              identifier,
              time: Date.now(),
              success: res.success,
              ...geo
            }).catch((err) => {
              console.warn("Failed to record analytics", err);
            });
            res.pending = Promise.all([res.pending, analyticsP]);
          } catch (err) {
            console.warn("Failed to record analytics", err);
          }
        }
        return res;
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };
    blockUntilReady = async (identifier, timeout) => {
      if (timeout <= 0) {
        throw new Error("timeout must be positive");
      }
      let res;
      const deadline = Date.now() + timeout;
      while (true) {
        res = await this.limit(identifier);
        if (res.success) {
          break;
        }
        if (res.reset === 0) {
          throw new Error("This should not happen");
        }
        const wait = Math.min(res.reset, deadline) - Date.now();
        await new Promise((r5) => setTimeout(r5, wait));
        if (Date.now() > deadline) {
          break;
        }
      }
      return res;
    };
  };
  var MultiRegionRatelimit = class extends Ratelimit {
    constructor(config) {
      super({
        prefix: config.prefix,
        limiter: config.limiter,
        timeout: config.timeout,
        analytics: config.analytics,
        ctx: {
          redis: config.redis,
          cache: config.ephemeralCache ? new Cache(config.ephemeralCache) : undefined
        }
      });
    }
    static fixedWindow(tokens, window) {
      const windowDuration = ms(window);
      const script = `
    local key     = KEYS[1]
    local id      = ARGV[1]
    local window  = ARGV[2]
    
    redis.call("SADD", key, id)
    local members = redis.call("SMEMBERS", key)
    if #members == 1 then
    -- The first time this key is set, the value will be 1.
    -- So we only need the expire command once
      redis.call("PEXPIRE", key, window)
    end
    
    return members
`;
      return async function(ctx, identifier) {
        if (ctx.cache) {
          const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
          if (blocked) {
            return {
              success: false,
              limit: tokens,
              remaining: 0,
              reset: reset2,
              pending: Promise.resolve()
            };
          }
        }
        const requestID = randomId();
        const bucket = Math.floor(Date.now() / windowDuration);
        const key = [identifier, bucket].join(":");
        const dbs = ctx.redis.map((redis) => ({
          redis,
          request: redis.eval(script, [key], [requestID, windowDuration])
        }));
        const firstResponse = await Promise.any(dbs.map((s2) => s2.request));
        const usedTokens = firstResponse.length;
        const remaining = tokens - usedTokens - 1;
        async function sync() {
          const individualIDs = await Promise.all(dbs.map((s2) => s2.request));
          const allIDs = Array.from(new Set(individualIDs.flatMap((_) => _)).values());
          for (const db of dbs) {
            const ids = await db.request;
            if (ids.length >= tokens) {
              continue;
            }
            const diff = allIDs.filter((id) => !ids.includes(id));
            if (diff.length === 0) {
              continue;
            }
            await db.redis.sadd(key, ...allIDs);
          }
        }
        const success = remaining > 0;
        const reset = (bucket + 1) * windowDuration;
        if (ctx.cache && !success) {
          ctx.cache.blockUntil(identifier, reset);
        }
        return {
          success,
          limit: tokens,
          remaining,
          reset,
          pending: sync()
        };
      };
    }
    static slidingWindow(tokens, window) {
      const windowSize = ms(window);
      const script = `
      local currentKey  = KEYS[1]           -- identifier including prefixes
      local previousKey = KEYS[2]           -- key of the previous bucket
      local tokens      = tonumber(ARGV[1]) -- tokens per window
      local now         = ARGV[2]           -- current timestamp in milliseconds
      local window      = ARGV[3]           -- interval in milliseconds
      local requestID   = ARGV[4]           -- uuid for this request


      local currentMembers = redis.call("SMEMBERS", currentKey)
      local requestsInCurrentWindow = #currentMembers
      local previousMembers = redis.call("SMEMBERS", previousKey)
      local requestsInPreviousWindow = #previousMembers

      local percentageInCurrent = ( now % window) / window
      if requestsInPreviousWindow * ( 1 - percentageInCurrent ) + requestsInCurrentWindow >= tokens then
        return {currentMembers, previousMembers}
      end

      redis.call("SADD", currentKey, requestID)
      table.insert(currentMembers, requestID)
      if requestsInCurrentWindow == 0 then 
        -- The first time this key is set, the value will be 1.
        -- So we only need the expire command once
        redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
      end
      return {currentMembers, previousMembers}
      `;
      const windowDuration = ms(window);
      return async function(ctx, identifier) {
        if (ctx.cache) {
          const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
          if (blocked) {
            return {
              success: false,
              limit: tokens,
              remaining: 0,
              reset: reset2,
              pending: Promise.resolve()
            };
          }
        }
        const requestID = randomId();
        const now = Date.now();
        const currentWindow = Math.floor(now / windowSize);
        const currentKey = [identifier, currentWindow].join(":");
        const previousWindow = currentWindow - windowSize;
        const previousKey = [identifier, previousWindow].join(":");
        const dbs = ctx.redis.map((redis) => ({
          redis,
          request: redis.eval(script, [currentKey, previousKey], [tokens, now, windowDuration, requestID])
        }));
        const percentageInCurrent = now % windowDuration / windowDuration;
        const [current, previous] = await Promise.any(dbs.map((s2) => s2.request));
        const usedTokens = previous.length * (1 - percentageInCurrent) + current.length;
        const remaining = tokens - usedTokens;
        async function sync() {
          const [individualIDs] = await Promise.all(dbs.map((s2) => s2.request));
          const allIDs = Array.from(new Set(individualIDs.flatMap((_) => _)).values());
          for (const db of dbs) {
            const [ids] = await db.request;
            if (ids.length >= tokens) {
              continue;
            }
            const diff = allIDs.filter((id) => !ids.includes(id));
            if (diff.length === 0) {
              continue;
            }
            await db.redis.sadd(currentKey, ...allIDs);
          }
        }
        const success = remaining > 0;
        const reset = (currentWindow + 1) * windowDuration;
        if (ctx.cache && !success) {
          ctx.cache.blockUntil(identifier, reset);
        }
        return {
          success,
          limit: tokens,
          remaining,
          reset,
          pending: sync()
        };
      };
    }
  };
  var RegionRatelimit = class extends Ratelimit {
    constructor(config) {
      super({
        prefix: config.prefix,
        limiter: config.limiter,
        timeout: config.timeout,
        analytics: config.analytics,
        ctx: {
          redis: config.redis
        },
        ephemeralCache: config.ephemeralCache
      });
    }
    static fixedWindow(tokens, window) {
      const windowDuration = ms(window);
      const script = `
    local key     = KEYS[1]
    local window  = ARGV[1]
    
    local r = redis.call("INCR", key)
    if r == 1 then 
    -- The first time this key is set, the value will be 1.
    -- So we only need the expire command once
    redis.call("PEXPIRE", key, window)
    end
    
    return r
    `;
      return async function(ctx, identifier) {
        const bucket = Math.floor(Date.now() / windowDuration);
        const key = [identifier, bucket].join(":");
        if (ctx.cache) {
          const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
          if (blocked) {
            return {
              success: false,
              limit: tokens,
              remaining: 0,
              reset: reset2,
              pending: Promise.resolve()
            };
          }
        }
        const usedTokensAfterUpdate = await ctx.redis.eval(script, [key], [windowDuration]);
        const success = usedTokensAfterUpdate <= tokens;
        const reset = (bucket + 1) * windowDuration;
        if (ctx.cache && !success) {
          ctx.cache.blockUntil(identifier, reset);
        }
        return {
          success,
          limit: tokens,
          remaining: tokens - usedTokensAfterUpdate,
          reset,
          pending: Promise.resolve()
        };
      };
    }
    static slidingWindow(tokens, window) {
      const script = `
      local currentKey  = KEYS[1]           -- identifier including prefixes
      local previousKey = KEYS[2]           -- key of the previous bucket
      local tokens      = tonumber(ARGV[1]) -- tokens per window
      local now         = ARGV[2]           -- current timestamp in milliseconds
      local window      = ARGV[3]           -- interval in milliseconds

      local requestsInCurrentWindow = redis.call("GET", currentKey)
      if requestsInCurrentWindow == false then
        requestsInCurrentWindow = -1
      end


      local requestsInPreviousWindow = redis.call("GET", previousKey)
      if requestsInPreviousWindow == false then
        requestsInPreviousWindow = 0
      end
      local percentageInCurrent = ( now % window) / window
      if requestsInPreviousWindow * ( 1 - percentageInCurrent ) + requestsInCurrentWindow >= tokens then
        return -1
      end

      local newValue = redis.call("INCR", currentKey)
      if newValue == 1 then 
        -- The first time this key is set, the value will be 1.
        -- So we only need the expire command once
        redis.call("PEXPIRE", currentKey, window * 2 + 1000) -- Enough time to overlap with a new window + 1 second
      end
      return tokens - newValue
      `;
      const windowSize = ms(window);
      return async function(ctx, identifier) {
        const now = Date.now();
        const currentWindow = Math.floor(now / windowSize);
        const currentKey = [identifier, currentWindow].join(":");
        const previousWindow = currentWindow - windowSize;
        const previousKey = [identifier, previousWindow].join(":");
        if (ctx.cache) {
          const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
          if (blocked) {
            return {
              success: false,
              limit: tokens,
              remaining: 0,
              reset: reset2,
              pending: Promise.resolve()
            };
          }
        }
        const remaining = await ctx.redis.eval(script, [currentKey, previousKey], [tokens, now, windowSize]);
        const success = remaining >= 0;
        const reset = (currentWindow + 1) * windowSize;
        if (ctx.cache && !success) {
          ctx.cache.blockUntil(identifier, reset);
        }
        return {
          success,
          limit: tokens,
          remaining: Math.max(0, remaining),
          reset,
          pending: Promise.resolve()
        };
      };
    }
    static tokenBucket(refillRate, interval, maxTokens) {
      const script = `
        local key         = KEYS[1]           -- identifier including prefixes
        local maxTokens   = tonumber(ARGV[1]) -- maximum number of tokens
        local interval    = tonumber(ARGV[2]) -- size of the window in milliseconds
        local refillRate  = tonumber(ARGV[3]) -- how many tokens are refilled after each interval
        local now         = tonumber(ARGV[4]) -- current timestamp in milliseconds
        local remaining   = 0
        
        local bucket = redis.call("HMGET", key, "updatedAt", "tokens")
        
        if bucket[1] == false then
          -- The bucket does not exist yet, so we create it and add a ttl.
          remaining = maxTokens - 1
          
          redis.call("HMSET", key, "updatedAt", now, "tokens", remaining)
          redis.call("PEXPIRE", key, interval)
  
          return {remaining, now + interval}
        end

        -- The bucket does exist
  
        local updatedAt = tonumber(bucket[1])
        local tokens = tonumber(bucket[2])
  
        if now >= updatedAt + interval then
          remaining = math.min(maxTokens, tokens + refillRate) - 1
          
          redis.call("HMSET", key, "updatedAt", now, "tokens", remaining)
          return {remaining, now + interval}
        end
  
        if tokens > 0 then
          remaining = tokens - 1
          redis.call("HMSET", key, "updatedAt", now, "tokens", remaining)
        end
  
        return {remaining, updatedAt + interval}
       `;
      const intervalDuration = ms(interval);
      return async function(ctx, identifier) {
        if (ctx.cache) {
          const { blocked, reset: reset2 } = ctx.cache.isBlocked(identifier);
          if (blocked) {
            return {
              success: false,
              limit: maxTokens,
              remaining: 0,
              reset: reset2,
              pending: Promise.resolve()
            };
          }
        }
        const now = Date.now();
        const key = [identifier, Math.floor(now / intervalDuration)].join(":");
        const [remaining, reset] = await ctx.redis.eval(script, [key], [maxTokens, intervalDuration, refillRate, now]);
        const success = remaining > 0;
        if (ctx.cache && !success) {
          ctx.cache.blockUntil(identifier, reset);
        }
        return {
          success,
          limit: maxTokens,
          remaining,
          reset,
          pending: Promise.resolve()
        };
      };
    }
    static cachedFixedWindow(tokens, window) {
      const windowDuration = ms(window);
      const script = `
      local key     = KEYS[1]
      local window  = ARGV[1]
      
      local r = redis.call("INCR", key)
      if r == 1 then 
      -- The first time this key is set, the value will be 1.
      -- So we only need the expire command once
      redis.call("PEXPIRE", key, window)
      end
      
      return r
      `;
      return async function(ctx, identifier) {
        if (!ctx.cache) {
          throw new Error("This algorithm requires a cache");
        }
        const bucket = Math.floor(Date.now() / windowDuration);
        const key = [identifier, bucket].join(":");
        const reset = (bucket + 1) * windowDuration;
        const hit = typeof ctx.cache.get(key) === "number";
        if (hit) {
          const cachedTokensAfterUpdate = ctx.cache.incr(key);
          const success = cachedTokensAfterUpdate < tokens;
          const pending = success ? ctx.redis.eval(script, [key], [windowDuration]).then((t5) => {
            ctx.cache.set(key, t5);
          }) : Promise.resolve();
          return {
            success,
            limit: tokens,
            remaining: tokens - cachedTokensAfterUpdate,
            reset,
            pending
          };
        }
        const usedTokensAfterUpdate = await ctx.redis.eval(script, [key], [windowDuration]);
        ctx.cache.set(key, usedTokensAfterUpdate);
        const remaining = tokens - usedTokensAfterUpdate;
        return {
          success: remaining >= 0,
          limit: tokens,
          remaining,
          reset,
          pending: Promise.resolve()
        };
      };
    }
  };
});

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/@elysiajs/swagger/dist/index.js
init_dist5();

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@elysiajs+swagger@0.5.2_elysia@0.5.23/node_modules/@elysiajs/swagger/dist/utils.js
var filterPaths = (paths, { excludeStaticFile = true, exclude = [] }) => {
  const newPaths = {};
  for (const [key, value] of Object.entries(paths))
    if (!exclude.some((x) => {
      if (typeof x === "string")
        return key === x;
      return x.test(key);
    }) && !key.includes("/swagger") && !key.includes("*") && (excludeStaticFile ? !key.includes(".") : true)) {
      Object.keys(value).forEach((method) => {
        const schema2 = value[method];
        if (key.includes("{")) {
          if (!schema2.parameters)
            schema2.parameters = [];
          schema2.parameters = [
            ...key.split("/").filter((x) => x.startsWith("{") && !schema2.parameters.find((params) => params.in === "path" && params.name === x.slice(1, x.length - 1))).map((x) => ({
              in: "path",
              name: x.slice(1, x.length - 1),
              type: "string",
              required: true
            })),
            ...schema2.parameters
          ];
        }
        if (!schema2.responses)
          schema2.responses = {
            200: {}
          };
      });
      newPaths[key] = value;
    }
  return newPaths;
};

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/@elysiajs/swagger/dist/index.js
var swagger = ({ documentation = {}, version = "4.18.2", excludeStaticFile = true, path = "/swagger", exclude = [] } = {
  documentation: {},
  version: "4.18.2",
  excludeStaticFile: true,
  path: "/swagger",
  exclude: []
}) => (app) => {
  const info = {
    title: "Elysia Documentation",
    description: "Developement documentation",
    version: "0.0.0",
    ...documentation.info
  };
  app.get(path, (context) => {
    return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${info.title}</title>
    <meta
        name="description"
        content="${info.description}"
    />
    <meta
        name="og:description"
        content="${info.description}"
    />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@${version}/swagger-ui.css" />
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@${version}/swagger-ui-bundle.js" crossorigin></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '${path}/json',
                dom_id: '#swagger-ui',
            });
        };
    </script>
</body>
</html>`, {
      headers: {
        "content-type": "text/html; charset=utf8"
      }
    });
  }).route("GET", `${path}/json`, (context) => ({
    openapi: "3.0.3",
    ...{
      ...documentation,
      info: {
        title: "Elysia Documentation",
        description: "Developement documentation",
        version: "0.0.0",
        ...documentation.info
      }
    },
    paths: filterPaths(context[SCHEMA], {
      excludeStaticFile,
      exclude: Array.isArray(exclude) ? exclude : [exclude]
    }),
    components: {
      schemas: context[DEFS]
    }
  }), {
    config: {
      allowMeta: true
    }
  });
  return app;
};
var dist_default2 = swagger;

// src/index.ts
init_dist5();

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/sanitization.js
function format(query, values) {
  return Array.isArray(values) ? replacePosition(query, values) : replaceNamed(query, values);
}
var replacePosition = function(query, values) {
  let index = 0;
  return query.replace(/\?/g, (match) => {
    return index < values.length ? sanitize(values[index++]) : match;
  });
};
var replaceNamed = function(query, values) {
  return query.replace(/:(\w+)/g, (match, name) => {
    return hasOwn(values, name) ? sanitize(values[name]) : match;
  });
};
var hasOwn = function(obj, name) {
  return Object.prototype.hasOwnProperty.call(obj, name);
};
var sanitize = function(value) {
  if (value == null) {
    return "null";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "string") {
    return quote(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitize).join(", ");
  }
  if (value instanceof Date) {
    return quote(value.toISOString().replace("Z", ""));
  }
  return quote(value.toString());
};
var quote = function(text) {
  return `'${escape(text)}'`;
};
var escape = function(text) {
  return text.replace(re, replacement);
};
var replacement = function(text) {
  switch (text) {
    case '"':
      return '\\"';
    case "'":
      return "\\'";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\t":
      return "\\t";
    case "\\":
      return "\\\\";
    case "\0":
      return "\\0";
    case "\b":
      return "\\b";
    case "\x1A":
      return "\\Z";
    default:
      return "";
  }
};
var re = /[\0\b\n\r\t\x1a\\"']/g;
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/text.js
function decode(text) {
  return text ? decoder.decode(Uint8Array.from(bytes(text))) : "";
}
var bytes = function(text) {
  return text.split("").map((c) => c.charCodeAt(0));
};
var decoder = new TextDecoder("utf-8");
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@planetscale+database@1.8.0/node_modules/@planetscale/database/dist/version.js
var Version = "1.8.0";

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/node_modules/@planetscale/database/dist/index.js
async function postJSON(config, url, body = {}) {
  const auth = btoa(`${config.username}:${config.password}`);
  const { fetch: fetch2 } = config;
  const response = await fetch2(url.toString(), {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `database-js/${Version}`,
      Authorization: `Basic ${auth}`
    },
    cache: "no-store"
  });
  if (response.ok) {
    return await response.json();
  } else {
    let error3 = null;
    try {
      const e7 = (await response.json()).error;
      error3 = new DatabaseError(e7.message, response.status, e7);
    } catch {
      error3 = new DatabaseError(response.statusText, response.status, {
        code: "internal",
        message: response.statusText
      });
    }
    throw error3;
  }
}
function connect(config) {
  return new Connection(config);
}
var parseArrayRow = function(fields, rawRow, cast) {
  const row = decodeRow(rawRow);
  return fields.map((field, ix) => {
    return cast(field, row[ix]);
  });
};
var parseObjectRow = function(fields, rawRow, cast) {
  const row = decodeRow(rawRow);
  return fields.reduce((acc, field, ix) => {
    acc[field.name] = cast(field, row[ix]);
    return acc;
  }, {});
};
var parse2 = function(result, cast, returnAs) {
  const fields = result.fields;
  const rows = result.rows ?? [];
  return rows.map((row) => returnAs === "array" ? parseArrayRow(fields, row, cast) : parseObjectRow(fields, row, cast));
};
var decodeRow = function(row) {
  const values = row.values ? atob(row.values) : "";
  let offset = 0;
  return row.lengths.map((size) => {
    const width = parseInt(size, 10);
    if (width < 0)
      return null;
    const splice = values.substring(offset, offset + width);
    offset += width;
    return splice;
  });
};
function cast(field, value) {
  if (value === "" || value == null) {
    return value;
  }
  switch (field.type) {
    case "INT8":
    case "INT16":
    case "INT24":
    case "INT32":
    case "UINT8":
    case "UINT16":
    case "UINT24":
    case "UINT32":
    case "YEAR":
      return parseInt(value, 10);
    case "FLOAT32":
    case "FLOAT64":
      return parseFloat(value);
    case "DECIMAL":
    case "INT64":
    case "UINT64":
    case "DATE":
    case "TIME":
    case "DATETIME":
    case "TIMESTAMP":
    case "BLOB":
    case "BIT":
    case "VARBINARY":
    case "BINARY":
    case "GEOMETRY":
      return value;
    case "JSON":
      return JSON.parse(decode(value));
    default:
      return decode(value);
  }
}

class DatabaseError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.name = "DatabaseError";
    this.body = body;
  }
}
var defaultExecuteOptions = {
  as: "object"
};
class Tx {
  constructor(conn) {
    this.conn = conn;
  }
  async execute(query, args = null, options = defaultExecuteOptions) {
    return this.conn.execute(query, args, options);
  }
}

class Connection {
  constructor(config) {
    var _a;
    this.session = null;
    this.config = { ...config };
    if (typeof fetch !== "undefined") {
      (_a = this.config).fetch || (_a.fetch = fetch);
    }
    if (config.url) {
      const url = new URL(config.url);
      this.config.username = url.username;
      this.config.password = url.password;
      this.config.host = url.hostname;
    }
  }
  async transaction(fn2) {
    const conn = new Connection(this.config);
    const tx = new Tx(conn);
    try {
      await tx.execute("BEGIN");
      const res = await fn2(tx);
      await tx.execute("COMMIT");
      return res;
    } catch (err) {
      await tx.execute("ROLLBACK");
      throw err;
    }
  }
  async refresh() {
    await this.createSession();
  }
  async execute(query, args = null, options = defaultExecuteOptions) {
    const url = new URL("/psdb.v1alpha1.Database/Execute", `https://${this.config.host}`);
    const formatter = this.config.format || format;
    const sql = args ? formatter(query, args) : query;
    const saved = await postJSON(this.config, url, { query: sql, session: this.session });
    const { result, session, error: error3, timing } = saved;
    if (error3) {
      throw new DatabaseError(error3.message, 400, error3);
    }
    const rowsAffected = result?.rowsAffected ? parseInt(result.rowsAffected, 10) : 0;
    const insertId = result?.insertId ?? "0";
    this.session = session;
    const fields = result?.fields ?? [];
    for (const field of fields) {
      field.type || (field.type = "NULL");
    }
    const castFn = options.cast || this.config.cast || cast;
    const rows = result ? parse2(result, castFn, options.as || "object") : [];
    const headers = fields.map((f2) => f2.name);
    const typeByName = (acc, { name, type }) => ({ ...acc, [name]: type });
    const types = fields.reduce(typeByName, {});
    const timingSeconds = timing ?? 0;
    return {
      headers,
      types,
      fields,
      rows,
      rowsAffected,
      insertId,
      size: rows.length,
      statement: sql,
      time: timingSeconds * 1000
    };
  }
  async createSession() {
    const url = new URL("/psdb.v1alpha1.Database/CreateSession", `https://${this.config.host}`);
    const { session } = await postJSON(this.config, url);
    this.session = session;
    return session;
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/drizzle-orm@0.27.2_@planetscale+database@1.8.0_bun-types@0.7.0/node_modules/drizzle-orm/alias-3e926a50.mjs
var is4 = function(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(`Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`);
  }
  let cls = value.constructor;
  if (cls) {
    while (cls) {
      if ((entityKind in cls) && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
};
var isTable = function(table) {
  return typeof table === "object" && table !== null && (IsDrizzleTable in table);
};
var getTableName = function(table) {
  return table[TableName];
};
var mapResultRow = function(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce((result2, { path, field }, columnIndex) => {
    let decoder2;
    if (is4(field, Column)) {
      decoder2 = field;
    } else if (is4(field, SQL)) {
      decoder2 = field.decoder;
    } else {
      decoder2 = field.sql.decoder;
    }
    let node = result2;
    for (const [pathChunkIndex, pathChunk] of path.entries()) {
      if (pathChunkIndex < path.length - 1) {
        if (!(pathChunk in node)) {
          node[pathChunk] = {};
        }
        node = node[pathChunk];
      } else {
        const rawValue = row[columnIndex];
        const value = node[pathChunk] = rawValue === null ? null : decoder2.mapFromDriverValue(rawValue);
        if (joinsNotNullableMap && is4(field, Column) && path.length === 2) {
          const objectName = path[0];
          if (!(objectName in nullifyMap)) {
            nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
          } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
            nullifyMap[objectName] = false;
          }
        }
      }
    }
    return result2;
  }, {});
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
};
var orderSelectedFields = function(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is4(field, Column) || is4(field, SQL) || is4(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is4(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
};
var mapUpdateSet = function(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== undefined).map(([key, value]) => {
    if (is4(value, SQL)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
};
var applyMixins = function(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      Object.defineProperty(baseClass.prototype, name, Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || Object.create(null));
    }
  }
};
var getTableColumns = function(table) {
  return table[Table.Symbol.Columns];
};
var getTableLikeName = function(table) {
  return is4(table, Subquery) ? table[SubqueryConfig].alias : is4(table, View) ? table[ViewBaseConfig].name : is4(table, SQL) ? undefined : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
};
var extractTablesRelationalConfig = function(schema2, configHelpers) {
  if (Object.keys(schema2).length === 1 && ("default" in schema2) && !is4(schema2["default"], Table)) {
    schema2 = schema2["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema2)) {
    if (isTable(value)) {
      const dbName = value[Table.Symbol.Name];
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(value[Table.Symbol.Columns])) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is4(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is4(value, Relations)) {
      const dbName = value.table[Table.Symbol.Name];
      const tableName = tableNamesMap[dbName];
      const relations = value.config(configHelpers(value.table));
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
};
var relations = function(table, relations2) {
  return new Relations(table, (helpers) => Object.fromEntries(Object.entries(relations2(helpers)).map(([key, value]) => [key, value.withFieldName(key)])));
};
var createOne = function(sourceTable) {
  return function one(table, config) {
    return new One(sourceTable, table, config, config?.fields.reduce((res, f2) => res && f2.notNull, true) ?? false);
  };
};
var createMany = function(sourceTable) {
  return function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  };
};
var normalizeRelation = function(schema2, tableNamesMap, relation) {
  if (is4(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[relation.referencedTable[Table.Symbol.Name]];
  if (!referencedTableTsName) {
    throw new Error(`Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`);
  }
  const referencedTableFields = schema2[referencedTableTsName];
  if (!referencedTableFields) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[sourceTable[Table.Symbol.Name]];
  if (!sourceTableTsName) {
    throw new Error(`Table "${sourceTable[Table.Symbol.Name]}" not found in schema`);
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(referencedTableFields.relations)) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(`There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`) : new Error(`There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`);
  }
  if (reverseRelations[0] && is4(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(`There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`);
};
var createTableRelationsHelpers = function(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
};
var mapRelationalRow = function(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [selectionItemIndex, selectionItem] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      if (is4(relation, One)) {
        result[selectionItem.tsKey] = subRows[0] ? mapRelationalRow(tablesConfig, tablesConfig[selectionItem.tableTsKey], subRows[0], selectionItem.selection, mapColumnValue) : null;
      } else {
        result[selectionItem.tsKey] = subRows.map((subRow) => mapRelationalRow(tablesConfig, tablesConfig[selectionItem.tableTsKey], subRow, selectionItem.selection, mapColumnValue));
      }
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder2;
      if (is4(field, Column)) {
        decoder2 = field;
      } else if (is4(field, SQL)) {
        decoder2 = field.decoder;
      } else {
        decoder2 = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder2.mapFromDriverValue(value);
    }
  }
  return result;
};
var bindIfParam = function(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is4(value, Param) && !is4(value, Placeholder) && !is4(value, Column) && !is4(value, Table) && !is4(value, View)) {
    return new Param(value, column);
  }
  return value;
};
var eq = function(left, right) {
  return sql`${left} = ${bindIfParam(right, left)}`;
};
var and = function(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter((c) => c !== undefined);
  if (conditions.length === 0) {
    return;
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  const chunks = [sql.raw("(")];
  for (const [index, condition] of conditions.entries()) {
    if (index === 0) {
      chunks.push(condition);
    } else {
      chunks.push(sql` and `, condition);
    }
  }
  chunks.push(sql`)`);
  return sql.fromList(chunks);
};
var or = function(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter((c) => c !== undefined);
  if (conditions.length === 0) {
    return;
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  const chunks = [sql.raw("(")];
  for (const [index, condition] of conditions.entries()) {
    if (index === 0) {
      chunks.push(condition);
    } else {
      chunks.push(sql` or `, condition);
    }
  }
  chunks.push(sql`)`);
  return sql.fromList(chunks);
};
var isNull3 = function(column) {
  return sql`${column} is null`;
};
var asc = function(column) {
  return sql`${column} asc`;
};
var desc = function(column) {
  return sql`${column} desc`;
};
var isSQLWrapper = function(value) {
  return typeof value === "object" && value !== null && ("getSQL" in value) && typeof value.getSQL === "function";
};
var mergeQueries = function(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      result.typings = result.typings || [];
      result.typings.push(...query.typings);
    }
  }
  return result;
};
var name = function(value) {
  return new Name(value);
};
var isDriverValueEncoder = function(value) {
  return typeof value === "object" && value !== null && ("mapToDriverValue" in value) && typeof value.mapToDriverValue === "function";
};
var sql = function(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param] of params.entries()) {
    queryChunks.push(param, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
};
var fillPlaceholders = function(params, values) {
  return params.map((p3) => {
    if (is4(p3, Placeholder)) {
      if (!(p3.name in values)) {
        throw new Error(`No value for placeholder "${p3.name}" was provided`);
      }
      return values[p3.name];
    }
    return p3;
  });
};
var aliasedTable = function(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
};
var aliasedRelation = function(relation, tableAlias) {
  return new Proxy(relation, new RelationTableAliasProxyHandler(tableAlias));
};
var aliasedTableColumn = function(column, tableAlias) {
  return new Proxy(column, new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false))));
};
var mapColumnsInAliasedSQLToAlias = function(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
};
var mapColumnsInSQLToAlias = function(query, alias) {
  return sql.fromList(query.queryChunks.map((c) => {
    if (is4(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is4(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is4(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
};
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");

class Column {
  table;
  static [entityKind] = "Column";
  name;
  primary;
  notNull;
  default;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  config;
  constructor(table, config) {
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.notNull = config.notNull;
    this.default = config.default;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
  }
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
}
var TableName = Symbol.for("drizzle:Name");
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");

class Table {
  static [entityKind] = "Table";
  static Symbol = {
    Name: TableName,
    Schema,
    OriginalName,
    Columns,
    BaseName,
    IsAlias,
    ExtraConfigBuilder
  };
  [TableName];
  [OriginalName];
  [Schema];
  [Columns];
  [BaseName];
  [IsAlias] = false;
  [ExtraConfigBuilder] = undefined;
  [IsDrizzleTable] = true;
  constructor(name2, schema2, baseName) {
    this[TableName] = this[OriginalName] = name2;
    this[Schema] = schema2;
    this[BaseName] = baseName;
  }
}
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");

class PgTable extends Table {
  static [entityKind] = "PgTable";
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys
  });
  [InlineForeignKeys] = [];
  [Table.Symbol.ExtraConfigBuilder] = undefined;
}
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

class View {
  static [entityKind] = "View";
  [ViewBaseConfig];
  constructor({ name: name2, schema: schema2, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema: schema2,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
}
class PrimaryKeyBuilder {
  static [entityKind] = "PgPrimaryKeyBuilder";
  columns;
  constructor(columns) {
    this.columns = columns;
  }
  build(table) {
    return new PrimaryKey(table, this.columns);
  }
}

class PrimaryKey {
  table;
  static [entityKind] = "PgPrimaryKey";
  columns;
  constructor(table, columns) {
    this.table = table;
    this.columns = columns;
  }
  getName() {
    return `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
}
var SubqueryConfig = Symbol.for("drizzle:SubqueryConfig");

class Subquery {
  static [entityKind] = "Subquery";
  [SubqueryConfig];
  constructor(sql2, selection, alias, isWith = false) {
    this[SubqueryConfig] = {
      sql: sql2,
      selection,
      alias,
      isWith
    };
  }
}

class WithSubquery extends Subquery {
  static [entityKind] = "WithSubquery";
}

class SelectionProxyHandler {
  static [entityKind] = "SelectionProxyHandler";
  config;
  constructor(config) {
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === SubqueryConfig) {
      return {
        ...subquery[SubqueryConfig],
        selection: new Proxy(subquery[SubqueryConfig].selection, this)
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this)
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is4(subquery, Subquery) ? subquery[SubqueryConfig].selection : is4(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is4(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is4(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
    }
    if (is4(value, Column)) {
      if (this.config.alias) {
        return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false))));
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new SelectionProxyHandler(this.config));
  }
}

class QueryPromise {
  static [entityKind] = "QueryPromise";
  [Symbol.toStringTag] = "QueryPromise";
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  finally(onFinally) {
    return this.then((value) => {
      onFinally?.();
      return value;
    }, (reason) => {
      onFinally?.();
      throw reason;
    });
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
}
var tracer = {
  startActiveSpan(name2, fn2) {
    {
      return fn2();
    }
  }
};
class TypedQueryBuilder {
  static [entityKind] = "TypedQueryBuilder";
  getSelectedFields() {
    return this._.selectedFields;
  }
}
class PgSelectQueryBuilder extends TypedQueryBuilder {
  static [entityKind] = "PgSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      joins: [],
      orderBy: [],
      groupBy: [],
      lockingClauses: [],
      distinct
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is4(table, SQL)) {
          const selection = is4(table, Subquery) ? table[SubqueryConfig].selection : is4(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  where(where) {
    if (typeof where === "function") {
      where = where(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.where = where;
    return this;
  }
  having(having) {
    if (typeof having === "function") {
      having = having(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy];
    } else {
      this.config.orderBy = columns;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  offset(offset) {
    this.config.offset = offset;
    return this;
  }
  for(strength, config = {}) {
    this.config.lockingClauses.push({ strength, config });
    return this;
  }
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(new Subquery(this.getSQL(), this.config.fields, alias), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
  }
}

class PgSelect extends PgSelectQueryBuilder {
  static [entityKind] = "PgSelect";
  _prepare(name2) {
    const { session, config, dialect, joinsNotNullableMap } = this;
    if (!session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    return tracer.startActiveSpan("drizzle.prepareQuery", () => {
      const fieldsList = orderSelectedFields(config.fields);
      const query = session.prepareQuery(dialect.sqlToQuery(this.getSQL()), fieldsList, name2);
      query.joinsNotNullableMap = joinsNotNullableMap;
      return query;
    });
  }
  prepare(name2) {
    return this._prepare(name2);
  }
  execute = (placeholderValues) => {
    return tracer.startActiveSpan("drizzle.operation", () => {
      return this._prepare().execute(placeholderValues);
    });
  };
}
applyMixins(PgSelect, [QueryPromise]);
var PgViewConfig = Symbol.for("drizzle:PgViewConfig");
var PgMaterializedViewConfig = Symbol.for("drizzle:PgMaterializedViewConfig");
class ColumnBuilder {
  static [entityKind] = "ColumnBuilder";
  config;
  constructor(name2) {
    this.config = {
      name: name2,
      notNull: false,
      default: undefined,
      primaryKey: false
    };
  }
  $type() {
    return this;
  }
  notNull() {
    this.config.notNull = true;
    return this;
  }
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
}
class Relation {
  sourceTable;
  referencedTable;
  relationName;
  static [entityKind] = "Relation";
  referencedTableName;
  fieldName;
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
}

class Relations {
  table;
  config;
  static [entityKind] = "Relations";
  constructor(table, config) {
    this.table = table;
    this.config = config;
  }
}

class One extends Relation {
  config;
  isNullable;
  static [entityKind] = "One";
  constructor(sourceTable, referencedTable, config, isNullable) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
    this.isNullable = isNullable;
  }
  withFieldName(fieldName) {
    const relation = new One(this.sourceTable, this.referencedTable, this.config, this.isNullable);
    relation.fieldName = fieldName;
    return relation;
  }
}

class Many extends Relation {
  config;
  static [entityKind] = "Many";
  constructor(sourceTable, referencedTable, config) {
    super(sourceTable, referencedTable, config?.relationName);
    this.config = config;
  }
  withFieldName(fieldName) {
    const relation = new Many(this.sourceTable, this.referencedTable, this.config);
    relation.fieldName = fieldName;
    return relation;
  }
}
var operators = {
  sql,
  eq,
  and,
  or
};
var orderByOperators = {
  sql,
  asc,
  desc
};
class StringChunk {
  static [entityKind] = "StringChunk";
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
}

class SQL {
  queryChunks;
  static [entityKind] = "SQL";
  decoder = noopDecoder;
  shouldInlineParams = false;
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
  }
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const { escapeName, escapeParam, prepareTyping, inlineParams, paramStartIndex } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is4(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is4(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === undefined) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i3, p3] of chunk.entries()) {
          result.push(p3);
          if (i3 < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is4(chunk, SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is4(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === undefined ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is4(chunk, Column)) {
        return { sql: escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(chunk.name), params: [] };
      }
      if (is4(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === undefined ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is4(chunk, Param)) {
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is4(mappedValue, SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings;
        if (prepareTyping !== undefined) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is4(chunk, SQL.Aliased) && chunk.fieldAlias !== undefined) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is4(chunk, Subquery)) {
        if (chunk[SubqueryConfig].isWith) {
          return { sql: escapeName(chunk[SubqueryConfig].alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk[SubqueryConfig].sql,
          new StringChunk(") "),
          new Name(chunk[SubqueryConfig].alias)
        ], config);
      }
      if (isSQLWrapper(chunk)) {
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (is4(chunk, Relation)) {
        return this.buildQueryFromSourceParams([
          chunk.sourceTable,
          new StringChunk("."),
          sql.identifier(chunk.fieldName)
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === undefined) {
      return this;
    }
    return new SQL.Aliased(this, alias);
  }
  mapWith(decoder2) {
    this.decoder = typeof decoder2 === "function" ? { mapFromDriverValue: decoder2 } : decoder2;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
}

class Name {
  value;
  static [entityKind] = "Name";
  brand;
  constructor(value) {
    this.value = value;
  }
}
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};

class Param {
  value;
  encoder;
  static [entityKind] = "Param";
  brand;
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
}
(function(sql2) {
  function empty() {
    return new SQL([]);
  }
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join(chunks, separator) {
    const result = [];
    for (const [i3, chunk] of chunks.entries()) {
      if (i3 > 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return sql2.fromList(result);
  }
  sql2.join = join;
  function identifier(value) {
    return name(value);
  }
  sql2.identifier = identifier;
})(sql || (sql = {}));
(function(SQL2) {

  class Aliased {
    sql;
    fieldAlias;
    static [entityKind] = "SQL.Aliased";
    isSelectionField = false;
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    getSQL() {
      return this.sql;
    }
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));

class Placeholder {
  name;
  static [entityKind] = "Placeholder";
  constructor(name2) {
    this.name = name2;
  }
}

class ColumnAliasProxyHandler {
  table;
  static [entityKind] = "ColumnAliasProxyHandler";
  constructor(table) {
    this.table = table;
  }
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
}

class TableAliasProxyHandler {
  alias;
  replaceOriginalName;
  static [entityKind] = "TableAliasProxyHandler";
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(columns[key], new ColumnAliasProxyHandler(new Proxy(target, this)));
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is4(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
}

class RelationTableAliasProxyHandler {
  alias;
  static [entityKind] = "RelationTableAliasProxyHandler";
  constructor(alias) {
    this.alias = alias;
  }
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/drizzle-orm@0.27.2_@planetscale+database@1.8.0_bun-types@0.7.0/node_modules/drizzle-orm/errors-fed11085.mjs
class DrizzleError extends Error {
  static [entityKind] = "DrizzleError";
  constructor(message) {
    super(message);
    this.name = "DrizzleError";
  }
  static wrap(error3, message) {
    return error3 instanceof Error ? new DrizzleError(message ? `${message}: ${error3.message}` : error3.message) : new DrizzleError(message ?? String(error3));
  }
}

class TransactionRollbackError extends DrizzleError {
  static [entityKind] = "TransactionRollbackError";
  constructor() {
    super("Rollback");
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/node_modules/drizzle-orm/index.mjs
class ConsoleLogWriter {
  static [entityKind] = "ConsoleLogWriter";
  write(message) {
    console.log(message);
  }
}

class DefaultLogger {
  static [entityKind] = "DefaultLogger";
  writer;
  constructor(config) {
    this.writer = config?.writer ?? new ConsoleLogWriter;
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p3) => {
      try {
        return JSON.stringify(p3);
      } catch {
        return String(p3);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
}

class NoopLogger {
  static [entityKind] = "NoopLogger";
  logQuery() {
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/drizzle-orm@0.27.2_@planetscale+database@1.8.0_bun-types@0.7.0/node_modules/drizzle-orm/session-9628aea0.mjs
var mysqlTableWithSchema = function(name2, columns, extraConfig, schema2, baseName = name2) {
  const rawTable = new MySqlTable(name2, schema2, baseName);
  const builtColumns = Object.fromEntries(Object.entries(columns).map(([name3, colBuilder]) => {
    const column = colBuilder.build(rawTable);
    rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
    return [name3, column];
  }));
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  if (extraConfig) {
    table[MySqlTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
};
var unique = function(name2) {
  return new UniqueOnConstraintBuilder(name2);
};
var uniqueKeyName = function(table, columns) {
  return `${table[MySqlTable.Symbol.Name]}_${columns.join("_")}_unique`;
};
var InlineForeignKeys2 = Symbol.for("drizzle:MySqlInlineForeignKeys");

class MySqlTable extends Table {
  static [entityKind] = "MySqlTable";
  static Symbol = Object.assign({}, Table.Symbol, {
    InlineForeignKeys: InlineForeignKeys2
  });
  [Table.Symbol.Columns];
  [InlineForeignKeys2] = [];
  [Table.Symbol.ExtraConfigBuilder] = undefined;
}
var mysqlTable = (name2, columns, extraConfig) => {
  return mysqlTableWithSchema(name2, columns, extraConfig, undefined, name2);
};

class ForeignKeyBuilder {
  static [entityKind] = "MySqlForeignKeyBuilder";
  reference;
  _onUpdate;
  _onDelete;
  constructor(config, actions) {
    this.reference = () => {
      const { columns, foreignColumns } = config();
      return { columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  build(table) {
    return new ForeignKey(table, this);
  }
}

class ForeignKey {
  table;
  static [entityKind] = "MySqlForeignKey";
  reference;
  onUpdate;
  onDelete;
  constructor(table, builder) {
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  getName() {
    const { columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[MySqlTable.Symbol.Name],
      ...columnNames,
      foreignColumns[0].table[MySqlTable.Symbol.Name],
      ...foreignColumnNames
    ];
    return `${chunks.join("_")}_fk`;
  }
}

class UniqueConstraintBuilder {
  name;
  static [entityKind] = "MySqlUniqueConstraintBuilder";
  columns;
  constructor(columns, name2) {
    this.name = name2;
    this.columns = columns;
  }
  build(table) {
    return new UniqueConstraint(table, this.columns, this.name);
  }
}

class UniqueOnConstraintBuilder {
  static [entityKind] = "MySqlUniqueOnConstraintBuilder";
  name;
  constructor(name2) {
    this.name = name2;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
}

class UniqueConstraint {
  table;
  static [entityKind] = "MySqlUniqueConstraint";
  columns;
  name;
  nullsNotDistinct = false;
  constructor(table, columns, name2) {
    this.table = table;
    this.columns = columns;
    this.name = name2 ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
  }
  getName() {
    return this.name;
  }
}

class MySqlColumnBuilder extends ColumnBuilder {
  static [entityKind] = "MySqlColumnBuilder";
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name2) {
    this.config.isUnique = true;
    this.config.uniqueName = name2;
    return this;
  }
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
}

class MySqlColumn extends Column {
  table;
  static [entityKind] = "MySqlColumn";
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
}

class MySqlColumnBuilderWithAutoIncrement extends MySqlColumnBuilder {
  static [entityKind] = "MySqlColumnBuilderWithAutoIncrement";
  constructor(name2) {
    super(name2);
    this.config.autoIncrement = false;
  }
  autoincrement() {
    this.config.autoIncrement = true;
    this.config.hasDefault = true;
    return this;
  }
}

class MySqlColumnWithAutoIncrement extends MySqlColumn {
  static [entityKind] = "MySqlColumnWithAutoIncrement";
  autoIncrement = this.config.autoIncrement;
}

class MySqlDelete extends QueryPromise {
  table;
  session;
  dialect;
  static [entityKind] = "MySqlDelete";
  config;
  constructor(table, session, dialect) {
    super();
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.config = { table };
  }
  where(where) {
    this.config.where = where;
    return this;
  }
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning);
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self2 = this;
    return async function* (placeholderValues) {
      yield* self2.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
}

class MySqlInsertBuilder {
  table;
  session;
  dialect;
  static [entityKind] = "MySqlInsertBuilder";
  shouldIgnore = false;
  constructor(table, session, dialect) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
  }
  ignore() {
    this.shouldIgnore = true;
    return this;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is4(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new MySqlInsert(this.table, mappedValues, this.shouldIgnore, this.session, this.dialect);
  }
}

class MySqlInsert extends QueryPromise {
  session;
  dialect;
  static [entityKind] = "MySqlInsert";
  config;
  constructor(table, values, ignore, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, ignore };
  }
  onDuplicateKeyUpdate(config) {
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
    this.config.onConflict = sql`update ${setSql}`;
    return this;
  }
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), undefined);
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self2 = this;
    return async function* (placeholderValues) {
      yield* self2.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
}
class MySqlViewBase extends View {
  static [entityKind] = "MySqlViewBase";
}
var MySqlViewConfig = Symbol.for("drizzle:MySqlViewConfig");
class MySqlDialect {
  static [entityKind] = "MySqlDialect";
  async migrate(migrations, session, config) {
    const migrationsTable = config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			create table if not exists ${sql.identifier(migrationsTable)} (
				id serial primary key,
				hash text not null,
				created_at bigint
			)
		`;
    await session.execute(migrationTableCreate);
    const dbMigrations = await session.all(sql`select id, hash, created_at from ${sql.identifier(migrationsTable)} order by created_at desc limit 1`);
    const lastDbMigration = dbMigrations[0];
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration.created_at) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.execute(sql.raw(stmt));
          }
          await tx.execute(sql`insert into ${sql.identifier(migrationsTable)} (\`hash\`, \`created_at\`) values(${migration.hash}, ${migration.folderMillis})`);
        }
      }
    });
  }
  escapeName(name2) {
    return `\`${name2}\``;
  }
  escapeParam(_num) {
    return `?`;
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildDeleteQuery({ table, where, returning }) {
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : undefined;
    const whereSql = where ? sql` where ${where}` : undefined;
    return sql`delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set) {
    const setEntries = Object.entries(set);
    const setSize = setEntries.length;
    return sql.fromList(setEntries.flatMap(([colName, value], i3) => {
      const col = table[Table.Symbol.Columns][colName];
      const res = sql`${sql.identifier(col.name)} = ${value}`;
      if (i3 < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table, set, where, returning }) {
    const setSql = this.buildUpdateSet(table, set);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : undefined;
    const whereSql = where ? sql` where ${where}` : undefined;
    return sql`update ${table} set ${setSql}${whereSql}${returningSql}`;
  }
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i3) => {
      const chunk = [];
      if (is4(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is4(field, SQL.Aliased) || is4(field, SQL)) {
        const query = is4(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(new SQL(query.queryChunks.map((c) => {
            if (is4(c, MySqlColumn)) {
              return sql.identifier(c.name);
            }
            return c;
          })));
        } else {
          chunk.push(query);
        }
        if (is4(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is4(field, Column)) {
        if (isSingleTable) {
          chunk.push(sql.identifier(field.name));
        } else {
          chunk.push(field);
        }
      }
      if (i3 < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.fromList(chunks);
  }
  buildSelectQuery({ withList, fields, fieldsFlat, where, having, table, joins, orderBy, groupBy, limit, offset, lockingClause, distinct }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f2 of fieldsList) {
      if (is4(f2.field, Column) && getTableName(f2.field.table) !== (is4(table, Subquery) ? table[SubqueryConfig].alias : is4(table, MySqlViewBase) ? table[ViewBaseConfig].name : is4(table, SQL) ? undefined : getTableName(table)) && !((table2) => joins.some(({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])))(f2.field.table)) {
        const tableName = getTableName(f2.field.table);
        throw new Error(`Your "${f2.path.join("->")}" field references a column "${tableName}"."${f2.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`);
      }
    }
    const isSingleTable = joins.length === 0;
    let withSql;
    if (withList?.length) {
      const withSqlChunks = [sql`with `];
      for (const [i3, w] of withList.entries()) {
        withSqlChunks.push(sql`${sql.identifier(w[SubqueryConfig].alias)} as (${w[SubqueryConfig].sql})`);
        if (i3 < withList.length - 1) {
          withSqlChunks.push(sql`, `);
        }
      }
      withSqlChunks.push(sql` `);
      withSql = sql.fromList(withSqlChunks);
    }
    const distinctSql = distinct ? sql` distinct` : undefined;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = (() => {
      if (is4(table, Table) && table[Table.Symbol.OriginalName] !== table[Table.Symbol.Name]) {
        return sql`${sql.identifier(table[Table.Symbol.OriginalName])} ${sql.identifier(table[Table.Symbol.Name])}`;
      }
      return table;
    })();
    const joinsArray = [];
    for (const [index, joinMeta] of joins.entries()) {
      if (index === 0) {
        joinsArray.push(sql` `);
      }
      const table2 = joinMeta.table;
      if (is4(table2, MySqlTable)) {
        const tableName = table2[MySqlTable.Symbol.Name];
        const tableSchema = table2[MySqlTable.Symbol.Schema];
        const origTableName = table2[MySqlTable.Symbol.OriginalName];
        const alias = tableName === origTableName ? undefined : joinMeta.alias;
        joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : undefined}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`);
      } else if (is4(table2, View)) {
        const viewName = table2[ViewBaseConfig].name;
        const viewSchema = table2[ViewBaseConfig].schema;
        const origViewName = table2[ViewBaseConfig].originalName;
        const alias = viewName === origViewName ? undefined : joinMeta.alias;
        joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join ${viewSchema ? sql`${sql.identifier(viewSchema)}.` : undefined}${sql.identifier(origViewName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`);
      } else {
        joinsArray.push(sql`${sql.raw(joinMeta.joinType)} join ${table2} on ${joinMeta.on}`);
      }
      if (index < joins.length - 1) {
        joinsArray.push(sql` `);
      }
    }
    const joinsSql = sql.fromList(joinsArray);
    const whereSql = where ? sql` where ${where}` : undefined;
    const havingSql = having ? sql` having ${having}` : undefined;
    const orderByList = [];
    for (const [index, orderByValue] of orderBy.entries()) {
      orderByList.push(orderByValue);
      if (index < orderBy.length - 1) {
        orderByList.push(sql`, `);
      }
    }
    const orderBySql = orderByList.length > 0 ? sql` order by ${sql.fromList(orderByList)}` : undefined;
    const groupByList = [];
    for (const [index, groupByValue] of groupBy.entries()) {
      groupByList.push(groupByValue);
      if (index < groupBy.length - 1) {
        groupByList.push(sql`, `);
      }
    }
    const groupBySql = groupByList.length > 0 ? sql` group by ${sql.fromList(groupByList)}` : undefined;
    const limitSql = limit ? sql` limit ${limit}` : undefined;
    const offsetSql = offset ? sql` offset ${offset}` : undefined;
    let lockingClausesSql;
    if (lockingClause) {
      const { config, strength } = lockingClause;
      lockingClausesSql = sql` for ${sql.raw(strength)}`;
      if (config.noWait) {
        lockingClausesSql.append(sql` no wait`);
      } else if (config.skipLocked) {
        lockingClausesSql.append(sql` skip locked`);
      }
    }
    return sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}${lockingClausesSql}`;
  }
  buildInsertQuery({ table, values, ignore, onConflict }) {
    const isSingleValue = values.length === 1;
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = isSingleValue ? Object.keys(values[0]).map((fieldName) => [fieldName, columns[fieldName]]) : Object.entries(columns);
    const insertOrder = colEntries.map(([, column]) => sql.identifier(column.name));
    for (const [valueIndex, value] of values.entries()) {
      const valueList = [];
      for (const [fieldName] of colEntries) {
        const colValue = value[fieldName];
        if (colValue === undefined || is4(colValue, Param) && colValue.value === undefined) {
          valueList.push(sql`default`);
        } else {
          valueList.push(colValue);
        }
      }
      valuesSqlList.push(valueList);
      if (valueIndex < values.length - 1) {
        valuesSqlList.push(sql`, `);
      }
    }
    const valuesSql = sql.fromList(valuesSqlList);
    const ignoreSql = ignore ? sql` ignore` : undefined;
    const onConflictSql = onConflict ? sql` on duplicate key ${onConflict}` : undefined;
    return sql`insert${ignoreSql} into ${table} ${insertOrder} values ${valuesSql}${onConflictSql}`;
  }
  sqlToQuery(sql2) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString
    });
  }
  buildRelationalQuery(fullSchema, schema2, tableNamesMap, table, tableConfig, config, tableAlias, relationColumns, isRoot = false) {
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      const selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: value,
        tableTsKey: undefined,
        isJson: false,
        selection: []
      }));
      return {
        tableTsKey: tableConfig.tsName,
        sql: table,
        selection
      };
    }
    const aliasedColumns = Object.fromEntries(Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)]));
    const aliasedRelations = Object.fromEntries(Object.entries(tableConfig.relations).map(([key, value]) => [key, aliasedRelation(value, tableAlias)]));
    const aliasedFields = Object.assign({}, aliasedColumns, aliasedRelations);
    const fieldsSelection = {};
    let selectedColumns = [];
    let selectedExtras = [];
    let selectedRelations = [];
    if (config.columns) {
      let isIncludeMode = false;
      for (const [field, value] of Object.entries(config.columns)) {
        if (value === undefined) {
          continue;
        }
        if (field in tableConfig.columns) {
          if (!isIncludeMode && value === true) {
            isIncludeMode = true;
          }
          selectedColumns.push(field);
        }
      }
      if (selectedColumns.length > 0) {
        selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
      }
    }
    if (config.with) {
      selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([key, value]) => ({ key, value }));
    }
    if (!config.columns) {
      selectedColumns = Object.keys(tableConfig.columns);
    }
    if (config.extras) {
      const extrasOrig = typeof config.extras === "function" ? config.extras(aliasedFields, { sql }) : config.extras;
      selectedExtras = Object.entries(extrasOrig).map(([key, value]) => ({
        key,
        value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
      }));
    }
    for (const field of selectedColumns) {
      const column = tableConfig.columns[field];
      fieldsSelection[field] = column;
    }
    for (const { key, value } of selectedExtras) {
      fieldsSelection[key] = value;
    }
    let where;
    if (config.where) {
      const whereSql = typeof config.where === "function" ? config.where(aliasedFields, operators) : config.where;
      where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
    }
    const groupBy = (tableConfig.primaryKey.length ? tableConfig.primaryKey : Object.values(tableConfig.columns)).map((c) => aliasedTableColumn(c, tableAlias));
    let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedFields, orderByOperators) : config.orderBy ?? [];
    if (!Array.isArray(orderByOrig)) {
      orderByOrig = [orderByOrig];
    }
    const orderBy = orderByOrig.map((orderByValue) => {
      if (is4(orderByValue, Column)) {
        return aliasedTableColumn(orderByValue, tableAlias);
      }
      return mapColumnsInSQLToAlias(orderByValue, tableAlias);
    });
    const builtRelations = [];
    const builtRelationFields = [];
    let result;
    let selectedRelationIndex = 0;
    for (const { key: selectedRelationKey, value: selectedRelationValue } of selectedRelations) {
      let relation;
      for (const [relationKey, relationValue] of Object.entries(tableConfig.relations)) {
        if (is4(relationValue, Relation) && relationKey === selectedRelationKey) {
          relation = relationValue;
          break;
        }
      }
      if (!relation) {
        throw new Error(`Relation ${selectedRelationKey} not found`);
      }
      const normalizedRelation = normalizeRelation(schema2, tableNamesMap, relation);
      const relationAlias = `${tableAlias}_${selectedRelationKey}`;
      const builtRelation = this.buildRelationalQuery(fullSchema, schema2, tableNamesMap, fullSchema[tableNamesMap[relation.referencedTable[Table.Symbol.Name]]], schema2[tableNamesMap[relation.referencedTable[Table.Symbol.Name]]], selectedRelationValue, relationAlias, normalizedRelation.references);
      builtRelations.push({ key: selectedRelationKey, value: builtRelation });
      let relationWhere;
      if (typeof selectedRelationValue === "object" && selectedRelationValue.limit) {
        const field2 = sql`${sql.identifier(relationAlias)}.${sql.identifier("__drizzle_row_number")}`;
        relationWhere = and(relationWhere, or(and(sql`${field2} <= ${selectedRelationValue.limit}`), sql`(${field2} is null)`));
      }
      const join = {
        table: is4(builtRelation.sql, Table) ? aliasedTable(builtRelation.sql, relationAlias) : new Subquery(builtRelation.sql, {}, relationAlias),
        alias: relationAlias,
        on: and(...normalizedRelation.fields.map((field2, i3) => eq(aliasedTableColumn(field2, tableAlias), aliasedTableColumn(normalizedRelation.references[i3], relationAlias)))),
        joinType: "left"
      };
      const elseField = sql`json_arrayagg(json_array(${sql.join(builtRelation.selection.map(({ dbKey: key, isJson }) => {
        const field2 = sql`${sql.identifier(relationAlias)}.${sql.identifier(key)}`;
        return isJson ? sql`cast(${field2} as json)` : field2;
      }), sql`, `)}))`;
      const countSql = normalizedRelation.references.length === 1 ? aliasedTableColumn(normalizedRelation.references[0], relationAlias) : sql.fromList([
        sql`coalesce(`,
        sql.join(normalizedRelation.references.map((c) => aliasedTableColumn(c, relationAlias)), sql.raw(", ")),
        sql.raw(")")
      ]);
      const field = sql`if(count(${countSql}) = 0, '[]', ${elseField})`.as(selectedRelationKey);
      const builtRelationField = {
        path: [selectedRelationKey],
        field
      };
      result = this.buildSelectQuery({
        table: result ? new Subquery(result, {}, tableAlias) : aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: [
          ...Object.entries(tableConfig.columns).map(([tsKey, column]) => ({
            path: [tsKey],
            field: aliasedTableColumn(column, tableAlias)
          })),
          ...selectedRelationIndex === selectedRelations.length - 1 ? selectedExtras.map(({ key, value }) => ({
            path: [key],
            field: value
          })) : [],
          ...builtRelationFields.map(({ path, field: field2 }) => ({
            path,
            field: sql`${sql.identifier(tableAlias)}.${sql.identifier(field2.fieldAlias)}`
          })),
          builtRelationField
        ],
        where: relationWhere,
        groupBy,
        orderBy: selectedRelationIndex === selectedRelations.length - 1 ? orderBy : [],
        joins: [join]
      });
      builtRelationFields.push(builtRelationField);
      selectedRelationIndex++;
    }
    const finalFieldsSelection = Object.entries(fieldsSelection).map(([key, value]) => {
      return {
        path: [key],
        field: is4(value, Column) ? aliasedTableColumn(value, tableAlias) : value
      };
    });
    const finalFieldsFlat = isRoot ? [
      ...finalFieldsSelection.map(({ path, field }) => ({
        path,
        field: is4(field, SQL.Aliased) ? sql`${sql.identifier(field.fieldAlias)}` : field
      })),
      ...builtRelationFields.map(({ path, field }) => ({
        path,
        field: sql`cast(${sql.identifier(field.fieldAlias)} as json)`
      }))
    ] : [
      ...Object.entries(tableConfig.columns).map(([tsKey, column]) => ({
        path: [tsKey],
        field: aliasedTableColumn(column, tableAlias)
      })),
      ...selectedExtras.map(({ key, value }) => ({
        path: [key],
        field: value
      })),
      ...builtRelationFields.map(({ path, field }) => ({
        path,
        field: sql`${sql.identifier(tableAlias)}.${sql.identifier(field.fieldAlias)}`
      }))
    ];
    if (finalFieldsFlat.length === 0) {
      finalFieldsFlat.push({
        path: [],
        field: sql.raw("1")
      });
    }
    if (!isRoot && !config.limit && orderBy.length > 0) {
      finalFieldsFlat.push({
        path: ["__drizzle_row_number"],
        field: sql`row_number() over(order by ${sql.join(orderBy, sql`, `)})`
      });
    }
    let limit, offset;
    if (config.limit !== undefined || config.offset !== undefined) {
      if (isRoot) {
        limit = config.limit;
        offset = config.offset;
      } else {
        finalFieldsFlat.push({
          path: ["__drizzle_row_number"],
          field: sql`row_number() over(partition by ${relationColumns.map((c) => aliasedTableColumn(c, tableAlias))}${orderBy.length > 0 && !isRoot ? sql` order by ${sql.join(orderBy, sql`, `)}` : undefined})`.as("__drizzle_row_number")
        });
      }
    }
    result = this.buildSelectQuery({
      table: result ? new Subquery(result, {}, tableAlias) : aliasedTable(table, tableAlias),
      fields: {},
      fieldsFlat: finalFieldsFlat,
      where,
      groupBy: [],
      orderBy: isRoot ? orderBy : [],
      joins: [],
      limit,
      offset
    });
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection: [
        ...finalFieldsSelection.map(({ path, field }) => ({
          dbKey: is4(field, SQL.Aliased) ? field.fieldAlias : tableConfig.columns[path[0]].name,
          tsKey: path[0],
          field,
          tableTsKey: undefined,
          isJson: false,
          selection: []
        })),
        ...builtRelations.map(({ key, value }) => ({
          dbKey: key,
          tsKey: key,
          field: undefined,
          tableTsKey: value.tableTsKey,
          isJson: true,
          selection: value.selection
        }))
      ]
    };
  }
}

class MySqlSelectBuilder {
  static [entityKind] = "MySqlSelectBuilder";
  fields;
  session;
  dialect;
  withList = [];
  distinct;
  constructor(config) {
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    if (config.withList) {
      this.withList = config.withList;
    }
    this.distinct = config.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is4(source, Subquery)) {
      fields = Object.fromEntries(Object.keys(source[SubqueryConfig].selection).map((key) => [key, source[key]]));
    } else if (is4(source, MySqlViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is4(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new MySqlSelect({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
}

class MySqlSelectQueryBuilder extends TypedQueryBuilder {
  static [entityKind] = "MySqlSelectQueryBuilder";
  _;
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table,
      fields: { ...fields },
      joins: [],
      orderBy: [],
      groupBy: [],
      distinct
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is4(table, SQL)) {
          const selection = is4(table, Subquery) ? table[SubqueryConfig].selection : is4(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false]));
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  leftJoin = this.createJoin("left");
  rightJoin = this.createJoin("right");
  innerJoin = this.createJoin("inner");
  fullJoin = this.createJoin("full");
  where(where) {
    if (typeof where === "function") {
      where = where(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.where = where;
    return this;
  }
  having(having) {
    if (typeof having === "function") {
      having = having(new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })));
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](new Proxy(this.config.fields, new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })));
      this.config.orderBy = Array.isArray(orderBy) ? orderBy : [orderBy];
    } else {
      this.config.orderBy = columns;
    }
    return this;
  }
  limit(limit) {
    this.config.limit = limit;
    return this;
  }
  offset(offset) {
    this.config.offset = offset;
    return this;
  }
  for(strength, config = {}) {
    this.config.lockingClause = { strength, config };
    return this;
  }
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(new Subquery(this.getSQL(), this.config.fields, alias), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
  }
}

class MySqlSelect extends MySqlSelectQueryBuilder {
  static [entityKind] = "MySqlSelect";
  prepare() {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), fieldsList);
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self2 = this;
    return async function* (placeholderValues) {
      yield* self2.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
}
applyMixins(MySqlSelect, [QueryPromise]);

class QueryBuilder {
  static [entityKind] = "MySqlQueryBuilder";
  dialect;
  $with(alias) {
    const queryBuilder = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(queryBuilder);
        }
        return new Proxy(new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
      }
    };
  }
  with(...queries) {
    const self2 = this;
    function select(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: self2.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? undefined,
        session: undefined,
        dialect: self2.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new MySqlSelectBuilder({ fields: fields ?? undefined, session: undefined, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new MySqlSelectBuilder({
      fields: fields ?? undefined,
      session: undefined,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  getDialect() {
    if (!this.dialect) {
      this.dialect = new MySqlDialect;
    }
    return this.dialect;
  }
}

class MySqlUpdateBuilder {
  table;
  session;
  dialect;
  static [entityKind] = "MySqlUpdateBuilder";
  constructor(table, session, dialect) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
  }
  set(values) {
    return new MySqlUpdate(this.table, mapUpdateSet(this.table, values), this.session, this.dialect);
  }
}

class MySqlUpdate extends QueryPromise {
  session;
  dialect;
  static [entityKind] = "MySqlUpdate";
  config;
  constructor(table, set, session, dialect) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table };
  }
  where(where) {
    this.config.where = where;
    return this;
  }
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  prepare() {
    return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning);
  }
  execute = (placeholderValues) => {
    return this.prepare().execute(placeholderValues);
  };
  createIterator = () => {
    const self2 = this;
    return async function* (placeholderValues) {
      yield* self2.prepare().iterator(placeholderValues);
    };
  };
  iterator = this.createIterator();
}

class RelationalQueryBuilder {
  fullSchema;
  schema;
  tableNamesMap;
  table;
  tableConfig;
  dialect;
  session;
  static [entityKind] = "MySqlRelationalQueryBuilder";
  constructor(fullSchema, schema2, tableNamesMap, table, tableConfig, dialect, session) {
    this.fullSchema = fullSchema;
    this.schema = schema2;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  findMany(config) {
    return new MySqlRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? config : {}, "many");
  }
  findFirst(config) {
    return new MySqlRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.dialect, this.session, config ? { ...config, limit: 1 } : { limit: 1 }, "first");
  }
}

class MySqlRelationalQuery extends QueryPromise {
  fullSchema;
  schema;
  tableNamesMap;
  table;
  tableConfig;
  dialect;
  session;
  config;
  mode;
  static [entityKind] = "MySqlRelationalQuery";
  constructor(fullSchema, schema2, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema2;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
  }
  prepare() {
    const query = this.dialect.buildRelationalQuery(this.fullSchema, this.schema, this.tableNamesMap, this.table, this.tableConfig, this.config, this.tableConfig.tsName, [], true);
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return this.session.prepareQuery(builtQuery, undefined, (rawRows) => {
      const rows = rawRows.map((row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection));
      if (this.mode === "first") {
        return rows[0];
      }
      return rows;
    });
  }
  execute() {
    return this.prepare().execute();
  }
}

class MySqlDatabase {
  dialect;
  session;
  static [entityKind] = "MySqlDatabase";
  query;
  constructor(dialect, session, schema2) {
    this.dialect = dialect;
    this.session = session;
    this._ = schema2 ? { schema: schema2.schema, tableNamesMap: schema2.tableNamesMap } : { schema: undefined, tableNamesMap: {} };
    this.query = {};
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        this.query[tableName] = new RelationalQueryBuilder(schema2.fullSchema, this._.schema, this._.tableNamesMap, schema2.fullSchema[tableName], columns, dialect, session);
      }
    }
  }
  $with(alias) {
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder);
        }
        return new Proxy(new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true), new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" }));
      }
    };
  }
  with(...queries) {
    const self2 = this;
    function select(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? undefined,
        session: self2.session,
        dialect: self2.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new MySqlSelectBuilder({
        fields: fields ?? undefined,
        session: self2.session,
        dialect: self2.dialect,
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new MySqlSelectBuilder({ fields: fields ?? undefined, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new MySqlSelectBuilder({
      fields: fields ?? undefined,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  update(table) {
    return new MySqlUpdateBuilder(table, this.session, this.dialect);
  }
  insert(table) {
    return new MySqlInsertBuilder(table, this.session, this.dialect);
  }
  delete(table) {
    return new MySqlDelete(table, this.session, this.dialect);
  }
  execute(query) {
    return this.session.execute(query.getSQL());
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
}

class PreparedQuery {
  static [entityKind] = "MySqlPreparedQuery";
  joinsNotNullableMap;
}

class MySqlSession {
  dialect;
  static [entityKind] = "MySqlSession";
  constructor(dialect) {
    this.dialect = dialect;
  }
  execute(query) {
    return this.prepareQuery(this.dialect.sqlToQuery(query), undefined).execute();
  }
  getSetTransactionSQL(config) {
    const parts = [];
    if (config.isolationLevel) {
      parts.push(`isolation level ${config.isolationLevel}`);
    }
    return parts.length ? sql.fromList(["set transaction ", parts.join(" ")]) : undefined;
  }
  getStartTransactionSQL(config) {
    const parts = [];
    if (config.withConsistentSnapshot) {
      parts.push("with consistent snapshot");
    }
    if (config.accessMode) {
      parts.push(config.accessMode);
    }
    return parts.length ? sql.fromList(["start transaction ", parts.join(" ")]) : undefined;
  }
}

class MySqlTransaction extends MySqlDatabase {
  schema;
  nestedIndex;
  static [entityKind] = "MySqlTransaction";
  constructor(dialect, session, schema2, nestedIndex = 0) {
    super(dialect, session, schema2);
    this.schema = schema2;
    this.nestedIndex = nestedIndex;
  }
  rollback() {
    throw new TransactionRollbackError;
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/node_modules/drizzle-orm/planetscale-serverless/index.mjs
var drizzle = function(client, config = {}) {
  const dialect = new MySqlDialect;
  let logger;
  if (config.logger === true) {
    logger = new DefaultLogger;
  } else if (config.logger !== false) {
    logger = config.logger;
  }
  let schema2;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
    schema2 = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new PlanetscaleSession(client, dialect, undefined, schema2, { logger });
  return new MySqlDatabase(dialect, session, schema2);
};

class PlanetScalePreparedQuery extends PreparedQuery {
  client;
  queryString;
  params;
  logger;
  fields;
  customResultMapper;
  static [entityKind] = "PlanetScalePreparedQuery";
  rawQuery = { as: "object" };
  query = { as: "array" };
  constructor(client, queryString, params, logger, fields, customResultMapper) {
    super();
    this.client = client;
    this.queryString = queryString;
    this.params = params;
    this.logger = logger;
    this.fields = fields;
    this.customResultMapper = customResultMapper;
  }
  async execute(placeholderValues = {}) {
    const params = fillPlaceholders(this.params, placeholderValues);
    this.logger.logQuery(this.queryString, params);
    const { fields, client, queryString, rawQuery, query, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return client.execute(queryString, params, rawQuery);
    }
    const { rows } = await client.execute(queryString, params, query);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  iterator(_placeholderValues) {
    throw new Error("Streaming is not supported by the PlanetScale Serverless driver");
  }
}

class PlanetscaleSession extends MySqlSession {
  baseClient;
  schema;
  options;
  static [entityKind] = "PlanetscaleSession";
  logger;
  client;
  constructor(baseClient, dialect, tx, schema2, options = {}) {
    super(dialect);
    this.baseClient = baseClient;
    this.schema = schema2;
    this.options = options;
    this.client = tx ?? baseClient;
    this.logger = options.logger ?? new NoopLogger;
  }
  prepareQuery(query, fields, customResultMapper) {
    return new PlanetScalePreparedQuery(this.client, query.sql, query.params, this.logger, fields, customResultMapper);
  }
  async query(query, params) {
    this.logger.logQuery(query, params);
    return await this.client.execute(query, params, { as: "array" });
  }
  async queryObjects(query, params) {
    return this.client.execute(query, params, { as: "object" });
  }
  all(query) {
    const querySql = this.dialect.sqlToQuery(query);
    this.logger.logQuery(querySql.sql, querySql.params);
    return this.client.execute(querySql.sql, querySql.params, { as: "object" }).then((eQuery) => eQuery.rows);
  }
  transaction(transaction) {
    return this.baseClient.transaction((pstx) => {
      const session = new PlanetscaleSession(this.baseClient, this.dialect, pstx, this.schema, this.options);
      const tx = new PlanetScaleTransaction(this.dialect, session, this.schema);
      return transaction(tx);
    });
  }
}

class PlanetScaleTransaction extends MySqlTransaction {
  static [entityKind] = "PlanetScaleTransaction";
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex + 1}`;
    const tx = new PlanetScaleTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await tx.execute(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await tx.execute(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/common.ts
function createIntegrationForm({
  name: name2,
  schema: schema2
}) {
  return {
    name: name2,
    fields: schema2,
    general: { name: nameField },
    config: { name: nameField, ...schema2 }
  };
}
var nameField = {
  type: "text",
  label: "Integration Name",
  placeholder: "Enter a name for this integration..."
};

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/custom/api_key.ts
var apiKeyForm = createIntegrationForm({
  name: "api_key",
  schema: {
    username: {
      type: "text",
      label: "API Key Header"
    },
    password: {
      type: "secret",
      label: "API Key"
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/custom/basic-auth.ts
var basicAuthForm = createIntegrationForm({
  name: "basic_auth",
  schema: {
    username: {
      type: "text",
      label: "Username"
    },
    password: {
      type: "secret",
      label: "Password"
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/custom/hmac.ts
var hmacForm = createIntegrationForm({
  name: "hmac",
  schema: {
    algorithm: {
      type: "select",
      label: "Algorithm",
      placeholder: "Select...",
      options: ["SHA-1", "SHA-256", "SHA-512", "MD5"]
    },
    encoding: {
      type: "select",
      label: "Encoding",
      placeholder: "Select...",
      options: ["Hex", "base64"]
    },
    signature_header: {
      type: "text",
      label: "Signature Header Key",
      placeholder: "Enter the header key...",
      description: "The header key that contains the signature. This is usually `X-API-Signature`."
    },
    signature_secret: {
      type: "secret",
      label: "Signature Secret",
      placeholder: "Enter the secret...",
      description: "The secret used to sign the webhook payload."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/ayden.ts
var aydenForm = createIntegrationForm({
  name: "ayden",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Ayden ",
      placeholder: "Webhook secret..."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/github.ts
var githubForm = createIntegrationForm({
  name: "github",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your GitHub account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/gitlab.ts
var gitlabForm = createIntegrationForm({
  name: "gitlab",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "API key",
      placeholder: "API key...",
      description: "The webhook signing secret for your GitLab account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/jira.ts
var jiraForm = createIntegrationForm({
  name: "jira",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Stripe account. [Click here](https://dashboard.stripe.com/webhooks) to access the secret in Stripe."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/linear.ts
var linearForm = createIntegrationForm({
  name: "linear",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Linear account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/mailgun.ts
var mailgunForm = createIntegrationForm({
  name: "mailgun",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your mailgun account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/postmark.ts
var postmarkForm = createIntegrationForm({
  name: "postmark",
  schema: {
    username: {
      type: "text",
      label: "Username"
    },
    password: {
      type: "secret",
      label: "Password"
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/resend.ts
var resendForm = createIntegrationForm({
  name: "resend",
  schema: {
    apiKey: {
      type: "secret",
      label: "API Key",
      placeholder: "API key...",
      description: "The webhook API key for your Resend account. You can find it [here](https://resend.com/onboarding)."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/sendgrid.ts
var sendgridForm = createIntegrationForm({
  name: "sendgrid",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Sendgrid account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/shopify.ts
var shopifyForm = createIntegrationForm({
  name: "shopify",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Shopify account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/stripe.ts
var stripeForm = createIntegrationForm({
  name: "stripe",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Stripe account. [Click here](https://dashboard.stripe.com/webhooks) to access the secret in Stripe."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/svix.ts
var svixForm = createIntegrationForm({
  name: "svix",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Stripe account. [Click here](https://dashboard.stripe.com/webhooks) to access the secret in Stripe."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/vendor/typeform.ts
var typeformForm = createIntegrationForm({
  name: "typeform",
  schema: {
    webhookSigningSecret: {
      type: "secret",
      label: "Webhook Signing Secret",
      placeholder: "Secret key...",
      description: "The webhook signing secret for your Typeform account."
    }
  }
});

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/integrations/data.ts
var INTEGRATIONS = {
  hmac: {
    slug: "hmac",
    name: "HMAC",
    categories: ["development", "custom"],
    subtitle: "Verify the authenticity of the webhook request using HMAC.",
    features: ["authentication"],
    config: hmacForm
  },
  basic_auth: {
    slug: "basic_auth",
    name: "Basic Auth",
    categories: ["development", "custom"],
    subtitle: "Verify the authenticity of the webhook request using Basic Auth.",
    features: ["authentication"],
    config: basicAuthForm
  },
  api_key: {
    slug: "api_key",
    name: "API Key",
    categories: ["development", "custom"],
    subtitle: "Verify the authenticity of the webhook request using an API key.",
    features: ["authentication"],
    config: apiKeyForm
  },
  stripe: {
    slug: "stripe",
    name: "Stripe",
    categories: ["payment"],
    subtitle: "Easily integrate and automate webhook processing for Stripe, a comprehensive solution for online payments, and manage transactions more efficiently.",
    features: ["database", "authentication"],
    config: stripeForm
  },
  github: {
    slug: "github",
    name: "GitHub",
    categories: ["development", "project_management"],
    subtitle: "Streamline your development and project management processes with automated webhook handling for GitHub, a platform that revolutionized collaboration in coding.",
    features: ["authentication"],
    config: githubForm
  },
  shopify: {
    slug: "shopify",
    name: "Shopify",
    categories: ["development", "payment"],
    subtitle: "Simplify e-commerce transaction processing by integrating Shopify's webhook services, making online store management and payments a breeze.",
    features: ["authentication"],
    config: shopifyForm
  },
  gitlab: {
    slug: "gitlab",
    name: "GitLab",
    categories: ["development", "project_management"],
    subtitle: "Supercharge your GitLab experience by integrating webhook processing, thereby accelerating your software development and project management tasks.",
    features: ["authentication"],
    config: gitlabForm
  },
  linear: {
    slug: "linear",
    name: "Linear",
    categories: ["project_management"],
    subtitle: "Empower your project management capabilities by integrating webhook processing for Linear, thereby ensuring seamless issue tracking and task assignments.",
    features: ["authentication"],
    config: linearForm
  },
  postmark: {
    slug: "postmark",
    name: "Postmark",
    categories: ["crm", "communication"],
    subtitle: "Improve your CRM and communication processes with Postmark by enabling efficient webhook processing, ensuring timely email deliveries and customer interactions.",
    features: ["authentication"],
    config: postmarkForm
  },
  typeform: {
    slug: "typeform",
    name: "Typeform",
    categories: ["development"],
    subtitle: "Enhance your application's interaction capabilities by integrating with Typeform's webhook services, turning responses into actionable insights quickly and easily.",
    features: ["database", "authentication"],
    config: typeformForm
  },
  mailgun: {
    slug: "mailgun",
    name: "Mailgun",
    categories: ["crm", "communication"],
    subtitle: "Optimize your CRM and communication strategies by integrating Mailgun's webhook services, ensuring efficient email delivery and performance tracking.",
    features: ["authentication"],
    config: mailgunForm
  },
  sendgrid: {
    slug: "sendgrid",
    name: "Sendgrid",
    categories: ["crm", "communication"],
    subtitle: "Enhance your email communication workflows with Sendgrid's webhooks, for more effective engagement tracking and customer communication.",
    features: ["authentication"],
    config: sendgridForm
  },
  resend: {
    slug: "resend",
    name: "Resend",
    categories: ["crm", "communication"],
    subtitle: "Boost your CRM and communication efforts by integrating Resend's webhook services, guaranteeing efficient message delivery and user engagement tracking.",
    features: ["authentication"],
    config: resendForm
  },
  ayden: {
    slug: "ayden",
    name: "Ayden",
    categories: ["payment"],
    subtitle: "Take control of your online payments by integrating Ayden's webhooks, enabling seamless and secure transaction processing for your business.",
    features: ["authentication"],
    disabled: true,
    config: aydenForm
  },
  jira: {
    slug: "jira",
    name: "Jira",
    categories: ["project_management"],
    subtitle: "Enhance your project management workflows by integrating with Jira's webhook system, providing real-time updates and issue tracking capabilities.",
    features: ["authentication"],
    config: jiraForm,
    disabled: true
  },
  svix: {
    slug: "svix",
    name: "Svix",
    categories: ["development"],
    subtitle: "Facilitate your development process with Svix, seamlessly connecting your application's webhook events, and reduce the overhead of webhook management.",
    features: ["authentication"],
    config: svixForm,
    disabled: true
  }
};

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/orm/db-table.ts
class DrizzleTable {
  table;
  db;
  name;
  constructor(name2, table, db) {
    this.name = name2;
    this.table = table;
    this.db = db;
  }
  insert(data) {
    return this.db.insert(this.table).values(...data);
  }
  delete(data) {
    return this.db.delete(this.table).where(...data);
  }
  update(data) {
    return this.db.update(this.table).set(...data);
  }
  select(data) {
    return data ? this.db.select(...data).from(this.table) : this.db.select().from(this.table);
  }
  get selectDistinct() {
    return (data) => this.db.selectDistinct(this.table).from(...data);
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/schema/index.ts
var exports_schema = {};
__export(exports_schema, {
  sourceRelations: () => {
    {
      return sourceRelations;
    }
  },
  source: () => {
    {
      return source;
    }
  },
  organizations: () => {
    {
      return organizations;
    }
  },
  organizationRelations: () => {
    {
      return organizationRelations;
    }
  },
  organizationMembers: () => {
    {
      return organizationMembers;
    }
  },
  organizationMemberRelations: () => {
    {
      return organizationMemberRelations;
    }
  },
  organizationInvites: () => {
    {
      return organizationInvites;
    }
  },
  organizationInviteRelations: () => {
    {
      return organizationInviteRelations;
    }
  },
  integrationRelations: () => {
    {
      return integrationRelations;
    }
  },
  integration: () => {
    {
      return integration;
    }
  },
  destinationRelations: () => {
    {
      return destinationRelations;
    }
  },
  destination: () => {
    {
      return destination;
    }
  },
  connectionRelations: () => {
    {
      return connectionRelations;
    }
  },
  connection: () => {
    {
      return connection;
    }
  },
  apiKeys: () => {
    {
      return apiKeys;
    }
  }
});
// /Users/makisuo/Documents/GitHub/Hazel/packages/db/node_modules/drizzle-orm/mysql-core/index.mjs
var boolean = function(name2) {
  return new MySqlBooleanBuilder(name2);
};
var datetime = function(name2, config = {}) {
  if (config.mode === "string") {
    return new MySqlDateTimeStringBuilder(name2, config);
  }
  return new MySqlDateTimeBuilder(name2, config);
};
var mysqlEnum = function(name2, values) {
  if (values.length === 0) {
    throw new Error(`You have an empty array for "${name2}" enum values`);
  }
  return new MySqlEnumColumnBuilder(name2, values);
};
var int = function(name2) {
  return new MySqlIntBuilder(name2);
};
var json = function(name2) {
  return new MySqlJsonBuilder(name2);
};
var serial = function(name2) {
  return new MySqlSerialBuilder(name2);
};
var timestamp = function(name2, config = {}) {
  if (config.mode === "string") {
    return new MySqlTimestampStringBuilder(name2, config);
  }
  return new MySqlTimestampBuilder(name2, config);
};
var varchar = function(name2, config) {
  return new MySqlVarCharBuilder(name2, config);
};
var index = function(name2) {
  return new IndexBuilderOn(name2, false);
};
var uniqueIndex = function(name2) {
  return new IndexBuilderOn(name2, true);
};
class MySqlBinary extends MySqlColumn {
  static [entityKind] = "MySqlBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === undefined ? `binary` : `binary(${this.length})`;
  }
}

class MySqlBooleanBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlBooleanBuilder";
  build(table) {
    return new MySqlBoolean(table, this.config);
  }
}

class MySqlBoolean extends MySqlColumn {
  static [entityKind] = "MySqlBoolean";
  getSQLType() {
    return "boolean";
  }
  mapFromDriverValue(value) {
    if (typeof value === "boolean") {
      return value;
    }
    return value === 1;
  }
}
class MySqlChar extends MySqlColumn {
  static [entityKind] = "MySqlChar";
  length = this.config.length;
  enumValues = this.config.enum ?? [];
  getSQLType() {
    return this.length === undefined ? `char` : `char(${this.length})`;
  }
}
class MySqlDateTimeBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateTimeBuilder";
  constructor(name2, config) {
    super(name2);
    this.config.fsp = config?.fsp;
  }
  build(table) {
    return new MySqlDateTime(table, this.config);
  }
}

class MySqlDateTime extends MySqlColumn {
  static [entityKind] = "MySqlDateTime";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === undefined ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
  mapFromDriverValue(value) {
    return new Date(value);
  }
}

class MySqlDateTimeStringBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateTimeStringBuilder";
  constructor(name2, config) {
    super(name2);
    this.config.fsp = config?.fsp;
  }
  build(table) {
    return new MySqlDateTimeString(table, this.config);
  }
}

class MySqlDateTimeString extends MySqlColumn {
  static [entityKind] = "MySqlDateTimeString";
  fsp;
  constructor(table, config) {
    super(table, config);
    this.fsp = config.fsp;
  }
  getSQLType() {
    const precision = this.fsp === undefined ? "" : `(${this.fsp})`;
    return `datetime${precision}`;
  }
}
class MySqlDecimal extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlDecimal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== undefined && this.scale !== undefined) {
      return `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === undefined) {
      return "decimal";
    } else {
      return `decimal(${this.precision})`;
    }
  }
}
class MySqlDouble extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlDouble";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== undefined && this.scale !== undefined) {
      return `double(${this.precision},${this.scale})`;
    } else if (this.precision === undefined) {
      return "double";
    } else {
      return `double(${this.precision})`;
    }
  }
}

class MySqlEnumColumnBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlEnumColumnBuilder";
  constructor(name2, values) {
    super(name2);
    this.config.enumValues = values;
  }
  build(table) {
    return new MySqlEnumColumn(table, this.config);
  }
}

class MySqlEnumColumn extends MySqlColumn {
  static [entityKind] = "MySqlEnumColumn";
  enumValues = this.config.enumValues;
  getSQLType() {
    return `enum(${this.enumValues.map((value) => `'${value}'`).join(",")})`;
  }
}
class MySqlIntBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlIntBuilder";
  build(table) {
    return new MySqlInt(table, this.config);
  }
}

class MySqlInt extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlInt";
  getSQLType() {
    return "int";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}

class MySqlJsonBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlJsonBuilder";
  build(table) {
    return new MySqlJson(table, this.config);
  }
}

class MySqlJson extends MySqlColumn {
  static [entityKind] = "MySqlJson";
  getSQLType() {
    return "json";
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
class MySqlReal extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlReal";
  precision = this.config.precision;
  scale = this.config.scale;
  getSQLType() {
    if (this.precision !== undefined && this.scale !== undefined) {
      return `real(${this.precision}, ${this.scale})`;
    } else if (this.precision === undefined) {
      return "real";
    } else {
      return `real(${this.precision})`;
    }
  }
}

class MySqlSerialBuilder extends MySqlColumnBuilderWithAutoIncrement {
  static [entityKind] = "MySqlSerialBuilder";
  constructor(name2) {
    super(name2);
    this.config.hasDefault = true;
    this.config.autoIncrement = true;
  }
  build(table) {
    return new MySqlSerial(table, this.config);
  }
}

class MySqlSerial extends MySqlColumnWithAutoIncrement {
  static [entityKind] = "MySqlSerial";
  getSQLType() {
    return "serial";
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  }
}
class MySqlText extends MySqlColumn {
  static [entityKind] = "MySqlText";
  textType = this.config.textType;
  enumValues = this.config.enumValues ?? [];
  getSQLType() {
    return this.textType;
  }
}
class MySqlTime extends MySqlColumn {
  static [entityKind] = "MySqlTime";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === undefined ? "" : `(${this.fsp})`;
    return `time${precision}`;
  }
}

class MySqlDateColumnBaseBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlDateColumnBuilder";
  defaultNow() {
    return this.default(sql`(now())`);
  }
  onUpdateNow() {
    this.config.hasOnUpdateNow = true;
    this.config.hasDefault = true;
    return this;
  }
}

class MySqlDateBaseColumn extends MySqlColumn {
  static [entityKind] = "MySqlDateColumn";
  hasOnUpdateNow = this.config.hasOnUpdateNow;
}

class MySqlTimestampBuilder extends MySqlDateColumnBaseBuilder {
  static [entityKind] = "MySqlTimestampBuilder";
  constructor(name2, config) {
    super(name2);
    this.config.fsp = config?.fsp;
  }
  build(table) {
    return new MySqlTimestamp(table, this.config);
  }
}

class MySqlTimestamp extends MySqlDateBaseColumn {
  static [entityKind] = "MySqlTimestamp";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === undefined ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
  mapFromDriverValue(value) {
    return new Date(value + "+0000");
  }
  mapToDriverValue(value) {
    return value.toISOString().slice(0, 19).replace("T", " ");
  }
}

class MySqlTimestampStringBuilder extends MySqlDateColumnBaseBuilder {
  static [entityKind] = "MySqlTimestampStringBuilder";
  constructor(name2, config) {
    super(name2);
    this.config.fsp = config?.fsp;
  }
  build(table) {
    return new MySqlTimestampString(table, this.config);
  }
}

class MySqlTimestampString extends MySqlDateBaseColumn {
  static [entityKind] = "MySqlTimestampString";
  fsp = this.config.fsp;
  getSQLType() {
    const precision = this.fsp === undefined ? "" : `(${this.fsp})`;
    return `timestamp${precision}`;
  }
}
class MySqlVarBinary extends MySqlColumn {
  static [entityKind] = "MySqlVarBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === undefined ? `varbinary` : `varbinary(${this.length})`;
  }
}

class MySqlVarCharBuilder extends MySqlColumnBuilder {
  static [entityKind] = "MySqlVarCharBuilder";
  constructor(name2, config) {
    super(name2);
    this.config.length = config.length;
    this.config.enum = config.enum;
  }
  build(table) {
    return new MySqlVarChar(table, this.config);
  }
}

class MySqlVarChar extends MySqlColumn {
  static [entityKind] = "MySqlVarChar";
  length = this.config.length;
  enumValues = this.config.enum ?? [];
  getSQLType() {
    return this.length === undefined ? `varchar` : `varchar(${this.length})`;
  }
}
class IndexBuilderOn {
  name;
  unique;
  static [entityKind] = "MySqlIndexBuilderOn";
  constructor(name2, unique2) {
    this.name = name2;
    this.unique = unique2;
  }
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
}

class IndexBuilder {
  static [entityKind] = "MySqlIndexBuilder";
  config;
  constructor(name2, columns, unique2) {
    this.config = {
      name: name2,
      columns,
      unique: unique2
    };
  }
  using(using) {
    this.config.using = using;
    return this;
  }
  algorythm(algorythm) {
    this.config.algorythm = algorythm;
    return this;
  }
  lock(lock) {
    this.config.lock = lock;
    return this;
  }
  build(table) {
    return new Index(this.config, table);
  }
}

class Index {
  static [entityKind] = "MySqlIndex";
  config;
  constructor(config, table) {
    this.config = { ...config, table };
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/node_modules/nanoid/index.browser.js
var nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
  byte &= 63;
  if (byte < 36) {
    id += byte.toString(36);
  } else if (byte < 62) {
    id += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id += "-";
  } else {
    id += "_";
  }
  return id;
}, "");

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/schema/common.ts
var commonFields = {
  id: serial("id").primaryKey().autoincrement(),
  workspaceId: varchar("workspace_id", { length: 128 }).notNull(),
  publicId: varchar("public_id", { length: 21 }).unique().notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: timestamp("deleted_at")
};
var buildMysqlTable = (name2, fields, extraConfig) => {
  return mysqlTable(name2, {
    ...commonFields,
    ...fields
  }, extraConfig);
};
var buildCustomMysqlTable = (name2, fields, extraConfig) => {
  return mysqlTable(name2, fields, extraConfig);
};
var generatePublicId = (prefix) => {
  return `${prefix}_${nanoid(21 - (prefix.length + 1))}`;
};

// /Users/makisuo/Documents/GitHub/Hazel/packages/db/src/drizzle/schema/index.ts
var name2 = varchar("name", { length: 64 }).notNull();
var url = varchar("url", { length: 128 });
var enabled = boolean("enabled").default(true).notNull();
var source = buildMysqlTable("sources", {
  name: name2,
  url,
  integrationId: int("integration_id")
}, (table) => ({
  publicIdIndex: index("src_public_id_idx").on(table.publicId),
  workspaceIdIndex: index("src_workspace_id_idx").on(table.workspaceId),
  integrationIdIndex: index("src_integration_id_idx").on(table.integrationId)
}));
var integration = buildMysqlTable("integrations", {
  name: name2,
  tool: mysqlEnum("tool", Object.keys(INTEGRATIONS)).notNull(),
  config: json("config")
}, (table) => ({
  publicIdIndex: index("itg_public_id_idx").on(table.publicId),
  workspaceIdIndex: index("itg_workspace_id_idx").on(table.workspaceId),
  nameIndex: index("itg_name_idx").on(table.name)
}));
var destination = buildMysqlTable("destinations", {
  name: name2,
  url: url.notNull(),
  websocket_connection: boolean("websocket_connection").default(false).notNull()
}, (table) => ({
  publicIdIndex: index("dst_public_id_idx").on(table.publicId),
  workspaceIdIndex: index("dst_workspace_id_idx").on(table.workspaceId)
}));
var connection = buildMysqlTable("connections", {
  name: name2,
  enabled,
  sourceId: int("source_id").notNull(),
  destinationId: int("destination_id").notNull(),
  delay: int("delay"),
  retyCount: int("retry_count"),
  retryDelay: int("retry_delay"),
  retryType: mysqlEnum("retry_type", ["fixed", "exponential"]),
  fluxConfig: json("flux_config")
}, (table) => ({
  publicIdIndex: uniqueIndex("con_public_id_idx").on(table.publicId),
  workspaceIdIndex: index("con_workspace_id_idx").on(table.workspaceId),
  sourceIdIndex: index("con_source_id_idx").on(table.sourceId),
  destinationIndex: index("con_destination_id_idx").on(table.destinationId),
  unq: unique().on(table.sourceId, table.destinationId)
}));
var apiKeys = buildMysqlTable("api_keys", {
  ownerId: varchar("owner_id", { length: 128 }),
  name: varchar("name", { length: 128 }),
  expires: datetime("expires", { fsp: 3 })
}, (table) => ({
  publicIdx: uniqueIndex("api_public_idx").on(table.publicId)
}));
var organizations = buildCustomMysqlTable("organizations", {
  id: serial("id").primaryKey().autoincrement(),
  publicId: varchar("public_id", { length: 21 }).unique().notNull(),
  ownerId: varchar("owner_id", { length: 128 }).notNull(),
  personal: boolean("personal").default(false).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: timestamp("deleted_at"),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull()
}, (table) => ({
  slugIdx: uniqueIndex("org_slug_idx").on(table.slug),
  publicIdx: uniqueIndex("public_idx").on(table.publicId)
}));
var organizationMembers = buildMysqlTable("organization_members", {
  id: serial("id").primaryKey().autoincrement(),
  publicId: varchar("public_id", { length: 21 }).unique().notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  deletedAt: timestamp("deleted_at"),
  customerId: varchar("customer_id", { length: 128 }).notNull(),
  organizationId: int("organization_id").notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).notNull()
}, (table) => ({
  publicIdx: uniqueIndex("public_idx").on(table.publicId),
  customerIdx: uniqueIndex("customer_id_idx").on(table.customerId),
  roleIdx: uniqueIndex("role_id_idx").on(table.role),
  organizationIdx: uniqueIndex("org_id_idx").on(table.organizationId)
}));
var organizationInvites = buildMysqlTable("organization_invites", {
  id: serial("id").primaryKey().autoincrement(),
  publicId: varchar("public_id", { length: 21 }).unique().notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  revokedAt: timestamp("revoked_at"),
  email: varchar("email", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["owner", "admin", "member"]).notNull(),
  organizationId: int("organization_id").notNull()
}, (table) => ({
  publicIdx: uniqueIndex("public_idx").on(table.publicId),
  emailIdx: uniqueIndex("email_idx").on(table.email)
}));
var organizationRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  invites: many(organizationInvites)
}));
var organizationMemberRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id]
  })
}));
var organizationInviteRelations = relations(organizationInvites, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationInvites.organizationId],
    references: [organizations.id]
  })
}));
var sourceRelations = relations(source, ({ many, one }) => ({
  connections: many(connection),
  integration: one(integration, {
    fields: [source.integrationId],
    references: [integration.id]
  })
}));
var destinationRelations = relations(destination, ({ many, one }) => ({
  connections: many(connection)
}));
var integrationRelations = relations(integration, ({ many }) => ({
  source: many(source)
}));
var connectionRelations = relations(connection, ({ one }) => ({
  destination: one(destination, {
    fields: [connection.destinationId],
    references: [destination.id]
  }),
  source: one(source, {
    fields: [connection.sourceId],
    references: [source.id]
  })
}));

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/db/src/drizzle/index.ts
function connectDB({
  username,
  host,
  password
}) {
  const client = connect({
    username,
    host,
    password
  });
  const db = drizzle(client, { schema: exports_schema });
  return {
    db,
    source: {
      table: new DrizzleTable("source", source, db),
      getOne: async ({
        publicId,
        includeDeleted
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(source.publicId, publicId), isNull3(source.deletedAt));
        } else {
          filter = eq(source.publicId, publicId);
        }
        return db.query.source.findFirst({
          where: filter,
          with: {
            connections: {
              with: {
                destination: true
              }
            },
            integration: true
          }
        });
      },
      getMany: async ({
        workspaceId,
        includeDeleted
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(source.workspaceId, workspaceId), isNull3(source.deletedAt));
        } else {
          filter = eq(source.workspaceId, workspaceId);
        }
        return await db.query.source.findMany({
          where: filter,
          with: {
            connections: {
              with: {
                destination: true
              }
            },
            integration: true
          }
        });
      },
      create: async (data2) => {
        const publicId = generatePublicId("src");
        const res = await db.insert(source).values({
          ...data2,
          publicId
        });
        return { res, publicId };
      },
      update: async (data2) => {
        const { publicId, ...rest } = data2;
        const res = await db.update(source).set(rest).where(eq(source.publicId, publicId));
        return { res, publicId };
      },
      markAsDeleted: async ({ publicId }) => {
        const res = await db.update(source).set({
          deletedAt: new Date
        }).where(eq(source.publicId, publicId));
        return { res };
      }
    },
    destination: {
      table: new DrizzleTable("destination", destination, db),
      getOne: async ({
        publicId,
        includeDeleted
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(destination.publicId, publicId), isNull3(destination.deletedAt));
        } else {
          filter = eq(destination.publicId, publicId);
        }
        return await db.query.destination.findFirst({
          where: filter
        });
      },
      getMany: async ({
        workspaceId,
        includeDeleted
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(destination.workspaceId, workspaceId), isNull3(destination.deletedAt));
        } else {
          filter = eq(destination.workspaceId, workspaceId);
        }
        return await db.query.destination.findMany({
          where: filter,
          with: {
            connections: {
              with: {
                source: true
              }
            }
          }
        });
      },
      create: async (data2) => {
        const publicId = generatePublicId("dst");
        const res = await db.insert(destination).values({
          ...data2,
          publicId
        });
        return { res, publicId };
      },
      update: async (data2) => {
        const { publicId, ...rest } = data2;
        const res = await db.update(destination).set(rest).where(eq(destination.publicId, publicId));
        return { res, publicId };
      },
      markAsDeleted: async ({ publicId }) => {
        const res = await db.update(destination).set({
          deletedAt: new Date
        }).where(eq(destination.publicId, publicId));
        return { res };
      }
    },
    connection: {
      table: new DrizzleTable("connection", connection, db),
      getOne: async ({
        publicId,
        includeDeleted
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(connection.publicId, publicId), isNull3(connection.deletedAt));
        } else {
          filter = eq(connection.publicId, publicId);
        }
        return await db.query.connection.findFirst({
          where: filter,
          with: {
            destination: true,
            source: true
          }
        });
      },
      getMany: async ({
        workspaceId,
        includeDeleted
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(connection.workspaceId, workspaceId), isNull3(connection.deletedAt));
        } else {
          filter = eq(connection.workspaceId, workspaceId);
        }
        return await db.query.connection.findMany({
          where: filter,
          with: {
            destination: true,
            source: true
          }
        });
      },
      create: async (data2) => {
        const publicId = generatePublicId("con");
        const res = await db.insert(connection).values({
          ...data2,
          publicId
        });
        return { res, publicId };
      },
      update: async (data2) => {
        const { publicId, ...rest } = data2;
        const res = await db.update(connection).set(rest).where(eq(connection.publicId, publicId));
        return { res, publicId };
      },
      markAsDeleted: async ({ publicId }) => {
        const res = await db.update(connection).set({
          deletedAt: new Date
        }).where(eq(connection.publicId, publicId));
        return { res };
      }
    },
    integration: {
      table: new DrizzleTable("integration", integration, db),
      getOne: async ({
        publicId,
        includeDeleted = false
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(integration.publicId, publicId), isNull3(integration.deletedAt));
        } else {
          filter = eq(integration.publicId, publicId);
        }
        return await db.query.integration.findFirst({
          where: filter,
          with: {
            source: true
          }
        });
      },
      getMany: async ({
        workspaceId,
        includeDeleted = false
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(integration.workspaceId, workspaceId), isNull3(integration.deletedAt));
        } else {
          filter = eq(integration.workspaceId, workspaceId);
        }
        return await db.query.integration.findMany({
          where: filter,
          with: {
            source: true
          }
        });
      },
      create: async (data2) => {
        const publicId = generatePublicId("itg");
        const res = await db.insert(integration).values({
          ...data2,
          publicId
        });
        return { res, publicId };
      },
      update: async (data2) => {
        const res = await db.update(integration).set(data2).where(eq(integration.publicId, data2.publicId));
        return { res };
      },
      markAsDeleted: async ({ publicId }) => {
        const res = await db.update(integration).set({
          deletedAt: new Date
        }).where(eq(integration.publicId, publicId));
        return { res };
      }
    },
    api: {
      getOne: async ({
        publicId
      }) => {
        return await db.query.apiKeys.findFirst({
          where: and(eq(apiKeys.publicId, publicId), isNull3(apiKeys.deletedAt))
        });
      },
      getMany: async ({
        workspaceId,
        includeDeleted = false
      }) => {
        let filter;
        if (!includeDeleted) {
          filter = and(eq(apiKeys.workspaceId, workspaceId), isNull3(apiKeys.deletedAt));
        } else {
          filter = eq(apiKeys.workspaceId, workspaceId);
        }
        return await db.query.apiKeys.findMany({
          where: filter
        });
      },
      create: async (data2) => {
        const publicId = generatePublicId("sk");
        const res = await db.insert(apiKeys).values({
          ...data2,
          publicId
        });
        return { res, publicId };
      },
      update: async (data2) => {
        const res = await db.update(apiKeys).set(data2).where(eq(apiKeys.publicId, data2.publicId));
        return { res };
      },
      markAsDeleted: async ({ publicId }) => {
        const res = await db.update(apiKeys).set({
          deletedAt: new Date
        }).where(eq(apiKeys.publicId, publicId));
        return { res };
      }
    },
    organization: {
      getOne: async ({
        publicId
      }) => {
        return db.query.organizations.findFirst({
          where: and(eq(organizations.publicId, publicId), isNull3(organizations.deletedAt)),
          with: {
            members: true,
            invites: true
          }
        });
      },
      getPersonal: async ({
        customerId
      }) => {
        return db.query.organizations.findFirst({
          where: and(eq(organizations.ownerId, customerId), eq(organizations.personal, true))
        });
      },
      create: async (data2) => {
        const publicId = generatePublicId("org");
        const res = await db.insert(organizations).values({
          ...data2,
          publicId
        });
        return { res, publicId };
      },
      update: async (data2) => {
        const res = await db.update(organizations).set(data2).where(eq(organizations.publicId, data2.publicId));
        return { res };
      },
      markAsDeleted: async ({ publicId }) => {
        const res = await db.update(organizations).set({
          deletedAt: new Date
        }).where(eq(organizations.publicId, publicId));
        return { res };
      },
      memberships: {
        getMany: async ({
          customerId
        }) => {
          const memberShips = db.query.organizationMembers.findMany({
            where: eq(organizationMembers.customerId, customerId),
            with: {
              organization: true
            }
          });
          return memberShips;
        }
      }
    }
  };
}
var drizzle_default = connectDB({
  host: process.env.PLANETSCALE_DB_HOST,
  username: process.env.PLANETSCALE_DB_USERNAME,
  password: process.env.PLANETSCALE_DB_PASSWORD
});

// src/routes/v1/connections.ts
init_dist5();

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/@elysiajs/bearer/dist/index.js
var bearer = ({ extract: { body = "access_token", query = "access_token", header = "Bearer" } = {
  body: "access_token",
  query: "access_token",
  header: "Bearer"
} } = {
  extract: {
    body: "access_token",
    query: "access_token",
    header: "Bearer"
  }
}) => (app) => app.derive(({ query: queries, headers: { authorization } }) => ({
  get bearer() {
    if (authorization?.startsWith(header))
      return authorization.slice(header.length + 1);
    const q = queries[query];
    if (q)
      return q;
  }
}));
var dist_default3 = bearer;

// src/guard/ratelimit.guard.ts
var ratelimit = __toESM(require_dist2(), 1);

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/error.js
class UpstashError extends Error {
  constructor(message) {
    super(message);
    this.name = "UpstashError";
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/util.js
var parseRecursive = function(obj) {
  const parsed = Array.isArray(obj) ? obj.map((o) => {
    try {
      return parseRecursive(o);
    } catch {
      return o;
    }
  }) : JSON.parse(obj);
  if (typeof parsed === "number" && parsed.toString() != obj) {
    return obj;
  }
  return parsed;
};
function parseResponse(result) {
  try {
    return parseRecursive(result);
  } catch {
    return result;
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/command.js
var defaultSerializer = (c) => {
  switch (typeof c) {
    case "string":
    case "number":
    case "boolean":
      return c;
    default:
      return JSON.stringify(c);
  }
};

class Command {
  constructor(command, opts) {
    Object.defineProperty(this, "command", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "serialize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "deserialize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.serialize = defaultSerializer;
    this.deserialize = typeof opts?.automaticDeserialization === "undefined" || opts.automaticDeserialization ? opts?.deserialize ?? parseResponse : (x) => x;
    this.command = command.map((c) => this.serialize(c));
  }
  async exec(client) {
    const { result, error: error4 } = await client.request({
      body: this.command
    });
    if (error4) {
      throw new UpstashError(error4);
    }
    if (typeof result === "undefined") {
      throw new Error("Request did not return a result");
    }
    return this.deserialize(result);
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/append.js
class AppendCommand extends Command {
  constructor(cmd, opts) {
    super(["append", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/bitcount.js
class BitCountCommand extends Command {
  constructor([key, start, end], opts) {
    const command3 = ["bitcount", key];
    if (typeof start === "number") {
      command3.push(start);
    }
    if (typeof end === "number") {
      command3.push(end);
    }
    super(command3, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/bitop.js
class BitOpCommand extends Command {
  constructor(cmd, opts) {
    super(["bitop", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/bitpos.js
class BitPosCommand extends Command {
  constructor(cmd, opts) {
    super(["bitpos", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/dbsize.js
class DBSizeCommand extends Command {
  constructor(opts) {
    super(["dbsize"], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/decr.js
class DecrCommand extends Command {
  constructor(cmd, opts) {
    super(["decr", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/decrby.js
class DecrByCommand extends Command {
  constructor(cmd, opts) {
    super(["decrby", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/del.js
class DelCommand extends Command {
  constructor(cmd, opts) {
    super(["del", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/echo.js
class EchoCommand extends Command {
  constructor(cmd, opts) {
    super(["echo", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/eval.js
class EvalCommand extends Command {
  constructor([script, keys, args], opts) {
    super(["eval", script, keys.length, ...keys, ...args ?? []], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/evalsha.js
class EvalshaCommand extends Command {
  constructor([sha, keys, args], opts) {
    super(["evalsha", sha, keys.length, ...keys, ...args ?? []], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/exists.js
class ExistsCommand extends Command {
  constructor(cmd, opts) {
    super(["exists", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/expire.js
class ExpireCommand extends Command {
  constructor(cmd, opts) {
    super(["expire", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/expireat.js
class ExpireAtCommand extends Command {
  constructor(cmd, opts) {
    super(["expireat", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/flushall.js
class FlushAllCommand extends Command {
  constructor(args, opts) {
    const command16 = ["flushall"];
    if (args && args.length > 0 && args[0].async) {
      command16.push("async");
    }
    super(command16, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/flushdb.js
class FlushDBCommand extends Command {
  constructor([opts], cmdOpts) {
    const command17 = ["flushdb"];
    if (opts?.async) {
      command17.push("async");
    }
    super(command17, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/get.js
class GetCommand extends Command {
  constructor(cmd, opts) {
    super(["get", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/getbit.js
class GetBitCommand extends Command {
  constructor(cmd, opts) {
    super(["getbit", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/getdel.js
class GetDelCommand extends Command {
  constructor(cmd, opts) {
    super(["getdel", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/getrange.js
class GetRangeCommand extends Command {
  constructor(cmd, opts) {
    super(["getrange", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/getset.js
class GetSetCommand extends Command {
  constructor(cmd, opts) {
    super(["getset", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hdel.js
class HDelCommand extends Command {
  constructor(cmd, opts) {
    super(["hdel", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hexists.js
class HExistsCommand extends Command {
  constructor(cmd, opts) {
    super(["hexists", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hget.js
class HGetCommand extends Command {
  constructor(cmd, opts) {
    super(["hget", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hgetall.js
var deserialize2 = function(result) {
  if (result.length === 0) {
    return null;
  }
  const obj = {};
  while (result.length >= 2) {
    const key = result.shift();
    const value = result.shift();
    try {
      obj[key] = JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj;
};

class HGetAllCommand extends Command {
  constructor(cmd, opts) {
    super(["hgetall", ...cmd], {
      deserialize: (result) => deserialize2(result),
      ...opts
    });
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hincrby.js
class HIncrByCommand extends Command {
  constructor(cmd, opts) {
    super(["hincrby", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hincrbyfloat.js
class HIncrByFloatCommand extends Command {
  constructor(cmd, opts) {
    super(["hincrbyfloat", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hkeys.js
class HKeysCommand extends Command {
  constructor([key], opts) {
    super(["hkeys", key], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hlen.js
class HLenCommand extends Command {
  constructor(cmd, opts) {
    super(["hlen", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hmget.js
var deserialize3 = function(fields, result) {
  if (result.length === 0 || result.every((field) => field === null)) {
    return null;
  }
  const obj = {};
  for (let i3 = 0;i3 < fields.length; i3++) {
    try {
      obj[fields[i3]] = JSON.parse(result[i3]);
    } catch {
      obj[fields[i3]] = result[i3];
    }
  }
  return obj;
};

class HMGetCommand extends Command {
  constructor([key, ...fields], opts) {
    super(["hmget", key, ...fields], {
      deserialize: (result) => deserialize3(fields, result),
      ...opts
    });
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hmset.js
class HMSetCommand extends Command {
  constructor([key, kv], opts) {
    super([
      "hmset",
      key,
      ...Object.entries(kv).flatMap(([field, value]) => [field, value])
    ], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hrandfield.js
var deserialize4 = function(result) {
  if (result.length === 0) {
    return null;
  }
  const obj = {};
  while (result.length >= 2) {
    const key = result.shift();
    const value = result.shift();
    try {
      obj[key] = JSON.parse(value);
    } catch {
      obj[key] = value;
    }
  }
  return obj;
};

class HRandFieldCommand extends Command {
  constructor(cmd, opts) {
    const command33 = ["hrandfield", cmd[0]];
    if (typeof cmd[1] === "number") {
      command33.push(cmd[1]);
    }
    if (cmd[2]) {
      command33.push("WITHVALUES");
    }
    super(command33, {
      deserialize: cmd[2] ? (result) => deserialize4(result) : opts?.deserialize,
      ...opts
    });
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hscan.js
class HScanCommand extends Command {
  constructor([key, cursor, cmdOpts], opts) {
    const command34 = ["hscan", key, cursor];
    if (cmdOpts?.match) {
      command34.push("match", cmdOpts.match);
    }
    if (typeof cmdOpts?.count === "number") {
      command34.push("count", cmdOpts.count);
    }
    super(command34, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hset.js
class HSetCommand extends Command {
  constructor([key, kv], opts) {
    super([
      "hset",
      key,
      ...Object.entries(kv).flatMap(([field, value]) => [field, value])
    ], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hsetnx.js
class HSetNXCommand extends Command {
  constructor(cmd, opts) {
    super(["hsetnx", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hstrlen.js
class HStrLenCommand extends Command {
  constructor(cmd, opts) {
    super(["hstrlen", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/hvals.js
class HValsCommand extends Command {
  constructor(cmd, opts) {
    super(["hvals", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/incr.js
class IncrCommand extends Command {
  constructor(cmd, opts) {
    super(["incr", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/incrby.js
class IncrByCommand extends Command {
  constructor(cmd, opts) {
    super(["incrby", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/incrbyfloat.js
class IncrByFloatCommand extends Command {
  constructor(cmd, opts) {
    super(["incrbyfloat", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_arrappend.js
class JsonArrAppendCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRAPPEND", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_arrindex.js
class JsonArrIndexCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRINDEX", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_arrinsert.js
class JsonArrInsertCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRINSERT", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_arrlen.js
class JsonArrLenCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRLEN", cmd[0], cmd[1] ?? "$"], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_arrpop.js
class JsonArrPopCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.ARRPOP", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_arrtrim.js
class JsonArrTrimCommand extends Command {
  constructor(cmd, opts) {
    const path = cmd[1] ?? "$";
    const start = cmd[2] ?? 0;
    const stop = cmd[3] ?? 0;
    super(["JSON.ARRTRIM", cmd[0], path, start, stop], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_clear.js
class JsonClearCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.CLEAR", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_del.js
class JsonDelCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.DEL", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_forget.js
class JsonForgetCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.FORGET", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_get.js
class JsonGetCommand extends Command {
  constructor(cmd, opts) {
    const command51 = ["JSON.GET"];
    if (typeof cmd[1] === "string") {
      command51.push(...cmd);
    } else {
      command51.push(cmd[0]);
      if (cmd[1]) {
        if (cmd[1].indent) {
          command51.push("INDENT", cmd[1].indent);
        }
        if (cmd[1].newline) {
          command51.push("NEWLINE", cmd[1].newline);
        }
        if (cmd[1].space) {
          command51.push("SPACE", cmd[1].space);
        }
      }
      command51.push(...cmd.slice(2));
    }
    super(command51, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_mget.js
class JsonMGetCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.MGET", ...cmd[0], cmd[1]], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_numincrby.js
class JsonNumIncrByCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.NUMINCRBY", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_nummultby.js
class JsonNumMultByCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.NUMMULTBY", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_objkeys.js
class JsonObjKeysCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.OBJKEYS", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_objlen.js
class JsonObjLenCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.OBJLEN", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_resp.js
class JsonRespCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.RESP", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_set.js
class JsonSetCommand extends Command {
  constructor(cmd, opts) {
    const command58 = ["JSON.SET", cmd[0], cmd[1], cmd[2]];
    if (cmd[3]) {
      if (cmd[3].nx) {
        command58.push("NX");
      } else if (cmd[3].xx) {
        command58.push("XX");
      }
    }
    super(command58, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_strappend.js
class JsonStrAppendCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.STRAPPEND", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_strlen.js
class JsonStrLenCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.STRLEN", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_toggle.js
class JsonToggleCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.TOGGLE", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/json_type.js
class JsonTypeCommand extends Command {
  constructor(cmd, opts) {
    super(["JSON.TYPE", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/keys.js
class KeysCommand extends Command {
  constructor(cmd, opts) {
    super(["keys", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lindex.js
class LIndexCommand extends Command {
  constructor(cmd, opts) {
    super(["lindex", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/linsert.js
class LInsertCommand extends Command {
  constructor(cmd, opts) {
    super(["linsert", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/llen.js
class LLenCommand extends Command {
  constructor(cmd, opts) {
    super(["llen", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lmove.js
class LMoveCommand extends Command {
  constructor(cmd, opts) {
    super(["lmove", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lpop.js
class LPopCommand extends Command {
  constructor(cmd, opts) {
    super(["lpop", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lpos.js
class LPosCommand extends Command {
  constructor(cmd, opts) {
    const args = ["lpos", cmd[0], cmd[1]];
    if (typeof cmd[2]?.rank === "number") {
      args.push("rank", cmd[2].rank);
    }
    if (typeof cmd[2]?.count === "number") {
      args.push("count", cmd[2].count);
    }
    if (typeof cmd[2]?.maxLen === "number") {
      args.push("maxLen", cmd[2].maxLen);
    }
    super(args, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lpush.js
class LPushCommand extends Command {
  constructor(cmd, opts) {
    super(["lpush", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lpushx.js
class LPushXCommand extends Command {
  constructor(cmd, opts) {
    super(["lpushx", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lrange.js
class LRangeCommand extends Command {
  constructor(cmd, opts) {
    super(["lrange", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lrem.js
class LRemCommand extends Command {
  constructor(cmd, opts) {
    super(["lrem", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/lset.js
class LSetCommand extends Command {
  constructor(cmd, opts) {
    super(["lset", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/ltrim.js
class LTrimCommand extends Command {
  constructor(cmd, opts) {
    super(["ltrim", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/mget.js
class MGetCommand extends Command {
  constructor(cmd, opts) {
    super(["mget", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/mset.js
class MSetCommand extends Command {
  constructor([kv], opts) {
    super([
      "mset",
      ...Object.entries(kv).flatMap(([key, value]) => [key, value])
    ], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/msetnx.js
class MSetNXCommand extends Command {
  constructor([kv], opts) {
    super(["msetnx", ...Object.entries(kv).flatMap((_) => _)], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/persist.js
class PersistCommand extends Command {
  constructor(cmd, opts) {
    super(["persist", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/pexpire.js
class PExpireCommand extends Command {
  constructor(cmd, opts) {
    super(["pexpire", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/pexpireat.js
class PExpireAtCommand extends Command {
  constructor(cmd, opts) {
    super(["pexpireat", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/ping.js
class PingCommand extends Command {
  constructor(cmd, opts) {
    const command82 = ["ping"];
    if (typeof cmd !== "undefined" && typeof cmd[0] !== "undefined") {
      command82.push(cmd[0]);
    }
    super(command82, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/psetex.js
class PSetEXCommand extends Command {
  constructor(cmd, opts) {
    super(["psetex", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/pttl.js
class PTtlCommand extends Command {
  constructor(cmd, opts) {
    super(["pttl", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/publish.js
class PublishCommand extends Command {
  constructor(cmd, opts) {
    super(["publish", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/randomkey.js
class RandomKeyCommand extends Command {
  constructor(opts) {
    super(["randomkey"], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/rename.js
class RenameCommand extends Command {
  constructor(cmd, opts) {
    super(["rename", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/renamenx.js
class RenameNXCommand extends Command {
  constructor(cmd, opts) {
    super(["renamenx", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/rpop.js
class RPopCommand extends Command {
  constructor(cmd, opts) {
    super(["rpop", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/rpush.js
class RPushCommand extends Command {
  constructor(cmd, opts) {
    super(["rpush", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/rpushx.js
class RPushXCommand extends Command {
  constructor(cmd, opts) {
    super(["rpushx", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sadd.js
class SAddCommand extends Command {
  constructor(cmd, opts) {
    super(["sadd", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/scan.js
class ScanCommand extends Command {
  constructor([cursor, opts], cmdOpts) {
    const command93 = ["scan", cursor];
    if (opts?.match) {
      command93.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command93.push("count", opts.count);
    }
    if (opts?.type && opts.type.length > 0) {
      command93.push("type", opts.type);
    }
    super(command93, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/scard.js
class SCardCommand extends Command {
  constructor(cmd, opts) {
    super(["scard", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/script_exists.js
class ScriptExistsCommand extends Command {
  constructor(hashes, opts) {
    super(["script", "exists", ...hashes], {
      deserialize: (result) => result,
      ...opts
    });
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/script_flush.js
class ScriptFlushCommand extends Command {
  constructor([opts], cmdOpts) {
    const cmd = ["script", "flush"];
    if (opts?.sync) {
      cmd.push("sync");
    } else if (opts?.async) {
      cmd.push("async");
    }
    super(cmd, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/script_load.js
class ScriptLoadCommand extends Command {
  constructor(args, opts) {
    super(["script", "load", ...args], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sdiff.js
class SDiffCommand extends Command {
  constructor(cmd, opts) {
    super(["sdiff", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sdiffstore.js
class SDiffStoreCommand extends Command {
  constructor(cmd, opts) {
    super(["sdiffstore", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/set.js
class SetCommand extends Command {
  constructor([key, value, opts], cmdOpts) {
    const command100 = ["set", key, value];
    if (opts) {
      if (("nx" in opts) && opts.nx) {
        command100.push("nx");
      } else if (("xx" in opts) && opts.xx) {
        command100.push("xx");
      }
      if (("get" in opts) && opts.get) {
        command100.push("get");
      }
      if (("ex" in opts) && typeof opts.ex === "number") {
        command100.push("ex", opts.ex);
      } else if (("px" in opts) && typeof opts.px === "number") {
        command100.push("px", opts.px);
      } else if (("exat" in opts) && typeof opts.exat === "number") {
        command100.push("exat", opts.exat);
      } else if (("pxat" in opts) && typeof opts.pxat === "number") {
        command100.push("pxat", opts.pxat);
      } else if (("keepTtl" in opts) && opts.keepTtl) {
        command100.push("keepTtl", opts.keepTtl);
      }
    }
    super(command100, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/setbit.js
class SetBitCommand extends Command {
  constructor(cmd, opts) {
    super(["setbit", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/setex.js
class SetExCommand extends Command {
  constructor(cmd, opts) {
    super(["setex", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/setnx.js
class SetNxCommand extends Command {
  constructor(cmd, opts) {
    super(["setnx", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/setrange.js
class SetRangeCommand extends Command {
  constructor(cmd, opts) {
    super(["setrange", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sinter.js
class SInterCommand extends Command {
  constructor(cmd, opts) {
    super(["sinter", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sinterstore.js
class SInterStoreCommand extends Command {
  constructor(cmd, opts) {
    super(["sinterstore", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sismember.js
class SIsMemberCommand extends Command {
  constructor(cmd, opts) {
    super(["sismember", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/smembers.js
class SMembersCommand extends Command {
  constructor(cmd, opts) {
    super(["smembers", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/smismember.js
class SMIsMemberCommand extends Command {
  constructor(cmd, opts) {
    super(["smismember", cmd[0], ...cmd[1]], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/smove.js
class SMoveCommand extends Command {
  constructor(cmd, opts) {
    super(["smove", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/spop.js
class SPopCommand extends Command {
  constructor([key, count], opts) {
    const command111 = ["spop", key];
    if (typeof count === "number") {
      command111.push(count);
    }
    super(command111, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/srandmember.js
class SRandMemberCommand extends Command {
  constructor([key, count], opts) {
    const command112 = ["srandmember", key];
    if (typeof count === "number") {
      command112.push(count);
    }
    super(command112, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/srem.js
class SRemCommand extends Command {
  constructor(cmd, opts) {
    super(["srem", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sscan.js
class SScanCommand extends Command {
  constructor([key, cursor, opts], cmdOpts) {
    const command114 = ["sscan", key, cursor];
    if (opts?.match) {
      command114.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command114.push("count", opts.count);
    }
    super(command114, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/strlen.js
class StrLenCommand extends Command {
  constructor(cmd, opts) {
    super(["strlen", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sunion.js
class SUnionCommand extends Command {
  constructor(cmd, opts) {
    super(["sunion", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/sunionstore.js
class SUnionStoreCommand extends Command {
  constructor(cmd, opts) {
    super(["sunionstore", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/time.js
class TimeCommand extends Command {
  constructor(opts) {
    super(["time"], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/touch.js
class TouchCommand extends Command {
  constructor(cmd, opts) {
    super(["touch", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/ttl.js
class TtlCommand extends Command {
  constructor(cmd, opts) {
    super(["ttl", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/type.js
class TypeCommand extends Command {
  constructor(cmd, opts) {
    super(["type", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/unlink.js
class UnlinkCommand extends Command {
  constructor(cmd, opts) {
    super(["unlink", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zadd.js
class ZAddCommand extends Command {
  constructor([key, arg1, ...arg2], opts) {
    const command123 = ["zadd", key];
    if (("nx" in arg1) && arg1.nx) {
      command123.push("nx");
    } else if (("xx" in arg1) && arg1.xx) {
      command123.push("xx");
    }
    if (("ch" in arg1) && arg1.ch) {
      command123.push("ch");
    }
    if (("incr" in arg1) && arg1.incr) {
      command123.push("incr");
    }
    if (("score" in arg1) && ("member" in arg1)) {
      command123.push(arg1.score, arg1.member);
    }
    command123.push(...arg2.flatMap(({ score, member }) => [score, member]));
    super(command123, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zcard.js
class ZCardCommand extends Command {
  constructor(cmd, opts) {
    super(["zcard", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zcount.js
class ZCountCommand extends Command {
  constructor(cmd, opts) {
    super(["zcount", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zincrby.js
class ZIncrByCommand extends Command {
  constructor(cmd, opts) {
    super(["zincrby", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zinterstore.js
class ZInterStoreCommand extends Command {
  constructor([destination2, numKeys, keyOrKeys, opts], cmdOpts) {
    const command127 = ["zinterstore", destination2, numKeys];
    if (Array.isArray(keyOrKeys)) {
      command127.push(...keyOrKeys);
    } else {
      command127.push(keyOrKeys);
    }
    if (opts) {
      if (("weights" in opts) && opts.weights) {
        command127.push("weights", ...opts.weights);
      } else if (("weight" in opts) && typeof opts.weight === "number") {
        command127.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command127.push("aggregate", opts.aggregate);
      }
    }
    super(command127, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zlexcount.js
class ZLexCountCommand extends Command {
  constructor(cmd, opts) {
    super(["zlexcount", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zpopmax.js
class ZPopMaxCommand extends Command {
  constructor([key, count], opts) {
    const command129 = ["zpopmax", key];
    if (typeof count === "number") {
      command129.push(count);
    }
    super(command129, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zpopmin.js
class ZPopMinCommand extends Command {
  constructor([key, count], opts) {
    const command130 = ["zpopmin", key];
    if (typeof count === "number") {
      command130.push(count);
    }
    super(command130, opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zrange.js
class ZRangeCommand extends Command {
  constructor([key, min, max, opts], cmdOpts) {
    const command131 = ["zrange", key, min, max];
    if (opts?.byScore) {
      command131.push("byscore");
    }
    if (opts?.byLex) {
      command131.push("bylex");
    }
    if (opts?.rev) {
      command131.push("rev");
    }
    if (typeof opts?.count !== "undefined" && typeof opts?.offset !== "undefined") {
      command131.push("limit", opts.offset, opts.count);
    }
    if (opts?.withScores) {
      command131.push("withscores");
    }
    super(command131, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zrank.js
class ZRankCommand extends Command {
  constructor(cmd, opts) {
    super(["zrank", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zrem.js
class ZRemCommand extends Command {
  constructor(cmd, opts) {
    super(["zrem", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zremrangebylex.js
class ZRemRangeByLexCommand extends Command {
  constructor(cmd, opts) {
    super(["zremrangebylex", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zremrangebyrank.js
class ZRemRangeByRankCommand extends Command {
  constructor(cmd, opts) {
    super(["zremrangebyrank", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zremrangebyscore.js
class ZRemRangeByScoreCommand extends Command {
  constructor(cmd, opts) {
    super(["zremrangebyscore", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zrevrank.js
class ZRevRankCommand extends Command {
  constructor(cmd, opts) {
    super(["zrevrank", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zscan.js
class ZScanCommand extends Command {
  constructor([key, cursor, opts], cmdOpts) {
    const command138 = ["zscan", key, cursor];
    if (opts?.match) {
      command138.push("match", opts.match);
    }
    if (typeof opts?.count === "number") {
      command138.push("count", opts.count);
    }
    super(command138, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zscore.js
class ZScoreCommand extends Command {
  constructor(cmd, opts) {
    super(["zscore", ...cmd], opts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zunionstore.js
class ZUnionStoreCommand extends Command {
  constructor([destination2, numKeys, keyOrKeys, opts], cmdOpts) {
    const command140 = ["zunionstore", destination2, numKeys];
    if (Array.isArray(keyOrKeys)) {
      command140.push(...keyOrKeys);
    } else {
      command140.push(keyOrKeys);
    }
    if (opts) {
      if (("weights" in opts) && opts.weights) {
        command140.push("weights", ...opts.weights);
      } else if (("weight" in opts) && typeof opts.weight === "number") {
        command140.push("weights", opts.weight);
      }
      if ("aggregate" in opts) {
        command140.push("aggregate", opts.aggregate);
      }
    }
    super(command140, cmdOpts);
  }
}
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zmscore.js
class ZMScoreCommand extends Command {
  constructor(cmd, opts) {
    const [key, members] = cmd;
    super(["zmscore", key, ...members], opts);
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/commands/zdiffstore.js
class ZDiffStoreCommand extends Command {
  constructor(cmd, opts) {
    super(["zdiffstore", ...cmd], opts);
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/pipeline.js
class Pipeline {
  constructor(opts) {
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "commands", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "commandOptions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "multiExec", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "exec", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: async () => {
        if (this.commands.length === 0) {
          throw new Error("Pipeline is empty");
        }
        const path = this.multiExec ? ["multi-exec"] : ["pipeline"];
        const res = await this.client.request({
          path,
          body: Object.values(this.commands).map((c) => c.command)
        });
        return res.map(({ error: error5, result }, i3) => {
          if (error5) {
            throw new UpstashError(`Command ${i3 + 1} [ ${this.commands[i3].command[0]} ] failed: ${error5}`);
          }
          return this.commands[i3].deserialize(result);
        });
      }
    });
    Object.defineProperty(this, "append", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new AppendCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "bitcount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new BitCountCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "bitop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (op, destinationKey, sourceKey, ...sourceKeys) => this.chain(new BitOpCommand([op, destinationKey, sourceKey, ...sourceKeys], this.commandOptions))
    });
    Object.defineProperty(this, "bitpos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new BitPosCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zdiffstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZDiffStoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "dbsize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => this.chain(new DBSizeCommand(this.commandOptions))
    });
    Object.defineProperty(this, "decr", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new DecrCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "decrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new DecrByCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "del", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new DelCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "echo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new EchoCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "eval", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new EvalCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "evalsha", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new EvalshaCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "exists", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ExistsCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "expire", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ExpireCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "expireat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ExpireAtCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "flushall", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (args) => this.chain(new FlushAllCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "flushdb", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new FlushDBCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "get", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new GetCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "getbit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new GetBitCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "getdel", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new GetDelCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "getrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new GetRangeCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "getset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, value) => this.chain(new GetSetCommand([key, value], this.commandOptions))
    });
    Object.defineProperty(this, "hdel", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HDelCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hexists", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HExistsCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hget", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HGetCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hgetall", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HGetAllCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hincrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HIncrByCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hincrbyfloat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HIncrByFloatCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hkeys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HKeysCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hlen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HLenCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hmget", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HMGetCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hmset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, kv) => this.chain(new HMSetCommand([key, kv], this.commandOptions))
    });
    Object.defineProperty(this, "hrandfield", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, count, withValues) => this.chain(new HRandFieldCommand([key, count, withValues], this.commandOptions))
    });
    Object.defineProperty(this, "hscan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HScanCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, kv) => this.chain(new HSetCommand([key, kv], this.commandOptions))
    });
    Object.defineProperty(this, "hsetnx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, field, value) => this.chain(new HSetNXCommand([key, field, value], this.commandOptions))
    });
    Object.defineProperty(this, "hstrlen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HStrLenCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "hvals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new HValsCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "incr", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new IncrCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "incrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new IncrByCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "incrbyfloat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new IncrByFloatCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "keys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new KeysCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "lindex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LIndexCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "linsert", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, direction, pivot, value) => this.chain(new LInsertCommand([key, direction, pivot, value], this.commandOptions))
    });
    Object.defineProperty(this, "llen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LLenCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "lmove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LMoveCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "lpop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LPopCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "lpos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LPosCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "lpush", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => this.chain(new LPushCommand([key, ...elements], this.commandOptions))
    });
    Object.defineProperty(this, "lpushx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => this.chain(new LPushXCommand([key, ...elements], this.commandOptions))
    });
    Object.defineProperty(this, "lrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LRangeCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "lrem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, count, value) => this.chain(new LRemCommand([key, count, value], this.commandOptions))
    });
    Object.defineProperty(this, "lset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, index2, value) => this.chain(new LSetCommand([key, index2, value], this.commandOptions))
    });
    Object.defineProperty(this, "ltrim", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new LTrimCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "mget", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new MGetCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "mset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (kv) => this.chain(new MSetCommand([kv], this.commandOptions))
    });
    Object.defineProperty(this, "msetnx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (kv) => this.chain(new MSetNXCommand([kv], this.commandOptions))
    });
    Object.defineProperty(this, "persist", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new PersistCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "pexpire", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new PExpireCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "pexpireat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new PExpireAtCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "ping", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (args) => this.chain(new PingCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "psetex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ttl2, value) => this.chain(new PSetEXCommand([key, ttl2, value], this.commandOptions))
    });
    Object.defineProperty(this, "pttl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new PTtlCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "publish", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new PublishCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "randomkey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => this.chain(new RandomKeyCommand(this.commandOptions))
    });
    Object.defineProperty(this, "rename", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new RenameCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "renamenx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new RenameNXCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "rpop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new RPopCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "rpush", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => this.chain(new RPushCommand([key, ...elements], this.commandOptions))
    });
    Object.defineProperty(this, "rpushx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => this.chain(new RPushXCommand([key, ...elements], this.commandOptions))
    });
    Object.defineProperty(this, "sadd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...members) => this.chain(new SAddCommand([key, ...members], this.commandOptions))
    });
    Object.defineProperty(this, "scan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ScanCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "scard", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SCardCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "scriptExists", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ScriptExistsCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "scriptFlush", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ScriptFlushCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "scriptLoad", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ScriptLoadCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sdiff", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SDiffCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sdiffstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SDiffStoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "set", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, value, opts2) => this.chain(new SetCommand([key, value, opts2], this.commandOptions))
    });
    Object.defineProperty(this, "setbit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SetBitCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "setex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ttl2, value) => this.chain(new SetExCommand([key, ttl2, value], this.commandOptions))
    });
    Object.defineProperty(this, "setnx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, value) => this.chain(new SetNxCommand([key, value], this.commandOptions))
    });
    Object.defineProperty(this, "setrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SetRangeCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sinter", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SInterCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sinterstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SInterStoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sismember", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => this.chain(new SIsMemberCommand([key, member], this.commandOptions))
    });
    Object.defineProperty(this, "smembers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SMembersCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "smismember", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, members) => this.chain(new SMIsMemberCommand([key, members], this.commandOptions))
    });
    Object.defineProperty(this, "smove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (source2, destination2, member) => this.chain(new SMoveCommand([source2, destination2, member], this.commandOptions))
    });
    Object.defineProperty(this, "spop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SPopCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "srandmember", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SRandMemberCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "srem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...members) => this.chain(new SRemCommand([key, ...members], this.commandOptions))
    });
    Object.defineProperty(this, "sscan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SScanCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "strlen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new StrLenCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sunion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SUnionCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "sunionstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new SUnionStoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => this.chain(new TimeCommand(this.commandOptions))
    });
    Object.defineProperty(this, "touch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new TouchCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "ttl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new TtlCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new TypeCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "unlink", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new UnlinkCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zadd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => {
        if ("score" in args[1]) {
          return this.chain(new ZAddCommand([args[0], args[1], ...args.slice(2)], this.commandOptions));
        }
        return this.chain(new ZAddCommand([args[0], args[1], ...args.slice(2)], this.commandOptions));
      }
    });
    Object.defineProperty(this, "zcard", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZCardCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zcount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZCountCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zincrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, increment, member) => this.chain(new ZIncrByCommand([key, increment, member], this.commandOptions))
    });
    Object.defineProperty(this, "zinterstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZInterStoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zlexcount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZLexCountCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zmscore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZMScoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zpopmax", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZPopMaxCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zpopmin", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZPopMinCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZRangeCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zrank", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => this.chain(new ZRankCommand([key, member], this.commandOptions))
    });
    Object.defineProperty(this, "zrem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...members) => this.chain(new ZRemCommand([key, ...members], this.commandOptions))
    });
    Object.defineProperty(this, "zremrangebylex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZRemRangeByLexCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zremrangebyrank", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZRemRangeByRankCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zremrangebyscore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZRemRangeByScoreCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zrevrank", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => this.chain(new ZRevRankCommand([key, member], this.commandOptions))
    });
    Object.defineProperty(this, "zscan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZScanCommand(args, this.commandOptions))
    });
    Object.defineProperty(this, "zscore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => this.chain(new ZScoreCommand([key, member], this.commandOptions))
    });
    Object.defineProperty(this, "zunionstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => this.chain(new ZUnionStoreCommand(args, this.commandOptions))
    });
    this.client = opts.client;
    this.commands = [];
    this.commandOptions = opts.commandOptions;
    this.multiExec = opts.multiExec ?? false;
  }
  chain(command143) {
    this.commands.push(command143);
    return this;
  }
  get json() {
    return {
      arrappend: (...args) => this.chain(new JsonArrAppendCommand(args, this.commandOptions)),
      arrindex: (...args) => this.chain(new JsonArrIndexCommand(args, this.commandOptions)),
      arrinsert: (...args) => this.chain(new JsonArrInsertCommand(args, this.commandOptions)),
      arrlen: (...args) => this.chain(new JsonArrLenCommand(args, this.commandOptions)),
      arrpop: (...args) => this.chain(new JsonArrPopCommand(args, this.commandOptions)),
      arrtrim: (...args) => this.chain(new JsonArrTrimCommand(args, this.commandOptions)),
      clear: (...args) => this.chain(new JsonClearCommand(args, this.commandOptions)),
      del: (...args) => this.chain(new JsonDelCommand(args, this.commandOptions)),
      forget: (...args) => this.chain(new JsonForgetCommand(args, this.commandOptions)),
      get: (...args) => this.chain(new JsonGetCommand(args, this.commandOptions)),
      mget: (...args) => this.chain(new JsonMGetCommand(args, this.commandOptions)),
      numincrby: (...args) => this.chain(new JsonNumIncrByCommand(args, this.commandOptions)),
      nummultby: (...args) => this.chain(new JsonNumMultByCommand(args, this.commandOptions)),
      objkeys: (...args) => this.chain(new JsonObjKeysCommand(args, this.commandOptions)),
      objlen: (...args) => this.chain(new JsonObjLenCommand(args, this.commandOptions)),
      resp: (...args) => this.chain(new JsonRespCommand(args, this.commandOptions)),
      set: (...args) => this.chain(new JsonSetCommand(args, this.commandOptions)),
      strappend: (...args) => this.chain(new JsonStrAppendCommand(args, this.commandOptions)),
      strlen: (...args) => this.chain(new JsonStrLenCommand(args, this.commandOptions)),
      toggle: (...args) => this.chain(new JsonToggleCommand(args, this.commandOptions)),
      type: (...args) => this.chain(new JsonTypeCommand(args, this.commandOptions))
    };
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/deps/deno.land/x/base64@v0.2.1/base.js
var getLengths = function(b64) {
  const len = b64.length;
  let validLen = b64.indexOf("=");
  if (validLen === -1) {
    validLen = len;
  }
  const placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
  return [validLen, placeHoldersLen];
};
function init(lookup, revLookup, urlsafe = false) {
  function _byteLength(validLen, placeHoldersLen) {
    return Math.floor((validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen);
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(buf, start, end) {
    const out = new Array((end - start) / 3);
    for (let i3 = start, curTriplet = 0;i3 < end; i3 += 3) {
      out[curTriplet++] = tripletToBase64((buf[i3] << 16) + (buf[i3 + 1] << 8) + buf[i3 + 2]);
    }
    return out.join("");
  }
  return {
    byteLength(b64) {
      return _byteLength.apply(null, getLengths(b64));
    },
    toUint8Array(b64) {
      const [validLen, placeHoldersLen] = getLengths(b64);
      const buf = new Uint8Array(_byteLength(validLen, placeHoldersLen));
      const len = placeHoldersLen ? validLen - 4 : validLen;
      let tmp;
      let curByte = 0;
      let i3;
      for (i3 = 0;i3 < len; i3 += 4) {
        tmp = revLookup[b64.charCodeAt(i3)] << 18 | revLookup[b64.charCodeAt(i3 + 1)] << 12 | revLookup[b64.charCodeAt(i3 + 2)] << 6 | revLookup[b64.charCodeAt(i3 + 3)];
        buf[curByte++] = tmp >> 16 & 255;
        buf[curByte++] = tmp >> 8 & 255;
        buf[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i3)] << 2 | revLookup[b64.charCodeAt(i3 + 1)] >> 4;
        buf[curByte++] = tmp & 255;
      } else if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i3)] << 10 | revLookup[b64.charCodeAt(i3 + 1)] << 4 | revLookup[b64.charCodeAt(i3 + 2)] >> 2;
        buf[curByte++] = tmp >> 8 & 255;
        buf[curByte++] = tmp & 255;
      }
      return buf;
    },
    fromUint8Array(buf) {
      const maxChunkLength = 16383;
      const len = buf.length;
      const extraBytes = len % 3;
      const len2 = len - extraBytes;
      const parts = new Array(Math.ceil(len2 / maxChunkLength) + (extraBytes ? 1 : 0));
      let curChunk = 0;
      let chunkEnd;
      for (let i3 = 0;i3 < len2; i3 += maxChunkLength) {
        chunkEnd = i3 + maxChunkLength;
        parts[curChunk++] = encodeChunk(buf, i3, chunkEnd > len2 ? len2 : chunkEnd);
      }
      let tmp;
      if (extraBytes === 1) {
        tmp = buf[len2];
        parts[curChunk] = lookup[tmp >> 2] + lookup[tmp << 4 & 63];
        if (!urlsafe)
          parts[curChunk] += "==";
      } else if (extraBytes === 2) {
        tmp = buf[len2] << 8 | buf[len2 + 1] & 255;
        parts[curChunk] = lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63];
        if (!urlsafe)
          parts[curChunk] += "=";
      }
      return parts.join("");
    }
  };
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/deps/deno.land/x/base64@v0.2.1/base64url.js
var lookup = [];
var revLookup = [];
var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
for (let i3 = 0, l = code.length;i3 < l; ++i3) {
  lookup[i3] = code[i3];
  revLookup[code.charCodeAt(i3)] = i3;
}
var { byteLength, toUint8Array, fromUint8Array } = init(lookup, revLookup, true);

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/deps/denopkg.com/chiefbiiko/std-encoding@v1.0.0/mod.js
var toHexString = function(buf) {
  return buf.reduce((hex2, byte) => `${hex2}${byte < 16 ? "0" : ""}${byte.toString(16)}`, "");
};
var fromHexString = function(hex2) {
  const len = hex2.length;
  if (len % 2 || !/^[0-9a-fA-F]+$/.test(hex2)) {
    throw new TypeError("Invalid hex string.");
  }
  hex2 = hex2.toLowerCase();
  const buf = new Uint8Array(Math.floor(len / 2));
  const end = len / 2;
  for (let i3 = 0;i3 < end; ++i3) {
    buf[i3] = parseInt(hex2.substr(i3 * 2, 2), 16);
  }
  return buf;
};
function decode2(buf, encoding = "utf8") {
  if (/^utf-?8$/i.test(encoding)) {
    return decoder2.decode(buf);
  } else if (/^base64$/i.test(encoding)) {
    return fromUint8Array(buf);
  } else if (/^hex(?:adecimal)?$/i.test(encoding)) {
    return toHexString(buf);
  } else {
    throw new TypeError("Unsupported string encoding.");
  }
}
function encode(str, encoding = "utf8") {
  if (/^utf-?8$/i.test(encoding)) {
    return encoder.encode(str);
  } else if (/^base64$/i.test(encoding)) {
    return toUint8Array(str);
  } else if (/^hex(?:adecimal)?$/i.test(encoding)) {
    return fromHexString(str);
  } else {
    throw new TypeError("Unsupported string encoding.");
  }
}
var decoder2 = new TextDecoder;
var encoder = new TextEncoder;
// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/deps/deno.land/x/sha1@v1.0.3/mod.js
var rotl = function(x, n) {
  return x << n | x >>> 32 - n;
};
function sha1(msg, inputEncoding, outputEncoding) {
  return new SHA1().update(msg, inputEncoding).digest(outputEncoding);
}
var BYTES = 20;

class SHA1 {
  constructor() {
    Object.defineProperty(this, "hashSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: BYTES
    });
    Object.defineProperty(this, "_buf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Uint8Array(64)
    });
    Object.defineProperty(this, "_bufIdx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "_count", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "_K", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Uint32Array([1518500249, 1859775393, 2400959708, 3395469782])
    });
    Object.defineProperty(this, "_H", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "_finalized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.init();
  }
  static F(t5, b, c, d2) {
    if (t5 <= 19) {
      return b & c | ~b & d2;
    } else if (t5 <= 39) {
      return b ^ c ^ d2;
    } else if (t5 <= 59) {
      return b & c | b & d2 | c & d2;
    } else {
      return b ^ c ^ d2;
    }
  }
  init() {
    this._H = new Uint32Array([
      1732584193,
      4023233417,
      2562383102,
      271733878,
      3285377520
    ]);
    this._bufIdx = 0;
    this._count = new Uint32Array(2);
    this._buf.fill(0);
    this._finalized = false;
    return this;
  }
  update(msg, inputEncoding) {
    if (msg === null) {
      throw new TypeError("msg must be a string or Uint8Array.");
    } else if (typeof msg === "string") {
      msg = encode(msg, inputEncoding);
    }
    for (let i3 = 0;i3 < msg.length; i3++) {
      this._buf[this._bufIdx++] = msg[i3];
      if (this._bufIdx === 64) {
        this.transform();
        this._bufIdx = 0;
      }
    }
    const c = this._count;
    if ((c[0] += msg.length << 3) < msg.length << 3) {
      c[1]++;
    }
    c[1] += msg.length >>> 29;
    return this;
  }
  digest(outputEncoding) {
    if (this._finalized) {
      throw new Error("digest has already been called.");
    }
    this._finalized = true;
    const b = this._buf;
    let idx = this._bufIdx;
    b[idx++] = 128;
    while (idx !== 56) {
      if (idx === 64) {
        this.transform();
        idx = 0;
      }
      b[idx++] = 0;
    }
    const c = this._count;
    b[56] = c[1] >>> 24 & 255;
    b[57] = c[1] >>> 16 & 255;
    b[58] = c[1] >>> 8 & 255;
    b[59] = c[1] >>> 0 & 255;
    b[60] = c[0] >>> 24 & 255;
    b[61] = c[0] >>> 16 & 255;
    b[62] = c[0] >>> 8 & 255;
    b[63] = c[0] >>> 0 & 255;
    this.transform();
    const hash = new Uint8Array(BYTES);
    for (let i3 = 0;i3 < 5; i3++) {
      hash[(i3 << 2) + 0] = this._H[i3] >>> 24 & 255;
      hash[(i3 << 2) + 1] = this._H[i3] >>> 16 & 255;
      hash[(i3 << 2) + 2] = this._H[i3] >>> 8 & 255;
      hash[(i3 << 2) + 3] = this._H[i3] >>> 0 & 255;
    }
    this.init();
    return outputEncoding ? decode2(hash, outputEncoding) : hash;
  }
  transform() {
    const h = this._H;
    let a2 = h[0];
    let b = h[1];
    let c = h[2];
    let d2 = h[3];
    let e7 = h[4];
    const w = new Uint32Array(80);
    for (let i3 = 0;i3 < 16; i3++) {
      w[i3] = this._buf[(i3 << 2) + 3] | this._buf[(i3 << 2) + 2] << 8 | this._buf[(i3 << 2) + 1] << 16 | this._buf[i3 << 2] << 24;
    }
    for (let t5 = 0;t5 < 80; t5++) {
      if (t5 >= 16) {
        w[t5] = rotl(w[t5 - 3] ^ w[t5 - 8] ^ w[t5 - 14] ^ w[t5 - 16], 1);
      }
      const tmp = rotl(a2, 5) + SHA1.F(t5, b, c, d2) + e7 + w[t5] + this._K[Math.floor(t5 / 20)] | 0;
      e7 = d2;
      d2 = c;
      c = rotl(b, 30);
      b = a2;
      a2 = tmp;
    }
    h[0] = h[0] + a2 | 0;
    h[1] = h[1] + b | 0;
    h[2] = h[2] + c | 0;
    h[3] = h[3] + d2 | 0;
    h[4] = h[4] + e7 | 0;
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/script.js
class Script {
  constructor(redis, script) {
    Object.defineProperty(this, "script", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "sha1", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "redis", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.redis = redis;
    this.sha1 = this.digest(script);
    this.script = script;
  }
  async eval(keys2, args) {
    return await this.redis.eval(this.script, keys2, args);
  }
  async evalsha(keys2, args) {
    return await this.redis.evalsha(this.sha1, keys2, args);
  }
  async exec(keys2, args) {
    const res = await this.redis.evalsha(this.sha1, keys2, args).catch(async (err) => {
      if (err instanceof Error && err.message.toLowerCase().includes("noscript")) {
        return await this.redis.eval(this.script, keys2, args);
      }
      throw err;
    });
    return res;
  }
  digest(s2) {
    const hash = sha1(s2, "utf8", "hex");
    return typeof hash === "string" ? hash : new TextDecoder().decode(hash);
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/redis.js
class Redis {
  constructor(client, opts) {
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "opts", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "enableTelemetry", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "use", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (middleware) => {
        const makeRequest = this.client.request.bind(this.client);
        this.client.request = (req) => middleware(req, makeRequest);
      }
    });
    Object.defineProperty(this, "addTelemetry", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (telemetry) => {
        if (!this.enableTelemetry) {
          return;
        }
        try {
          this.client.mergeTelemetry(telemetry);
        } catch {
        }
      }
    });
    Object.defineProperty(this, "pipeline", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => new Pipeline({
        client: this.client,
        commandOptions: this.opts,
        multiExec: false
      })
    });
    Object.defineProperty(this, "multi", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => new Pipeline({
        client: this.client,
        commandOptions: this.opts,
        multiExec: true
      })
    });
    Object.defineProperty(this, "append", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new AppendCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "bitcount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new BitCountCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "bitop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (op, destinationKey, sourceKey, ...sourceKeys) => new BitOpCommand([op, destinationKey, sourceKey, ...sourceKeys], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "bitpos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new BitPosCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "dbsize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => new DBSizeCommand(this.opts).exec(this.client)
    });
    Object.defineProperty(this, "decr", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new DecrCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "decrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new DecrByCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "del", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new DelCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "echo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new EchoCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "eval", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new EvalCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "evalsha", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new EvalshaCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "exists", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ExistsCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "expire", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ExpireCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "expireat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ExpireAtCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "flushall", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (args) => new FlushAllCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "flushdb", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new FlushDBCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "get", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new GetCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "getbit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new GetBitCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "getdel", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new GetDelCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "getrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new GetRangeCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "getset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, value) => new GetSetCommand([key, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hdel", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HDelCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hexists", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HExistsCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hget", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HGetCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hgetall", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HGetAllCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hincrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HIncrByCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hincrbyfloat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HIncrByFloatCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hkeys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HKeysCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hlen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HLenCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hmget", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HMGetCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hmset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, kv) => new HMSetCommand([key, kv], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hrandfield", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, count, withValues) => new HRandFieldCommand([key, count, withValues], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hscan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HScanCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, kv) => new HSetCommand([key, kv], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hsetnx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, field, value) => new HSetNXCommand([key, field, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hstrlen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HStrLenCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "hvals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new HValsCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "incr", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new IncrCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "incrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new IncrByCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "incrbyfloat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new IncrByFloatCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "keys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new KeysCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lindex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LIndexCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "linsert", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, direction, pivot, value) => new LInsertCommand([key, direction, pivot, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "llen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LLenCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lmove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LMoveCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lpop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LPopCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lpos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LPosCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lpush", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => new LPushCommand([key, ...elements], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lpushx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => new LPushXCommand([key, ...elements], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LRangeCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lrem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, count, value) => new LRemCommand([key, count, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "lset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, index2, value) => new LSetCommand([key, index2, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "ltrim", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new LTrimCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "mget", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new MGetCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "mset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (kv) => new MSetCommand([kv], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "msetnx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (kv) => new MSetNXCommand([kv], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "persist", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new PersistCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "pexpire", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new PExpireCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "pexpireat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new PExpireAtCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "ping", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (args) => new PingCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "psetex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ttl2, value) => new PSetEXCommand([key, ttl2, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "pttl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new PTtlCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "publish", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new PublishCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "randomkey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => new RandomKeyCommand().exec(this.client)
    });
    Object.defineProperty(this, "rename", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new RenameCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "renamenx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new RenameNXCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "rpop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new RPopCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "rpush", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => new RPushCommand([key, ...elements], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "rpushx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...elements) => new RPushXCommand([key, ...elements], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sadd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...members) => new SAddCommand([key, ...members], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "scan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ScanCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "scard", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SCardCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "scriptExists", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ScriptExistsCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "scriptFlush", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ScriptFlushCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "scriptLoad", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ScriptLoadCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sdiff", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SDiffCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sdiffstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SDiffStoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "set", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, value, opts2) => new SetCommand([key, value, opts2], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "setbit", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SetBitCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "setex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ttl2, value) => new SetExCommand([key, ttl2, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "setnx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, value) => new SetNxCommand([key, value], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "setrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SetRangeCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sinter", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SInterCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sinterstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SInterStoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sismember", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => new SIsMemberCommand([key, member], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "smismember", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, members) => new SMIsMemberCommand([key, members], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "smembers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SMembersCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "smove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (source2, destination2, member) => new SMoveCommand([source2, destination2, member], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "spop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SPopCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "srandmember", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SRandMemberCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "srem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...members) => new SRemCommand([key, ...members], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sscan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SScanCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "strlen", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new StrLenCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sunion", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SUnionCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "sunionstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new SUnionStoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => new TimeCommand().exec(this.client)
    });
    Object.defineProperty(this, "touch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new TouchCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "ttl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new TtlCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new TypeCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "unlink", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new UnlinkCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zadd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => {
        if ("score" in args[1]) {
          return new ZAddCommand([args[0], args[1], ...args.slice(2)], this.opts).exec(this.client);
        }
        return new ZAddCommand([args[0], args[1], ...args.slice(2)], this.opts).exec(this.client);
      }
    });
    Object.defineProperty(this, "zcard", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZCardCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zcount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZCountCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zdiffstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZDiffStoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zincrby", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, increment, member) => new ZIncrByCommand([key, increment, member], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zinterstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZInterStoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zlexcount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZLexCountCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zmscore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZMScoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zpopmax", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZPopMaxCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zpopmin", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZPopMinCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zrange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZRangeCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zrank", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => new ZRankCommand([key, member], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zrem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, ...members) => new ZRemCommand([key, ...members], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zremrangebylex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZRemRangeByLexCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zremrangebyrank", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZRemRangeByRankCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zremrangebyscore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZRemRangeByScoreCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zrevrank", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => new ZRevRankCommand([key, member], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zscan", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZScanCommand(args, this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zscore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (key, member) => new ZScoreCommand([key, member], this.opts).exec(this.client)
    });
    Object.defineProperty(this, "zunionstore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (...args) => new ZUnionStoreCommand(args, this.opts).exec(this.client)
    });
    this.client = client;
    this.opts = opts;
    this.enableTelemetry = opts?.enableTelemetry ?? true;
  }
  get json() {
    return {
      arrappend: (...args) => new JsonArrAppendCommand(args, this.opts).exec(this.client),
      arrindex: (...args) => new JsonArrIndexCommand(args, this.opts).exec(this.client),
      arrinsert: (...args) => new JsonArrInsertCommand(args, this.opts).exec(this.client),
      arrlen: (...args) => new JsonArrLenCommand(args, this.opts).exec(this.client),
      arrpop: (...args) => new JsonArrPopCommand(args, this.opts).exec(this.client),
      arrtrim: (...args) => new JsonArrTrimCommand(args, this.opts).exec(this.client),
      clear: (...args) => new JsonClearCommand(args, this.opts).exec(this.client),
      del: (...args) => new JsonDelCommand(args, this.opts).exec(this.client),
      forget: (...args) => new JsonForgetCommand(args, this.opts).exec(this.client),
      get: (...args) => new JsonGetCommand(args, this.opts).exec(this.client),
      mget: (...args) => new JsonMGetCommand(args, this.opts).exec(this.client),
      numincrby: (...args) => new JsonNumIncrByCommand(args, this.opts).exec(this.client),
      nummultby: (...args) => new JsonNumMultByCommand(args, this.opts).exec(this.client),
      objkeys: (...args) => new JsonObjKeysCommand(args, this.opts).exec(this.client),
      objlen: (...args) => new JsonObjLenCommand(args, this.opts).exec(this.client),
      resp: (...args) => new JsonRespCommand(args, this.opts).exec(this.client),
      set: (...args) => new JsonSetCommand(args, this.opts).exec(this.client),
      strappend: (...args) => new JsonStrAppendCommand(args, this.opts).exec(this.client),
      strlen: (...args) => new JsonStrLenCommand(args, this.opts).exec(this.client),
      toggle: (...args) => new JsonToggleCommand(args, this.opts).exec(this.client),
      type: (...args) => new JsonTypeCommand(args, this.opts).exec(this.client)
    };
  }
  createScript(script2) {
    return new Script(this, script2);
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/pkg/http.js
var base64decode = function(b64) {
  let dec = "";
  try {
    const binString = atob(b64);
    const size = binString.length;
    const bytes2 = new Uint8Array(size);
    for (let i3 = 0;i3 < size; i3++) {
      bytes2[i3] = binString.charCodeAt(i3);
    }
    dec = new TextDecoder().decode(bytes2);
  } catch {
    dec = b64;
  }
  return dec;
};
var decode3 = function(raw) {
  let result = undefined;
  switch (typeof raw.result) {
    case "undefined":
      return raw;
    case "number": {
      result = raw.result;
      break;
    }
    case "object": {
      if (Array.isArray(raw.result)) {
        result = raw.result.map((v) => typeof v === "string" ? base64decode(v) : Array.isArray(v) ? v.map(base64decode) : v);
      } else {
        result = null;
      }
      break;
    }
    case "string": {
      result = raw.result === "OK" ? "OK" : base64decode(raw.result);
      break;
    }
    default:
      break;
  }
  return { result, error: raw.error };
};

class HttpClient {
  constructor(config) {
    Object.defineProperty(this, "baseUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "headers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, "retry", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: undefined
    });
    this.options = {
      backend: config.options?.backend,
      agent: config.agent,
      responseEncoding: config.responseEncoding ?? "base64",
      cache: config.cache
    };
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers
    };
    if (this.options.responseEncoding === "base64") {
      this.headers["Upstash-Encoding"] = "base64";
    }
    if (typeof config?.retry === "boolean" && config?.retry === false) {
      this.retry = {
        attempts: 1,
        backoff: () => 0
      };
    } else {
      this.retry = {
        attempts: config?.retry?.retries ?? 5,
        backoff: config?.retry?.backoff ?? ((retryCount) => Math.exp(retryCount) * 50)
      };
    }
  }
  mergeTelemetry(telemetry) {
    function merge(obj, key, value) {
      if (!value) {
        return obj;
      }
      if (obj[key]) {
        obj[key] = [obj[key], value].join(",");
      } else {
        obj[key] = value;
      }
      return obj;
    }
    this.headers = merge(this.headers, "Upstash-Telemetry-Runtime", telemetry.runtime);
    this.headers = merge(this.headers, "Upstash-Telemetry-Platform", telemetry.platform);
    this.headers = merge(this.headers, "Upstash-Telemetry-Sdk", telemetry.sdk);
  }
  async request(req) {
    const requestOptions = {
      cache: this.options.cache,
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(req.body),
      keepalive: true,
      agent: this.options?.agent,
      backend: this.options?.backend
    };
    let res = null;
    let error6 = null;
    for (let i3 = 0;i3 <= this.retry.attempts; i3++) {
      try {
        res = await fetch([this.baseUrl, ...req.path ?? []].join("/"), requestOptions);
        break;
      } catch (err) {
        error6 = err;
        await new Promise((r5) => setTimeout(r5, this.retry.backoff(i3)));
      }
    }
    if (!res) {
      throw error6 ?? new Error("Exhausted all retries");
    }
    const body = await res.json();
    if (!res.ok) {
      throw new UpstashError(body.error);
    }
    if (this.options?.responseEncoding === "base64") {
      return Array.isArray(body) ? body.map(decode3) : decode3(body);
    }
    return body;
  }
}

// /Users/makisuo/Documents/GitHub/Hazel/node_modules/.pnpm/@upstash+redis@1.22.0/node_modules/@upstash/redis/esm/version.js
var VERSION = "v1.22.0";

// /Users/makisuo/Documents/GitHub/Hazel/apps/api/node_modules/@upstash/redis/esm/platforms/nodejs.js
if (typeof atob === "undefined") {
  global.atob = function(b64) {
    return Buffer.from(b64, "base64").toString("utf-8");
  };
}

class Redis2 extends Redis {
  constructor(configOrRequester) {
    if ("request" in configOrRequester) {
      super(configOrRequester);
      return;
    }
    if (configOrRequester.url.startsWith(" ") || configOrRequester.url.endsWith(" ") || /\r|\n/.test(configOrRequester.url)) {
      console.warn("The redis url contains whitespace or newline, which can cause errors!");
    }
    if (configOrRequester.token.startsWith(" ") || configOrRequester.token.endsWith(" ") || /\r|\n/.test(configOrRequester.token)) {
      console.warn("The redis token contains whitespace or newline, which can cause errors!");
    }
    const client = new HttpClient({
      baseUrl: configOrRequester.url,
      retry: configOrRequester.retry,
      headers: { authorization: `Bearer ${configOrRequester.token}` },
      agent: configOrRequester.agent,
      responseEncoding: configOrRequester.responseEncoding,
      cache: configOrRequester.cache || "no-store"
    });
    super(client, {
      automaticDeserialization: configOrRequester.automaticDeserialization,
      enableTelemetry: !process.env.UPSTASH_DISABLE_TELEMETRY
    });
    this.addTelemetry({
      runtime: typeof EdgeRuntime === "string" ? "edge-light" : `node@${process.version}`,
      platform: process.env.VERCEL ? "vercel" : process.env.AWS_REGION ? "aws" : "unknown",
      sdk: `@upstash/redis@${VERSION}`
    });
  }
  static fromEnv(config) {
    if (typeof process?.env === "undefined") {
      throw new Error('Unable to get environment variables, `process.env` is undefined. If you are deploying to cloudflare, please import from "@upstash/redis/cloudflare" instead');
    }
    const url2 = process?.env["UPSTASH_REDIS_REST_URL"];
    if (!url2) {
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_URL`");
    }
    const token = process?.env["UPSTASH_REDIS_REST_TOKEN"];
    if (!token) {
      throw new Error("Unable to find environment variable: `UPSTASH_REDIS_REST_TOKEN`");
    }
    return new Redis2({ ...config, url: url2, token });
  }
}

// src/guard/ratelimit.guard.ts
var ratelimit2 = new ratelimit.Ratelimit({
  redis: Redis2.fromEnv(),
  limiter: ratelimit.Ratelimit.slidingWindow(1000, "60 s"),
  analytics: true,
  prefix: "@upstash/ratelimit"
});

// src/guard/authGuard.ts
var authGuard = (app) => app.use(dist_default3()).derive(async ({ bearer: bearer3 }) => {
  if (typeof bearer3 !== "string") {
    throw "Not good";
  }
  const apiKey = await drizzle_default.api.getOne({ publicId: bearer3 });
  if (!apiKey) {
    throw new Error("Unauthorized");
  }
  const { success } = await ratelimit2.limit(apiKey.customerId);
  if (!success) {
    throw new Error("Ratelimit");
  }
  return {
    workspace_id: apiKey.customerId
  };
});

// src/routes/v1/connections.ts
var connectionRouter = (app) => app.use(authGuard).group("connections", (app2) => app2.get("/", async ({ workspace_id }) => {
  const connections = await drizzle_default.connection.getMany({
    customerId: workspace_id
  });
  return connections;
}).post("/", async ({ body, set: set2, workspace_id }) => {
  const source2 = await drizzle_default.source.getOne({
    publicId: body.publicSourceId
  });
  const destination2 = await drizzle_default.destination.getOne({
    publicId: body.publiceDestinationId
  });
  if (!destination2) {
    set2.status = 404;
    return "Destination not found";
  }
  if (!source2) {
    set2.status = 404;
    return "Source not found";
  }
  const connection2 = await drizzle_default.connection.create({
    name: body.name,
    sourceId: source2.id,
    destinationId: destination2.id,
    customerId: workspace_id
  });
  return {
    id: connection2.publicId,
    name: body.name,
    sourceId: source2.id,
    destinationId: destination2.id,
    customerId: workspace_id
  };
}, {
  body: typebox3.Type.Object({
    name: typebox3.Type.String({
      minLength: 2,
      maxLength: 3
    }),
    publicSourceId: typebox3.Type.String({ maxLength: 21, minLength: 21 }),
    publiceDestinationId: typebox3.Type.String({ maxLength: 21, minLength: 21 })
  })
}).get("/:id", async ({ params }) => {
  const connection2 = await drizzle_default.connection.getOne({ publicId: params.id });
  return connection2;
}).put("/:id", async ({ params, body }) => {
  const res = await drizzle_default.connection.update({
    publicId: params.id,
    ...body
  });
  return res;
}, {
  body: typebox3.Type.Object({
    name: typebox3.Type.Optional(typebox3.Type.String({ maxLength: 15, minLength: 3 })),
    url: typebox3.Type.Optional(typebox3.Type.String())
  })
}).delete("/:id", async ({ params }) => {
  const res = await drizzle_default.connection.markAsDeleted({ publicId: params.id });
  return res;
}).put("/:id/pause", async ({ params }) => {
  const res = await drizzle_default.connection.update({
    publicId: params.id,
    enabled: false
  });
  return res;
}).put("/:id/unpause", async ({ params }) => {
  const res = await drizzle_default.connection.update({
    publicId: params.id,
    enabled: false
  });
  return res;
}));

// src/index.ts
var app = new p2().use(dist_default2()).onError(({ code: code2, error: error6, set: set2 }) => {
  let statusCode = 400;
  switch (code2) {
    case "INTERNAL_SERVER_ERROR":
      statusCode = 500;
      break;
    case "NOT_FOUND":
      statusCode = 404;
      break;
    case "PARSE":
      statusCode = 400;
      break;
    case "VALIDATION":
      statusCode = 403;
      break;
    default:
      statusCode = 400;
      break;
  }
  if (error6.message === "Unauthorized") {
    set2.status = 401;
  }
  if (error6.message === "Ratelimit") {
    set2.status = 429;
  }
  return new Response(error6.message, {
    status: statusCode,
    statusText: error6.cause
  });
}).get("/", () => "Hello Elysia").group("v1", (app2) => app2.use(connectionRouter)).listen(3006);
console.log(`\uD83E\uDD8A Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
