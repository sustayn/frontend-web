import Pretender from 'pretender';
import pluralize from 'pluralize';
import kebabCase from 'lodash/kebabCase';
import Response from './Response';
import db from './db';
import capitalize from './utils/capitalize';
import logWrapper from './utils/logWrapper';
import deserializeJsonApi from './utils/deserializeJsonApi';

class Server {
    /**
     * Setup for the server class. Creates a pretender instance, with passthrough,
     * and console logging for handled, unhandled, and passthrough requests
     */
    constructor() {
        this.pretender = new Pretender(function() {
            this.get('/**', this.passthrough);

            this.passthroughRequest = function(verb, path, request) {
                logWrapper(`Passthrough request: ${verb.toUpperCase()} ${request.url}`);
            };

            this.handledRequest = function(verb, path, request) {
                logWrapper(`Mirage: [${request.status}] ${verb.toUpperCase()} ${request.url}`);
                logWrapper(`Request Body: `, request.requestBody);
                const { responseText } = request;
                let loggedResponse;

                try {
                    loggedResponse = JSON.parse(responseText);
                } catch(e) {
                    loggedResponse = responseText;
                }

                // The response body data
                logWrapper(loggedResponse);
            };

            this.unhandledRequest = function(verb, path) {
                path = decodeURI(path);
                console.error(
                    `Your App tried to ${verb} '${path}',
                    but there was no route defined to handle this request.
                    Define a route that matches this path in a route file.
                    Did you forget to add a namespace, or include the route file in the index?`
                );
            };
        });

        ['get', 'put', 'post', 'delete', 'patch'].forEach((verb) => {
            this[verb] = this._route(verb);
        });

        // Default headers are JSON API
        this.headers = {
            'Content-Type': 'application/vnd.api+json',
        };

        // Default namespace. Eventually will want to accept server config or something I'm sure
        this.namespace = '';
    }

    /**
     * Set the namespace for the server. This will be applied to all routes that are defined while this namespace is set
     * @param {String} namespace The namespace for the routes
     */
    setNamespace(namespace) {
        this.namespace = namespace;
    }

    /**
     * Generate a route wrapper for each different verb
     * @param  {String} verb The HTTP verb to create the route for
     * @return {Function}    A function that is a wrapper for the the corresponding pretender function.
     *                       It calls the pretender function and the passed in handler and calls serializers on the result
     */
    _route(verb) {
        return (url, handler, status) => {
            const namespace = getNamespace(this.namespace);
            this.pretender[verb](`${namespace}${url}`, (request) => {
                // We want to deserialize the request from JSON API.
                // At the very least, it will parse the JSON from the stringified version.
                // It will then pass this into the deserializeJsonApi function, which will turn it into a simple object
                if(request.requestBody) {
                    try {
                        const data = JSON.parse(request.requestBody);
                        request.parsedBody = deserializeJsonApi(data);
                    } catch(e) {
                        logWrapper(`Error deserializing request: ${e}`);
                    }
                }

                const handlerResponse = handler(db, request);

                let responseStatus = status || this._defaultStatus(verb);
                let responseHeaders = this.headers;
                let responseString;

                if(handlerResponse instanceof Response) {
                    responseStatus = handlerResponse.status || responseStatus;
                    responseHeaders = Object.assign({}, responseHeaders, handlerResponse.headers);
                    responseString = JSON.stringify(handlerResponse.data);
                } else if(Array.isArray(handlerResponse)) {
                    responseString = JSON.stringify(this.serializeArray(handlerResponse, request.queryParams.include));
                } else if(typeof handlerResponse === 'object') {
                    if(handlerResponse.id) {
                        responseString = JSON.stringify(this.serializeObject(handlerResponse, request.queryParams.include));
                    } else {
                        responseString = JSON.stringify(handlerResponse);
                    }
                } else if(typeof handlerResponse === 'undefined') {
                    responseString = '{}';
                } else {
                    console.error(`Your handler for url: ${url} did not return a recognizeable type (type: ${typeof handlerResponse})`);
                    responseString = '{}';
                }

                return [responseStatus, responseHeaders, responseString];
            });
        };
    }

    /**
     * Given a verb, return the default status for that verb
     * @param  {String} verb The HTTP verb
     * @return {Number}      The default status to be returned
     */
    _defaultStatus(verb) {
        switch(verb) {
            case 'get':
                return 200;
            case 'post':
                return 201;
            default: // PUT/PATCH/DELETE
                return 204;
        }
    }

    /**
     * Serialize a model into a JSON API response
     * @param  {Object} obj      The object to serialize
     * @param  {String} included A string of the 'include' query param. Can be undefined.
     *                           Formatted with comma separated objects. e.g. 'doctor,patient'
     *                           Does _not_ support nested resources at this time e.g. 'doctor.patients'
     * @return {Object}          The response object
     */
    serializeObject(obj, included) {
        const response = {
            data: this.jsonApiObject(obj),
        };
        if(included) {
            response.included = getUniqIncluded(this._getIncluded(obj, included))
                                .map((incObj) => this.jsonApiObject(incObj));
        }

        return response;
    }

    /**
     * Serialize an array of models into a JSON API response
     * @param  {Array} arr       The array of objects to serialize
     * @param  {String} included A string of the 'include' query param. Can be undefined.
     *                           Formatted with comma separated objects. e.g. 'doctor,patient'
     *                           Does _not_ support nested resources at this time e.g. 'doctor.patients'
     * @return {Object}          The response object
     */
    serializeArray(arr, included) {
        let includedObjects = [];

        const data = arr.map((obj) => {
            if(included) includedObjects = includedObjects.concat(this._getIncluded(obj, included));
            return this.jsonApiObject(obj);
        });

        const response = { data: data };
        if(included) {
            response.included = getUniqIncluded(includedObjects)
                                .map((incObj) => this.jsonApiObject(incObj));
        }
        return response;
    }

    /**
     * Create a JSON API object from a factory model
     * @param  {Object} obj The object to convert to JSON API 
     * @return {Object}     The JSON API schema object
     */
    jsonApiObject(obj) {
        const schema = {
            type:       kebabCase(pluralize(obj._meta.type)),
            attributes: {},
        };
        if(obj.id) schema.id = obj.id;

        schema.attributes = this.getModelAttributes(obj);

        if(obj._meta.relationships) {
            schema.relationships = {};
            obj._meta.relationships.forEach((rel) => {
                const relation = obj[`get${capitalize(rel)}`]();
                let data;

                if(Array.isArray(relation)) {
                    data = relation.map((rObj) => {
                        return { type: kebabCase(pluralize(rObj._meta.type)), id: rObj.id };
                    });
                } else {
                    data = { type: kebabCase(pluralize(relation._meta.type)), id: relation.id };
                }

                schema.relationships[kebabCase(rel)] = { data: data };
            });
        }

        return schema;
    }

    /**
     * Get model attributes, filtering out id, relationship Ids, and private attributes with _
     * @param  {Object} obj The factory object passed in
     * @return {Object}     The object with unwanted values filtered out
     */
    getModelAttributes(obj) {
        const modelAttrs = obj || {};
        const attributes = {};

        Object.keys(modelAttrs)
        .filter((key) => (key !== 'id' && !key.includes('_') && !key.includes('Id')))
        .forEach((key) => { attributes[kebabCase(key)] = modelAttrs[key]; });

        return attributes;
    }

    /**
     * Get all the included resources for the object, based on the passed in included param
     * @param  {Object} obj      The factory model to get the included resources from
     * @param  {String} included The included param for the request
     * @return {Array}           The array of included objects as factory models, not JSON API schema models
     */
    _getIncluded(obj, included) {
        const includedArray = included.split(',');
        let includedObjects = [];

        includedArray.forEach((rel) => {
            if(obj._meta.relationships.includes(rel)) {
                const relObj = obj[`get${capitalize(rel)}`]();
                includedObjects = Array.isArray(relObj) ? includedObjects.concat(relObj) : includedObjects.concat([relObj]);
            } else {
                console.warn(`Object with name ${obj._meta.type} does not have a relation ${rel}`);
            }
        });

        return includedObjects;
    }
}

export default new Server();

// Could probably take this and make it a more generic util method, by utilizing a passed in function to compare uniqueness
/**
 * Loop through the included objects array and only keep unique objects, based off of type and id
 * @param  {Array} arr  The array of included objects
 * @return {Array}      The array of unique included objects
 */
function getUniqIncluded(arr) {
    return arr.reduce((prev, curr) => {
        let dup = false;
        for(let i = 0; i < prev.length; i++) {
            if((prev[i].id === curr.id) && (prev[i]._meta.type === curr._meta.type)) {
                dup = true;
                break;
            }
        }
        return dup ? prev : [...prev, curr];
    }, []);
}

function getNamespace(definedNS) {
    return definedNS.includes('http') ? definedNS : `/v1/metamason${definedNS}`;
}