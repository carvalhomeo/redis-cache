import 'dotenv/config'
import cors from '@fastify/cors'

import Fastify from 'fastify'
import { userRoutes } from './routes/user'

const fastify = Fastify({
  logger: false,
})

fastify.register(cors)
fastify.register(userRoutes)

if (process.env.PORT) {
  fastify
    .listen({ port: parseInt(process.env.PORT), host: '0.0.0.0' })
    .then(() => {
      console.log(
        `HTTP server running on port http://localhost:${process.env.PORT}`,
      )
    })
} else {
  throw new Error('PORT is not defined')
}
