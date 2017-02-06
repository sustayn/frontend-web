import Factory from './Factory';
import faker from 'faker';

const Node = new Factory('node', {
  name:         faker.name.firstName,
  temperatures: () => [
    { time: new Date('2016-11-1').toJSON(), value: 20.0 },
    { time: new Date('2016-11-2').toJSON(), value: 21.0 },
    { time: new Date('2016-11-3').toJSON(), value: 19.0 },
    { time: new Date('2016-11-4').toJSON(), value: 19.5 },
    { time: new Date('2016-11-5').toJSON(), value: 20.5 },
    { time: new Date('2016-11-6').toJSON(), value: 20.0 },
  ],
});

export default Node;