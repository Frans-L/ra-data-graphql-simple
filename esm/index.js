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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import merge from 'lodash/merge';
import buildDataProvider from 'ra-data-graphql';
import { DELETE, DELETE_MANY, UPDATE, UPDATE_MANY } from 'ra-core';
import defaultBuildQuery from './buildQuery';
var defaultOptions = {
    buildQuery: defaultBuildQuery,
};
export var buildQuery = defaultBuildQuery;
export default (function (options) {
    return buildDataProvider(merge({}, defaultOptions, options)).then(function (defaultDataProvider) {
        return function (fetchType, resource, params) {
            // This provider does not support multiple deletions so instead we send multiple DELETE requests
            // This can be optimized using the apollo-link-batch-http link
            if (fetchType === DELETE_MANY) {
                var ids = params.ids, otherParams_1 = __rest(params, ["ids"]);
                return Promise.all(params.ids.map(function (id) {
                    return defaultDataProvider(DELETE, resource, __assign({ id: id }, otherParams_1));
                })).then(function (results) {
                    var data = results.reduce(function (acc, _a) {
                        var data = _a.data;
                        return acc.concat([data.id]);
                    }, []);
                    return { data: data };
                });
            }
            // This provider does not support multiple deletions so instead we send multiple UPDATE requests
            // This can be optimized using the apollo-link-batch-http link
            if (fetchType === UPDATE_MANY) {
                var ids = params.ids, otherParams_2 = __rest(params, ["ids"]);
                return Promise.all(params.ids.map(function (id) {
                    return defaultDataProvider(UPDATE, resource, __assign({ id: id }, otherParams_2));
                })).then(function (results) {
                    var data = results.reduce(function (acc, _a) {
                        var data = _a.data;
                        return acc.concat([data.id]);
                    }, []);
                    return { data: data };
                });
            }
            return defaultDataProvider(fetchType, resource, params);
        };
    });
});
