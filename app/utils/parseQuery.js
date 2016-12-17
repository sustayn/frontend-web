import _fromPairs from 'lodash/fromPairs';

export default function parseQuery(qstr) {
    const arr = qstr.substr(1).split('&');
    return _fromPairs(arr.map((val) => {
        return val.split('=').map((spl) => decodeURIComponent(spl) || '');
    }));
}