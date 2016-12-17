import factories from './factories';

class Model {
    constructor(type) {
        this.type = type;
        this._maxId = 0;
        this.objects = [];
    }

    /**
     * Return all objects of this type
     * @return {Array} The array of factory objects
     */
    all() {
        return this.objects;
    }
    /**
     * Find all objects corresponding to one or many ids
     * @param  {Array OR Number OR Multiple Numbers} ids The ids of objects to find
     * @return {Array}                                   The array of corresponding objects
     */
    find(ids) {
        if(!Array.isArray(ids)) ids = Array.prototype.slice.call(arguments); // Turn arguments into an array

        return this.objects.filter((obj) => ids.includes(obj.id));
    }
    /**
     * Find all objects corresponding to the conditions provided
     * @param  {Object} conditions An object corresponding to the search conditions
     * @return {Array}             The array of objects that are found with the query
     */
    where(conditions) {
        let objects = this.objects;
        
        Object.keys(conditions).forEach((key) => {
            objects = objects.filter((obj) => {
                if(!conditions[key] && !obj[key]) return true; // If the condition is false and the property is undefined
                return conditions[key] === obj[key];
            });
        });

        return objects;
    }
    /**
     * Create a new object, using the factory for that object
     * @param  {Object} attrs Optional attributes to pass in to create
     * @return {Object}       The created object
     */
    create(attrs) {
        const newObj = factories[this.type].create(attrs);
        newObj.id = ++this._maxId;

        this.objects = [...this.objects, newObj];

        return newObj;
    }

    update(id, attrs) {
        const user = this.find(id)[0];

        if(!user) return console.error(`Unable to update model with type ${this.type} and id ${id}. Could not find model.`);

        Object.assign(user, attrs);
        return user;
    }

    destroy(id) {
        this.objects = this.objects.filter((obj) => obj.id !== id);

        return this.objects;
    }

    destroyAll() {
        this.objects = [];
    }
}

export default Model;