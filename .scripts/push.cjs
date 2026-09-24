const { execSync } = require("child_process");

const message = process.argv.slice(2).join(" ");

if (!message) {
  console.error("Usage: npm run push -- <commit message>");
  process.exit(1);
}

execSync("git add .", { stdio: "inherit" });
execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
  stdio: "inherit",
});
execSync("git push", { stdio: "inherit" });
