const Redis = require('ioredis')

/**
 * Get an existing Redis client instance. Build one if necessary
 * @return {Cluster|null} redis client
 * */
function buildRedisClient() {
  
  try {
    // cluster URLs should be passed in with the following format:
    // REDIS_CLUSTER_URLS=10.0.0.1:6379,10.0.0.2:6379,10.0.0.3:6379
    const nodes = process.env.REDIS_CLUSTER_URLS.split(',').map(url => {
      const [host, port] = url.split(':')
      return { host, port }
    })

    const client = new Redis.Cluster(nodes, {
      redisOptions: {
        enableAutoPipelining: true,
      },
    })

    client.on('error', error => {
      console.error('Redis Error', error)
    })

    client.on('connect', () => {
      console.log('Redis Connection stablished')
    })

    client.on('ready', () => {
      console.log('Redis client ready')
    })

    client.on('end', () => {
      console.log('Redis client connection ended')
    })

    // Emits when an error occurs when connecting 
    // to a node when using Redis in Cluster mode
    client.on('node error', (error, node) => {
      console.error(`Redis error in node ${node}`, error)
    })

    return client
  } catch (error) {
    console.error('Could not create a Redis cluster client', error)

    return null
  }
}

module.exports = buildRedisClient
