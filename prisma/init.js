const { execSync } = require("child_process");

function run(cmd) {
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

async function main() {
  try {
    console.log("Running DB migrations...");

    run("npx prisma migrate deploy");

    console.log("Seeding database (safe mode)...");

    run("npx prisma db seed");

    console.log("DB ready");
  } catch (err) {
    console.error("DB init failed:", err);
    process.exit(1);
  }
}

main();