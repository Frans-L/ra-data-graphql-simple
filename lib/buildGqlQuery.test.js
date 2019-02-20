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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var ra_core_1 = require("ra-core");
var buildGqlQuery_1 = __importStar(require("./buildGqlQuery"));
describe('getArgType', function () {
    it('returns the arg type', function () {
        expect(graphql_1.print(buildGqlQuery_1.getArgType({ type: { kind: graphql_1.TypeKind.SCALAR, name: 'foo' } }))).toEqual('foo');
    });
    it('returns the arg type for NON_NULL types', function () {
        expect(graphql_1.print(buildGqlQuery_1.getArgType({
            type: {
                kind: graphql_1.TypeKind.NON_NULL,
                ofType: { name: 'ID', kind: graphql_1.TypeKind.SCALAR },
            },
        }))).toEqual('ID!');
    });
    it('returns the arg type for LIST types', function () {
        expect(graphql_1.print(buildGqlQuery_1.getArgType({
            type: {
                kind: graphql_1.TypeKind.LIST,
                ofType: { name: 'ID', kind: graphql_1.TypeKind.SCALAR },
            },
        }))).toEqual('[ID]');
    });
    it('returns the arg type for LIST types of NON_NULL type', function () {
        expect(graphql_1.print(buildGqlQuery_1.getArgType({
            type: {
                kind: graphql_1.TypeKind.LIST,
                ofType: {
                    kind: graphql_1.TypeKind.NON_NULL,
                    ofType: {
                        kind: graphql_1.TypeKind.SCALAR,
                        name: 'ID',
                    },
                },
            },
        }))).toEqual('[ID!]');
    });
});
describe('buildArgs', function () {
    it('returns an empty array when query does not have any arguments', function () {
        expect(buildGqlQuery_1.buildArgs({ args: [] })).toEqual([]);
    });
    it('returns an array of args correctly filtered when query has arguments', function () {
        expect(graphql_1.print(buildGqlQuery_1.buildArgs({ args: [{ name: 'foo' }, { name: 'bar' }] }, { foo: 'foo_value' }))).toEqual(['foo: $foo']);
    });
});
describe('buildApolloArgs', function () {
    it('returns an empty array when query does not have any arguments', function () {
        expect(graphql_1.print(buildGqlQuery_1.buildApolloArgs({ args: [] }))).toEqual([]);
    });
    it('returns an array of args correctly filtered when query has arguments', function () {
        expect(graphql_1.print(buildGqlQuery_1.buildApolloArgs({
            args: [
                {
                    name: 'foo',
                    type: {
                        kind: graphql_1.TypeKind.NON_NULL,
                        ofType: {
                            kind: graphql_1.TypeKind.SCALAR,
                            name: 'Int',
                        },
                    },
                },
                {
                    name: 'barId',
                    type: { kind: graphql_1.TypeKind.SCALAR, name: 'ID' },
                },
                {
                    name: 'barIds',
                    type: {
                        kind: graphql_1.TypeKind.LIST,
                        ofType: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: {
                                kind: graphql_1.TypeKind.SCALAR,
                                name: 'ID',
                            },
                        },
                    },
                },
                { name: 'bar' },
            ],
        }, { foo: 'foo_value', barId: 100, barIds: [101, 102] }))).toEqual(['$foo: Int!', '$barId: ID', '$barIds: [ID!]']);
    });
});
describe('buildFields', function () {
    it('returns an object with the fields to retrieve', function () {
        var introspectionResults = {
            resources: [{ type: { name: 'resourceType' } }],
            types: [
                {
                    name: 'linkedType',
                    fields: [
                        {
                            name: 'id',
                            type: { kind: graphql_1.TypeKind.SCALAR, name: 'ID' },
                        },
                    ],
                },
            ],
        };
        var fields = [
            { type: { kind: graphql_1.TypeKind.SCALAR, name: 'ID' }, name: 'id' },
            {
                type: { kind: graphql_1.TypeKind.SCALAR, name: '_internalField' },
                name: 'foo1',
            },
            {
                type: { kind: graphql_1.TypeKind.OBJECT, name: 'linkedType' },
                name: 'linked',
            },
            {
                type: { kind: graphql_1.TypeKind.OBJECT, name: 'resourceType' },
                name: 'resource',
            },
        ];
        expect(graphql_1.print(buildGqlQuery_1.buildFields(introspectionResults)(fields))).toEqual([
            'id',
            "linked {\n  id\n}",
            "resource {\n  id\n}",
        ]);
    });
});
describe('buildGqlQuery', function () {
    var introspectionResults = {
        resources: [{ type: { name: 'resourceType' } }],
        types: [
            {
                name: 'linkedType',
                fields: [
                    {
                        name: 'foo',
                        type: { kind: graphql_1.TypeKind.SCALAR, name: 'bar' },
                    },
                ],
            },
        ],
    };
    var resource = {
        type: {
            fields: [
                { type: { kind: graphql_1.TypeKind.SCALAR, name: '' }, name: 'foo' },
                { type: { kind: graphql_1.TypeKind.SCALAR, name: '_foo' }, name: 'foo1' },
                {
                    type: { kind: graphql_1.TypeKind.OBJECT, name: 'linkedType' },
                    name: 'linked',
                },
                {
                    type: { kind: graphql_1.TypeKind.OBJECT, name: 'resourceType' },
                    name: 'resource',
                },
            ],
        },
    };
    var queryType = {
        name: 'allCommand',
        args: [
            {
                name: 'foo',
                type: {
                    kind: graphql_1.TypeKind.NON_NULL,
                    ofType: { kind: graphql_1.TypeKind.SCALAR, name: 'Int' },
                },
            },
            {
                name: 'barId',
                type: { kind: graphql_1.TypeKind.SCALAR },
            },
            {
                name: 'barIds',
                type: { kind: graphql_1.TypeKind.SCALAR },
            },
            { name: 'bar' },
        ],
    };
    var params = { foo: 'foo_value' };
    it('returns the correct query for GET_LIST', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.GET_LIST, queryType, params))).toEqual("query allCommand($foo: Int!) {\n  items: allCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n  total: _allCommandMeta(foo: $foo) {\n    count\n  }\n}\n");
    });
    it('returns the correct query for GET_MANY', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.GET_MANY, queryType, params))).toEqual("query allCommand($foo: Int!) {\n  items: allCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n  total: _allCommandMeta(foo: $foo) {\n    count\n  }\n}\n");
    });
    it('returns the correct query for GET_MANY_REFERENCE', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.GET_MANY_REFERENCE, queryType, params))).toEqual("query allCommand($foo: Int!) {\n  items: allCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n  total: _allCommandMeta(foo: $foo) {\n    count\n  }\n}\n");
    });
    it('returns the correct query for GET_ONE', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.GET_ONE, __assign({}, queryType, { name: 'getCommand' }), params))).toEqual("query getCommand($foo: Int!) {\n  data: getCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n}\n");
    });
    it('returns the correct query for UPDATE', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.UPDATE, __assign({}, queryType, { name: 'updateCommand' }), params))).toEqual("mutation updateCommand($foo: Int!) {\n  data: updateCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n}\n");
    });
    it('returns the correct query for CREATE', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.CREATE, __assign({}, queryType, { name: 'createCommand' }), params))).toEqual("mutation createCommand($foo: Int!) {\n  data: createCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n}\n");
    });
    it('returns the correct query for DELETE', function () {
        expect(graphql_1.print(buildGqlQuery_1.default(introspectionResults)(resource, ra_core_1.DELETE, __assign({}, queryType, { name: 'deleteCommand' }), params))).toEqual("mutation deleteCommand($foo: Int!) {\n  data: deleteCommand(foo: $foo) {\n    id\n  }\n}\n");
    });
});
