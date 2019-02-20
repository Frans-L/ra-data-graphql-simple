import { TypeKind } from 'graphql';
import getFinalType from './getFinalType';
describe('getFinalType', function () {
    it('returns the correct type for SCALAR types', function () {
        expect(getFinalType({ name: 'foo', kind: TypeKind.SCALAR })).toEqual({
            name: 'foo',
            kind: TypeKind.SCALAR,
        });
    });
    it('returns the correct type for NON_NULL types', function () {
        expect(getFinalType({
            kind: TypeKind.NON_NULL,
            ofType: { name: 'foo', kind: TypeKind.SCALAR },
        })).toEqual({
            name: 'foo',
            kind: TypeKind.SCALAR,
        });
    });
    it('returns the correct type for LIST types', function () {
        expect(getFinalType({
            kind: TypeKind.LIST,
            ofType: { name: 'foo', kind: TypeKind.SCALAR },
        })).toEqual({
            name: 'foo',
            kind: TypeKind.SCALAR,
        });
    });
    it('returns the correct type for NON_NULL LIST types', function () {
        expect(getFinalType({
            kind: TypeKind.NON_NULL,
            ofType: {
                kind: TypeKind.LIST,
                ofType: { name: 'foo', kind: TypeKind.SCALAR },
            },
        })).toEqual({ name: 'foo', kind: TypeKind.SCALAR });
    });
});
