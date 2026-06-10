require("dotenv/config");

const { spawnSync } = require("node:child_process");
const { Client } = require("pg");

async function migrateLegacyRoles() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  try {
    await client.query('ALTER TYPE "Role" ADD VALUE IF NOT EXISTS \'EDITOR\'');
    await client.query("UPDATE users SET role = 'EDITOR' WHERE role::text = 'MANAGING_EDITOR'");
    await client.query("UPDATE users SET role = 'AUTHOR' WHERE role::text = 'PRODUCTION'");
  } finally {
    await client.end();
  }
}

async function main() {
  console.log("Preparing database for NexScholar deployment...");
  await migrateLegacyRoles();

  const result = spawnSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    throw new Error("prisma db push failed.");
  }

  console.log("Database deployment completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
