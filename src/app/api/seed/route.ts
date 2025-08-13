import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../../db/schema';

export async function POST() {
  if(isRealDb(db)) {
    const records = await db.insert(advocates).values(advocateData).returning();
    return Response.json({ advocates: records });
  } else {
    return Response.error();
  }  
}

function isRealDb(db: unknown): db is PostgresJsDatabase<typeof schema> {
  return !!db && typeof(db as any).insert === 'function';
}
