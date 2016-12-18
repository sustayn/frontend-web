import { Observable } from 'rxjs/Observable';

export default function getEpicResults(epic, data) {
  data = data || {};
  let results = [];

  epic({ ofType: () => Observable.of(data) }).subscribe(x => { results.push(x); });

  return results;
}