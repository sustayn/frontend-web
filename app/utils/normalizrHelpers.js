import { Schema, normalize, arrayOf } from 'normalizr';
import { Observable } from 'libs/rxjs';
import reduce from 'lodash/reduce';
import camelCase from 'lodash/camelCase';

import { entityList } from '../reducers/Entities';

/*  Normalizr helper methods

Usage:
genericPayload(xhrResponse, genericModels('ModelX', 'ModelY'))
(Model names should be plural)

Output:
Takes nested JSON data of the following form, and normalizes it into a Redux-store-friendly format

From:
{
  "data": [
    {
      "type": "patient",
      "attributes": {
        "name": "Gretchen Renner DDS",
        "status": 1,
        "notes": "Use the multi-byte EXE card, then you can compress the primary program!"
      },
      "id": 1,
      "relationships": {
        "doctor": {
          "data": {
            "type": "doctor",
            "id": 1
          }
        }
      }
    },
    ...
  ], "included": [
    {
      "type": "doctor",
      "attributes": {
        "name": "Effie Towne"
      },
      "id": 1,
      "relationships": {
        "patients": {
          "data": [
            {
              "type": "patient",
              "id": 1
            }
          ]
        }
      }
    },
    ...
  ]
}

To:
{
  "entities": {
    "patients": {
      "1": {
        "type": "patient",
        "name": "Gretchen Renner DDS",
        "status": 1,
        "notes": "Use the multi-byte EXE card, then you can compress the primary program!",
        "id": 1,
        "doctor": 1
      },
      ...
    },
    "doctors": {
      "1": {
        "type": "doctor",
        "name": "Effie Towne",
        "id": 1,
        "patients": [1]
      },
      ...
    }
  },
  "result": [
    {
      "id": 1,
      "schema": "patients"
    },
    ...,
    {
      "id": 1,
      "schema": "doctors"
    },
    ...
  ]
}

*/

export const genericEntity = (output, key, value, input) => {
  if(key === 'type') {
    // Camelize the type
    output[key] = camelCase(value);
  } else if(key === 'attributes') {
    Object.keys(value).forEach((attr) => {
      // Camelize attribute keys
      output[camelCase(attr)] = value[attr];
    });
    delete output.attributes;
  } else if(key === 'relationships') {
    Object.keys(value).forEach((relation) => {
      // for "has many" relations
      if(Array.isArray(value[relation].data)) {
        output[camelCase(relation)] = value[relation].data.map((val) => val.id);
      //  for "has one" relations
      } else {
        output[camelCase(relation)] = value[relation].data.id;
      }
    });
    delete output.relationships;
  }
};

export const genericSchema = (schema) => {
  return new Schema(schema, {
    idAttribute:  (value) => value.id,
    assignEntity: genericEntity,
  });
};

const entityModels = reduce(entityList, (res, val) => {
  res[val] = genericSchema(val);
  return res;
}, {});

// This will need to expand should requests get more sophisticated
export const genericPayload = (res) => {
  if(!Array.isArray(res.response.data)) res.response.data = [res.response.data];

  const data = res.response.included ?
    [...res.response.data, ...res.response.included] :
    [...res.response.data];
  return normalize(
    data,
    arrayOf(
      entityModels,
      {
        schemaAttribute: (item) => {
          return camelCase(item.type);
        },
      }
    )
  );
};

Observable.prototype.mapDataToPayload = function mapDataToPayload() {
  return Observable.create((observer) => {
    this.subscribe({
      next:     (data) => observer.next(genericPayload(data)),
      error:    (err) => observer.error(err),
      complete: () => observer.complete(),
    });
  });
};

Observable.prototype.mapDataToAction = function mapDataToAction(type) {
  return Observable.create((observer) => {
    this.subscribe({
      next:     (data) => observer.next({ type, payload: genericPayload(data) }),
      error:    (err) => observer.error(err),
      complete: () => observer.complete(),
    });
  });
};