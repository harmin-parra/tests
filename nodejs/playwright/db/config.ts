export const mssql_conf = {
  user: "user",
  password: "password",
  server: "localhost",
  port: 1433,
  database: "database",
  // requestTimeout: 30000,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export const pg_conf = {
  host: "localhost",
  port: 5432,
  database: "database",
  user: "user",
  password: "password",
};

export const oracle_conf = {
  user: "user",
  password: "password",
  connectString: "localhost:1234/ORCL",
}

const configuration: Record<string, any> = {
  'mssql': mssql_conf,
  'pg': pg_conf,
  'oracle': oracle_conf,
}

export function getDBconfig(conf: string): any {
  if (!(conf in configuration))
    throw new Error("Unknown database configuration: " + conf);
  return configuration[conf];
}
