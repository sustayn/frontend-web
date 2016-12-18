import camelCase from 'lodash/camelCase';

/**
 * Deserializes a JSON API request into a plain, flat, javascript object
 * @param  {Object} data The JSON API object
 * @return {Object}      The flattened, deserialized object
 *
 * @example
 * input:
 * {
 *     data: {
 *         type: 'my-type',
 *         attributes: {
 *             'attr-one': 'foo',
 *             'attr-two': 'bar'
 *         },
 *         relationships: {
 *             'rel-one': {
 *                 data: {
 *                     type: 'rel-ones',
 *                     id: 42
 *                 }
 *             }
 *         }
 *     }
 * }
 *
 * output:
 * {
 *     type: 'myType',
 *     attrOne: 'foo',
 *     attrTwo: 'bar',
 *     relOneId: 42
 * }
 */
export default function deserializeJsonApi(data) {
  if(!data.data || !data.data.type) return data;

  const newData = { type: camelCase(data.data.type) };
  if(data.data.id) newData.id = data.data.id;

  Object.keys(data.data.attributes).forEach((key) => {
    newData[camelCase(key)] = data.data.attributes[key];
  });

  if(data.data.relationships) {
    Object.keys(data.data.relationships).forEach((rel) => {
      const relData = data.data.relationships[rel].data;
      newData[`${camelCase(rel)}Id`] = relData.id;
    });
  }

  return newData;
}