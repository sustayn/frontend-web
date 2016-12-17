import { Observable } from 'libs/rxjs';

import { a } from 'services/flash/actions';

export default function observableError(message) {
    return Observable.of({
        type:        a.PUSH_TO_QUEUE,
        flashObject: {
            message,
            type: 'error',
        },
    });
}