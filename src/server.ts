import fastify from 'fastify'

const app = fastify()

app.get('/', async () => {
  return {
    project: 'Diet controll API',
    version: '0.0.2',
    date: '30/04/2023',
  }
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server is running')
  })
  .catch((error) => {
    console.log(error)
  })
