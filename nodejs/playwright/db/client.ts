import { mssql_conf, oracle_conf, pg_conf } from "./config";
import sql from "mssql";
import { Pool, PoolClient } from "pg";
import oracledb from "oracledb";


export abstract class DBClient {

  engine: string;
  driver: any;
  env: string;

  constructor(engine: string, env: string) {
    this.engine = engine;
    this.env = env;
  }

  async initialize(): Promise<any> {
    if (this.driver) {
      await this.dispose();
      this.driver = null;
    }
  }

  abstract dispose(): Promise<void>

  async testConnection(): Promise<boolean> {
    const connectionTestQuery = this.engine === "oracle"
      ? "SELECT 1 AS Connected FROM DUAL"
      : "SELECT 1 AS Connected";
    const result = await this.query(connectionTestQuery);
    return result.length > 0;
  }

  /**
   * Executes a SQL query.
   * @param statement The SQL query to execute.
   * @returns An array of the fetched records.
   */
  abstract query(statement: string): Promise<any[]>

  /**
   * Executes a transaction (insert, update, delete, drop)
   * @param statements The SQL statement(s) to execute.
   * @returns The number of affected records.
   */
  abstract transaction(statements: string | string[]): Promise<number[]>
}


export class mssqlClient extends DBClient {

  constructor(env: string) {
    super("mssql", env);
  }

  async initialize(): Promise<void> {
    super.initialize();
    if (!this.driver) {
      let pool = new sql.ConnectionPool(mssql_conf);
      this.driver = await pool.connect();
    }
  }

  async dispose(): Promise<void> {
    if (this.driver)
      try { await (this.driver as sql.ConnectionPool).close(); } catch(error) { }
    this.driver = null;
  }

  async query(statement: string): Promise<any[]> {
    let _driver = (this.driver as sql.ConnectionPool)
    try {
      const result = await _driver.request().query(statement);
      return result.recordset;
    } catch (error) {
      console.error("Database error: ", error);
      console.error("Raw query: ", statement);
      throw error;
    }
  }

  async transaction(statements: string | string[]): Promise<number[]> {
    statements = Array.isArray(statements) ? statements : [statements];
    const driver = this.driver as sql.ConnectionPool;
    const tx = new sql.Transaction(driver);

    let began = false;

    try {
      await tx.begin();
      began = true;

      const request = new sql.Request(tx);
      const rowsAffected: number[] = [];

      for (const statement of statements) {
        try {
          const result = await request.query(statement);
          rowsAffected.push(...result.rowsAffected);
        } catch (error) {
          console.error("Database error: ", error);
          console.error("Raw query: ", statement);
          throw error;
        }
      }
      await tx.commit();
      return rowsAffected;
    } catch (error) {
      if (began) {
        try {
          await tx.rollback();
        } catch (rollbackErr) {
          console.error("Rollback failed:", rollbackErr);
        }
      }
      throw error;
    }
  }

}

export class pgClient extends DBClient {

  constructor(env: string) {
    super("pg", env);
  }

  async initialize(): Promise<any> {
    super.initialize();
    if (!this.driver) {
      let pool = new Pool(pg_conf);
      this.driver = pool.connect();
    }
  }

  async dispose(): Promise<void> {
    try { (this.driver as PoolClient).release(); } catch(error) { };
    this.driver = null;
  }

  async query(statement: string): Promise<any[]> {
    const result = await (this.driver as PoolClient).query(statement);
    return result.rows;
  }

  async transaction(statements: string | string[]): Promise<number[]> {
    statements = Array.isArray(statements) ? statements : [statements];
    let _driver: PoolClient = this.driver as PoolClient;
    try {
      await _driver.query("BEGIN");
      const results: number[] = [];

      for (const statement of statements) {
        const result = await _driver.query(statement);
        results.push(result.rowCount ?? 0);
      }
      await _driver.query("COMMIT");
      return results;
    } catch (error) {
      console.error("Database error: ", error);
      try {
        await _driver.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
      throw error;
    } finally {
      _driver.release();
    }
  }

}

export class oracleClient extends DBClient {

  constructor(env: string) {
    super("oracle", env);
  }

  async initialize(): Promise<any> {
    super.initialize();
    if (!this.driver) {
      let pool = await oracledb.createPool(oracle_conf);
      this.driver = await pool.getConnection();
    }
  }

  async dispose(): Promise<void> {
    try { (this.driver as oracledb.Connection).close(); } catch(error) { };
    this.driver = null;
  }

  async query(statement: string): Promise<any[]> {
    const result = await (this.driver as oracledb.Connection).execute(statement);
    return result.rows;
  }

  async transaction(statements: string | string[]): Promise<number[]> {
    statements = Array.isArray(statements) ? statements : [statements];
    let _driver: oracledb.Connection = this.driver as oracledb.Connection
    try {
      const rowsAffected: number[] = [];
      for (const statement of statements) {
        const result = await _driver.execute(statement);
        rowsAffected.push(result.rowsAffected ?? 0);
      }
      await _driver.commit();
      return rowsAffected;
    } catch (error) {
      console.error("Database error: ", error);
      try {
        await _driver.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
      throw error;
    } finally {
      await _driver.close();
    }
  }
}
