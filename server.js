import jsonServer from 'json-server';
import auth from 'json-server-auth';
import bodyParser from 'body-parser';

import userRoutes from './routes/user';

const server = jsonServer.create();
const router = jsonServer.router('db.json');

server.db = router.db;

// Permission rules
const rules = auth.rewriter({
    users: 400,
    items: 600,
    products: 644,
})

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(userRoutes);
server.use(rules);
server.use(auth);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port);
