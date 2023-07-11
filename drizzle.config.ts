import type { Config } from "drizzle-kit";
 
export default {
  schema: "./src/services/database/schema.ts",
  out: "./drizzle",
} satisfies Config;