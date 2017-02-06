import server from '../Server';
import Response from '../Response';

server.get('/nodes/:id', (db, req) => {
  console.log(db.nodes.find(parseInt(req.params.id)));
  return db.nodes.find(req.params.id);
});

export default server;