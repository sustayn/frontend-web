import RxAjax from '../services/RxAjax';
import { Observable } from 'libs/rxjs';
import snakeCase from 'lodash/snakeCase';
import pluralize from 'pluralize';

import { genericPayload } from 'utils/normalizrHelpers.js';
import { a } from 'actions/actions';
import Logging from 'services/Logging';
import { observableError } from 'services/flash';
import { serializeJsonApiRecord, deserializeJsonApiErrors } from 'utils/jsonApiHelpers';

export function makeFetchEpic(entity) {
    const snaked = snakeCase(entity);
    const upperSnaked = snaked.toUpperCase();

    return (action$) => {
        return action$.ofType(a[`FETCH_${upperSnaked}_REQ`])
        .mergeMap(({ query = '' }) => {
            return RxAjax.get(`/${snaked}${query}`)
            .mapDataToAction(a[`FETCH_${upperSnaked}_RES`] || 'NONE')
            .catch((err) => {
                Logging.error(err, `${entity}#fetchEpic`);
                return Observable.of({ type: 'NONE' });
            });
        });
    };
}

export function makeFindEpic(entity) {
    const singulared = pluralize.singular(entity);
    const upperSnaked = snakeCase(singulared).toUpperCase();

    return (action$) => {
        return action$.ofType(a[`FIND_${upperSnaked}_REQ`])
        .mergeMap(({ id, query = '' }) => {
            return RxAjax.get(`/${snakeCase(entity)}/${id}${query}`)
            .mapDataToAction(a[`FIND_${upperSnaked}_RES`] || 'NONE')
            .catch((err) => {
                Logging.error(err, `${entity}#findEpic`);
                // TODO: Better error handling
                return observableError('We were unable to find this entity');
            });
        });
    };
}

export function makeCreateEpic(entity) {
    const snaked = snakeCase(entity);
    const upperSnaked = snaked.toUpperCase();

    return (action$) => {
        return action$.ofType(a[`CREATE_${upperSnaked}_REQ`])
        .mergeMap(({ payload }) => {
            const body = serializeJsonApiRecord({ type: entity }, payload);
            return RxAjax.post(`/${snaked}`, body)
            .mapDataToAction(a[`CREATE_${upperSnaked}_RES`] || 'NONE')
            .catch((err) => {
                Logging.error(err, `${entity}#createEpic`);

                if(err && err.xhr && err.xhr.responseText) {
                    const errResponse = JSON.parse(err.xhr.responseText);
                    return Observable.of({ type: a.PUSH_ERRORS, payload: deserializeJsonApiErrors(errResponse.errors) });
                }
                return Observable.of({ type: 'NONE' });
            });
        });
    };
}

export function makeEpics(entity) {
    return [
        makeFetchEpic(entity),
        makeFindEpic(entity),
        makeCreateEpic(entity),
    ];
}