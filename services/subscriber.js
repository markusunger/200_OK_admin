const Redis = require('ioredis');

const cfg = require('../services/config');

module.exports = (function RedisSubscriber() {
  const redis = new Redis({
    host: cfg.redisHost,
    port: cfg.redisPort,
    password: cfg.redisPassword,
  });

  return {
    subscribe: function subscribe(apiName) {
      redis.subscribe(apiName);
      return redis;
    },
  };
}());
