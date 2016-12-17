import { a } from 'services/flash/actions';

const init = [];

export function reducer(state = init, action) {
    switch(action.type) {
        case a.PUSH_TO_QUEUE:
            return [...state, action.flashObject];
        case a.POP_FROM_QUEUE:
            return state.slice(1);
        default:
            return state;
    }
}