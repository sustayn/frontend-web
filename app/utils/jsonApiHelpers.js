import kebabCase from 'lodash/kebabCase';
import camelCase from 'lodash/camelCase';
import pluralize from 'pluralize';
import isEmpty from 'lodash/isEmpty';

const RELATIONSHIP_REGEX = /(.+)Id$/;

/**
 * Serialize data and attributes into JSON API data
 * @param  {Object} data  Data to include within the data key of the document
 * @param  {Object} attrs Attributes to serialize into the attributes key
 * @return {Object}       The JSON API document
 */
export function serializeJsonApiRecord(data, attrs) {
    const attributes = {};
    const newData = {};
    const relationships = {};
    Object.keys(attrs).forEach((key) => {
        // If it tests with the form of {something}Id then add it as a relationship
        if(RELATIONSHIP_REGEX.test(key)) {
            // Get result from first capturing group - the actual relationship
            const rel = key.match(RELATIONSHIP_REGEX)[1];
            relationships[kebabCase(rel)] = {
                data: { type: kebabCase(pluralize(rel)), id: attrs[key] },
            };
        } else {
            attributes[kebabCase(key)] = attrs[key];
        }
    });

    if(data.type) newData.type = kebabCase(data.type);
    if(data.id) newData.id = data.id;
    if(!isEmpty(relationships)) newData.relationships = relationships;
    newData.attributes = attributes;

    return { data: newData };
}

/**
 * Deserialize a JSON API errors array into form data errors
 * Does _not_ take into account any errors that do not have source.pointer and detail keys
 * @param  {Array} errsArray The errors array from the JSON API response
 * @return {Object}          An object of the form { [attr]: [errText] } for each err in the errors array
 */
export function deserializeJsonApiErrors(errsArray) {
    if(!errsArray || errsArray.length === 0) return {};

    const errorsObj = {};
    errsArray.filter((err) => err.source && err.source.pointer && err.detail).forEach((err) => {
        const key = camelCase(err.source.pointer.replace('/data/attributes/', ''));
        errorsObj[key] = err.detail;
    });

    return errorsObj;
}