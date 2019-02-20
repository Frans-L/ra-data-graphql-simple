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
var ra_core_1 = require("ra-core");
var getFinalType_1 = __importDefault(require("./getFinalType"));
var isList_1 = __importDefault(require("./isList"));
var sanitizeValue = function (type, value) {
    if (type.name === 'Int') {
        return parseInt(value, 10);
    }
    if (type.name === 'Float') {
        return parseFloat(value);
    }
    return value;
};
var buildGetListVariables = function (introspectionResults) { return function (resource, aorFetchType, params) {
    var filter = Object.keys(params.filter).reduce(function (acc, key) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (key === 'ids') {
            return __assign({}, acc, { ids: params.filter[key] });
        }
        if (typeof params.filter[key] === 'object') {
            var type = introspectionResults.types.find(function (t) { return t.name === resource.type.name + "Filter"; });
            var filterSome = type.inputFields.find(function (t) { return t.name === key + "_some"; });
            if (filterSome) {
                var filter_1 = Object.keys(params.filter[key]).reduce(function (acc, k) {
                    var _a;
                    return (__assign({}, acc, (_a = {}, _a[k + "_in"] = params.filter[key][k], _a)));
                }, {});
                return __assign({}, acc, (_a = {}, _a[key + "_some"] = filter_1, _a));
            }
        }
        var parts = key.split('.');
        if (parts.length > 1) {
            if (parts[1] == 'id') {
                var type_1 = introspectionResults.types.find(function (t) { return t.name === resource.type.name + "Filter"; });
                var filterSome = type_1.inputFields.find(function (t) { return t.name === parts[0] + "_some"; });
                if (filterSome) {
                    return __assign({}, acc, (_b = {}, _b[parts[0] + "_some"] = { id: params.filter[key] }, _b));
                }
                return __assign({}, acc, (_c = {}, _c[parts[0]] = { id: params.filter[key] }, _c));
            }
            var resourceField_1 = resource.type.fields.find(function (f) { return f.name === parts[0]; });
            var type = getFinalType_1.default(resourceField_1.type);
            return __assign({}, acc, (_d = {}, _d[key] = sanitizeValue(type, params.filter[key]), _d));
        }
        var resourceField = resource.type.fields.find(function (f) { return f.name === key; });
        if (resourceField) {
            var type_2 = getFinalType_1.default(resourceField.type);
            var isAList = isList_1.default(resourceField.type);
            if (isAList) {
                return __assign({}, acc, (_e = {}, _e[key] = Array.isArray(params.filter[key])
                    ? params.filter[key].map(function (value) {
                        return sanitizeValue(type_2, value);
                    })
                    : sanitizeValue(type_2, [params.filter[key]]), _e));
            }
            return __assign({}, acc, (_f = {}, _f[key] = sanitizeValue(type_2, params.filter[key]), _f));
        }
        return __assign({}, acc, (_g = {}, _g[key] = params.filter[key], _g));
    }, {});
    return {
        page: parseInt(params.pagination.page, 10) - 1,
        perPage: parseInt(params.pagination.perPage, 10),
        sortField: params.sort.field,
        sortOrder: params.sort.order,
        filter: filter,
    };
}; };
var buildCreateUpdateVariables = function () { return function (resource, aorFetchType, params, queryType) {
    return Object.keys(params.data).reduce(function (acc, key) {
        var _a, _b, _c;
        if (Array.isArray(params.data[key])) {
            var arg = queryType.args.find(function (a) { return a.name === key + "Ids"; });
            if (arg) {
                return __assign({}, acc, (_a = {}, _a[key + "Ids"] = params.data[key].map(function (_a) {
                    var id = _a.id;
                    return id;
                }), _a));
            }
        }
        if (typeof params.data[key] === 'object') {
            var arg = queryType.args.find(function (a) { return a.name === key + "Id"; });
            if (arg) {
                return __assign({}, acc, (_b = {}, _b[key + "Id"] = params.data[key].id, _b));
            }
        }
        return __assign({}, acc, (_c = {}, _c[key] = params.data[key], _c));
    }, {});
}; };
exports.default = (function (introspectionResults) { return function (resource, aorFetchType, params, queryType) {
    var _a;
    switch (aorFetchType) {
        case ra_core_1.GET_LIST: {
            return buildGetListVariables(introspectionResults)(resource, aorFetchType, params, queryType);
        }
        case ra_core_1.GET_MANY:
            return {
                filter: { ids: params.ids },
            };
        case ra_core_1.GET_MANY_REFERENCE: {
            var parts = params.target.split('.');
            return {
                filter: (_a = {}, _a[parts[0]] = params.id, _a),
            };
        }
        case ra_core_1.GET_ONE:
            return {
                id: params.id,
            };
        case ra_core_1.UPDATE: {
            return buildCreateUpdateVariables(introspectionResults)(resource, aorFetchType, params, queryType);
        }
        case ra_core_1.CREATE: {
            return buildCreateUpdateVariables(introspectionResults)(resource, aorFetchType, params, queryType);
        }
        case ra_core_1.DELETE:
            return {
                id: params.id,
            };
    }
}; });
