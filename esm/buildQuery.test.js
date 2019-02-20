var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import gql from 'graphql-tag';
import { buildQueryFactory } from './buildQuery';
describe('buildQuery', function () {
    var queryType = 'query_type';
    var resource = {
        type: { name: 'Post' },
        GET_LIST: queryType,
    };
    var introspectionResults = {
        resources: [resource],
    };
    it('throws an error if resource is unknown', function () {
        expect(function () {
            return buildQueryFactory()(introspectionResults)('GET_LIST', 'Comment');
        }).toThrow('Unknown resource Comment. Make sure it has been declared on your server side schema. Known resources are Post');
    });
    it('throws an error if resource does not have a query or mutation for specified AOR fetch type', function () {
        expect(function () {
            return buildQueryFactory()(introspectionResults)('CREATE', 'Post');
        }).toThrow('No query or mutation matching aor fetch type CREATE could be found for resource Post');
    });
    it('correctly builds a query and returns it along with variables and parseResponse', function () {
        var buildVariables = jest.fn(function () { return ({ foo: true }); });
        var buildGqlQuery = jest.fn(function () {
            return gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n                    query {\n                        id\n                    }\n                "], ["\n                    query {\n                        id\n                    }\n                "])));
        });
        var getResponseParser = jest.fn(function () { return 'parseResponseFunction'; });
        var buildVariablesFactory = jest.fn(function () { return buildVariables; });
        var buildGqlQueryFactory = jest.fn(function () { return buildGqlQuery; });
        var getResponseParserFactory = jest.fn(function () { return getResponseParser; });
        expect(buildQueryFactory(buildVariablesFactory, buildGqlQueryFactory, getResponseParserFactory)(introspectionResults)('GET_LIST', 'Post', { foo: 'bar' })).toEqual({
            query: gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n                query {\n                    id\n                }\n            "], ["\n                query {\n                    id\n                }\n            "]))),
            variables: { foo: true },
            parseResponse: 'parseResponseFunction',
        });
        expect(buildVariablesFactory).toHaveBeenCalledWith(introspectionResults);
        expect(buildGqlQueryFactory).toHaveBeenCalledWith(introspectionResults);
        expect(getResponseParserFactory).toHaveBeenCalledWith(introspectionResults);
        expect(buildVariables).toHaveBeenCalledWith(resource, 'GET_LIST', { foo: 'bar' }, queryType);
        expect(buildGqlQuery).toHaveBeenCalledWith(resource, 'GET_LIST', queryType, { foo: true });
        expect(getResponseParser).toHaveBeenCalledWith('GET_LIST', resource, queryType);
    });
});
var templateObject_1, templateObject_2;
