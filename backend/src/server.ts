import Koa from "koa";
import koaCors from "koa-cors";
import { connect } from "mongoose";

import "dotenv/config";

const app = new Koa();
app.use(koaCors);

const mongoDB = process.env.MONGODB_CONNECT as string;
const port = process.env.PORT;

connect(mongoDB)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error({ message: err }));

app.listen(port, () => {
  console.log(`Server running, ${port}`);
});
