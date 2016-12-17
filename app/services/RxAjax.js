import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';

export class RxAjax {
    constructor({ headers = {}, baseUrl = '', afterRequest = (res) => res }) {
        this.headers  = this.defaultHeaders = headers;
        this.baseUrl = baseUrl;
        this.afterRequest = afterRequest;
    }

    ajax(urlOrRequest) {
        const request = typeof urlOrRequest === 'string' ? { url: urlOrRequest } : urlOrRequest;
        request.headers = Object.assign({}, this.headers, urlOrRequest.headers);
        request.url = `${this.baseUrl}${request.url}`;

        return Observable.ajax(request).map(this.afterRequest, this);
    }
    get(url, headers = {}) {
        return this.ajax({ method: 'GET', url, headers });
    }
    post(url, body, headers = {}) {
        return this.ajax({ method: 'POST', url, body, headers });
    }
    delete(url, body, headers = {}) {
        return this.ajax({ method: 'DELETE', url, body, headers });
    }
    patch(url, body, headers = {}) {
        return this.ajax({ method: 'PATCH', url, body, headers });
    }
    put(url, body, headers = {}) {
        return this.ajax({ method: 'PUT', url, body, headers });
    }

    setHeaders(headers) {
        this.headers = Object.assign({}, this.headers, headers);
    }
    resetHeaders() {
        this.headers = this.defaultHeaders;
    }
}

import { RxAjaxConfig } from '../config';
export default new RxAjax(RxAjaxConfig);