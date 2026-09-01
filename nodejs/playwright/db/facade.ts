import { DBClient, mssqlClient } from "./client";
import { getDBconfig } from "./config";


let client: DBClient = null;

export async function initializeDBClient(env: string): Promise<void> {
  let conf = getDBconfig(env);
  if (client) {
    await client.dispose();
    client = null;
  }
  if (!client) {
    client = new mssqlClient(conf);
    await client.initialize();
  }
}

export async function disposeDBClient(): Promise<void> {
  if (client) {
    try { await client.dispose(); } catch(error) { }
    client = null;
  }
}

export async function query(statement: string): Promise<any[]> {
  return client.query(statement);
}

export async function transaction(statements: string[]): Promise<number[]> {
  return client.transaction(statements);
}
