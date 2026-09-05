import assert from "node:assert";
import { gunzipSync } from "zlib";
import { query, transaction } from "./facade";


/**
 * Decompress a data as Buffer type.
 * @param compressedData The data as Buffer type.
 */
function decompress(compressedData: Buffer): string {
  const decompressed = gunzipSync(compressedData);
  return decompressed.toString("utf16le");
}


export async function sampleQuery(statement: string) { // : Promise<your_interface[]>
  return query(statement);
}


export async function sampleTransaction(statements: string[]): Promise<number[]> {
  return transaction(statements);
}

/**
 * To build an update statement from several key/value pairs
 * 
  let updates = [];
  for (const [key, value] of Object.entries(data))
    updates.push(`[${key}] = ${key}`);
  let update = updates.join(', ');
  let sql = `
    UPDATE table
    SET ${update}
    WHERE id = ${id}
  `;
 */
