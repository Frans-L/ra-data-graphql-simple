"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var ra_core_1 = require("ra-core");
var getFinalType_1 = __importDefault(require("./getFinalType"));
var sanitizeResource = function (introspectionResults, resource) { return function (data) {
    var result = Object.keys(data).reduce(function (acc, key) {
        var _a, _b, _c, _d;
        if (key.startsWith('_')) {
            return acc;
        }
        var field = resource.type.fields.find(function (f) { return f.name === key; });
        var type = getFinalType_1.default(field.type);
        if (type.kind !== graphql_1.TypeKind.OBJECT) {
            return __assign({}, acc, (_a = {}, _a[field.name] = data[field.name], _a));
        }
        // FIXME: We might have to handle linked types which are not resources but will have to be careful about
        // endless circular dependencies
        var linkedResource = introspectionResults.resources.find(function (r) { return r.type.name === type.name; });
        if (linkedResource) {
            var linkedResourceData = data[field.name];
            if (Array.isArray(linkedResourceData)) {
                return __assign({}, acc, (_b = {}, _b[field.name] = data[field.name].map(sanitizeResource(introspectionResults, linkedResource)), _b[field.name + "Ids"] = data[field.name].map(function (d) { return d.id; }), _b));
            }
            return __assign({}, acc, (_c = {}, _c[field.name + ".id"] = linkedResourceData
                ? data[field.name].id
                : undefined, _c[field.name] = linkedResourceData
                ? sanitizeResource(introspectionResults, linkedResource)(data[field.name])
                : undefined, _c));
        }
        return __assign({}, acc, (_d = {}, _d[field.name] = data[field.name], _d));
    }, {});
    return result;
}; };
exports.default = (function (introspectionResults) { return function (aorFetchType, resource) { return function (response) {
    var sanitize = sanitizeResource(introspectionResults, resource);
    var data = response.data;
    if (aorFetchType === ra_core_1.GET_LIST ||
        aorFetchType === ra_core_1.GET_MANY ||
        aorFetchType === ra_core_1.GET_MANY_REFERENCE) {
        return {
            data: response.data.items.map(sanitize),
            total: response.data.total.count,
        };
    }
    return { data: sanitize(data.data) };
}; }; });
