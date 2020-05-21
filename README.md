# @servicebus/kafkabus-common
[![Build Status](https://travis-ci.org/servicebus/kafkabus-common.svg?branch=master)](https://travis-ci.org/servicebus/kafkabus-common)
[![codecov](https://codecov.io/gh/servicebus/kafkabus-common/branch/master/graph/badge.svg)](https://codecov.io/gh/servicebus/kafkabus-common)

## Usage Example

**start.mjs**
```
import path from 'path'
import log from 'llog'
import errortrap from 'errortrap'
import registerHandlers from '@servicebus/register-handlers'
import { makeBus, handleError } from '@servicebus/kafkabus-common';
import { config } from '../config.mjs'

errortrap()

const bus = makeBus(config)
const { serviceName } = config

registerHandlers({
  bus,
  handleError,
  path:  path.resolve(process.cwd(), 'handlers'),
  queuePrefix: serviceName
})

log.info('service is running')
```

### Config

```
{
  serviceName: 'microservice',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  kafka: {
    host: process.env.KAFKA_HOST || '127.0.0.1',
    port: process.env.KAFKA_PORT || '9092',
    brokers: process.env.KAFKA_BROKERS && process.env.KAFKA_BROKERS.split(',') || ['localhost:9092', 'localhost:9095', 'localhost:9098']
  },
}
```