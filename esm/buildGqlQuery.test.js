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
import { TypeKind, print } from 'graphql';
import { GET_LIST, GET_ONE, GET_MANY, GET_MANY_REFERENCE, UPDATE, CREATE, DELETE, } from 'ra-core';
import buildGqlQuery, { buildApolloArgs, buildArgs, buildFields, getArgType, } from './buildGqlQuery';
describe('getArgType', function () {
    it('returns the arg type', function () {
        expect(print(getArgType({ type: { kind: TypeKind.SCALAR, name: 'foo' } }))).toEqual('foo');
    });
    it('returns the arg type for NON_NULL types', function () {
        expect(print(getArgType({
            type: {
                kind: TypeKind.NON_NULL,
                ofType: { name: 'ID', kind: TypeKind.SCALAR },
            },
        }))).toEqual('ID!');
    });
    it('returns the arg type for LIST types', function () {
        expect(print(getArgType({
            type: {
                kind: TypeKind.LIST,
                ofType: { name: 'ID', kind: TypeKind.SCALAR },
            },
        }))).toEqual('[ID]');
    });
    it('returns the arg type for LIST types of NON_NULL type', function () {
        expect(print(getArgType({
            type: {
                kind: TypeKind.LIST,
                ofType: {
                    kind: TypeKind.NON_NULL,
                    ofType: {
                        kind: TypeKind.SCALAR,
                        name: 'ID',
                    },
                },
            },
        }))).toEqual('[ID!]');
    });
});
describe('buildArgs', function () {
    it('returns an empty array when query does not have any arguments', function () {
        expect(buildArgs({ args: [] })).toEqual([]);
    });
    it('returns an array of args correctly filtered when query has arguments', function () {
        expect(print(buildArgs({ args: [{ name: 'foo' }, { name: 'bar' }] }, { foo: 'foo_value' }))).toEqual(['foo: $foo']);
    });
});
describe('buildApolloArgs', function () {
    it('returns an empty array when query does not have any arguments', function () {
        expect(print(buildApolloArgs({ args: [] }))).toEqual([]);
    });
    it('returns an array of args correctly filtered when query has arguments', function () {
        expect(print(buildApolloArgs({
            args: [
                {
                    name: 'foo',
                    type: {
                        kind: TypeKind.NON_NULL,
                        ofType: {
                            kind: TypeKind.SCALAR,
                            name: 'Int',
                        },
                    },
                },
                {
                    name: 'barId',
                    type: { kind: TypeKind.SCALAR, name: 'ID' },
                },
                {
                    name: 'barIds',
                    type: {
                        kind: TypeKind.LIST,
                        ofType: {
                            kind: TypeKind.NON_NULL,
                            ofType: {
                                kind: TypeKind.SCALAR,
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
                            type: { kind: TypeKind.SCALAR, name: 'ID' },
                        },
                    ],
                },
            ],
        };
        var fields = [
            { type: { kind: TypeKind.SCALAR, name: 'ID' }, name: 'id' },
            {
                type: { kind: TypeKind.SCALAR, name: '_internalField' },
                name: 'foo1',
            },
            {
                type: { kind: TypeKind.OBJECT, name: 'linkedType' },
                name: 'linked',
            },
            {
                type: { kind: TypeKind.OBJECT, name: 'resourceType' },
                name: 'resource',
            },
        ];
        expect(print(buildFields(introspectionResults)(fields))).toEqual([
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
                        type: { kind: TypeKind.SCALAR, name: 'bar' },
                    },
                ],
            },
        ],
    };
    var resource = {
        type: {
            fields: [
                { type: { kind: TypeKind.SCALAR, name: '' }, name: 'foo' },
                { type: { kind: TypeKind.SCALAR, name: '_foo' }, name: 'foo1' },
                {
                    type: { kind: TypeKind.OBJECT, name: 'linkedType' },
                    name: 'linked',
                },
                {
                    type: { kind: TypeKind.OBJECT, name: 'resourceType' },
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
                    kind: TypeKind.NON_NULL,
                    ofType: { kind: TypeKind.SCALAR, name: 'Int' },
                },
            },
            {
                name: 'barId',
                type: { kind: TypeKind.SCALAR },
            },
            {
                name: 'barIds',
                type: { kind: TypeKind.SCALAR },
            },
            { name: 'bar' },
        ],
    };
    var params = { foo: 'foo_value' };
    it('returns the correct query for GET_LIST', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, GET_LIST, queryType, params))).toEqual("query allCommand($foo: Int!) {\n  items: allCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n  total: _allCommandMeta(foo: $foo) {\n    count\n  }\n}\n");
    });
    it('returns the correct query for GET_MANY', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, GET_MANY, queryType, params))).toEqual("query allCommand($foo: Int!) {\n  items: allCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n  total: _allCommandMeta(foo: $foo) {\n    count\n  }\n}\n");
    });
    it('returns the correct query for GET_MANY_REFERENCE', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, GET_MANY_REFERENCE, queryType, params))).toEqual("query allCommand($foo: Int!) {\n  items: allCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n  total: _allCommandMeta(foo: $foo) {\n    count\n  }\n}\n");
    });
    it('returns the correct query for GET_ONE', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, GET_ONE, __assign({}, queryType, { name: 'getCommand' }), params))).toEqual("query getCommand($foo: Int!) {\n  data: getCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n}\n");
    });
    it('returns the correct query for UPDATE', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, UPDATE, __assign({}, queryType, { name: 'updateCommand' }), params))).toEqual("mutation updateCommand($foo: Int!) {\n  data: updateCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n}\n");
    });
    it('returns the correct query for CREATE', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, CREATE, __assign({}, queryType, { name: 'createCommand' }), params))).toEqual("mutation createCommand($foo: Int!) {\n  data: createCommand(foo: $foo) {\n    foo\n    linked {\n      foo\n    }\n    resource {\n      id\n    }\n  }\n}\n");
    });
    it('returns the correct query for DELETE', function () {
        expect(print(buildGqlQuery(introspectionResults)(resource, DELETE, __assign({}, queryType, { name: 'deleteCommand' }), params))).toEqual("mutation deleteCommand($foo: Int!) {\n  data: deleteCommand(foo: $foo) {\n    id\n  }\n}\n");
    });
});
