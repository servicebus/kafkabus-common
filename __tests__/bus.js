const bus = require('bus')

const {
  makeBus,
  handleError,
  throwErr,
  onBusReady
} = bus

jest.mock('@servicebus/kafkabus', () => {
  return {
    bus: () => {
      return {
        use: jest.fn(),
        // logger: jest.fn(),
        package: jest.fn(),
        correlate: jest.fn()
      }
    }
  }
})

describe('lib/bus', () => {
  it('should make a bus when makeBus is called', async () => {
    expect(handleError).toBeDefined()
    expect(makeBus).toBeDefined()
    expect(throwErr).toBeDefined()

    let bus = await makeBus()
    expect(bus).toMatchSnapshot()
  })

  it('should throw an error when throwErr is called', () => {
    expect(() => {
      throwErr(new Error('OMG'))
    }).toThrow()
  })

  it('should handle an error with handleError is called', () => {
    expect(() => {
      handleError('msg', 'err')
    }).toThrow()
  })

  it('auth config', () => {
    expect(() => {
      makeBus({
        kafka: {
          brokers: ['localhost:9093', 'localhost:9095', 'localhost:9097'],
          connectionTimeout: 3000,
          host: '127.0.0.1',
          port: 9092,
        }
      })
    }).not.toThrow()
  })

  describe('#onBusReady', () => {
    let resolve = jest.fn()
    let bus = {}
    onBusReady(bus, resolve)
    expect(resolve).toBeCalledWith(bus)
  })
})
