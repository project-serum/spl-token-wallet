import { Commitment, Connection } from '@solana/web3.js'

type RateLimitedEndpoint = {
  url: string
  RPS: number
}

type EndpointRequestsCounter = {
  connection: Connection
  endpoint: RateLimitedEndpoint
  numberOfRequestsSent: number
}
// @ts-ignore
class MultiEndpointsConnection implements Connection {
  private endpointsRequestsCounter: EndpointRequestsCounter[]

  constructor(endpoints: RateLimitedEndpoint[], commitment?: Commitment) {
    this.endpointsRequestsCounter = endpoints.map(
      (endpoint: RateLimitedEndpoint) => ({
        endpoint,
        connection: new Connection(endpoint.url, commitment),
        numberOfRequestsSent: 0,
      })
    )

    // go through all methods of connection
    for (let functionName of Object.getOwnPropertyNames(Connection.prototype)) {
      // skip non-function
      if (typeof Connection.prototype[functionName] !== 'function') continue
      this[functionName] = (...args: any) => {
        // select connection, depending on RPS and load of connection, execute method of this connection
        try {
          const connection = this.getConnection();
          return connection[functionName](...args)
        } catch (e) {
          console.error(functionName, e)
        }
      }
    }

    // setInterval(() => {
    //   this.endpointsRequestsCounter.forEach((endpointCounter) => {
    //     endpointCounter.numberOfRequestsSent = 0
    //   })
    // }, 1500)
  }

  getConnection(): Connection {
    const availableConnection = this.endpointsRequestsCounter.reduce(
      (prev, current) =>
        prev.numberOfRequestsSent < current.numberOfRequestsSent ? prev : current
    );

    // objects pass by ref
    availableConnection.numberOfRequestsSent++

    return availableConnection.connection
  }

  // initializing in constructor, but some libraries use connection._rpcRequest
  async _rpcRequest(...args) {
    // @ts-ignore
    return await this.getConnection()._rpcRequest(...args);
  }
}

export default MultiEndpointsConnection
