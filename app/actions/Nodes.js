import { Observable } from 'libs/rxjs';
import { a } from 'actions/actions';
import { makeEpics } from 'actions/Entities';

export default [
  ...makeEpics('nodes'),
];