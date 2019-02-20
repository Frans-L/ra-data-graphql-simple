import { GET_LIST, GET_MANY, GET_MANY_REFERENCE, CREATE, UPDATE, DELETE, } from 'ra-core';
import buildVariables from './buildVariables';
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
            expect(buildVariables(introspectionResult)({ type: { name: 'Post', fields: [] } }, GET_LIST, params, {})).toEqual({
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
            expect(buildVariables()({ type: { name: 'Post' } }, CREATE, params, queryType)).toEqual({
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
            expect(buildVariables()({ type: { name: 'Post' } }, UPDATE, params, queryType)).toEqual({
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
            expect(buildVariables()({ type: { name: 'Post' } }, GET_MANY, params, {})).toEqual({
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
            expect(buildVariables()({ type: { name: 'Post' } }, GET_MANY_REFERENCE, params, {})).toEqual({
                filter: { author: 'author1' },
            });
        });
    });
    describe('DELETE', function () {
        it('returns correct variables', function () {
            var params = {
                id: 'post1',
            };
            expect(buildVariables()({ type: { name: 'Post', inputFields: [] } }, DELETE, params, {})).toEqual({
                id: 'post1',
            });
        });
    });
});
