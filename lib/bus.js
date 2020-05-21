const servicebus = require('@servicebus/kafkabus')
const retry = require('@servicebus/retry')
const log = require('llog')

module.exports.handleError = function (msg, err) {
  log.error('error handling %s: %s. rejecting message w/ cid %s and correlationId %s.', msg.type, err, msg.cid, this.correlationId)
  log.error(err)
  msg.handle.reject(throwErr(err))
}

const throwErr = function (err) {
  throw err
}

module.exports.throwErr = throwErr

const onBusReady = function (bus, resolve) {
  resolve(bus)
}

module.exports.onBusReady = onBusReady

module.exports.makeBus = async function ({
  redis = {
    host: 'localhost',
    port: '6379'
  },

  kafka = {
    brokers: ['localhost:9093', 'localhost:9095', 'localhost:9097'],
    connectionTimeout: 3000,
    host: '127.0.0.1',
    port: 9092,
  },

  serviceName
} = {}) {
  return new Promise(async (resolve, reject) => {
    const bus = await servicebus.bus({
      ...kafka,
      serviceName
    })

    // bus.use(bus.logger())
    bus.use(bus.package())
    bus.use(bus.correlate())

    bus.use(retry({
      store: new retry.RedisStore({
        ...redis,
        setRetriesRemaining: true,
        keyExpireTTL: 0,
        namespace: kafka.serviceName
      })
    }))

    return resolve(bus);
  })
}
