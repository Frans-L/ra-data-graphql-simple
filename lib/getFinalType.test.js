"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
var getFinalType_1 = __importDefault(require("./getFinalType"));
describe('getFinalType', function () {
    it('returns the correct type for SCALAR types', function () {
        expect(getFinalType_1.default({ name: 'foo', kind: graphql_1.TypeKind.SCALAR })).toEqual({
            name: 'foo',
            kind: graphql_1.TypeKind.SCALAR,
        });
    });
    it('returns the correct type for NON_NULL types', function () {
        expect(getFinalType_1.default({
            kind: graphql_1.TypeKind.NON_NULL,
            ofType: { name: 'foo', kind: graphql_1.TypeKind.SCALAR },
        })).toEqual({
            name: 'foo',
            kind: graphql_1.TypeKind.SCALAR,
        });
    });
    it('returns the correct type for LIST types', function () {
        expect(getFinalType_1.default({
            kind: graphql_1.TypeKind.LIST,
            ofType: { name: 'foo', kind: graphql_1.TypeKind.SCALAR },
        })).toEqual({
            name: 'foo',
            kind: graphql_1.TypeKind.SCALAR,
        });
    });
    it('returns the correct type for NON_NULL LIST types', function () {
        expect(getFinalType_1.default({
            kind: graphql_1.TypeKind.NON_NULL,
            ofType: {
                kind: graphql_1.TypeKind.LIST,
                ofType: { name: 'foo', kind: graphql_1.TypeKind.SCALAR },
            },
        })).toEqual({ name: 'foo', kind: graphql_1.TypeKind.SCALAR });
    });
});
