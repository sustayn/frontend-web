import { a, newNodeTempValue } from 'actions/actions';

export default class NodeChannel {
  constructor(cable, store) {
    this.cable = cable;
    this.store = store;
    this.subscriptions = {};
  }

  handleAction(action) {
    switch(action.type) {
      case a.OPEN_NODE_CHANNEL:
        this.subscriptions[action.id] = this.createSubscription(action.id);
        break;
      case a.CLOSE_NODE_CHANNEL:
        if(this.subscriptions[action.id]) this.subscriptions[action.id].unsubscribe();
        break;
      case a.SEND_TEMP_DATA:
        const { id, val } = action.payload;
        if(this.subscriptions[id]) this.subscriptions[id].send({ id, val });
    }
  }

  createSubscription(id) {
    return this.cable.subscriptions.create({ channel: 'NodeChannel', id }, {
      connected:    () => {},
      disconnected: () => {},
      received:     (data) => {
        switch(data.message) {
          case 'new_temperature_value':
            this.store.dispatch(newNodeTempValue(id, data.value));
            break;
        }
      },
    });
  }
}

// export default class Channel {
//   constructor(cable, store) {
//     this.cable = cable;
//     this.store = store;
//     this.subscriptions = {};
//   }
// }