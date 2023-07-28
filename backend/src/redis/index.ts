import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || "6379";

const options = {
  host: host,
  port: Number(port),
  retryStrategy: (times: number) => {
    return Math.min(times * 50, 2000);
  },
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});

export default pubsub;
