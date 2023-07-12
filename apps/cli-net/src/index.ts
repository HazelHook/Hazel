import Koa from 'koa';
import websockify from 'koa-websocket';
import Router from '@koa/router';

const app = websockify(new Koa());
const route = new Router();

app

console.log('Starting server on port 3004');
// Using routes
app.ws.use(route.all('/', (ctx) => {
  console.log('ctx', ctx)
  ctx.websocket.send('Hello World');
  ctx.websocket.on('message', (message: any) => {
    // do something with the message from client
        console.log(message);
  });
}).middleware);

app.listen(3004);