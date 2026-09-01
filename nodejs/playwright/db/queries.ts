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
