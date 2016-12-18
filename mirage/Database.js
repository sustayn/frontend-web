import Model from './Model';
import factories from './factories';
import pluralize from 'pluralize';

class DB {
  /** For each factory, create a model with the factory type and assign it to db.{type} */
  constructor() {
    Object.keys(factories).forEach((type) => {
      this[pluralize(type)] = new Model(type);
    });
  }
  /**
   * Wrapper for Model.create. Used as a way to seed models on startup
   * @param  {String} type  The type of resource to create
   * @param  {Object} attrs Optional attributes to pass in. Will override factory attributes
   * @return {Object}       The created object
   */
  create(type, attrs) {
    if(!factories.hasOwnProperty(type)) {
      return console.error(`Unable to find a factory with for object with type of ${type}. Did you import and export it in the index.js file?`);
    }

    return this[pluralize(type)].create(attrs);
  }

  /**
   * Create a list of objects
   * @param  {String} type  The type of resource to create
   * @param  {Number} num   The number of objects to create
   * @param  {Object} attrs Optional attributes to pass in. Will override factory attributes
   * @return {Array}        The array of created objects
   */
  createList(type, num, attrs) {
    if(!num || num <= 0) {
      return console.error(`Please specify a positive number for create list`);
    }

    const list = [];

    for(let i = 0; i < num; i++) {
      list.push(this.create(type, attrs));
    }

    return list;
  }

  destroyAll() {
    Object.keys(factories).forEach((type) => {
      this[pluralize(type)].destroyAll();
    });
  }
}

export default new DB();