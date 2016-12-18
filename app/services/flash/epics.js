import { Observable } from 'libs/rxjs';

import { a } from 'services/flash/actions';
import observableError from 'services/flash/observableError';

export const flashPushEpic = (action$) => {
  return action$.ofType(a.PUSH_TO_QUEUE)
  .concatMap(({ duration }) => {
    return Observable.of({ type: a.POP_FROM_QUEUE })
    .delay(duration || 3000)
    .takeUntil(action$.ofType(a.POP_FROM_QUEUE));
  });
};

export const flashErrorEpic = (action$) => {
  return action$.ofType(a.PUSH_ERROR)
  .mergeMap(({ message }) => observableError(message));
};

export const flashSuccessEpic = (action$) => {
  return action$.ofType(a.PUSH_SUCCESS)
  .mergeMap(({ message }) => Observable.of({ type: a.PUSH_TO_QUEUE, flashObject: { type: 'success', message } }));
};

export const flashWarningEpic = (action$) => {
  return action$.ofType(a.PUSH_WARNING)
  .mergeMap(({ message }) => Observable.of({ type: a.PUSH_TO_QUEUE, flashObject: { type: 'warning', message } }));
};

export default [
flashPushEpic,
flashErrorEpic,
flashSuccessEpic,
flashWarningEpic,
];