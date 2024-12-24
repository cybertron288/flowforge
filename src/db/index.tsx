import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle('postgresql://postgres:postgres@localhost:5432/flow_forge'!);
