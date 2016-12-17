import camelCase from 'lodash.camelcase';
import _mapKeys from 'lodash/mapKeys';

export default function camelizeKeys(obj) {
    return _mapKeys(obj, (val, key) => camelCase(key));
}