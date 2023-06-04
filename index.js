const { Client } = require("pg");
const { dbList } = require("./listOfDb");
const fs = require('fs')
require("dotenv").config();

const rdsDetails = {
  host: process.env.rds_host,
  port: 5432, // Default PostgreSQL port
  user: process.env.rds_username,
  password: process.env.rds_password,
  database: "postgres", // Default PostgreSQL database for administrative tasks
};
console.log({ rdsDetails });

const databases = dbList;

async function createDatabase(dbName) {
  console.log("createDatabase:", { dbName })
  const client = new Client(rdsDetails);
  await client.connect();
  try {
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created successfully.`);
  } catch (error) {
    console.error(`Failed to create database ${dbName}. Error:`, error);
    throw error;
  } finally {
    await client.end();
  }
}

async function createRoleAndGrantAccess(dbName, userName, password) {
  console.log("createRoleAndGrantAccess", { dbName, userName, password })
  const client = new Client(rdsDetails);
  await client.connect();

  try {
    await client.query(`CREATE ROLE ${userName} LOGIN PASSWORD '${password}'`);
    console.log(`Role ${userName} created successfully.`);

    await client.query(
      `GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${userName}`
    );
    console.log(`Granted access to database ${dbName} for role ${userName}.`);
  } catch (error) {
    console.error(
      `Failed to create role or grant access to database. Error:`,
      error
    );
    throw error;
  } finally {
    await client.end();
  }
}

function writeToFile(data) {
  console.log("writeToFile", { data })
  const content = data
    .map(
      ({ dbName, userName, password }) => `${dbName},${userName},${password}, postgres://${userName}:${password}@${rdsDetails.host}/${dbName}`
    )
    .join("\n");
  const fileName = process.env.db_env || "database.credential.csv"
  fs.writeFileSync(fileName, content);
  console.log("Database credentials written to file.");
}

async function createDatabasesAndRoles() {
  try {
    await Promise.all(
      databases.map(async (database) => {
        await createDatabase(database.dbName);
        await createRoleAndGrantAccess(
          database.dbName,
          database.userName,
          database.password
        );
      })
    );
    writeToFile(databases);
    console.log("All databases and roles created successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

createDatabasesAndRoles();
