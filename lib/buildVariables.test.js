"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ra_core_1 = require("ra-core");
var buildVariables_1 = __importDefault(require("./buildVariables"));
describe('buildVariables', function () {
    describe('GET_LIST', function () {
        it('returns correct variables', function () {
            var introspectionResult = {
                types: [
                    {
                        name: 'PostFilter',
                        inputFields: [{ name: 'tags_some' }],
                    },
                ],
            };
            var params = {
                filter: {
                    ids: ['foo1', 'foo2'],
                    tags: { id: ['tag1', 'tag2'] },
                    'author.id': 'author1',
                    views: 100,
                },
                pagination: { page: 10, perPage: 10 },
                sort: { field: 'sortField', order: 'DESC' },
            };
            expect(buildVariables_1.default(introspectionResult)({ type: { name: 'Post', fields: [] } }, ra_core_1.GET_LIST, params, {})).toEqual({
                filter: {
                    ids: ['foo1', 'foo2'],
                    tags_some: { id_in: ['tag1', 'tag2'] },
                    author: { id: 'author1' },
                    views: 100,
                },
                page: 9,
                perPage: 10,
                sortField: 'sortField',
                sortOrder: 'DESC',
            });
        });
    });
    describe('CREATE', function () {
        it('returns correct variables', function () {
            var params = {
                data: {
                    author: { id: 'author1' },
                    tags: [{ id: 'tag1' }, { id: 'tag2' }],
                    title: 'Foo',
                },
            };
            var queryType = {
                args: [{ name: 'tagsIds' }, { name: 'authorId' }],
            };
            expect(buildVariables_1.default()({ type: { name: 'Post' } }, ra_core_1.CREATE, params, queryType)).toEqual({
                authorId: 'author1',
                tagsIds: ['tag1', 'tag2'],
                title: 'Foo',
            });
        });
    });
    describe('UPDATE', function () {
        it('returns correct variables', function () {
            var params = {
                data: {
                    author: { id: 'author1' },
                    tags: [{ id: 'tag1' }, { id: 'tag2' }],
                    title: 'Foo',
                },
            };
            var queryType = {
                args: [{ name: 'tagsIds' }, { name: 'authorId' }],
            };
            expect(buildVariables_1.default()({ type: { name: 'Post' } }, ra_core_1.UPDATE, params, queryType)).toEqual({
                authorId: 'author1',
                tagsIds: ['tag1', 'tag2'],
                title: 'Foo',
            });
        });
    });
    describe('GET_MANY', function () {
        it('returns correct variables', function () {
            var params = {
                ids: ['tag1', 'tag2'],
            };
            expect(buildVariables_1.default()({ type: { name: 'Post' } }, ra_core_1.GET_MANY, params, {})).toEqual({
                filter: { ids: ['tag1', 'tag2'] },
            });
        });
    });
    describe('GET_MANY_REFERENCE', function () {
        it('returns correct variables', function () {
            var params = {
                target: 'author.id',
                id: 'author1',
            };
            expect(buildVariables_1.default()({ type: { name: 'Post' } }, ra_core_1.GET_MANY_REFERENCE, params, {})).toEqual({
                filter: { author: 'author1' },
            });
        });
    });
    describe('DELETE', function () {
        it('returns correct variables', function () {
            var params = {
                id: 'post1',
            };
            expect(buildVariables_1.default()({ type: { name: 'Post', inputFields: [] } }, ra_core_1.DELETE, params, {})).toEqual({
                id: 'post1',
            });
        });
    });
});
