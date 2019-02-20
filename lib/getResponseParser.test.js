"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var ra_core_1 = require("ra-core");
var getResponseParser_1 = __importDefault(require("./getResponseParser"));
var testListTypes = function (type) {
    it('returns the response expected by AOR for GET_LIST', function () {
        var resource = {
            type: {
                name: 'Post',
                fields: [
                    {
                        name: 'id',
                        type: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: { kind: graphql_1.TypeKind.SCALAR },
                        },
                    },
                    {
                        name: 'title',
                        type: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: { kind: graphql_1.TypeKind.SCALAR },
                        },
                    },
                    {
                        name: 'tags',
                        type: {
                            kind: graphql_1.TypeKind.LIST,
                            ofType: { kind: graphql_1.TypeKind.OBJECT, name: 'Tag' },
                        },
                    },
                    { name: 'embeddedJson', type: { kind: graphql_1.TypeKind.JSON } },
                    {
                        name: 'author',
                        type: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: { kind: graphql_1.TypeKind.OBJECT, name: 'User' },
                        },
                    },
                    {
                        name: 'coauthor',
                        type: { kind: graphql_1.TypeKind.OBJECT, name: 'User' },
                    },
                ],
            },
        };
        var introspectionResults = {
            resources: [
                {
                    type: {
                        name: 'User',
                        fields: [
                            { name: 'id', type: { kind: graphql_1.TypeKind.SCALAR } },
                            {
                                name: 'firstName',
                                type: { kind: graphql_1.TypeKind.SCALAR },
                            },
                        ],
                    },
                },
                {
                    type: {
                        name: 'Tag',
                        fields: [
                            { name: 'id', type: { kind: graphql_1.TypeKind.SCALAR } },
                            { name: 'name', type: { kind: graphql_1.TypeKind.SCALAR } },
                        ],
                    },
                },
            ],
            types: [{ name: 'User' }, { name: 'Tag' }],
        };
        var response = {
            data: {
                items: [
                    {
                        _typeName: 'Post',
                        id: 'post1',
                        title: 'title1',
                        author: { id: 'author1', firstName: 'Toto' },
                        coauthor: null,
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag2', name: 'tag2 name' },
                        ],
                        embeddedJson: { foo: 'bar' },
                    },
                    {
                        _typeName: 'Post',
                        id: 'post2',
                        title: 'title2',
                        author: { id: 'author1', firstName: 'Toto' },
                        coauthor: null,
                        tags: [
                            { id: 'tag1', name: 'tag1 name' },
                            { id: 'tag3', name: 'tag3 name' },
                        ],
                        embeddedJson: { foo: 'bar' },
                    },
                ],
                total: { count: 100 },
            },
        };
        expect(getResponseParser_1.default(introspectionResults)(type, resource)(response)).toEqual({
            data: [
                {
                    id: 'post1',
                    title: 'title1',
                    'author.id': 'author1',
                    author: { id: 'author1', firstName: 'Toto' },
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag2', name: 'tag2 name' },
                    ],
                    tagsIds: ['tag1', 'tag2'],
                    embeddedJson: { foo: 'bar' },
                },
                {
                    id: 'post2',
                    title: 'title2',
                    'author.id': 'author1',
                    author: { id: 'author1', firstName: 'Toto' },
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag3', name: 'tag3 name' },
                    ],
                    tagsIds: ['tag1', 'tag3'],
                    embeddedJson: { foo: 'bar' },
                },
            ],
            total: 100,
        });
    });
};
var testSingleTypes = function (type) {
    it('returns the response expected by AOR for GET_LIST', function () {
        var resource = {
            type: {
                name: 'Post',
                fields: [
                    {
                        name: 'id',
                        type: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: { kind: graphql_1.TypeKind.SCALAR },
                        },
                    },
                    {
                        name: 'title',
                        type: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: { kind: graphql_1.TypeKind.SCALAR },
                        },
                    },
                    {
                        name: 'tags',
                        type: {
                            kind: graphql_1.TypeKind.LIST,
                            ofType: { kind: graphql_1.TypeKind.OBJECT, name: 'Tag' },
                        },
                    },
                    { name: 'embeddedJson', type: { kind: graphql_1.TypeKind.JSON } },
                    {
                        name: 'author',
                        type: {
                            kind: graphql_1.TypeKind.NON_NULL,
                            ofType: { kind: graphql_1.TypeKind.OBJECT, name: 'User' },
                        },
                    },
                    {
                        name: 'coauthor',
                        type: { kind: graphql_1.TypeKind.OBJECT, name: 'User' },
                    },
                ],
            },
        };
        var introspectionResults = {
            resources: [
                {
                    type: {
                        name: 'User',
                        fields: [
                            { name: 'id', type: { kind: graphql_1.TypeKind.SCALAR } },
                            {
                                name: 'firstName',
                                type: { kind: graphql_1.TypeKind.SCALAR },
                            },
                        ],
                    },
                },
                {
                    type: {
                        name: 'Tag',
                        fields: [
                            { name: 'id', type: { kind: graphql_1.TypeKind.SCALAR } },
                            { name: 'name', type: { kind: graphql_1.TypeKind.SCALAR } },
                        ],
                    },
                },
            ],
            types: [{ name: 'User' }, { name: 'Tag' }],
        };
        var response = {
            data: {
                data: {
                    _typeName: 'Post',
                    id: 'post1',
                    title: 'title1',
                    author: { id: 'author1', firstName: 'Toto' },
                    coauthor: null,
                    tags: [
                        { id: 'tag1', name: 'tag1 name' },
                        { id: 'tag2', name: 'tag2 name' },
                    ],
                    embeddedJson: { foo: 'bar' },
                },
            },
        };
        expect(getResponseParser_1.default(introspectionResults)(type, resource)(response)).toEqual({
            data: {
                id: 'post1',
                title: 'title1',
                'author.id': 'author1',
                author: { id: 'author1', firstName: 'Toto' },
                tags: [
                    { id: 'tag1', name: 'tag1 name' },
                    { id: 'tag2', name: 'tag2 name' },
                ],
                tagsIds: ['tag1', 'tag2'],
                embeddedJson: { foo: 'bar' },
            },
        });
    });
};
describe('getResponseParser', function () {
    testListTypes(ra_core_1.GET_LIST);
    testListTypes(ra_core_1.GET_MANY);
    testListTypes(ra_core_1.GET_MANY_REFERENCE);
    testSingleTypes(ra_core_1.CREATE);
    testSingleTypes(ra_core_1.UPDATE);
    testSingleTypes(ra_core_1.DELETE);
});
