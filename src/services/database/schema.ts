import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
})

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users)

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users)
