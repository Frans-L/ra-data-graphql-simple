import { TypeKind } from 'graphql';
import isList from './isList';
describe('isList', function () {
    it('returns the correct type for SCALAR types', function () {
        expect(isList({ name: 'foo', kind: TypeKind.SCALAR })).toEqual(false);
    });
    it('returns the correct type for NON_NULL types', function () {
        expect(isList({
            kind: TypeKind.NON_NULL,
            ofType: { name: 'foo', kind: TypeKind.SCALAR },
        })).toEqual(false);
    });
    it('returns the correct type for LIST types', function () {
        expect(isList({
            kind: TypeKind.LIST,
            ofType: { name: 'foo', kind: TypeKind.SCALAR },
        })).toEqual(true);
    });
    it('returns the correct type for NON_NULL LIST types', function () {
        expect(isList({
            kind: TypeKind.NON_NULL,
            ofType: {
                kind: TypeKind.LIST,
                ofType: { name: 'foo', kind: TypeKind.SCALAR },
            },
        })).toEqual(true);
    });
});
