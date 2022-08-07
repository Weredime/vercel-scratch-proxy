import { Octokit } from "octokit";
import fs from "fs";
import "dotenv/config"
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const { data } = await octokit.request('POST /markdown', {
  text: fs.readFileSync("README.md", "utf8")
});

let html = fs.readFileSync("scripts/index.html");
html = html.toString().replace(/<!-- README -->/, data);
fs.writeFileSync("index.html", html);