import db from '../Database';
import pluralize from 'pluralize';
import capitalize from '../utils/capitalize';

class Factory {
    /**
     * Assign type, and the attribute factories.
     * An attribute factory is the object of attributes as functions that are called to generate fake data
     */
    constructor(type, attrs) {
        this.type = type;
        this.attrFactories = attrs;
    }

    /**
     * Create a new resource. It creates it with a _meta object with a type field
     * It will assign a value based on the attribute factory.
     * If a 'relationships' object is defined on the attribute factory, then it creates methods to find those relationships
     * based on whether it is belongsTo, hasOne, or hasMany
     * @param  {Object} customAttrs The custom attributes to assign to the object. Overrides existing attributes
     * @return {Object}             The created object
     */
    create(customAttrs = {}) {
        const newObj = {
            _meta: {
                type: this.type,
            },
        };

        Object.keys(this.attrFactories).forEach((key) => {
            if(key === 'relationships') {
                // The relationships object
                const relationshipsObject = this.attrFactories[key];
                newObj._meta.relationships = [];

                if(relationshipsObject.belongsTo) {
                    newObj._meta.relationships = newObj._meta.relationships.concat(relationshipsObject.belongsTo);

                    relationshipsObject.belongsTo.forEach((belongsTo) => {
                        newObj[`get${capitalize(belongsTo)}`] = function() {
                            return db[pluralize(belongsTo)].find(this[`${belongsTo}Id`])[0];
                        };
                    });
                }

                if(relationshipsObject.hasMany) {
                    newObj._meta.relationships = newObj._meta.relationships.concat(relationshipsObject.hasMany);

                    relationshipsObject.hasMany.forEach((hasMany) => {
                        newObj[`get${capitalize(hasMany)}`] = function() {
                            const queryConditions = {};
                            queryConditions[`${newObj._meta.type}Id`] = this.id;
                            return db[hasMany].where(queryConditions);
                        };
                    });
                }

                if(relationshipsObject.hasOne) {
                    newObj._meta.relationships = newObj._meta.relationships.concat(relationshipsObject.hasOne);

                    relationshipsObject.hasOne.forEach((hasOne) => {
                        newObj[`get${capitalize(hasOne)}`] = function() {
                            const queryConditions = {};
                            queryConditions[`${newObj._meta.type}Id`] = this.id;
                            return db[hasOne].where(queryConditions)[0];
                        };
                    });
                }
            } else {
                // Just a normal attribute factory
                newObj[key] = this.attrFactories[key]();
            }
        });

        return Object.assign({}, newObj, customAttrs);
    }
}

export default Factory;