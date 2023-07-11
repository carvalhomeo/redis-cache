import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  throw new Error('DATABASE_URL is not defined')
}

const client = postgres(getDatabaseUrl())
export const db = drizzle(client)
