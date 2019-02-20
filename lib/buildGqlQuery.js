"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ra_core_1 = require("ra-core");
var ra_data_graphql_1 = require("ra-data-graphql");
var graphql_1 = require("graphql");
var gqlTypes = __importStar(require("graphql-ast-types-browser"));
var getFinalType_1 = __importDefault(require("./getFinalType"));
var isList_1 = __importDefault(require("./isList"));
var isRequired_1 = __importDefault(require("./isRequired"));
exports.buildFields = function (introspectionResults) { return function (fields) {
    return fields.reduce(function (acc, field) {
        var type = getFinalType_1.default(field.type);
        if (type.name.startsWith('_')) {
            return acc;
        }
        if (type.kind !== graphql_1.TypeKind.OBJECT) {
            return acc.concat([gqlTypes.field(gqlTypes.name(field.name))]);
        }
        var linkedResource = introspectionResults.resources.find(function (r) { return r.type.name === type.name; });
        if (linkedResource) {
            return acc.concat([
                gqlTypes.field(gqlTypes.name(field.name), null, null, null, gqlTypes.selectionSet([gqlTypes.field(gqlTypes.name('id'))])),
            ]);
        }
        var linkedType = introspectionResults.types.find(function (t) { return t.name === type.name; });
        if (linkedType) {
            return acc.concat([
                gqlTypes.field(gqlTypes.name(field.name), null, null, null, gqlTypes.selectionSet(exports.buildFields(introspectionResults)(linkedType.fields))),
            ]);
        }
        // NOTE: We might have to handle linked types which are not resources but will have to be careful about
        // ending with endless circular dependencies
        return acc;
    }, []);
}; };
exports.getArgType = function (arg) {
    var type = getFinalType_1.default(arg.type);
    var required = isRequired_1.default(arg.type);
    var list = isList_1.default(arg.type);
    if (list) {
        if (required) {
            return gqlTypes.listType(gqlTypes.nonNullType(gqlTypes.namedType(gqlTypes.name(type.name))));
        }
        return gqlTypes.listType(gqlTypes.namedType(gqlTypes.name(type.name)));
    }
    if (required) {
        return gqlTypes.nonNullType(gqlTypes.namedType(gqlTypes.name(type.name)));
    }
    return gqlTypes.namedType(gqlTypes.name(type.name));
};
exports.buildArgs = function (query, variables) {
    if (query.args.length === 0) {
        return [];
    }
    var validVariables = Object.keys(variables).filter(function (k) { return typeof variables[k] !== 'undefined'; });
    var args = query.args
        .filter(function (a) { return validVariables.includes(a.name); })
        .reduce(function (acc, arg) { return acc.concat([
        gqlTypes.argument(gqlTypes.name(arg.name), gqlTypes.variable(gqlTypes.name(arg.name))),
    ]); }, []);
    return args;
};
exports.buildApolloArgs = function (query, variables) {
    if (query.args.length === 0) {
        return [];
    }
    var validVariables = Object.keys(variables).filter(function (k) { return typeof variables[k] !== 'undefined'; });
    var args = query.args
        .filter(function (a) { return validVariables.includes(a.name); })
        .reduce(function (acc, arg) {
        return acc.concat([
            gqlTypes.variableDefinition(gqlTypes.variable(gqlTypes.name(arg.name)), exports.getArgType(arg)),
        ]);
    }, []);
    return args;
};
exports.default = (function (introspectionResults) { return function (resource, aorFetchType, queryType, variables) {
    var sortField = variables.sortField, sortOrder = variables.sortOrder, metaVariables = __rest(variables, ["sortField", "sortOrder"]);
    var apolloArgs = exports.buildApolloArgs(queryType, variables);
    var args = exports.buildArgs(queryType, variables);
    var metaArgs = exports.buildArgs(queryType, metaVariables);
    var fields = exports.buildFields(introspectionResults)(resource.type.fields);
    if (aorFetchType === ra_core_1.GET_LIST ||
        aorFetchType === ra_core_1.GET_MANY ||
        aorFetchType === ra_core_1.GET_MANY_REFERENCE) {
        return gqlTypes.document([
            gqlTypes.operationDefinition('query', gqlTypes.selectionSet([
                gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('items'), args, null, gqlTypes.selectionSet(fields)),
                gqlTypes.field(gqlTypes.name("_" + queryType.name + "Meta"), gqlTypes.name('total'), metaArgs, null, gqlTypes.selectionSet([
                    gqlTypes.field(gqlTypes.name('count')),
                ])),
            ]), gqlTypes.name(queryType.name), apolloArgs),
        ]);
    }
    if (aorFetchType === ra_core_1.DELETE) {
        return gqlTypes.document([
            gqlTypes.operationDefinition('mutation', gqlTypes.selectionSet([
                gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('data'), args, null, gqlTypes.selectionSet([
                    gqlTypes.field(gqlTypes.name('id')),
                ])),
            ]), gqlTypes.name(queryType.name), apolloArgs),
        ]);
    }
    return gqlTypes.document([
        gqlTypes.operationDefinition(ra_data_graphql_1.QUERY_TYPES.includes(aorFetchType) ? 'query' : 'mutation', gqlTypes.selectionSet([
            gqlTypes.field(gqlTypes.name(queryType.name), gqlTypes.name('data'), args, null, gqlTypes.selectionSet(fields)),
        ]), gqlTypes.name(queryType.name), apolloArgs),
    ]);
}; });
