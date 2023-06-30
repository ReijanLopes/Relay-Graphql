import Koa from "koa";
import koaCors from "koa-cors";
import bodyParser from "koa-bodyparser";
import convert from "koa-convert";

import { connect } from "mongoose";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { execute, subscribe } from "graphql";

import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";

import { schema } from "./graphql/index";

import "dotenv/config";

const mongoDB = process.env.MONGODB_CONNECT as string;
const port = process.env.PORT;

const app = new Koa();
app.use(convert(koaCors()));
app.use(convert(bodyParser()));

app.use(
  convert(async (ctx, _) => {
    const request = {
      body: ctx.request.body,
      headers: ctx.req.headers,
      method: ctx.request.method,
      query: ctx.request.query,
    };

    if (shouldRenderGraphiQL(request)) {
      ctx.body = renderGraphiQL({
        subscriptionsEndpoint: `ws://localhost:${port}`,
      });
    } else {
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        operationName,
        query,
        variables,
        request,
        schema,
      });

      sendResult(result, ctx.res);
    }
  })
);

connect(mongoDB)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error({ message: err }));

const server = app.listen(port, () => {
  const wsServer = new WebSocketServer({
    server,
    path: "/graphql",
  });

  useServer({ schema, execute, subscribe }, wsServer);
  console.log(`Server running, http://localhost:${port}`);
});
