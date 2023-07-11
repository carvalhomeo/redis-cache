import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import {
  db,
  insertUserSchema,
  selectUserSchema,
  users,
} from '../services/database'
import { eq } from 'drizzle-orm'
import { redis } from '../services/cache'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', async () => {
    const userList = await db.select().from(users)

    return userList
  })

  fastify.get(
    '/user/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.string(),
      })

      const { id } = paramsSchema.parse(request.params)

      const cachedUser = await redis.get(`${id}`)

      if (cachedUser) {
        return cachedUser
      }

      const userList = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))

      return !userList.length ? reply.send() : userList.reduce((user) => user)
    },
  )

  fastify.post('/user', async (request: FastifyRequest) => {
    const newUser = insertUserSchema.parse(request.body)
    const userList = await db.insert(users).values(newUser).returning()
    const user = userList.reduce((user) => user)

    await redis.set(`${user.id}`, JSON.stringify(user))

    return user
  })

  fastify.put('/user/:id', async (request: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    const { fullName, phone } = selectUserSchema
      .omit({ id: true })
      .parse(request.body)

    return await db
      .update(users)
      .set({ fullName, phone })
      .where(eq(users.id, parseInt(id)))
      .returning()
  })

  fastify.delete('/user/:id', async (request: FastifyRequest) => {
    const paramsSchema = z.object({
      id: z.string(),
    })

    const { id } = paramsSchema.parse(request.params)

    await db.delete(users).where(eq(users.id, parseInt(id)))
  })
}
