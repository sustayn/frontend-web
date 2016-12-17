import db from 'mirage/Database';

before(function() {
    this.mirage = require('../mirage').default;
});
after(function() {
    this.mirage.pretender.shutdown();
});

beforeEach(function() {
    db.destroyAll();
});