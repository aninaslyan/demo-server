const jsonServer = require('json-server')
const auth = require('json-server-auth')

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const port = process.env.PORT || 3000;

server.db = router.db;

// Permission rules
const rules = auth.rewriter({
    users: 400,
    items: 600,
    products: 664,
})

server.use(rules);
server.use(auth);
server.use(router);

server.listen(port);
